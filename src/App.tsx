import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard.js';
import CashFlow from './pages/CashFlow';
import Income from './pages/Income';

function App() {
  return (
    <Router basename="/NetWorthPro/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cashflow" element={<CashFlow />} />
        <Route path="/income" element={<Income />} />
      </Routes>
    </Router>
  );
}

export default App;
