import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from './components/uploadPage/uploadPage';
import DownloadPage from './components/downloadPage/downloadPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/sharing/:fileId" element={<DownloadPage />} />
          <Route path="/" element={<UploadPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
