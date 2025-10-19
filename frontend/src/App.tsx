import { useState } from "react"
import Header from "./components/Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UploadPage from "./components/UploadPage"
import DownloadPage from "./pages/DownloadPage"
import ContactPage from "./pages/ContactPage"
import AboutPage from "./pages/About"
import { Toaster } from "sonner"
import Sidebar from "./components/Sidebar/Sidebar"
import StuffWeLikePage from "./pages/StuffWeLike/StuffWeLike"
import LoginModal from "./components/LoginModal/LoginModal"
import { SuccessPage } from "@/pages"
import { ProvideAuth } from "@/hooks"
import DashboardPage from "./pages/DashboardPage"

function App() {
  const [showLogin, setShowLogin] = useState<boolean>(false)
  return (
    <div className="bg-night min-h-screen flex flex-col">
      <ProvideAuth>
        <Sidebar handleLogin={() => setShowLogin(true)} />
        <Toaster />
        <Header />
        <BrowserRouter>
          <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
          <Routes>
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/external-links" element={<StuffWeLikePage />} />
            <Route path="/sharing/:fileId" element={<DownloadPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/" element={<UploadPage />} />
            <Route path="success" element={<SuccessPage />}></Route>
          </Routes>
        </BrowserRouter>
      </ProvideAuth>
    </div>
  )
}

export default App
