import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../../context/context";
import crypto from "crypto-browserify";
import { numberOfChunks } from "../../components/Upload/uploader.ts";
import { NavLink, useLocation } from "react-router-dom";
import { getIPFS } from "../../shared/ipfsUtils.ts";
import GuidesSidebar from "../../components/GuidesSidebar";

const APP_NAME = process.env.REACT_APP_NAME;

const UploadingGuide = () => {
  const [ipfsAvailable, setipfsAvailable] = useState(false);

  const sendHelloWorld = async () => {
    try {
      const node = await getIPFS();
      const { cid } = await node.add("Hello world");
      if (cid) {
        setipfsAvailable(true);
        console.log(cid);
      }
    } catch (err) {
      console.log(err);
      setipfsAvailable(false);
    }
  };

  useEffect(() => {
    setInterval(async () => {
      if (!ipfsAvailable) {
        await sendHelloWorld();
      }
    }, [30000]);
  }, []);

  useEffect(() => {
    sendHelloWorld();
  }, [ipfsAvailable]);


  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname !== "/") {
      console.log(document.getElementById("app"))
      document.getElementById("app").style.backgroundColor = "#f1f0f3"
      document.getElementById("app").style.backgroundImage = null
    }
  }, [])
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Guide</title>
      </Helmet>
      <div className="flex">
        <div>
          <div className="flex w-max flex-col">
            <div className="text-iexblk">
              <GuidesSidebar />
            </div>
          </div>
        </div>

        <div className="ml-m flex w-full flex-col justify-center text-iexblk">
          <h2 className="mt-16 mb-4 text-5xl font-bold text-iexblk">
            File publishing service setup
          </h2>
          <div className="mt-4 flex w-full flex-col items-start text-left">
            <div>
              <p>
                When publishing a file, it will be uploaded to InterPlanetary
                File System (IPFS). To do this, USDL will be using a IPFS node
                nested locally on your machine. That way, for the proper functionning this you will only be needing :
                <br />
                &emsp;- well-configured IPFS desktop app
                <br />
                &emsp;- USDL dapp website
              </p>
              <div className="my-8 border-t border-gray-700"></div>
              {ipfsAvailable ? (
                <p className="my-3">
                  You are ready to upload! ✅ Go straight{" "}
                  <NavLink
                    to="/upload"
                    relative="path"
                    className="text-main hover:underline"
                  >
                    here
                  </NavLink>{" "}
                  to upload!
                </p>
              ) : (
                <p className="my-3">
                  Your IPFS node is not ready yet. ❌ Please follow the steps
                  below.
                </p>
              )}
              <h3 className="mt-8 text-3xl">Set up</h3>
            </div>
            <ol>
              <li className="my-3">1. Download and install IPFS desktop here </li>
              <li className="my-3">2. Run IPFS desktop</li>
              <li className="my-3">3. Go to settings</li>
              <li className="my-3">4. Scroll to "IPFS CONFIG"</li>
              <li className="my-3">
                5. Add '*' to the "Access-Control-Allow-Origin" entry in the JSON
                file, like below
                <img
                  src={require("../../assets/ipfs-example.png")}
                  alt="IPFS example"
                  className="h-56"
                />
              </li>
              <li>
                6. Make sure your the IPFS desktop node is running on port 5001, by
                checking and optionnaly change the API port in the "Addresses"
                entry
                <img
                  src={require("../../assets/ipfs-example-2.png")}
                  alt="IPFS example"
                  className="h-56"
                />
              </li>
              {ipfsAvailable && (
                <li className="my-3">
                  You are ready to upload! ✅ Get started{" "}
                  <NavLink
                    to="/upload"
                    relative="path"
                    className="text-main hover:underline"
                  >
                    here
                  </NavLink>
                  !
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadingGuide;
