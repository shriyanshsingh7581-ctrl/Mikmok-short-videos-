import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary using provided credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxeuzdwkz',
  api_key: process.env.CLOUDINARY_API_KEY || '478893876885231',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_Dfy_T9KDI21P317j4XoPUsChm4'
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize SQLite Database
const db = new Database('mikmok.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    profileImage TEXT,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    userId TEXT,
    videoUrl TEXT,
    thumbnailUrl TEXT,
    caption TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS likes (
    userId TEXT,
    videoId TEXT,
    PRIMARY KEY (userId, videoId)
  );
  
  -- Insert a default user for the prototype
  INSERT OR IGNORE INTO users (id, username, profileImage) 
  VALUES ('user1', 'mikmok_creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mikmok_creator');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Get all videos (Feed)
  app.get('/api/videos', (req, res) => {
    try {
      const videos = db.prepare(`
        SELECT v.*, u.username, u.profileImage 
        FROM videos v 
        LEFT JOIN users u ON v.userId = u.id 
        ORDER BY v.timestamp DESC
      `).all();
      
      // Check if user liked each video
      const userId = req.query.userId as string || 'user1';
      const videosWithLikes = videos.map((v: any) => {
        const isLiked = db.prepare('SELECT 1 FROM likes WHERE userId = ? AND videoId = ?').get(userId, v.id);
        return { 
          ...v, 
          isLiked: !!isLiked,
          username: v.username || 'User',
          profileImage: v.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${v.userId}`
        };
      });
      
      res.json(videosWithLikes);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  });

  // Get user videos
  app.get('/api/users/:id/videos', (req, res) => {
    try {
      const videos = db.prepare('SELECT * FROM videos WHERE userId = ? ORDER BY timestamp DESC').all(req.params.id);
      res.json({ videos });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user videos' });
    }
  });

  // Get user profile
  app.get('/api/users/:id', (req, res) => {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as any;
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      const videos = db.prepare('SELECT * FROM videos WHERE userId = ? ORDER BY timestamp DESC').all(req.params.id);
      res.json({ ...user, videos });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });

  // Upload Video
  app.post('/api/upload', upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      const caption = req.body.caption || '';
      const userId = req.body.userId || 'user1';

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'mikmok_videos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });

      const result = uploadResult as any;
      const videoId = result.public_id;
      const videoUrl = result.secure_url;
      
      // Generate thumbnail URL (Cloudinary allows replacing extension with .jpg)
      const thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, ".jpg");

      // Save to SQLite
      const stmt = db.prepare(`
        INSERT INTO videos (id, userId, videoUrl, thumbnailUrl, caption)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(videoId, userId, videoUrl, thumbnailUrl, caption);

      res.json({ success: true, videoId, videoUrl, thumbnailUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload video' });
    }
  });

  // Toggle Like
  app.post('/api/videos/like', (req, res) => {
    try {
      const { videoId, userId } = req.body;
      if (!videoId) return res.status(400).json({ error: 'Video ID is required' });
      if (!userId) return res.status(400).json({ error: 'User ID is required' });
      
      const existingLike = db.prepare('SELECT 1 FROM likes WHERE userId = ? AND videoId = ?').get(userId, videoId);

      if (existingLike) {
        db.prepare('DELETE FROM likes WHERE userId = ? AND videoId = ?').run(userId, videoId);
        db.prepare('UPDATE videos SET likes = likes - 1 WHERE id = ?').run(videoId);
        res.json({ liked: false });
      } else {
        db.prepare('INSERT INTO likes (userId, videoId) VALUES (?, ?)').run(userId, videoId);
        db.prepare('UPDATE videos SET likes = likes + 1 WHERE id = ?').run(videoId);
        res.json({ liked: true });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle like' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
