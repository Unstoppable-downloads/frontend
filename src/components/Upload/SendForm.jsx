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
import {uploadFileToIpfs} from "./uploader.ts";
import {downloadFile} from "../Download/downloader.ts";



import ReactTooltip from 'react-tooltip';
import { setModalContent, toggleModal } from "../Modal/ModalController";
import Modal from "../Modal/Modal";
const { ethereum } = window;

const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == 'true';


const SendForm = () => {
  const { connectedAccount, connectWallet, getNextIpfsGateway } = useContext(AceContext);

  const { isLoading, setIsLoading, addressTo, setAddressTo, step, setStep, price, setPrice, message, setMessage, selectedFiles, setSelectedFiles, checkFileAvailability, setIsAvailable } = useContext(AceContext);
  const inputFile = useRef(null);
  const [isAFile, setIsAFile] = useState(false);
  const [selectedValueList, setSelectedValueList] = useState("");
  const [description, setDescription] = useState("");

  const BEGINNING_PROCESS = 0;
  const ENCRYPTING_FILE = 1;
  const UPLOADING_FILE = 2;
  const ENCRYPTING_DATASET = 3;
  const UPLOADING_DATASET = 4;
  const DEPLOYING_DATASET = 5;
  const PUSHING_SECRET = 6;
  const FINISHED = 7;
  const DELAY_BEFORE_CHECKING_FILE_UPLOADED = 3;
  let resolvedAddressTo;

  const handleChange = (event) => {
    setSelectedFiles([...selectedFiles, event.target.files[0]]);
    setIsAFile(true);
    for (var i = 0; i < selectedFiles.length; i += 1) {
      if (IS_DEBUG) console.log(selectedFiles[i]);
    }
  };

  const handleChangeList = (e) => {
    setSelectedValueList(e.target.value)
  }

  const handleChangeDescr = (e) => {
      setDescription(e.target.value);
  }

  var optimistic = false;
  const handleChecked = () => {
    const checkbox = document.getElementById("optimistic");
    if (IS_DEBUG) console.log(checkbox.checked);
    optimistic = checkbox.checked;
  };


  var setInprogress = () => {
    document.getElementById("btn-transfer").classList.add("btn-inverted");
    document.getElementById("btn-transfer").innerText = "In progress...";
    document.getElementById("btn-transfer").disabled = true;
  }

  var setReady = () => {
    document.getElementById("btn-transfer").classList.remove("btn-inverted");
    document.getElementById("btn-transfer").innerText = "Tranfer";
    document.getElementById("btn-transfer").disabled = true;
  }

  const showModalFileSent = () => {
    setModalContent("sendform-modal", "File sent 🚀", `The owner of wallet ${addressTo} will get a new item in the inbox!`, true);
  }

  const modalCloseHandler = () => {
    window.location.reload(false);
  }


  const validateForm = async () => {
    let iexec = null;
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (!ethereum && isSafari) {
      let modalText = "Please install the Metamask plugin.";
      modalText += isSafari ? "<br/>Metamask is not currently supported on Safari. Please use another browser like Chrome." : "";
      setModalContent("app-modal", "Metamask missing 🦊", modalText, true);
      return;
    }

    try {
      iexec = getIexec();
    }
    catch (e) {
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
      if (undefined == resolvedAddressTo || null == resolvedAddressTo || resolvedAddressTo.trim() == "") {
        setModalContent("sendform-modal", "Invalid address ❌", `Address ${addressTo} is not recognised. The value is not a valid ethereum address and no matching ENS item could be found.`, true);
        return false;
      }
    }
    else {
      resolvedAddressTo = addressTo
    }

    return true;
  }

  const publishFile = async () => {
        
    let metaData = await uploadFileToIpfs(selectedFiles[0]) ; 
    await downloadFile(metaData) ;    

    //let jsonData = JSON.stringify(metaData) ;
    //encryptDataset(metaData) ;
  }



  return (
    <>
      <Modal id="sendform-modal" onModalClose={modalCloseHandler} />
      <form>
        <div className="mr-8 flex w-80 flex-col rounded-2xl bg-iexwhite px-4 py-4 text-iexblk shadow-xl">
          <div className="flex flex-col">
            <div>
              <button
                className="border border-iexblk w-full rounded-md py-2"
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
                Upload
              </button>
              <input
                      type="file"
                      className="hidden"
                      onChange={handleChange}
                      ref={inputFile}
                      required
                    />
            </div>
            
            <select className="my-4 border border-iexblk" onChange={(e) => handleChangeList(e)}>
              <option value="music">Music</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="ebook">E-book</option>
              <option value="software">Software</option>
              <option value="game">Game</option>
              <option value="other">Other file</option>
            </select>

            <textarea
              value={description}
              onChange={handleChangeDescr}
              placeholder="Description"
            />
          </div>
          <div className="formFooter mx-auto items-center p-4">
            <ReactTooltip multiline="true" />

            <div className="optimisticContainer mb-4">
              <input
                type="checkbox"
                name="optimistic"
                id="optimistic"
                onClick={handleChecked}
              />
              <label htmlFor="optimistic" className="ml-2">
                Optimistic IPFS upload{" "}
                <svg
                  data-tip="Activate this setting to speedup the upload process.<br/>By default, the system will ensure that the file is available on IPFS before proceeding to the next step."
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="inlineText h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </label>
            </div>

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
