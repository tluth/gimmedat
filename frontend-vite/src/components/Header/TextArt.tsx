type TextArtProps = {
  label: string;
  text: string;
};

function TextArt({ label, text }: TextArtProps) {
  return (
    <pre
      aria-label={label}
      className="bg-black text-[rgb(73,247,4)] font-mono text-[calc(0.25vw+0.25vh)] leading-none p-4 whitespace-pre overflow-x-hidden"
    >
      {text}
    </pre>
  );
}

export default TextArt;
