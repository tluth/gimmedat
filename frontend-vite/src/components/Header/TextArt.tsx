type TextArtProps = {
  label: string;
  text: string;
};

function TextArt({ label, text }: TextArtProps) {
  return (
    <pre
      aria-label={label}
      className="bg-dark text-blue font-mono text-[calc(0.25vw+0.25vh)] leading-none p-4 whitespace-pre overflow-x-hidden"
    >
      {text}
    </pre>
  );
}

export default TextArt;
