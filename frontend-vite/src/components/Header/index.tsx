import { headerText, ton618Text } from "../../constants"
import TextArt from "./TextArt"

function Header() {
  const label = window.location.pathname === "/video" ? "TON618" : "GimmeDat"
  const text = window.location.pathname === "/video" ? ton618Text : headerText
  return (
    <div className="flex flex-col w-full pt-[2%] text-center">
      <TextArt
        label={label}
        text={text}
      />
    </div>
  )
}

export default Header
