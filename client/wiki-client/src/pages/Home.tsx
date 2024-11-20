import { useSidebar } from "../context/SideBarContext";

const Home = () => {
  const { articleTextSize, textColor, screenColor } = useSidebar();
  return (
    <div className="flex flex-col items-center  min-h-screen py-8 px-4">
      <div className="flex items-center max-w-5xl w-full p-4   border-b-4 ">
        <h1 className="flex-1 text-5xl font-bold  ">wikiにようこそ</h1>
      </div>
      <article className={` ${articleTextSize}  max-w-5xl w-full p-4 `}>
        <h2>wikiとは</h2>
      </article>
    </div>
  );
};

export default Home;
