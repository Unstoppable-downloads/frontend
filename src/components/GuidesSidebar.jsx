import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import SendForm from "./Upload/SendForm";

const APP_NAME = process.env.REACT_APP_NAME;

const GuidesSidebar = () => {
  return (
    <>
      <aside>
        <div className="flex flex-col fixed">
          <div className="my-4 flex items-center">
            {/* <NavLink to="/" relative="path">
              <div className="flex">
                <img
                  src={require("../assets/usdl-text.png")}
                  alt="USDL logo"
                  className="app-logo-sidebar mr-2"
                />
                <div className="border-1 h-16 w-full border-l border-iexblk"></div>
              </div>
            </NavLink>

            <span className="mx-4 text-xl">Guides</span> */}
          </div>
          <ul id="sidebar" className="my-2">
            <li className="mb-2">File publishing service setup</li>
            <li>
              File indexing service setup
              <ul>
                <li className="sb-element" id="sb-prerequisites">
                  <a href="/guides/how-to-index#prerequisites" className="text-iexblk text-sm ml-4"
                    onClick={() => {
                      const qs = document.querySelector("#sb-prerequisites");
                      const els = document.getElementsByClassName("sb-element")
                      console.log("els", els)
                      for (let element of els) {
                        element.classList.remove("active")
                      }
                      qs.classList.toggle("active")
                    }}
                  >
                    Prerequisites
                  </a>
                </li>
                <li className="sb-element" id="sb-docker">
                  <a href="/guides/how-to-index#docker" className="text-iexblk text-sm ml-4"
                    onClick={() => {
                      const qs = document.querySelector("#sb-docker");
                      const els = document.getElementsByClassName("sb-element")
                      console.log("els", els)
                      for (let element of els) {
                        element.classList.remove("active")
                      }
                      qs.classList.toggle("active")
                    }}
                  >
                    Install Docker
                  </a>
                </li>
                <li className="sb-element" id="sb-wallet">
                  <a href="/guides/how-to-index#wallet" className="text-iexblk text-sm ml-4"
                    onClick={() => {
                      const qs = document.querySelector("#sb-wallet");
                      const els = document.getElementsByClassName("sb-element")
                      console.log("els", els)
                      for (let element of els) {
                        element.classList.remove("active")
                      }
                      qs.classList.toggle("active")
                    }}
                  >
                    Install a Local Wallet
                  </a>
                </li>
                <li className="sb-element" id="sb-clone">
                  <a href="/guides/how-to-index#clone" className="text-iexblk text-sm ml-4"
                    onClick={() => {
                      const qs = document.querySelector("#sb-clone");
                      const els = document.getElementsByClassName("sb-element")
                      console.log("els", els)
                      for (let element of els) {
                        element.classList.remove("active")
                      }
                      qs.classList.toggle("active")
                    }}
                  >
                    Git Clone the Repo
                  </a>
                </li>
                <li className="sb-element" id="sb-env">
                  <a href="/guides/how-to-index#env" className="text-iexblk text-sm ml-4"
                    onClick={() => {
                      const qs = document.querySelector("#sb-env");
                      const els = document.getElementsByClassName("sb-element")
                      console.log("els", els)
                      for (let element of els) {
                        element.classList.remove("active")
                      }
                      qs.classList.toggle("active")
                    }}
                  >
                    Copy the .env File
                  </a>
                </li>
                <li className="sb-element" id="sb-key">
                  <a href="/guides/how-to-index#key" className="text-iexblk text-sm ml-4"
                    onClick={() => {
                      const qs = document.querySelector("#sb-key");
                      const els = document.getElementsByClassName("sb-element")
                      console.log("els", els)
                      for (let element of els) {
                        element.classList.remove("active")
                      }
                      qs.classList.toggle("active")
                    }}
                  >
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
