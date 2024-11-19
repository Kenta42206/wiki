import { Button, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>
            <Link to="/">wiki</Link>
          </NavbarHeading>
          <Navbar.Divider />
          <SearchBar />
          <Link to="/pages/create">
            <Button className="bp5-minimal" icon="document" text="新しく作る" />
          </Link>
        </NavbarGroup>
      </Navbar>
    </>
  );
}

export default Header;
