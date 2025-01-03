import { useState } from "react"
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
import { ProvideAuth } from "@/hooks"

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  return (
    <div className="bg-night min-h-screen flex flex-col">
      <ProvideAuth>

        <Sidebar handleLogin={() => setShowLogin(true)} />
        <Toaster />
        <Header />
        <BrowserRouter>
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
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
      </ProvideAuth>
    </div>
  )
}

export default App


// Login Modal Component
const LoginModal = withAuthenticator(({ onClose }: { onClose: () => void }) => {
  return (
    <div style={modalStyle}>
      <button onClick={onClose} style={closeButtonStyle}>
        Close
      </button>
    </div>
  );
});

// Styling for Modal
const modalStyle = {
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: 1000,
};

const closeButtonStyle = {
  position: 'absolute' as const,
  top: '1rem',
  right: '1rem',
  border: 'none',
  background: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
};