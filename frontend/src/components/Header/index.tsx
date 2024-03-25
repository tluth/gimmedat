import { headerText } from "../../constants";
import TextArt from "./TextArt";

function Header() {
  return (
    <div className="w-full pt-[5%]">
      <TextArt
        label="ASCII art depicting a person fishing from an island which has a single palm tree"
        text={headerText}
      />
    </div>
  );
}

export default Header;
