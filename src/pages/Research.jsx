import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../context/context";
import SearchBar from "../components/SearchBar";
import {sizeToReadableSize} from "../utils/sizeToReadableSize";
import SideBar from "../components/Sidebar";
const APP_NAME = process.env.REACT_APP_NAME;
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === "true";

function Research() {
  const { isSearching, searchTerms, setsearchTerms, filesSearched, setFilesSearched } = useContext(AceContext);

  useEffect(() => {

  }, [filesSearched])

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Home</title>
      </Helmet>
      <div className="flex">
        <div className="relative mr-m flex w-3/4 flex-col py-m items-center my-auto">
          {isSearching ? (
            <div className="mb-12 flex w-full">
              <SearchBar />
            </div>
          ) : (
            <div className="flex w-full">
              <SearchBar />
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
              {filesSearched.length > 0 ? (
                <tbody>
                  {filesSearched.map((file, i) => {
                    return (
                      <tr className="text-center" key={i}>
                        <td>{file.title}</td>
                        <td>{file.fileName}</td>
                        <td>
                          {file.categories.map((category, j) => {
                            return <span key={j}>{category}, </span>;
                          })}
                        </td>
                        <td>{sizeToReadableSize(file.fileSize)[0]} {sizeToReadableSize(file.fileSize)[1]}</td>
                        <td>{file.nbDownloads}</td>
                        <td>
                          <button className="btn h-6"><a href="#">Details</a></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <tbody>
                  <tr class="text-center">
                    <td colSpan={6}>No sent item found.</td>
                  </tr>
                </tbody>
              )}
            </table>
          )}
          <div className="text-iexwhite"></div>
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

export default Research;
