import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import SendForm from "./Upload/SendForm";
import { AceContext } from "../context/context";
import { fetchRecentData } from "../shared/searchData";

const APP_NAME = process.env.REACT_APP_NAME;

const SideBar = () => {
  const [recentFiles, setRecentFiles] = useState();

  useEffect(() => {
    const updatefiles = async () => {
        setRecentFiles(await fetchRecentData())
    }
    updatefiles();
  }, []);

  return (
    <>
      <aside>
        <div className="flex flex-col px-4">
          <h3 className="text-xl my-8">Recent Uploads</h3>
          {console.log(recentFiles)}
          {recentFiles && (
            <>
                {recentFiles.map((file, i) => {
                    return (
                        <div key={i} className="text-iexyellow my-3">{file.fileName}</div>
                    )
                })}
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
