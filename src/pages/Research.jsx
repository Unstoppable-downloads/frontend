import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../context/context";
import ResearchBar from "../components/ResearchBar";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === "true";

function Research() {
  const { isSearching, searchTerms, setsearchTerms } = useContext(AceContext);

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Home</title>
      </Helmet>
      <div className="flex">
        <div className="relative mx-m flex w-3/4 flex-col py-m">
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
                  <th className="text-center">Title</th>
                  <th className="text-center">Filename</th>
                  <th className="text-center">Categories</th>
                  <th className="text-center">Size</th>
                  <th className="text-center"># DL</th>
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
        <aside>
          <div className="flex flex-col bg-sidebar w-max">
            <div className="w-full">
                <h4 className="text-xl">Recent Uploads</h4>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Research;
