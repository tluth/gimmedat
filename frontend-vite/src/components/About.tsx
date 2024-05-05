import GitHubButton from 'react-github-btn';


const AboutPage = () => {
  return (
    <div className="mx-auto sm:max-w-[80%] sm:min-w-[50%] min-w-[75%] max-w-[90%] pt-[5%] inline-block">
      <div
        className={`flex flex-col items-center justify-center text-offWhite rounded-xl
       transition-border ease-in-out border-2 border-dotted border-main-200 p-14
        bg-night-light bg-opacity-30 mb-8`}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu
          magna non nisi lacinia lacinia. Etiam tortor enim, congue lacinia nisi
          sed, tempor bibendum lacus. Proin cursus arcu vitae elit vehicula
          posuere. Maecenas at malesuada mi. Aenean condimentum, erat nec dictum
          convallis, leo mauris mattis dolor, egestas cursus enim sem nec neque.
          Aenean sit amet mi dolor. Morbi maximus tristique justo et rhoncus. In
          ut massa ut mauris pellentesque condimentum non in leo. Nam nisi
          ligula, lobortis sit amet nulla tincidunt, ultricies dignissim nibh.
          Sed laoreet efficitur viverra. Sed ut magna in massa congue molestie.
          Maecenas vel sem efficitur augue feugiat iaculis id sit amet nibh.
          Duis hendrerit pulvinar nunc at posuere.
        </p>
        <p>
          Donec eu nisl efficitur, lacinia massa eget, consequat neque. Vivamus
          sagittis dictum vulputate. Vivamus sit amet sem vitae nisi imperdiet
          posuere. Phasellus tincidunt semper volutpat. Duis quis elit eu massa
          tristique lacinia. Etiam a eros ac velit pulvinar interdum vitae in
          tortor. Fusce dictum gravida egestas. Nam in euismod magna. Sed
          sagittis eros sed leo pretium, ut faucibus odio rhoncus. Quisque ut
          ultricies elit, non mollis purus. Praesent cursus neque diam, ut
          accumsan odio auctor eu. In id pulvinar eros. Suspendisse convallis
          diam eget massa iaculis pulvinar. Nam elementum porttitor efficitur.
        </p>

        <p>
          Morbi blandit, nisi at dictum vestibulum, turpis orci scelerisque
          tellus, in finibus velit erat sagittis metus. Integer bibendum tempus
          est nec pulvinar. Curabitur porta leo magna, porttitor consectetur
          lectus lacinia vel. Donec dui nibh, semper volutpat malesuada id,
          mattis a risus. Mauris vestibulum ipsum sed fringilla porta. Donec ut
          nulla pharetra urna aliquet vehicula a in dui. Aliquam erat volutpat.
          Pellentesque erat turpis, pellentesque at faucibus non, fermentum at
          mi. Nullam lacus enim, convallis fringilla elementum id, gravida sit
          amet ipsum. Nunc imperdiet dui quis purus venenatis, at dictum dui
          imperdiet. Vestibulum accumsan ante sapien, vel tempus diam dapibus
          quis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Nunc lectus elit, dictum at ultrices quis,
          fringilla nec quam.
        </p>
      </div>
      <div
            className={`pb-5`}
          >
            <GitHubButton href="https://github.com/tluth/gimmedat" data-icon="octicon-star" aria-label="Star tluth/gimmedat on GitHub" >Star on GitHub</GitHubButton>
          </div>
    </div>
  );
};

export default AboutPage;
