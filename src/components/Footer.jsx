import React from "react";
import {useContext} from "react";
import {AceContext} from "../context/context";

const Footer = () => {
  const { backgroundColorIsBlack } = useContext(AceContext);
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="footer-container">
          <footer>
            <div className="justify-center mx-auto flex basis-1/3">
              { backgroundColorIsBlack 
                ? <>
                    <div className="mx-auto flex text-iexwhite items-center font-logo text-base">
                      <p className="mx-3 text-center">Powered by </p>
                      <img src={require("../assets/cropped-favicon-192x192.png")} alt="iExec logo" className="h-5" />
                      <p className="mx-1 text-center">iExec</p>
                    </div>
                  </>
                : <>
                    <div className="mx-auto flex text-iexblk items-center font-logo text-base">
                      <p className="mx-3 text-center">Powered by </p>
                      <img src={require("../assets/cropped-favicon-192x192.png")} alt="iExec logo" className="h-5" />
                      <p className="mx-1 text-center">iExec</p>
                    </div>
                  </>
                }
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Footer;