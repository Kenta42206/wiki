import { useSidebar } from "../../context/SideBarContext";
import { Link } from "react-router-dom";

const LeftSideBar = () => {
  const { hoverElement, recentPages } = useSidebar();

  return (
    <div className="block">
      <div className="sticky top-3">
        <div className="mt-6 py-4 min-w-48">
          <h3 className="mb-4">最新の記事</h3>
          <div className="border-b-2">
            {recentPages?.map((page, index) => (
              <Link
                to={`/pages/${page.title}`}
                key={page.title}
                className=" hover:no-underline"
              >
                <div
                  className={`flex items-center justify-between p-4 border-t-2 ${hoverElement} transition`}
                >
                  <span className="">
                    {index + 1}. {page.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
