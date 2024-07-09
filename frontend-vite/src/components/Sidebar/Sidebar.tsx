import { useState } from "react";
import {
  Github,
  CircleHelp,
  Beer,
  BookHeart,
  Send,
  Home,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import HamburgerButton from "./HamburgerButton";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenClose = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute grid grid-cols-2 gap-2">
      <Sheet onOpenChange={handleOpenClose} open={isOpen}>
        {!isOpen ? (
          <SheetTrigger
            className={`w-10 sm:w-12 h-[0.35rem] transition-all opacity-75 hover:opacity-100 
            disabled:pointer-events-none data-[state=open]:bg-night mt-3 ml-3`}
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
          <div className="text-night lg:text-xl text-sm text-left p-2 border-b border-night-light  font-mono">G I M M E D A T</div>

            <ul className="space-y-3 text-m pt-4">
              <li>
                <a
                  href="/"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <Home className=" text-main-800 w-9 h-9" />
                  </span>
                  <span >Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <CircleHelp className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tluth/gimmedat"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6" >
                    <Github className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Github</span>
                </a>
              </li>
              <li>
                <a
                  href="/external-links"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <BookHeart className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Stuff we like</span>
                </a>
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
                <a
                  href="/contact"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span className="pl-6">
                    <Send className=" text-main-800 w-9 h-9" />
                  </span>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
