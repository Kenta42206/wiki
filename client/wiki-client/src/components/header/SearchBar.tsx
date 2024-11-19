import { InputGroup } from "@blueprintjs/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPagesBySearchKeyord } from "../../services/PageService";

const SearchBar = () => {
  const [keyword, setKeyword] = useState<string>("");
  const navigate = useNavigate();

  const handleSearchKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKeyword(e.target.value);
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    handleSearch();
  };

  const handleSearch = async () => {
    try {
      const res = await getPagesBySearchKeyord(keyword);
      navigate(`/pages/?q=${keyword}`, { state: { pages: res } });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <InputGroup
      placeholder="Search..."
      type="search"
      onChange={handleSearchKeywordChange}
      onKeyDown={handleEnterKeyDown}
    />
  );
};

export default SearchBar;
