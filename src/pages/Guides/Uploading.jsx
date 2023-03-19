import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../../context/context";
import crypto from "crypto-browserify";
import { numberOfChunks } from "../../components/Upload/uploader.ts";
import {NavLink} from "react-router-dom";
const APP_NAME = process.env.REACT_APP_NAME;

const UploadingGuide = () => {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Guide</title>
      </Helmet>
      <div className="mx-auto flex w-full flex-col items-center text-iexblk">
        <h2 className="text-5xl font-bold">Share a file</h2>
        <div className="flex flex-col mt-4 text-left items-start w-full">
            <ol className="list-decimal">
              <li className="my-3">Download and install IPFS desktop here </li>
              <li className="my-3">Run IPFS desktop</li>
              <li className="my-3">Go to settings</li>
              <li className="my-3">
                Go to "IPFS CONFIG" and add * to the "Access-Control-Allow-Origin" like below
                <img src={require("../../assets/ipfs-example.png")} alt="IPFS example" className="h-64" />  
              </li>
              <li className="my-3">You are ready to upload! Just upload your file <NavLink to="/upload" relative="path">here</NavLink>!</li>
            </ol>
        </div>
      </div>
    </>
  );
};

export default UploadingGuide;