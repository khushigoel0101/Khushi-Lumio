import React from "react";
import Topbar from "./Navbar";

const AppLayout = ({ children }) => {
  return (
      <div className="flex flex-1 flex-col"> 
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
  );
};

export default AppLayout;