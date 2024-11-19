import React, { useState } from "react";
import Page from "./Page";
import { Button, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";

interface PageEditFormProps {
  page: Page;
  onCancel: () => void;
}

const PageEditForm: React.FC<PageEditFormProps> = ({ page, onCancel }) => {
  const [title, setTitle] = useState<string>(page.title);
  const [source, setSource] = useState<string>(page.source);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSource(e.target.value);
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
        <Button intent="success">編集</Button>
        <Button onClick={onCancel}>キャンセル</Button>
      </div>
    </div>
  );
};

export default PageEditForm;
