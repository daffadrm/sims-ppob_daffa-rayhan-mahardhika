import { Outlet } from "react-router-dom";

import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 bg-gray-50 p-6 pt-20 px-[10vw] ">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
