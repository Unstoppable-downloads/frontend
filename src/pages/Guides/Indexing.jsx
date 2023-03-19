import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../../context/context";
import crypto from "crypto-browserify";
import { numberOfChunks } from "../../components/Upload/uploader.ts";
const APP_NAME = process.env.REACT_APP_NAME;

const IndexingGuide = () => {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Guide</title>
      </Helmet>
      <div className="mx-auto flex w-full flex-col items-center">
        <h2 className="text-5xl font-bold">Index a file</h2>
        <div className="flex flex-col">
            
        </div>
      </div>
    </>
  );
};

export default IndexingGuide;