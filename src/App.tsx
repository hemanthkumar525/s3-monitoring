import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import S3Operations from './pages/S3Operations';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/operations" element={<S3Operations />} />
      </Routes>
    </BrowserRouter>
  );
}
