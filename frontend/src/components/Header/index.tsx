import { headerText } from "../../constants"
import TextArt from "./TextArt"

function Header() {
  return (
    <div className="flex flex-col w-full pt-[2%] text-center">
      <TextArt
        label="gimmedat"
        text={headerText}
      />
    </div>
  )
}

export default Header
