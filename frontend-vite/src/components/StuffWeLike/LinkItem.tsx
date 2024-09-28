import { ForwardRefExoticComponent, RefAttributes } from "react"
import { SquareArrowOutUpRight, LucideProps } from "lucide-react"
import { isMobile } from "../../utils"

type LinkItemProps = {
  href: string
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  text: string
}

const LinkItem = ({ href, Icon, text }: LinkItemProps) => {
  const isItOnMobile: boolean = isMobile()
  return (
    <li>
      <a
        href={href}
        className="flex items-center space-x-3 p-2  font-medium hover:bg-main-400/30 focus:shadow-outline rounded"
      >
        <Icon />
        {text}
        <SquareArrowOutUpRight
          className={`absolute inset-y-0 right-0 w-16 transition ease-in-out relative top-1/2 right-0 mr-3 ${
            isItOnMobile ? "opacity-100" : "opacity-40"
          } 
            hover:opacity-100 p-1`}
        />
      </a>
    </li>
  )
}

export default LinkItem
