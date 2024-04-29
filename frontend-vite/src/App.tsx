import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import DownloadPage from "./components/DownloadPage";
import { Toaster } from "sonner";


function App() {
  return (
    <div className="text-center bg-night min-h-screen flex flex-col">
      <Toaster />
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
