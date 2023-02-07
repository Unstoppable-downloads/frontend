import { IExec } from "iexec";
import * as usdl from "./constants";

const configArgs = { ethProvider: window.ethereum, chainId: 134 };
const configOptions = { smsURL: process.env.REACT_APP_SMS_URL };
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === 'true';

let iexec = null

/**
 * 
 * @returns 
 */
export const getIexec = function () {
    if (null === iexec) {

        iexec = new IExec(configArgs, configOptions);
        
        if (IS_DEBUG) console.log("Created new instance of iExec");
    }
    return iexec

    // else {
    //     //if (IS_DEBUG) console.log("Re-using iexec ");
    // }
}