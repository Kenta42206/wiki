import React, { useState } from "react";
import Page from "./Page";
import { Button, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import { deletePage, PageUpdate, updatePage } from "../../services/PageService";
import { useNavigate } from "react-router-dom";

interface PageEditFormProps {
  page: Page;
  onCancel: () => void;
}

const PageEditForm: React.FC<PageEditFormProps> = ({ page, onCancel }) => {
  const [title, setTitle] = useState<string>(page.title);
  const [source, setSource] = useState<string>(page.source);
  const nav = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSource(e.target.value);
  };

  const handleEditButtonClick = async () => {
    try {
      const updatePageProps: PageUpdate = {
        id: page.id,
        title,
        source,
      };
      await updatePage(updatePageProps);
      console.log("update successfully!");
      onCancel();
      nav(`/pages/${updatePageProps.title}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteButtonClick = async () => {
    try {
      await deletePage(page.id);
      console.log(`delete page ${page.id} : ${page.title} deleted!`);
      nav("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-4xl w-full">
      <FormGroup>
        <InputGroup large value={title} onChange={handleTitleChange} />
      </FormGroup>
      <FormGroup>
        <TextArea value={source} fill rows={10} onChange={handleSourceChange} />
      </FormGroup>
      <div className="space-x-1 flex justify-end">
        <Button onClick={handleEditButtonClick} intent="success">
          編集
        </Button>
        <Button onClick={handleDeleteButtonClick} intent="danger">
          削除
        </Button>
        <Button onClick={onCancel}>キャンセル</Button>
      </div>
    </div>
  );
};

export default PageEditForm;
