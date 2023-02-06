import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import SendForm from "./Upload/SendForm";
import Details from "../pages/Search/details";
import { AceContext } from "../context/context";
import { fetchRecentData } from "../shared/searchData";

const APP_NAME = process.env.REACT_APP_NAME;

const SideBar = () => {
  const [recentFiles, setRecentFiles] = useState();

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
                return (
                  <NavLink
                    to={`/search/details/${file.uid}-${file.fileName}`}
                    relative="path"
                  >
                    <div key={i} className="my-3 text-iexyellow">
                      {file.fileName}
                    </div>
                  </NavLink>
                );
              })}
            </>
          )}
        </div>
      </aside>
      <Routes>
        <Route path="search/details/:uid-:fileName" element={<Details />} />
      </Routes>
    </>
  );
};

export default SideBar;
