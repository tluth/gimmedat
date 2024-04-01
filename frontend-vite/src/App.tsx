import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import DownloadPage from "./components/DownloadPage";

//

function App() {
  return (
    <div className="text-center bg-dark h-screen flex flex-col">
      <Header />
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
