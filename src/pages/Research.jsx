import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../context/context";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === "true";

function Research() {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Home</title>
      </Helmet>
    </>
  );
}

export default Research;