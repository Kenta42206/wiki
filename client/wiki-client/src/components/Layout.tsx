import Header from "./header/Header";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./left/LeftSideBar";
import RightSideBar from "./right/RightSideBar";
import { useSidebar } from "../context/SideBarContext";

const Root = () => {
  const { screenColor, textColor } = useSidebar();
  return (
    <div className={`${screenColor} ${textColor}`}>
      <Header />
      <div id="detail" className={`flex flex-row ${screenColor}`}>
        <div className="w-2/12  hidden lg:flex justify-center">
          <LeftSideBar />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
        <div className="w-2/12 hidden  md:flex justify-center">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default Root;
