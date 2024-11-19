import { Button, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import React, { useState } from "react";
import { createPage, PageCreate } from "../../services/PageService";
import { useNavigate } from "react-router-dom";

const PageCreateForm = () => {
  const [title, setTitle] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const nav = useNavigate();

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
    <div className="max-w-4xl w-full">
      <FormGroup>
        <InputGroup large value={title} onChange={handleTitleChange} />
      </FormGroup>
      <FormGroup>
        <TextArea value={source} fill rows={10} onChange={handleSourceChange} />
      </FormGroup>
      <div className="space-x-1 flex justify-end">
        <Button onClick={handleCreateButtonClick} intent="success">
          作成
        </Button>
      </div>
    </div>
  );
};

export default PageCreateForm;
