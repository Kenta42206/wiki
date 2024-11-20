import React, { useState } from "react";
import Page from "./Page";
import { Button, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import { deletePage, PageUpdate, updatePage } from "../../services/PageService";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SideBarContext";

interface PageEditFormProps {
  page: Page;
  onCancel: () => void;
}

const PageEditForm: React.FC<PageEditFormProps> = ({ page, onCancel }) => {
  const [title, setTitle] = useState<string>(page.title);
  const [source, setSource] = useState<string>(page.source);
  const nav = useNavigate();
  const { textareaStyle } = useSidebar();
  console.log(textareaStyle);

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
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          className={`px-4 py-2 border w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${textareaStyle}`}
          placeholder="Enter your title"
        />
      </FormGroup>
      <FormGroup>
        <TextArea
          value={source}
          fill
          rows={10}
          onChange={handleSourceChange}
          className={`${textareaStyle}`}
        />
      </FormGroup>
      <div className="space-x-1 flex justify-end">
        <Button
          onClick={handleEditButtonClick}
          intent="success"
          icon="document"
        >
          編集
        </Button>
        <Button onClick={handleDeleteButtonClick} intent="danger" icon="trash">
          削除
        </Button>
        <Button icon="delete" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </div>
  );
};

export default PageEditForm;
