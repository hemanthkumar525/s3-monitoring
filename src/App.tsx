import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import S3Operations from './pages/S3Operations';
import BedrockOperations from './pages/BedrockOperations';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/operations" element={<S3Operations />} />
        <Route path="/bedrock" element={<BedrockOperations />} />
      </Routes>
    </BrowserRouter>
  );
}
