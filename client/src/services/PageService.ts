import axios from "axios";
import Page from "../pages/page/Page";

export interface PageCreate {
  title: string;
  source: string;
}

export interface PageUpdate {
  id: number;
  title: string;
  source: string;
}

export const getPageByTitle = async (title?: string) => {
  const res = await axios.get(`/api/pages/title/${title}`);
  return res.data;
};

export const getPagesBySearchKeyord = async (keyword: string) => {
  const res = await axios.get<Page[]>("/api/pages", { params: { q: keyword } });
  return res.data;
};

export const getPagesOrderByCreateTime = async () => {
  const res = await axios.get<Page[]>("/api/pages/recently-created");
  return res.data;
};

export const createPage = async (page: PageCreate) => {
  await axios.post("/api/pages", page);
};

export const updatePage = async (page: PageUpdate) => {
  await axios.put(`/api/pages/${page.id}`, page);
};

export const deletePage = async (id: number) => {
  await axios.delete(`/api/pages/${id}`);
};
