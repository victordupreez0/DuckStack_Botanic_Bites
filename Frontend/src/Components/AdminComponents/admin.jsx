import React from "react";
import Sidebar from "./sidebar";

const Admin = () => {
  return (
    <div style={{ display: "flex", height: "95vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        {/* Main content goes here */}
      </main>
    </div>
  );
};

export default Admin;