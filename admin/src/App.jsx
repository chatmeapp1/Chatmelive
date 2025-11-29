import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-dark text-white">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 overflow-auto bg-dark">
            <div className="p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/agencies" element={<Agencies />} />
                <Route path="/hosts" element={<Hosts />} />
                <Route path="/users" element={<Users />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/mall" element={<Mall />} />
                <Route path="/bans" element={<Bans />} />
                <Route path="/super-admin" element={<SuperAdmin />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
