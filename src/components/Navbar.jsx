import { disconnect } from "process";
import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AceContext } from "../context/context";
import { shortenAddress } from "../utils/shortenAddress";
import { copyTextToClipboard } from "../utils/copyToClipboard";
import { setModalContent } from "./Modal/ModalController";
import Modal from "./Modal/Modal";

import ReactTooltip from "react-tooltip";

const NavBar = () => {
  const { connectWallet, connectedAccount } = useContext(AceContext);

  const copyAddressToClipboard = () => {
    document.getElementById(
      "walletAddressContainer"
    ).innerHTML = `Copied! ${shortenAddress(connectedAccount)} 👋`;

    setTimeout(() => {
      document.getElementById(
        "walletAddressContainer"
      ).innerHTML = `Hello! ${shortenAddress(connectedAccount)} 👋`;
    }, 1000);

    copyTextToClipboard(connectedAccount);
  };

  const showModalNotConnected = () => {
    setModalContent(
      "navbar-modal",
      "Connection is required ❌",
      "Please connect your wallet to acces this menu option!",
      true
    );
  };

  const { pathname } = useLocation();

  if (pathname === "/") {
    return null;
  } else {
    return (
      <>
        <Modal id="navbar-modal" closeHand />
        <div className="flex w-full items-center justify-center bg-iexblk">
          <div className="top-container">
            <div className="flex items-center">
              <NavLink to="/" relative="path">
                <div className="flex">
                  <img src={require("../assets/usdl.png")} alt="USDL logo" className="app-logo" />
                  <div className="logo-container h-6 flex-none text-left font-logo text-xl not-italic">
                    Unstoppable Downloads
                  </div>
                </div>
              </NavLink>

              <nav className="top-navigation">
                <ul className="flex list-none">
                  <li>
                    <NavLink to="/search" relative="path">
                      Search
                    </NavLink>
                  </li>
                  <li>
                    {connectedAccount ? (
                      <NavLink to="/upload" relative="path">
                        Upload
                      </NavLink>
                    ) : (
                      <span onClick={showModalNotConnected}>Upload</span>
                    )}
                  </li>
                  <li>
                    {connectedAccount ? (
                      <NavLink to="/#" relative="path">
                        Settings
                      </NavLink>
                    ) : (
                      <span onClick={showModalNotConnected}>Settings</span>
                    )}
                  </li>
                  <li></li>
                </ul>
              </nav>
            </div>
            <div>&nbsp;</div>
            {/* <div className="cursor-pointer" onClick={() => window.open("https://t.me/ace_ft_bot")}> */}
            {/* <NavLink to="/settings" relative="path"> */}
            {/* <img src="/tg.png" className="tg-logo" />
                &nbsp;Settings */}
            {/* </NavLink> */}
            {/*</div> */}
            <div className="flex max-w-2/10 basis-1/5">
              {connectedAccount ? (
                <div className="ml-auto items-center">
                  <ReactTooltip multiline="true" />
                  <p
                    className="clickable ml-8 text-right"
                    data-tip="Click to copy"
                    id="walletAddressContainer"
                    onClick={copyAddressToClipboard}
                  >
                    Hello! {shortenAddress(connectedAccount)} 👋
                  </p>
                </div>
              ) : (
                <button className="btn ml-auto h-8 text-l font-bold" onClick={connectWallet}>
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default NavBar;
