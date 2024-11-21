import { Icon, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSidebar } from "../../context/SideBarContext";

function Header() {
  const { screenColor, textColor, hoverElement } = useSidebar();
  return (
    <>
      <Navbar className={`${screenColor} flex items-center justify-between`}>
        <NavbarGroup>
          <div className="flex items-center">
            <NavbarHeading>
              <Link to="/">wiki</Link>
            </NavbarHeading>
            <Navbar.Divider />
            <SearchBar />
          </div>
        </NavbarGroup>
        <NavbarGroup>
          <Link to="/pages/create" className="hover:no-underline">
            <button
              className={`flex justify-center items-center bg-transparent ${hoverElement} ${textColor}   py-1 px-3 border border-gray-300  rounded`}
            >
              <Icon icon="add" />
              <span className="pl-2 ">新しく作る</span>
            </button>
          </Link>
        </NavbarGroup>
      </Navbar>
    </>
  );
}

export default Header;
