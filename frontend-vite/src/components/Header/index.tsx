import { headerText } from "../../constants";
import TextArt from "./TextArt";

function Header() {
  return (
    <div className="w-full pt-[5%]">
      <TextArt
        label="gimmedat"
        text={headerText}
      />
    </div>
  );
}

export default Header;
