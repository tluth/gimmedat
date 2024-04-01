type TextArtProps = {
  label: string;
  text: string;
};

function TextArt({ label, text }: TextArtProps) {
  return (
    <pre
      aria-label={label}
      style={{ textShadow: "1px 0 currentColor" }}
      className="bg-night text-main font-mono text-[calc(0.25vw+0.25vh)] leading-none p-4 whitespace-pre overflow-x-hidden"
    >
      {text}
    </pre>
  );
}

export default TextArt;
