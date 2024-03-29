import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AceContext } from "../../context/context";
import crypto from "crypto-browserify";
import { numberOfChunks } from "../../components/Upload/uploader.ts";
import GuidesSidebar from "../../components/GuidesSidebar";
import { Link, NavLink } from "react-router-dom";

const APP_NAME = process.env.REACT_APP_NAME;

const IndexingGuide = () => {
  const {setBackgroundColor} = useContext(AceContext);

  useEffect(() => {
    console.log(document.getElementById("app"))
    document.getElementById("app").style.backgroundColor = "#f2f1f4"
    document.getElementById("app").style.backgroundImage = null
  }, [])

  useEffect(() => {
    setBackgroundColor(false)
  }, [])

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Guide</title>
      </Helmet>
      <div className="flex page-subcontainer">
        <div>
          <div className="flex w-max flex-col">
            <div className="text-iexblk">
              <GuidesSidebar />
            </div>
          </div>
        </div>

        <div id="indexing" className="mx-auto ml-m flex w-full flex-col justify-center text-iexblk">
          <h2 className="mb-4 text-5xl font-bold">
            File indexing service setup
          </h2>
          <div className="mt-4 flex w-full flex-col items-start text-left">
            <div className="flex flex-col">
              <h3 className="text-3xl">Introduction</h3>
              <p className="mt-4 mb-8">
                {/* The role of the indexer is to locate the files on the
                blockchain, in order to find and access them.  */}
                In this documentation, we will guide you through the steps required to
                launch USDL's indexing service.
              </p>
              <h3 className="text-3xl" id="prerequisites">Prerequisites</h3>
              <p className="mt-4 mb-8">
                Before you begin, please ensure that you have the following
                prerequisites:
                <br />
              
                - Docker installed and properly configured for your operating
                system.
                <br />- A local wallet installed and configured to interact with
                the Ethereum network. If you do not have a local wallet, you can
                install and use the {" "}
                <a href="https://github.com/iExecBlockchainComputing/iexec-sdk/blob/master/CLI.md" className="text-main underline">
                  iExec SDK
                </a>{" "}
                to create one.
              </p>
              <h3 className="text-3xl" id="docker">Step 1: Install Docker</h3>
              <p className="mt-4 mb-8">
                If you do not already have Docker desktop installed on your
                system, you shall install it by following the instructions on
                the official{" "}
                <a href="https://docs.docker.com/engine/install/" className="text-main underline">
                  Docker website
                </a>{" "}
                to install it for your operating system.
              </p>
              <h3 className="text-3xl" id="wallet">Step 2: Install a iExec local Wallet</h3>
              <p className="mt-4 mb-8">
                To interact with the blockchain and run an USDL indexing
                service, you will need a local wallet installed and properly
                configured. If you already have a local wallet, make sure it is
                properly configured to interact with the Ethereum network. If
                you do not have a local wallet, you can install and use the
                iExec SDK to create one.
              </p>
              <h3 className="text-3xl" id="clone">Step 3: Git clone the Repo</h3>
              <p  className="mt-4 mb-8">
                Next, you will need to clone the indexer{" "}
                <a href="https://github.com/Unstoppable-downloads/indexer.git" className="text-main">
                  Github repo
                </a>
              </p>
              <h3 className="text-3xl" id="env">Step 4: Copy the .env file</h3>
              <p className="my-4">
                Once you have cloned the repository, navigate to the root
                directory of the project and make a copy of the .env.example
                file with the following command:
              </p>
              <code className="code bg-iexblk p-4 rounded-lg shadow-2xl mb-8"><span className="text-main">$</span>{" "}cp .env.example .env</code>
              <h3 className="text-3xl" id="key">Step 5: Add your private key</h3>
              <p className="my-4">
                Open the .env file in a text editor and add your local wallet's
                private key to the PRIVATE_KEY entry.
              </p>
              <code className="code bg-iexblk p-4 rounded-lg shadow-2xl mb-8">PRIVATE_KEY=&#60;your_private_key&#62;</code>
              <h3 className="text-3xl" id="ngrok">Step 6: Configure ngrok</h3>
              <p className="mt-4 mb-8">
                ----------------<br />----------------<br />----------------<br />
              </p>
              <h3 className="text-3xl" id="dockerfile">Step 7: Run the Dockerfile</h3>
              <p className="my-4">
                Next, you will need to run the Dockerfile to run your indexing
                service. Open a terminal window, navigate to the root directory
                of the project, and run the following command:
              </p>
              <code className="code bg-iexblk p-4 rounded-lg shadow-2xl mb-8"><span className="text-main">$</span>{" "}docker-compose up -d</code>
              <h3 className="text-3xl">Step 8: You're Ready!</h3>
              <p className="mt-4 mb-8">
                Once the Dockerfile has finished execution, your indexing service will be running. Congratulations! You have successfully launched your USDL file indexing service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexingGuide;
