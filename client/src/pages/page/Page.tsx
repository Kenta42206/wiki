import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import PageEditForm from "./PageEditForm";
import { useSidebar } from "../../context/SideBarContext";
import Error from "../Error";
import axios from "axios";

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
  const [isError, setError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { articleTextSize, articleColor } = useSidebar();

  useEffect(() => {
    setPage(null);
    const getPagesByTitle = async () => {
      try {
        const res = await axios.get<Page>(`/api/pages/title/${title}`);
        setError(false);
        setPage(res.data);
      } catch (err: unknown) {
        // Todo
        // resのエラー内容によってErrorComponentに表示するものを変える
        // const error = err as AxiosError;
        setError(true);
      }
    };

    getPagesByTitle();
    setIsEditing(false);
  }, [title]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const formattedDate =
      d.getFullYear() +
      "/" +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      d.getDate().toString().padStart(2, "0");
    return formattedDate;
  };

  if (isError) {
    return (
      <>
        <Error />
      </>
    );
  }

  if (!page) {
    return (
      <div className="flex justify-center h-screen">
        <div className="mt-40">
          <h2>ページ取得中...</h2>
        </div>
      </div>
    ); // `page` が `null` の場合に対応
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
        <div className="flex flex-col items-center  min-h-screen py-8 px-4">
          <PageEditForm page={page} onCancel={handleEditCancel} />
        </div>
      ) : (
        <div className="flex flex-col items-center   min-h-screen py-8 px-4">
          <div className="max-w-5xl w-full">
            <div className="flex justify-end mb-2 mr-8">
              <Button
                intent="success"
                icon="document"
                onClick={handleEditopen}
                className="h-3"
              >
                編集
              </Button>
            </div>
            <div className="flex items-end max-w-5xl w-full px-8  border-b-4 ">
              <h1 className="flex-1 text-5xl font-bold  pb-8">{page.title}</h1>
              <h3 className="pb-4">
                投稿日：<span>{formatDate(page.createTime)}</span>
              </h3>
            </div>
            <article
              className={`${articleTextSize} ${articleColor} max-w-5xl w-full  p-8 `}
              dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
            ></article>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
