import React, { useRef, useState, useContext, useEffect } from "react";
import { AceContext } from "../../context/context";
import * as ace from "../../shared/constants";
import { delay } from "../../utils/delay";
import { isAddress } from "../../utils/isAddress";

import { encryptFile, encryptDataset, generateEncryptedFileChecksum, datasetEncryptionKey } from "./encryption.js";
import { deployDataset, pushSecret, pushOrder } from "./deploy.js";
import { generateDatasetName } from "../../utils/datasetNameGenerator.ts";
import { jsonToBuffer } from "../../utils/jsonToBuffer";
import { getIexec } from "../../shared/getIexec";
import { uploadFileToIpfs } from "./uploader.ts";
import { downloadFile } from "../Download/downloader.ts";

import ReactTooltip from "react-tooltip";
import { setModalContent, toggleModal } from "../Modal/ModalController";
import Modal from "../Modal/Modal";

import { addToIpfs,confirmDocumentAvailable } from "../../shared/ipfsUtils.ts";

const { ethereum } = window;

const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == "true";

const SendForm = () => {
  const { connectedAccount, connectWallet, getNextIpfsGateway } =
    useContext(AceContext);

  const {
    isLoading,
    setIsLoading,
    addressTo,
    setAddressTo,
    step,
    setStep,
    price,
    setPrice,
    message,
    setMessage,
    selectedFiles,
    setSelectedFiles,
    checkFileAvailability,
    setIsAvailable,
  } = useContext(AceContext);
  const inputFile = useRef(null);
  const [isAFile, setIsAFile] = useState(false);
  const [selectedValueList, setSelectedValueList] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imdb, setImdb] = useState("");

  let resolvedAddressTo;

  let iexec = getIexec();

  const handleChange = (event) => {
    setSelectedFiles([...selectedFiles, event.target.files[0]]);
    setIsAFile(true);
    for (var i = 0; i < selectedFiles.length; i += 1) {
      if (IS_DEBUG) console.log(selectedFiles[i]);
    }
    setTitle(event.target.files[0].name);
  };

  const handleChangeList = (e) => {
    setSelectedValueList(e.target.value);
  };
  const handleChangeDescr = (e) => {
    setDescription(e.target.value);
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeImbd = (e) => {
    setImdb(e.target.value);
  };


  var setInprogress = () => {
    document.getElementById("btn-transfer").classList.add("btn-inverted");
    document.getElementById("btn-transfer").innerText = "In progress...";
    document.getElementById("btn-transfer").disabled = true;
  };

  var setReady = () => {
    document.getElementById("btn-transfer").classList.remove("btn-inverted");
    document.getElementById("btn-transfer").innerText = "Tranfer";
    document.getElementById("btn-transfer").disabled = true;
  };

  const showModalFileSent = () => {
    setModalContent("sendform-modal", "File sent 🚀", `The owner of wallet ${addressTo} will get a new item in the inbox!`, true);
  };

  const modalCloseHandler = () => {
    window.location.reload(false);
  };

  const validateForm = async () => {
    let iexec = null;
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (!ethereum && isSafari) {
      let modalText = "Please install the Metamask plugin.";
      modalText += isSafari
        ? "<br/>Metamask is not currently supported on Safari. Please use another browser like Chrome."
        : "";
      setModalContent("app-modal", "Metamask missing 🦊", modalText, true);
      return;
    }

    try {
      iexec = getIexec();
    } catch (e) {
      setModalContent("sendform-modal", "Connection is required ❌", "Please connect your wallet first.", true);
      return false;
      console.error(e);
    }

    const isConnected = connectedAccount && connectedAccount !== "";
    if (!isConnected) {
      setModalContent("sendform-modal", "Connection is required ❌", "Please connect your wallet first.", true);
      return false;
    }

    const hasSelectedFile = selectedFiles && selectedFiles.length > 0;
    if (!hasSelectedFile) {
      setModalContent("sendform-modal", "No file selected ❌", "Please choose the file you want to send.", true);
      return false;
    }

    const hasRecipient = addressTo && addressTo.trim().length > 0;
    setAddressTo(addressTo.trim());
    if (!hasRecipient) {
      setModalContent("sendform-modal", "Address missing ❌", "Please enter the wallet address where to send the file. ENS is supported", true);
      return false;
    }

    const isValidAddress = isAddress(addressTo);
    console.log("isValidAddress", isValidAddress);
    if (!isValidAddress) {
      resolvedAddressTo = await iexec.ens.resolveName(addressTo);
      if (
        undefined == resolvedAddressTo ||
        null == resolvedAddressTo ||
        resolvedAddressTo.trim() == ""
      ) {
        setModalContent("sendform-modal", "Invalid address ❌", `Address ${addressTo} is not recognised. The value is not a valid ethereum address and no matching ENS item could be found.`, true);
        return false;
      }
    } else {
      resolvedAddressTo = addressTo;
    }

    return true;
  };

  const publishFile = async () => {


    // Split the file in bite size chunks and upload to Ipfs
    let metaData = await uploadFileToIpfs(selectedFiles[0]);

    if (metaData) {
      metaData.title = selectedFiles[0].name;
      metaData.imdb = imdb;
      metaData.description = description;
      metaData.categories = selectedValueList;

      // Create a iExec dataset with the file meta
      let encryptionResult = await encryptDataset(metaData);
      console.log("encryptionResult", encryptionResult);
      if (encryptionResult) {

        let datasetCid = await addToIpfs(encryptionResult.encryptedDataset);
        let datasetCheckResult = await confirmDocumentAvailable(datasetCid);
        let datasetIpfsUrl = datasetCheckResult.ipfsURL ;

        console.log("datasetCid", datasetCid, "datasetUrl", datasetIpfsUrl);

        let datasetName = generateDatasetName(connectedAccount);
        console.log("datasetName", datasetName);
        const checksum = await generateEncryptedFileChecksum(encryptionResult.encryptedDataset);
        let datasetAddress = await deployDataset(
          datasetName,
          datasetIpfsUrl,
          checksum
        );
        if (datasetAddress) {
          await pushSecret(
            datasetAddress,
            encryptionResult.datasetEncryptionKey
          );
          const isSecretPushed = await iexec.dataset.checkDatasetSecretExists(datasetAddress);
          if (isSecretPushed) {
            await pushOrder(datasetAddress);
          }
        }
      }
    }

  //  await downloadFile(metaData);

    //let jsonData = JSON.stringify(metaData) ;
    //encryptDataset(metaData) ;
  };


  return (
    <>
      <Modal id="sendform-modal" onModalClose={modalCloseHandler} />
      <form>
        <div className="mr-8 flex w-80 flex-col rounded-2xl bg-iexwhite px-4 py-4 text-iexblk shadow-xl">
          <div className="uploader">
            {isAFile ? (
              <div>
                You are uploading:
                {/* {selectedFile.slice(0, 1).map((file) => { */}
                {/* return ( */}
                <div className="flex items-center" key={selectedFiles[0].name}>
                  {selectedFiles[0].name}
                  <button
                    className="ml-2"
                    onClick={(e) => {
                      setSelectedFiles();
                      setIsAFile(false);
                    }}
                  >
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.096"></g><g id="SVGRepo_iconCarrier"><g id="style=fill"><g id="minus-circle"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.25 12.75C16.6642 12.75 17 12.4142 17 12C17 11.5858 16.6642 11.25 16.25 11.25L7.76477 11.25C7.35055 11.25 7.01477 11.5857 7.01476 12C7.01476 12.4142 7.35055 12.75 7.76476 12.75L16.25 12.75Z" fill="#fcd15a"></path>{" "}</g></g></g>
                    </svg>
                  </button>
                </div>
                {/* ); */}
                {/* })} */}
                <button
                  className="flex w-full items-center border-b border-gray-500 px-4 py-8"
                  onClick={(e) => {
                    e.preventDefault();
                    inputFile.current.click();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleChange(e);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleChange(e);
                  }}
                >
                  <svg viewBox="0 0 72 72" className="w-9">
                    <path
                      d="M36.493 72C16.118 72 0 55.883 0 36.493 0 16.118 16.118 0 36.493 0 55.882 0 72 16.118 72 36.493 72 55.882 55.883 72 36.493 72zM34 34h-9c-.553 0-1 .452-1 1.01v1.98A1 1 0 0 0 25 38h9v9c0 .553.452 1 1.01 1h1.98A1 1 0 0 0 38 47v-9h9c.553 0 1-.452 1-1.01v-1.98A1 1 0 0 0 47 34h-9v-9c0-.553-.452-1-1.01-1h-1.98A1 1 0 0 0 34 25v9z"
                      fill="rgb(252 209 90)"
                      fillRule="nonzero"
                    ></path>
                  </svg>
                  <h3 className="mx-4 text-2xl font-light">Upload files</h3>
                </button>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  ref={inputFile}
                />
              </div>
            ) : (
              <div>
                <button
                  className="flex w-full items-center border-b border-gray-500 px-4 py-16"
                  data-tip="Click here to choose the file to transfer"
                  onClick={(e) => {
                    e.preventDefault();
                    inputFile.current.click();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleChange(e);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleChange(e);
                  }}
                >
                  <svg viewBox="0 0 72 72" className="w-9">
                    <path
                      d="M36.493 72C16.118 72 0 55.883 0 36.493 0 16.118 16.118 0 36.493 0 55.882 0 72 16.118 72 36.493 72 55.882 55.883 72 36.493 72zM34 34h-9c-.553 0-1 .452-1 1.01v1.98A1 1 0 0 0 25 38h9v9c0 .553.452 1 1.01 1h1.98A1 1 0 0 0 38 47v-9h9c.553 0 1-.452 1-1.01v-1.98A1 1 0 0 0 47 34h-9v-9c0-.553-.452-1-1.01-1h-1.98A1 1 0 0 0 34 25v9z"
                      fill="rgb(252 209 90)"
                      fillRule="nonzero"
                      data-tip="Click here to choose the file to transfer"
                    ></path>
                  </svg>
                  <h3 className="mx-4 text-2xl font-extralight">
                    Upload files
                  </h3>
                </button>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  ref={inputFile}
                  required
                />
              </div>
            )}
          </div>

          <div className="p-4">
            <select
              className="my-4 border border-iexblk"
              onChange={(e) => handleChangeList(e)}
            >
              <option value="">--Please choose an category--</option>
              <option value="music">Music</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="ebook">E-book</option>
              <option value="software">Software</option>
              <option value="game">Game</option>
              <option value="other">Other</option>
            </select>

            <textarea
              value={description}
              className="w-full p-2"
              onChange={handleChangeDescr}
              placeholder="Description"
            />

            <div className="flex">
              <label htmlFor="doctitle" className="mr-2">
                Title
              </label>
              <input name="doctitle" onChange={handleChangeTitle} required />
            </div>

            {(selectedValueList === "movie" ||
              selectedValueList === "series") && (
                <div className="my-4">
                  <label htmlFor="imdb" className="mr-2">
                    IMDB URL
                  </label>
                  <input
                    type="url"
                    onChange={handleChangeImbd}
                    className="ml-2"
                    name="imdb"
                  />
                </div>
              )}
            <input
              type="file"
              className="hidden"
              onChange={handleChange}
              ref={inputFile}
              required
            />
          </div>
          <div className="formFooter mx-auto items-center p-4">
            <ReactTooltip multiline="true" />

            <div className="mx-4 rounded-lg bg-iexblk">
              <button
                className="btn h-8 w-full font-bold"
                id="btn-transfer"
                onClick={async (e) => {
                  e.preventDefault();

                  publishFile();

                  alert("done");
                }}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendForm;
