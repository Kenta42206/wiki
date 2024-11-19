import {
  Button,
  InputGroup,
  Navbar,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import React from "react";
import { Outlet } from "react-router-dom";

function Header() {
  return (
    <>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>wiki</NavbarHeading>
          <Navbar.Divider />
          <InputGroup
            disabled={false}
            large={false}
            placeholder="Search..."
            readOnly={false}
            small={false}
            type="search"
          />
          <Button className="bp5-minimal" icon="document" text="新しく作る" />
        </NavbarGroup>
      </Navbar>
    </>
  );
}

export default Header;
