import { useState } from "react";
import {
  Github,
  CircleHelp,
  HeartHandshake,
  Music4,
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
          className="md:bg-opacity-90 bg-asparagus text-offWhite md:max-w-[20%] md:min-w-[20%] min-w-full shadow-md shadow-main-200"
          style={{
            boxShadow:
              "5px 0 20px rgba(128, 173, 255, 0.4), 3px 0 3px rgba(128, 173, 255, 0.2)",
          }}
        >
          <div className="w-full rounded p-2 pt-8">
            <ul className="space-y-3 text-lg">
              <li>
                <a
                  href="/"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span>
                    <Home className=" text-main-700 w-9 h-9" />
                  </span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span>
                    <CircleHelp className=" text-main-700 w-9 h-9" />
                  </span>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tluth/gimmedat"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span>
                    <Github className=" text-main-700 w-9 h-9" />
                  </span>
                  <span>Github</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tluth/gimmedat"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span>
                    <HeartHandshake className=" text-main-700 w-9 h-9" />
                  </span>
                  <span>Donate</span>
                </a>
              </li>
              <li>
                <a
                  href="https://nkfunky.com/"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span>
                    <Music4 className=" text-main-700 w-9 h-9" />
                  </span>
                  <span>Music from friends</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:tom@bulgingdiscs.com"
                  className="flex items-center space-x-3 text-night p-2  font-medium hover:bg-main-400/30 focus:bg-main-600/40 focus:shadow-outline"
                >
                  <span>
                    <Send className=" text-main-700 w-9 h-9" />
                  </span>
                  <span>contact</span>
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
