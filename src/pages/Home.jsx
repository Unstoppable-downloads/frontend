import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { AceContext } from "../context/context";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == "true";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Home</title>
      </Helmet>

      <div className="mx-auto flex w-full flex-col items-center justify-center text-center">
        <img src={require("../assets/logo.png")} alt="USDL logo" className="h-56" />
        <h1 className="text-8xl font-bold">Unstoppable Downloads</h1>
        <p className="my-8">Break free from takedowns, embrace unlimited uploads!</p>
        <div className="mt-8 flex w-full">
          <div className="mr-4 flex w-1/3 flex-col rounded-xl bg-iexyellow p-4 font-bold">
            <NavLink to="/guides/how-to-share" relative="path">
              <img src={require("../assets/uploading-logo.png")} alt="Upload" className="mx-auto h-32" />
              <h2 className="text-iexblk">I want to share content</h2>
            </NavLink>
          </div>
          <div className="mx-4 flex w-1/3 flex-col rounded-xl bg-iexyellow p-4 font-bold">
            <NavLink to="/guides/how-to-index">
              <img src={require("../assets/indexing-logo.png")} alt="Index" className="mx-auto h-32" />
              <h2 className="text-iexblk">I want to index content</h2>
            </NavLink>
          </div>

          <div className="ml-4 flex w-1/3 flex-col rounded-xl bg-iexyellow p-4 font-bold">
            <NavLink to="/search" relative="path">
              <img src={require("../assets/downloading-logo.png")} alt="Upload" className="mx-auto h-32" />
              <h2 className="text-iexblk">I want to download content</h2>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;