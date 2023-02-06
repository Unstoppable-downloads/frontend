import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { AceContext } from "../../context/context";
import SearchBar from "../../components/SearchBar";
import { sizeToReadableSize } from "../../utils/sizeToReadableSize";
import SideBar from "../../components/Sidebar";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === "true";

function Details() {
  const { fileName } = useParams();
  console.log("fileName", fileName);
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Details</title>
      </Helmet>

      <div className="flex">
        <div className="w-full">
          <h1 className="text-3xl">{fileName}Details of the film</h1>
          Hello
          {console.log(fileName)}
        </div>

        <div>
          <div className="flex w-max flex-col bg-sidebar">
            <div className="w-full">
              <SideBar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
