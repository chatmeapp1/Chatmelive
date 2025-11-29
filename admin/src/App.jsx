import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Agencies from './pages/Agencies';
import Hosts from './pages/Hosts';
import Users from './pages/Users';
import Gifts from './pages/Gifts';
import Mall from './pages/Mall';
import Bans from './pages/Bans';
import SuperAdmin from './pages/SuperAdmin';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
    setLoading(false);

    // Listen for storage changes (when token is added in LoginPage)
    const handleStorageChange = (e) => {
      if (e.key === 'admin_token') {
        setIsAuthenticated(!!localStorage.getItem('admin_token'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex flex-col lg:flex-row h-screen bg-dark text-white">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex flex-col flex-1 w-full">
            <Navbar setIsAuthenticated={setIsAuthenticated} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-auto bg-dark">
              <div className="p-4 md:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/agencies" element={<Agencies />} />
                  <Route path="/hosts" element={<Hosts />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/gifts" element={<Gifts />} />
                  <Route path="/mall" element={<Mall />} />
                  <Route path="/bans" element={<Bans />} />
                  <Route path="/super-admin" element={<SuperAdmin />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
