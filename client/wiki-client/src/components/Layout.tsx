import Header from "./header/Header";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <>
      <Header />
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
