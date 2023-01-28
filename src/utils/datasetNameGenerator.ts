import * as usdl from "../shared/constants";
import { createHash } from "crypto-browserify";

const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == 'true';

const hashIt = (str)=>{
  return createHash('sha256').update(str).digest('hex');
}

export function generateDatasetNameLookup(owner?: string) {
  
  let lookupStr = "";

  if (owner)
  {
     let str1 = `${usdl.APP_ADDRESS}`.toLowerCase();
     lookupStr += hashIt(str1) ;
  }

  return lookupStr;
}

export function generateDatasetName(owner: string) {

  const str1 = `${usdl.APP_ADDRESS}`.toLowerCase() ;

  const hash = `${hashIt(str1)}`;
  const name = `${hash}${new Date().getTime().toString()}`
            // file name
  return name;
}
