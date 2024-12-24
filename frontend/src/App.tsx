import Header from "./components/Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UploadPage from "./components/UploadPage"
import DownloadPage from "./components/DownloadPage"
import ContactPage from "./components/ContactPage"
import AboutPage from "./components/About"
import { Toaster } from "sonner"
import Sidebar from "./components/Sidebar/Sidebar"
import StuffWeLikePage from "./components/StuffWeLike/StuffWeLike"

import { SignIn } from "@/pages"
import { SuccessPage } from "@/pages"

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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={<UploadPage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="success" element={<SuccessPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
