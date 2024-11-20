import { Button, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSidebar } from "../../context/SideBarContext";

function Header() {
  const { screenColor, textColor } = useSidebar();
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
          <Link to="/pages/create">
            <Button
              className={`bp5-minimal ${textColor}`}
              icon="document"
              text="新しく作る"
            />
          </Link>
        </NavbarGroup>
      </Navbar>
    </>
  );
}

export default Header;
