import {ForwardRefExoticComponent, RefAttributes} from "react";
import {SquareArrowOutUpRight, LucideProps} from "lucide-react";
import { isMobile } from "../../utils";

type LinkItemProps = {
  href: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  text: string;
};

const LinkItem = ({ href, Icon, text }: LinkItemProps) => {
    const isItOnMobile: boolean = isMobile()
  return (
<li>
            <a
              href={href}
              className="flex items-center space-x-3 p-2  font-medium hover:bg-main-400/30 focus:shadow-outline rounded"
            >
              <span className="">
                <Icon/>
              </span>
              <span>{text}</span>

            </a>
            <SquareArrowOutUpRight className={
            `transition ease-in-out absolute top-1/2 right-0 mr-3 ${isItOnMobile ? "opacity-100" : "opacity-40"} 
            hover:opacity-100 p-1`
          }/>
          </li>
  );
};

export default LinkItem;