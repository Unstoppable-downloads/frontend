import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../context/context";
import ResearchBar from "../components/ResearchBar";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === "true";

function Research() {
  const { isSearching } = useContext(AceContext);

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Home</title>
      </Helmet>
      <div className="relative mx-m flex flex-col py-m">
        {isSearching ? (
          <div className="mb-12 flex w-full">
            <ResearchBar />
          </div>
        ) : (
          <div className="flex w-full">
            <ResearchBar />
          </div>
        )}

        {isSearching && (
          <table className="container mt-12 w-full max-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="text-center">Name</th>
                <th className="text-center">Description</th>
                <th className="text-center">Categories</th>
                <th className="text-center">IMDB</th>
                <th className="text-center">Size</th>
                <th className="px-8 text-center">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center">
                <td colSpan={6}>No sent item found.</td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="text-iexwhite"></div>
      </div>
    </>
  );
}

export default Research;
