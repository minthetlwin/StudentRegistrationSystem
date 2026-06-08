import React from "react";
import Navbar from "../components/Common/Navbar";

const StudentLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default StudentLayout;
