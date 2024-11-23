import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPagesBySearchKeyord } from "../../services/PageService";
import { useSidebar } from "../../context/SideBarContext";

const SearchBar = () => {
  const [keyword, setKeyword] = useState<string>("");
  const navigate = useNavigate();
  const { textareaStyle } = useSidebar();

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
    <div className="flex items-center border-1 rounded-lg overflow-hidden ">
      <input
        type="search"
        onChange={handleSearchKeywordChange}
        onKeyDown={handleEnterKeyDown}
        placeholder="Search..."
        className={`px-4 py-1 border w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${textareaStyle}`}
        // className={`px-4 py-1 w-full text-sm ${textareaStyle}  focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
  );
};

export default SearchBar;
