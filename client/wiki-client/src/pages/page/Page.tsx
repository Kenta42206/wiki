import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import PageEditForm from "./PageEditForm";

interface Page {
  id: number;
  title: string;
  source: string;
  bodyHtml: string;
  createTime: string;
}

const Page: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchPageByTitle = async () => {
      try {
        const res = await axios.get<Page>(`/api/pages/${title}`, {
          headers: { "Content-Type": "application/json" },
        });
        setError(false);
        setPage(res.data);
      } catch (err) {
        setError(true);
      }
    };

    fetchPageByTitle();
  }, [title]);

  if (error) {
    return <p>Error</p>;
  }

  if (!page) {
    return <p>Loading page content...</p>; // `page` が `null` の場合に対応
  }

  const handleEditopen = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8 px-4">
          <PageEditForm page={page} onCancel={handleEditCancel} />
        </div>
      ) : (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8 px-4">
          <div className="flex items-center bg-white max-w-4xl w-full p-4  shadow-md border-b-4 ">
            <h1 className="flex-1 text-5xl font-bold  ">{page.title}</h1>
            <Button intent="success" onClick={handleEditopen} className="h-3">
              編集
            </Button>
          </div>
          <article
            className="prose prose-sm bg-white max-w-4xl w-full  p-4 shadow-md"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          ></article>
        </div>
      )}
    </div>
  );
};

export default Page;
