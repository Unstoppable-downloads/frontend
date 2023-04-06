import React, { useState, useContext, useEffect, useLocation } from 'react';
import { Helmet } from 'react-helmet';
import SendForm from "../components/Upload/SendForm";
import { AceContext } from '../context/context';
import crypto from 'crypto-browserify';
import { numberOfChunks } from '../components/Upload/uploader.ts';
import StepBar from '../components/StepBar';
const APP_NAME = process.env.REACT_APP_NAME;

function Upload() {
  const { state, background, bgCreator, bgUrls, bgCreatorSocial, creativeMode, imgUrl, numberOfChunks } = useContext(AceContext);
  

  const [message, setMessage] = useState("")
  const [statusWidth, setStatusWidth] = useState()

  const writeStatus = (status) => {
    return (
      <span>{status}</span>
    )
  }

  useEffect(()=> {
    
  }, [])
  useEffect(() => {
    writeStatus(state)
  }, [state])
  useEffect(() => {
    onStatusChanged("")
  })
  useEffect(() => {
  }, [statusWidth])
  useEffect(() => {}, [numberOfChunks])

  
  const onStatusChanged = (newStatus) => {
    console.log("New status", newStatus)
    console.log(document.getElementById("statusBar").innerText)
    const chunks = newStatus.split('/');
    var actualChunk = 0;
    if (chunks[0]) actualChunk = parseInt(chunks[0]);
    var totalChunks = 0;
    if (chunks[1]) totalChunks = parseInt(chunks[1]);
    console.log("actual chunk", actualChunk, "Total number of chnks", chunks[1])
    if (actualChunk >= 0 && totalChunks > 0) {
      let width = actualChunk / totalChunks
      console.log(width)
      document.getElementById("statusBarContainer").classList.remove("hidden")
      setStatusWidth(width)
      document.getElementById("statusBar").style.width = `${width*100}%`;
      document.getElementById("statusBar").innerText = newStatus;
    }
  }


  // Defining algorithm
  const algorithm = 'aes-256-cbc';

  // Defining key
  const key = crypto.randomBytes(32);

  const chunksBullet = [];
  for (let i = 0; i < numberOfChunks; i++) {
    chunksBullet.push(<div className="mx-8 rounded-full bg-iexyellow w-5 h-5"></div>)
  }

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Upload</title>
      </Helmet>
      <div className="relative flex flex-col mx-auto py-m items-center justify-center">
        <div className="flex">
          <SendForm statusChangedHandler={onStatusChanged} />
        </div>
        {numberOfChunks > 0 && (
          <div className="mt-8">Uploading to IPFS...</div>
        )}
        <div id="statusBarContainer" className="hidden w-64 bg-gray-200 rounded-l-full rounded-r-full items-center m-3">
          <div id="statusBar" className="pgbr bg-iexyellow text-base font-medium text-iexblk text-center p-1 leading-none h-5">90%</div>
        </div>
      </div>
    </>
  )
}

export default Upload;