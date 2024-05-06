const AboutPage = () => {
  return (
    <div className="mx-auto sm:max-w-[80%] sm:min-w-[50%] min-w-[75%] max-w-[90%] pt-[5%] inline-block">
      <div
        className={`flex flex-col items-center justify-center text-offWhite rounded-xl
        border-2 border-dotted border-main-200 p-5
        bg-night-light bg-opacity-30 mb-8`}
      >
        <h1 className="my-4 text-2xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl ">
          About
        </h1>
        <span className="text-xl font-bold pb-4">
          Free • No-nonsense • Open-source • Secure • File sharing
        </span>
        <p>
          Gimmedat started as a not-for-profit, personal project to help with my
          regular need to send relatively large files across the internet
          without costing an arm and a leg in monthly fees for popular services like
          Google Drive or Dropbox. At the moment, this is intended only for
          temporary file sharing rather than permanent storage. You can upload a
          file, up to 4GB in size and receive a download link which will be
          valid for 4 days. Sure, WeTransfer would've met my needs and maybe
          done an even better job, but building stuff is also fun, so I decided
          to build this.
        </p>
        <p>
          This is an ongoing work-in-progress, and we're open to contributions
          from others. See the Contributing Guidelines{" "}
          <a className="a-line" href="https://github.com/tluth/gimmedat/blob/main/CONTRIBUTING.md">
            here
          </a>
          , which include our code of conduct as well as other info on things
          like bug reporting, etc. Please keep in mind, this is non-comercial
          and funded out of my own pocket, just for the fun of it. We aim to
          keep things free from advertising and trackers, and we do our best to
          respect your privacy and security. Therefore, we ask that you be
          considerate and respectful in your use of the platform. 
          Unnecessary excessive uploads will get you temporarily blacklisted.  
        </p>
        <h1 className="my-4 text-2xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl ">
          Privacy Policy
        </h1>
        <p>
          In general, we aim to keep the handling, storing and sharing of
          Personally Identifiable Information (“PII”) to the absolute minimum.
          The records stored in our database when a file is uploaded
          contain no PII alongside the file.
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
          (currently 96hrs).{" "}
        </p>

        <h1 className="my-4 text-2xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl ">
          Conflicts of Interest and Ethics
        </h1>
        <p>
          While we aim to provide a private and unrestrictive service, we
          understand this comes with it the potential for abuse, misuse, and all
          sorts of shady business. We therefore employ various routine measures
          for monitoring and detection of those kinds of misuses, which we don't
          agree with. If you are flagged for any such behaviour, all previous
          considerations for your privacy, security and safety may be
          disregarded.
        </p>
        <p>
          We do not actively restrict access based on location (E.g. to comply
          with international embargoes) or content (E.g. no copyright strikes),
          and and have no particular concern whether your use of Gimedat is in
          violation of the laws of your local government. If you wanna share a
          pirated copy of the latest Marvel blockbuster, or your plans to stage
          a coup against your local political leader, that's your business. 
          We won't be aware of it, nor would we necessarily care.
        </p>
        <h2 className="mb-4 text-xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">
          However...
        </h2>
        <p>
          Gimmedat is 100% committed to fighting online child sexual abuse and
          exploitation, and preventing our services from being used to spread
          child sexual abuse material (CSAM). While our resources are limited,
          we still devote significant time and energy into detecting,
          removing, and reporting child sexual exploitation content and
          behavior. In the case of CSAM detection, our privacy policy goes out
          the window. Your information will be recorded, stored and shared with
          the relevant authorities, agencies and/or whoever we see fit. 
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
