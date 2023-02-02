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
    const { uid, filename } = useParams();
    console.log(uid, filename)
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Details</title>
      </Helmet>
    
      <div className="flex">
        {console.log(uid)}
      </div>
    </>
  );
}

export default Details;
