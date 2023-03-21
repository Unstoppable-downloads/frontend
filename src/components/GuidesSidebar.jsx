import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import SendForm from "./Upload/SendForm";

const APP_NAME = process.env.REACT_APP_NAME;

const GuidesSidebar = () => {
  return (
    <>
      <aside>
        <div className="flex flex-col">
          <div className="my-4 flex items-center">
            <NavLink to="/" relative="path">
              <div className="flex">
                <img
                  src={require("../assets/usdl-text.png")}
                  alt="USDL logo"
                  className="app-logo-sidebar mr-2"
                />
                <div className="border-1 h-16 w-full border-l border-iexblk"></div>
              </div>
            </NavLink>

            <span className="mx-4 text-xl">Guides</span>
          </div>
          <ul className="my-2">
            <li className="mb-2">File publishing service setup</li>
            <li>
              File indexing service setup
              <ul>
                <li>
                  <a href="/guides/how-to-index#docker" className="text-iexblk text-sm ml-4">
                    Install Docker
                  </a>
                </li>
                <li>
                  <a href="/guides/how-to-index#wallet" className="text-iexblk text-sm ml-4">
                    Install a Local Wallet
                  </a>
                </li>
                <li>
                  <a href="/guides/how-to-index#clone" className="text-iexblk text-sm ml-4">
                    Git Clone the Repo
                  </a>
                </li>
                <li>
                  <a href="/guides/how-to-index#env" className="text-iexblk text-sm ml-4">
                    Copy the .env File
                  </a>
                </li>
                <li>
                  <a href="/guides/how-to-index#key" className="text-iexblk text-sm ml-4">
                    Add your private key
                  </a>
                </li>
                <li>
                  <a href="/guides/how-to-index#dockerfile" className="text-iexblk text-sm ml-4">
                    Run the Dockerfile
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default GuidesSidebar;
