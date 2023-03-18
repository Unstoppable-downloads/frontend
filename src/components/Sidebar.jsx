import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import SendForm from "./Upload/SendForm";
import Details from "../pages/Search/details";
import { AceContext } from "../context/context";
import { fetchRecentData } from "../shared/searchData";

const APP_NAME = process.env.REACT_APP_NAME;

const SideBar = () => {
  const [recentFiles, setRecentFiles] = useState();
  const {detailFile, setDetailFile} = useContext(AceContext)

  useEffect(() => {
    const updatefiles = async () => {
      setRecentFiles(await fetchRecentData());
    };
    updatefiles();
  }, []);

  return (
    <>
      <aside>
        <div className="flex flex-col px-4">
          <h3 className="my-8 text-xl">Recent Uploads</h3>
          {console.log(recentFiles)}
          {recentFiles && (
            <>
              {recentFiles.map((file, i) => {
                console.log(file)
                return (
                  <NavLink
                    to={`/search/details/${file.uid}`}
                    relative="path"
                    onClick={() => {
                      console.log(file.uid)
                      setDetailFile(file)
                      //sessionStorage.setItem("")
                    }}
                  >
                    <div key={i} className="my-3 text-iexyellow flex flex-col">
                      {file.title}
                      <span className="text-xs text-iexwhite">{file.fileName}</span>
                    </div>
                  </NavLink>
                );
              })}
            </>
          )}
        </div>
      </aside>
      <Routes>
        <Route path="search/details/:uid" element={<Details />} />
      </Routes>
    </>
  );
};

export default SideBar;
