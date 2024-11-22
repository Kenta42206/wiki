import { useSidebar } from "../context/SideBarContext";

const Home = () => {
  const { articleTextSize } = useSidebar();
  return (
    <div className="flex flex-col items-center  min-h-screen py-8 px-4">
      <div className="flex items-center max-w-5xl w-full p-4   border-b-4 ">
        <h1 className="flex-1 text-5xl font-bold  ">wikiにようこそ</h1>
      </div>
      <article className={` ${articleTextSize}  max-w-5xl w-full p-4 `}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed fugit
          perferendis nam facilis ea laudantium labore aliquid fugiat quibusdam
          voluptatum commodi tenetur, quam necessitatibus ut ab similique soluta
          quia. Molestias.
        </p>

        <h2>dami</h2>
        <ul>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
        </ul>

        <h2>dami</h2>
        <ul>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
        </ul>

        <h2>dami</h2>
        <ul>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
          <li>
            <strong>dami</strong>: Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quam, ab ullam? Facere, vitae? Similique
            reiciendis ipsum enim ab quos, ipsam tempore, et atque, quidem
            soluta alias delectus. Repellendus, cupiditate earum.
          </li>
        </ul>

        <p>
          ソースコードはこちら⇒
          <a target="blank" href="https://github.com/Kenta42206/wiki">
            https://github.com/Kenta42206/wiki
          </a>
        </p>
      </article>
    </div>
  );
};

export default Home;
