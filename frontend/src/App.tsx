import { useState } from "react"
import Header from "./components/Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UploadPage from "./components/UploadPage"
import { DownloadPage, ContactPage, AboutPage, StuffWeLikePage, DashboardPage } from "@/pages"
import { Toaster } from "sonner"
import Sidebar from "./components/Sidebar/Sidebar"
import LoginModal from "./components/LoginModal/LoginModal"
import { ProvideAuth } from "@/hooks"

function App() {
  const [showLogin, setShowLogin] = useState<boolean>(false)
  return (
    <div className="bg-night min-h-screen flex flex-col">
      <ProvideAuth>
        <BrowserRouter>
          <Sidebar handleLogin={() => setShowLogin(true)} />
          <Toaster />
          <Header />
          <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
          <Routes>
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/external-links" element={<StuffWeLikePage />} />
            <Route path="/sharing/:fileId" element={<DownloadPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/" element={<UploadPage />} />
          </Routes>
        </BrowserRouter>
      </ProvideAuth>
    </div>
  )
}

export default App
