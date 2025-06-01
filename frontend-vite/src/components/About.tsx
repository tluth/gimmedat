const AboutPage = () => {
  return (
    <div className="mx-auto lg:max-w-[60%] sm:max-w-[80%] sm:min-w-[50%] max-w-[90%] min-w-[75%] pt-[2%] inline-block">
      <div
        className={`flex flex-col text-justify text-offWhite rounded-xl
        border-2 border-dotted border-main-200 p-5
        bg-night-light bg-opacity-30 mb-8 leading-relaxed`}
      >
        <h1 className="my-4 text-2xl font-extrabold md:text-4xl lg:text-5xl text-center">
          About
        </h1>
        <span className="text-lg md:text-2xl font-bold pb-5 text-center">
          Free • No-nonsense • Open-source • Secure • File sharing
        </span>
        <p>
          Gimmedat started as a not-for-profit, personal project to facilitate
          my regular need to send relatively large files to others across the
          internet, without buying into popular services like Google Drive or
          Dropbox. At the moment, this is intended only for sharing temporary
          download links rather than permanent storage. You can upload a file,
          up to 4GB in size and receive a download link which will be valid for
          4 days. Sure, WeTransfer would've met those needs and maybe done an
          even better job, but building stuff is also fun, so I decided to build
          this.
        </p>
        <p>
          This is an ongoing work-in-progress, and we're open to contributions
          from others. See the Contributing Guidelines{" "}
          <a
            className="a-line"
            href="https://github.com/tluth/gimmedat/blob/main/CONTRIBUTING.md"
          >
            here
          </a>
          , which also includes our code of conduct as well as other info on
          things like bug reporting, etc. Please keep in mind, this is
          non-comercial and funded out of my own pocket, just for the fun of it.
          We aim to keep things free from advertising and trackers, with an
          emphasis on respecting privacy and security. Therefore, we ask that
          you be considerate and respectful in your use of the platform.
          Unnecessary excessive uploads will get you temporarily blacklisted.
        </p>
        <h1 className="my-4 text-2xl font-extrabold md:text-4xl lg:text-5xl text-center">
          Privacy Policy
        </h1>
        <p className="font-black">In General:</p>
        <p>
          In general, we aim to keep the handling, storing and sharing of
          Personally Identifiable Information (“PII”) to the absolute minimum.
          The records stored in our database when a file is uploaded contain no
          information on the uploader, let alone PII, alongside the file
          information.
        </p>
        <p>
          We do not allow or employ third-party behavioral tracking. Our website
          features no third party ads or tracking tools.
        </p>
        <p>
          We do not sell, trade, or otherwise transfer to outside parties your
          personally identifiable information.
        </p>
        <p>We do not currently utilise any cookies.</p>
        <p>
          ALL data is permanently destroyed within the given time frame
          (currently 96hrs).
        </p>

        <h1 className="my-4 text-2xl font-extrabold md:text-4xl lg:text-5xl text-center">
          Conflicts of Interest and Ethics
        </h1>
        <p>
          While we aim to provide a private and unrestrictive service, we
          understand this comes with it the potential for abuse, misuse, and all
          sorts of shady business. We therefore employ various measures for
          routine monitoring and detection of those kinds of misuses which we
          don't agree with (these are automated programmatic processes - a human
          is not looking at what you've uploaded). If you are flagged for any
          such behaviour though, all previous considerations for your privacy
          and security will likely be disregarded.
        </p>
        <p>
          We do not actively restrict access based on location (e.g. to comply
          with international embargoes) or content (e.g. no copyright strikes),
          and and have no particular concern whether your use of Gimedat is in
          violation of the laws of your local government. If you wanna share a
          pirated copy of the latest Marvel blockbuster, or your homemade ANFO
          recipe, that's your business, not mine. We probably won't be aware of
          it, nor would we necessarily care.
        </p>
        <span className="text-xl font-bold pb-4">However...</span>
        <p>
          Gimmedat is 100% against online child sexual abuse and exploitation,
          and we're committed to preventing our services from being used to
          spread child sexual abuse material (CSAM) or other abusive material
          (e.g. revenge porn). In the case of CSAM detection, our privacy policy
          goes out the window. Your content will be flagged once uploaded and
          the information associate with the request will be recorded, stored
          and shared with whoever we feel appropriate.
        </p>
      </div>
    </div>
  )
}

export default AboutPage
