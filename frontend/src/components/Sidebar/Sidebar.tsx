import { useState } from "react"
import { Github, CircleHelp, Beer, BookHeart, Send, Home, LogIn, Pocket, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "./Sheet"
import HamburgerButton from "./HamburgerButton"
import { useAuth } from "@/hooks/useAuth"

type SidebarProps = {
  handleLogin: () => void
}

const Sidebar = ({ handleLogin }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { isAuthenticated, handleSignOut } = useAuth()
  const navigate = useNavigate()

  const handleOpenClose = (): void => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    await handleSignOut()
    setIsOpen(false)
    navigate("/")
  }

  return (
    <div className="absolute grid grid-cols-2 gap-2">
      <Sheet onOpenChange={handleOpenClose} open={isOpen}>
        {!isOpen ? (
          <SheetTrigger
            className={`transition-all opacity-75 hover:opacity-100
            disabled:pointer-events-none data-[state=open]:bg-night mt-3 ml-3 left-0 top-0 align-left`}
          >
            <HamburgerButton handleClick={handleOpenClose} isOpen={isOpen} />
          </SheetTrigger>
        ) : null}
        <SheetContent
          className="md:bg-opacity-90 bg-main text-offWhite md:max-w-[20%] md:min-w-[20%] min-w-full shadow-md shadow-main-300"
          style={{
            boxShadow:
              "5px 0 10px rgba(128, 173, 255, 0.3), 3px 0 3px rgba(128, 173, 255, 0.2)",
          }}
        >
          <div className="w-full rounded p-2 pt-16">
            <div className="text-night lg:text-xl text-sm text-left p-2 border-b border-night-light  font-mono">
              G I M M E D A T
            </div>

            <ul className="space-y-3 text-m pt-4">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <Home className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <CircleHelp className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>About</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/tluth/gimmedat"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <Github className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Github</span>
                </a>
              </li>
              <li>
                <Link
                  to="/external-links"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <BookHeart className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Stuff we like</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://buymeacoffee.com/tluth"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <Beer className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Buy me a beer</span>
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <Send className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                  >
                    <span className="pl-6">
                      <Pocket className=" text-main-800 w-9 h-9" />
                    </span>
                    <span>Pocketdat</span>
                  </Link>
                ) : (
                  <a
                    onClick={handleLogin}
                    className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline cursor-pointer"
                  >
                    <span className="pl-6">
                      <LogIn className=" text-main-800 w-9 h-9" />
                    </span>
                    <span>Log in</span>
                  </a>
                )}
              </li>
            </ul>
            {isAuthenticated && (
              <div className="absolute bottom-4 left-0 right-0 px-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-night p-2 font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline w-full rounded"
                >
                  <span className="pl-6">
                    <LogOut className="text-main-800 w-9 h-9" />
                  </span>
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Sidebar
