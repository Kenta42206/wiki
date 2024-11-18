import { Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import React from "react";
import { Outlet } from "react-router-dom";

function Header() {
  return (
    <>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>wiki</NavbarHeading>
        </NavbarGroup>
      </Navbar>
    </>
  );
}

export default Header;
