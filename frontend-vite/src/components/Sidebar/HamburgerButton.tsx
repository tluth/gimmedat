export interface HamburgerProps {
  handleClick: () => void;
  isOpen?: boolean;
}

export default function HamburgerButton(props: HamburgerProps) {
  const { handleClick, isOpen } = props;

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`transition-opacity duration-20 ${
        isOpen ? "opacity-0" : "opacity-100"
      } w-10 sm:w-16`}
    >
      <img
        src="https://img.icons8.com/isometric-line/100/3A80FF/bulleted-list.png"
        alt="bulleted-list"
        className="object-fill"
      />
    </button>
  );
}
