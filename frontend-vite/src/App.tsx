import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import DownloadPage from "./components/DownloadPage";
import AboutPage from "./components/About";
import { Toaster } from "sonner";
import Sidebar from "./components/Sidebar/Sidebar";
import StuffWeLikePage from "./components/StuffWeLike/StuffWeLike";

function App() {
  return (

    <div className="bg-night min-h-screen flex flex-col">
      <Sidebar />
      <Toaster />
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/external-links" element={<StuffWeLikePage />} />
          <Route path="/sharing/:fileId" element={<DownloadPage />} />
          <Route path="/" element={<UploadPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
