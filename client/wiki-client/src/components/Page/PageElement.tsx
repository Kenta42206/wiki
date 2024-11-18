import React from "react";
import Page from "./Page";
import { Card } from "@blueprintjs/core";

interface PageElementProps {
  page: Page;
}

const PageElement: React.FC<PageElementProps> = ({ page }) => {
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8 px-4">
      <div className="bg-white max-w-4xl w-full p-3 mb-6 shadow-md">
        <h1 className=" text-5xl font-bold  border-b-4">{page.title}</h1>
      </div>
      <article
        className="prose prose-sm bg-white max-w-4xl w-full  p-3 shadow-md"
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      ></article>
    </div>
  );
};

export default PageElement;
