type TextArtProps = {
  label: string
  text: string
}

function TextArt({ label, text }: TextArtProps) {
  return (
    <pre
      aria-label={label}
      style={{ textShadow: "1px -1px 1px rgba(77, 140, 255, 0.9)" }}
      className="bg-night text-main font-mono text-[calc(0.25vw+0.25vh)]
      leading-none p-4 whitespace-pre overflow-x-hidden mt-7 sm:mt-0
      mb-2 sm:mb-0"
    >
      {text}
    </pre>
  )
}

export default TextArt
