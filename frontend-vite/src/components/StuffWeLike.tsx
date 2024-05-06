import { Music4, RadioTower } from "lucide-react";

const StuffWeLikePage = () => {
  return (
    <div className="mx-auto sm:max-w-[80%] sm:min-w-[50%] min-w-[75%] max-w-[90%] pt-[5%] inline-block">
      <div
        className={`flex flex-col items-center justify-center text-offWhite rounded-xl
          border-2 border-dotted border-main-200 p-5
          bg-night-light bg-opacity-30 mb-8`}
      >
        <h1 className="my-4 text-2xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl ">
          Stuff We Like
        </h1>
        <span className="text-xl font-bold pb-4">
          Just an unordered list of some projects and resources we wanted to
          share, from friends, collaborators and people we like.
        </span>
        <ul className="space-y-3 text-lg pt-4 w-[90%]">
          <li>
            <a
              href="https://nkfunky.com/"
              className="flex items-center space-x-3 p-2  font-medium hover:bg-main-400/30 focus:shadow-outline rounded"
            >
              <span className="">
                <RadioTower />
              </span>
              <span>NK Funky — online radio</span>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://triplemango.substack.com/"
              className="flex items-center space-x-3 p-2  font-medium hover:bg-main-400/30 focus:shadow-outline rounded"
            >
              <span className="">
                <Music4 />
              </span>
              <span>
                Triple Mango Newsletter — Bi-weekly music recos to help you
                break through the monotony of the algorithm 🥭🥭🥭
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StuffWeLikePage;
