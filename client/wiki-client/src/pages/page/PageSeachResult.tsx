import React from "react";
import Page from "./Page";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Card } from "@blueprintjs/core";
import { useSidebar } from "../../context/SideBarContext";

const PageSeachResult: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { screenColor, hoverElement } = useSidebar();

  const pages = location.state?.pages;
  const keyword = searchParams.get("q");
  console.log(pages);
  console.log(keyword);
  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4">
      <h1 className="text-lg mb-4">検索結果：{keyword}</h1>
      {pages?.map((page: Page) => (
        <Link
          key={page.id}
          to={`/pages/${page.title}`}
          className="bg-white max-w-4xl w-full hover:no-underline mb-2"
        >
          <Card className={` transition ${screenColor}  ${hoverElement}`}>
            <h1 className="text-lg border-b-4">{page.title}</h1>
            <article
              className="py-3"
              dangerouslySetInnerHTML={{
                __html:
                  page.bodyHtml.length > 200
                    ? page.bodyHtml.slice(0, 200) + "..."
                    : page.bodyHtml,
              }}
            ></article>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default PageSeachResult;
