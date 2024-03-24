import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from './components/uploadPage/uploadPage';
import DownloadPage from './components/downloadPage/downloadPage';
import Header from './components/header/header';


function App() {
  return (
    <div className="App">
      <Header/>
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
