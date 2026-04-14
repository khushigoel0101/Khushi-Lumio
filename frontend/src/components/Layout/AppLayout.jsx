import React from "react";
import Topbar from "./Topbar";

const AppLayout = ({ children }) => {
  return (
    

      <div className="flex-1 ">
        <Topbar />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    
  );
};

export default AppLayout;