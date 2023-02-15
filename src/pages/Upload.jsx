import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SendForm from "../components/Upload/SendForm";
import { AceContext } from '../context/context';
import crypto from 'crypto-browserify';
import { numberOfChunks } from '../components/Upload/uploader.ts';
import StepBar from '../components/StepBar';
const APP_NAME = process.env.REACT_APP_NAME;

function Upload() {
  const { state, background, bgCreator, bgUrls, bgCreatorSocial, creativeMode, imgUrl, checkFileAvailability, backgroundIsLight, numberOfChunks } = useContext(AceContext);
  

  const [message, setMessage] = useState("")

  const writeStatus = (status) => {
    return (
      <span>{status}</span>
    )
  }

  useEffect(() => {
    writeStatus(state)
  }, [state])

  
  const  onStatusChanged = function (newStatus)
  {
      document.getElementById("statusDiv").innerText = newStatus ; 
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
      <div className="relative flex mx-auto py-m justify-center">
        <div className="flex">
          <SendForm statusChangedHandler={{onStatusChanged}} />
        </div>

        <div id="statusDiv"> hello man ! 
        </div>
      </div>
        
    </>
  )
}

export default Upload;