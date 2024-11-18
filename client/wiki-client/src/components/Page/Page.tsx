import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageElement from "./PageElement";

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

  useEffect(() => {
    const fetchPageByTitle = async () => {
      try {
        const res = await axios.get<Page>(`/api/pages/${title}`, {
          headers: { "Content-Type": "application/json" },
        });
        setPage(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPageByTitle();
  }, [title]);

  if (!page) {
    return <p>Loading page content...</p>; // `page` が `null` の場合に対応
  }

  return (
    <div>
      <PageElement page={page} />
    </div>
  );
};

export default Page;
