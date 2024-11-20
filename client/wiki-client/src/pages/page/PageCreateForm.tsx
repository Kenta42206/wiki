import { Button, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import React, { useState } from "react";
import { createPage, PageCreate } from "../../services/PageService";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SideBarContext";

const PageCreateForm = () => {
  const [title, setTitle] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const nav = useNavigate();
  const { textareaStyle } = useSidebar();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSource(e.target.value);
  };

  const handleCreateButtonClick = async () => {
    try {
      const page: PageCreate = {
        title,
        source,
      };
      await createPage(page);
      console.log("Page created successfully!");
      nav(`/pages/${title}`);
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  return (
    <div className="flex flex-col items-center  min-h-screen py-8 px-4">
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
            className={`${textareaStyle} rounded-lg`}
          />
        </FormGroup>
        <div className="space-x-1 flex justify-end">
          <Button
            onClick={handleCreateButtonClick}
            icon="document"
            intent="success"
          >
            作成
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageCreateForm;
