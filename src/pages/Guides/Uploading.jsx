import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../../context/context";
import crypto from "crypto-browserify";
import { numberOfChunks } from "../../components/Upload/uploader.ts";
const APP_NAME = process.env.REACT_APP_NAME;

const UploadingGuide = () => {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Guide</title>
      </Helmet>
      <div className="mx-auto flex w-full flex-col items-center">
        <h2 className="text-5xl font-bold">How to upload a file ?</h2>
      </div>
    </>
  );
};

export default UploadingGuide;