import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SendForm from "../components/Upload/SendForm";
import { AceContext } from '../context/context';
import crypto from 'crypto-browserify';
const APP_NAME = process.env.REACT_APP_NAME;

function Upload() {
  const { state, background, bgCreator, bgUrls, bgCreatorSocial, creativeMode, imgUrl, checkFileAvailability, backgroundIsLight } = useContext(AceContext);
  

  const [message, setMessage] = useState("")

  const writeStatus = (status) => {
    return (
      <span>{status}</span>
    )
  }

  useEffect(() => {
    writeStatus(state)
  }, [state])

  // Defining algorithm
  const algorithm = 'aes-256-cbc';

  // Defining key
  const key = crypto.randomBytes(32);

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Home</title>
      </Helmet>
      <div className="relative flex mx-m py-m">
        <div className="flex">
          <SendForm />
        </div>

        <div className="text-iexwhite">
        </div>
      </div>
        
    </>
  )
}

export default Upload;