/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import BottomNav from './components/BottomNav';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
        <main className="flex-1 relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
