import React, { useContext, useEffect } from "react";
import { AceContext } from "../context/context";
import ReactTooltip from "react-tooltip";

const StepBar = () => {
  const { step, setStep, creativeMode, backgroundIsLight } = useContext(AceContext);

  const barSteps = document.getElementsByClassName("progress");
  const one = document.querySelector(".one");
  const two = document.querySelector(".two");
  const three = document.querySelector(".three");
  const four = document.querySelector(".four");
  const five = document.querySelector(".five");
  const six = document.querySelector(".six");
  const seven = document.querySelector(".seven");

  useEffect(() => {
    if (step === 1 && one) one.classList.add("inprogr");
    if (step === 2 && two) two.classList.add("inprogr");
    if (step === 3 && three) three.classList.add("inprogr");
    if (step === 4 && four) four.classList.add("inprogr");
    if (step === 5 && five) five.classList.add("inprogr");
    if (step === 6 && six) six.classList.add("inprogr");
    if (step === 7 && seven) seven.classList.add("inprogr");
  }, [step]);


  return (
    <>
      <ReactTooltip multiline="true" />
      <ul id="stepbar" className="mt-s ml-xs flex flex-row items-start">
        <li className="mr-4 flex flex-col list-none items-center justify-center font-semibold">
          <p className="progress one">1</p>
          <p className="mt-24 w-full" style={{ transform: 'rotate(280deg)' }}>Encrypting file</p>
        </li>
        <li className="mx-4 flex flex-col list-none items-center justify-center font-semibold">
          <p className="progress two">2</p>
          <p className="mt-24 w-full" style={{ transform: 'rotate(280deg)' }}>Uploading encrypted file to IPFS</p>
        </li>
        <li className="mx-4 flex flex-col list-none items-center justify-center font-semibold">
          <p className="progress three">3</p>
          <p className="mt-24 w-full" style={{ transform: 'rotate(280deg)' }}>Creating and encrypting dataset</p>
        </li>
        <li className="mx-4 flex flex-col list-none items-center justify-center font-semibold">
          <p className="progress four">4</p>
          <p className="mt-24 w-full" style={{ transform: 'rotate(280deg)' }}>Uploading encrypted dataset to IPFS</p>
        </li>
        <li className="mx-4 flex flex-col list-none items-center justify-center font-semibold">
          <p class="progress five">5</p>
          <p className="mt-24 w-full" style={{ transform: 'rotate(280deg)' }}>
            <svg
              data-tip="Tx validation required"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="inlineText h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Deploying dataset
          </p>
        </li>
        <li className="mx-4 flex flex-col list-none items-center justify-center font-semibold">
          <p className="progress six">6</p>
          <p className="mt-24 w-full" style={{ transform: 'rotate(280deg)' }}>
            <svg
              data-tip="Signature required"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="inlineText h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Pushing dataset secret & creating orders
          </p>
        </li>
        <li className="mx-4 flex flex-col list-none items-center justify-center font-semibold">
          <p className="progress seven">7</p>
          <p className="mt-24 w-full" style={{ transform: 'rotate(280deg)' }}>File sent</p>
        </li>
      </ul>
    </>
  );
};

export default StepBar;
