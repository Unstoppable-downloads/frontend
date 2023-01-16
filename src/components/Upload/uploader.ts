import * as bufferUtils from "../../utils/BufferUtils.ts";
import FileChunk from "../../shared/FileChunk.ts";
import MetaData from "../../shared/metadata.ts";

import { create, Options } from 'ipfs-http-client'

import { delay } from "../../utils/delay";


import { fixObservableSubclass } from "@apollo/client/utilities";
//import { create, IPFSHTTPClient } from "ipfs-http-client";

import * as constants from "../../shared/constants";

//import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';

import * as sha1 from "js-sha1";
import all from 'it-all'

const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == 'true';


let ipfs: null
const getIpfs = async () => {
  if (ipfs) {
    console.log('IPFS already started')
    return ipfs;
  } else if (window.ipfs && window.ipfs.enable) {
    console.log('Found window.ipfs')
    ipfs = await window.ipfs.enable({ commands: ['id'] })
    return ipfs;
  } else {
    try {
      console.time('IPFS Started')
      ipfs = await ipfsCore.create();
      console.timeEnd('IPFS Started')
      return ipfs;
    } catch (error) {
      console.error('IPFS init error:', error)
      ipfs = null
    }
  }

  return null;
}


const createFiles = (directory, files) => {
  return files.map(file => {
    return {
      path: `${directory}/${file.name}`,
      content: file.content
    }
  })
}


const streamFiles = async (directory, files) => {

  console.log("directory", directory);
  // Create a stream to write files to
  const stream = new ReadableStream({
    start(controller) {
      for (const file of files) {
        // Add the files one by one
        console.log("enquee file", file);
        controller.enqueue(file)
      }

      // When we have no more files to add, close the stream
      controller.close()
    }
  })

  for await (const data of ipfs.addAll(stream)) {
    // The last data event will contain the directory hash
    if (data.path === directory) {
      return data.cid
    }
  }

  throw new Error('Could not find directory in `ipfs.addAll` output')
}




const checkFileAvailability = async (url, _callback) => {

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  let options = {
    method: "HEAD",
    cache: "no-cache",
    signal: controller.signal
    //mode: "no-cors", 
    //redirect: "follow"
  };

  if (url.indexOf('cloudflare') == -1 && url.indexOf('pinata') == -1) {
    //options.headers =  {"Access-Control-Allow-Origin": ["*"] }
  }
  try {
    if (IS_DEBUG) console.log("fetching url", url, "options", options);

    const response = await fetch(url, options);
    const ok = response.status === 200;

    // await delay(2) ;

    _callback()

    return ok; // If status is 200, then it's OK
  } catch (error) {
    console.error(error);
    return false;
  }
};




const getNextIpfsGateway = (cid, trycount) => {

  const gateways = process.env.REACT_APP_IPFS_GATEWAYS.split(',');

  let numNext = trycount % gateways.length
  let nextUrl = gateways[numNext] + "/" + cid;
  console.log("numNext", numNext, "nextUrl", nextUrl);

  return nextUrl;
}

const confirmChunckAvailable = async (cid: string): Promise<any> => {

  const nbGateways = process.env.REACT_APP_IPFS_GATEWAYS.split(',').length;

  let ok: boolean = false;
  let trycount: number = 0;
  let result = { "status": "FAILED", ipfsURL: "" };
  while (!ok && trycount < nbGateways * 2) {
    let ipfsUrl = getNextIpfsGateway(cid, trycount);
    if (IS_DEBUG) console.log("Checking file availability at", ipfsUrl);
    ok = await checkFileAvailability(ipfsUrl, () => { if (IS_DEBUG) console.log("checking ended...") }); //fileUrl
    if (ok) {
      result.status = "SUCCESS"
      result.ipfsURL = ipfsUrl;
    }
    trycount++;
    if (IS_DEBUG) console.log(ok);
  }

  return result;

}


const getIPFS = async function () {
  /*
    config: { Addresses: { Swarm: [
      // These are public webrtc-star servers
      '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
    ]
  },
  // This removes the default IPFS peers to dial to. You can specify any known addresses you wish, or leave blank.
  Bootstrap: []
  */
  //  let node = await ipfsCore.create({ repo: 'ipfs-usdl-' + new Date().getTime() });

  let opt: Options = {}
  //opt.host = '127.0.0.1' ; 
  opt.url = "http://localhost:5001/api/v0"
  let node = create(opt);

  return node;

}

const pinToIpfs = async (buf: Buffer, directoryName, chunkName: string, pinTryCount?: number, node?: IPFS): Promise<string> => {

  node = node ? node : await getIPFS();
  const version = await node.version()

  pinTryCount = pinTryCount ? pinTryCount : 0;

  console.log("PIN TO IPFS tryCount", pinTryCount);
  //const node = await IPFS.create({ repo: 'ipfs-' + Math.random() });

  let newCid: string = "";
  try {

    console.log('Version:', version.version)

    const addResult = await node.add(buf);

    console.log('Added file:', addResult.path, addResult.cid.toString())

    const data = await all(node.cat(addResult.cid));

    console.log('Added file contents:', data);


    //const addResult = await node.add({ content: buf });
    //const addResult = await node.add(buf);

    //const pinResult = await node.pin.add(addResult.cid);

    //console.log("addResult?", addResult, addResult.cid.toString(), "pinResult", pinResult);

    //console.log("delaying....");
    //await delay(10);
    console.log("done delaying....");
    const checkResult = await confirmChunckAvailable(addResult.cid.toString());

    if (checkResult.status === "SUCCESS") {
      console.log("Added file:", addResult.path, addResult.cid.toString(), checkResult, "pinTryCount", pinTryCount);
      newCid = addResult.cid.toString();
    }
    else {
      if (pinTryCount < 10) {
        newCid = await pinToIpfs(buf, directoryName, chunkName, pinTryCount + 1, node);
      }
      else {
        alert(`Could not find chunk ${chunkName} on ipfs`);
      }
    }

  }
  catch (exc) {
    console.error(exc);
  }
  finally {

  }

  return newCid;

}

const pinToIpfs_OLD = async (buf: Buffer, directoryName, chunkName: string, pinTryCount?: number, node?: IPFS): Promise<string> => {

  node = node ? node : await getIPFS();
  const version = await node.version()

  pinTryCount = pinTryCount ? pinTryCount : 0;

  console.log("PIN TO IPFS tryCount", pinTryCount);
  //const node = await IPFS.create({ repo: 'ipfs-' + Math.random() });

  let newCid: string = "";
  try {

    console.log('Version:', version.version)

    const addResult = await node.add({
      path: directoryName,
      content: buf
    })

    console.log('Added file:', addResult.path, addResult.cid.toString())

    const data = await all(node.cat(addResult.cid));

    console.log('Added file contents:', data);


    //const addResult = await node.add({ content: buf });
    //const addResult = await node.add(buf);

    //const pinResult = await node.pin.add(addResult.cid);

    //console.log("addResult?", addResult, addResult.cid.toString(), "pinResult", pinResult);

    console.log("delaying....");
    await delay(10);
    console.log("done delaying....");
    const checkResult = await confirmChunckAvailable(addResult.cid.toString());

    if (checkResult.status === "SUCCESS") {
      console.log("Added file:", addResult.path, addResult.cid.toString(), checkResult, "pinTryCount", pinTryCount);
      newCid = addResult.cid.toString();
    }
    else {
      if (pinTryCount < 10) {
        newCid = await pinToIpfs(buf, directoryName, chunkName, pinTryCount + 1, node);
      }
      else {
        alert(`Could not find chunk ${chunkName} on ipfs`);
      }
    }

  }
  catch (exc) {
    console.error(exc);
  }
  finally {

  }

  return newCid;

}

const addMetaDataToLocalCache = (meta: MetaData) => {

  let storage = window.localStorage;
  let existingTempStorage = storage.getItem("USDL_TMP");
  let tempStorageItems = new Array<any>();

  if (existingTempStorage) {
    tempStorageItems = JSON.parse(existingTempStorage)
  }

  tempStorageItems.push(meta);

  storage.setItem("USDL_TMP", JSON.stringify(tempStorageItems));

}


function createHexHash(algo, arrayBuffer, callback) {
  if (Object.prototype.toString.call(arrayBuffer) == '[object String]') {
    var encoder = new TextEncoder()
    arrayBuffer = encoder.encode(arrayBuffer)
  }
  crypto.subtle.digest(algo, arrayBuffer).then(function (hash) {
    var hex = ""
    var array = new Uint8Array(hash)
    for (var i = 0; i < array.byteLength; i++) {
      var byte = array[i]
      var pad = ""
      if (byte < 16) pad = "0"
      hex += pad + byte.toString(16)
    }
    callback(hex)
  })
}


const readFile = async (file: File): Promise<any> => {
  try {

    const readResult: ArrayBuffer = await new Promise(async (resolve, reject) => {
      const fileReader = new FileReader();
      await fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        let res = {
          "hash": sha1(e.target.result),
          "bytes": e.target.result
        };

        resolve(res);

      }
      fileReader.onerror = () => reject(Error(`Error`))
      fileReader.onabort = () => reject(Error(`Error : aborded`))
    });

    if (IS_DEBUG) console.log("fileBytes\n", readResult)

    return readResult;

    // const encryptedFile = await iexec.dataset.encrypt(fileBytes, fileEncryptionKey);
    // console.log("encrypted file", encryptedFile)
    // return encryptedFile;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Split the file into n pa
 * @param fileBuffer 
 */
export async function uploadFileToIpfs(file: File): Promise<MetaData[]> {

  const readResult: any = await readFile(file);

  let arrayBuffer: ArrayBuffer = readResult.bytes;

  //let aarrayBuffer =  bufferUtils.toArrayBuffer(fileBuffer); 
  let chunkSize = constants.MAX_PART_SIZE_MB * 1024 * 1024;
  let fileLength = arrayBuffer.byteLength;
  let fileChunks = new Array<FileChunk>();
  let fileUid: string = uuidv4().replaceAll('-', '');
  console.log("fileUid", fileUid);

  let meta = new MetaData();
  meta.fileName = file.name;
  meta.fileSize = arrayBuffer.byteLength;
  meta.categories = ["PHOTOS"];
  meta.hash = readResult.hash;
  meta.uid = fileUid;

  if (fileLength < chunkSize) {
    chunkSize = Math.floor(fileLength / constants.MIN_NB_PARTS);
    console.log("Small file below ", constants.MAX_PART_SIZE_MB, " MB");
  }

  let chunks = Math.ceil(fileLength / chunkSize);
  console.log("chunks", chunks, "chunkSize", chunkSize, "fileLength", fileLength, "chunks", chunks);

  let chunk = 0;
  while (chunk <= chunks) {

    var start = chunk * chunkSize;
    let end = start + chunkSize;
    end = end > fileLength  ? fileLength   : end;

    if (start >= fileLength) {
      break;
    }

    let chunkData = arrayBuffer.slice(start, end);

    let chunkDataAsBuffer = bufferUtils.toBuffer(chunkData);
    let fc = new FileChunk();
    fc.sequence = chunk;
    fc.size = chunkData.byteLength;
    fc.byteBegin = start;
    fc.byteEnd = end;

    console.log("fc", fc, end - start + 1);


    fc.name = `${fileUid}${chunk.toString(16)}`;

    console.log("uploadData", chunk, "/", chunks);

    try {
      let cid = await pinToIpfs(chunkDataAsBuffer, fileUid, fc.name);

      if (cid && cid != "") {

        // let cid = await uploadData(chunkDataAsBuffer, fc.name, arrayBuffer);
        fc.cid = cid;

        fileChunks.push(fc);

        console.log("filechunk", fc);

        //saveFile(chunkDataAsBuffer, fc.name);
        chunk++;

      }
      else {
        alert("Could not ensure file is available to IPFS");
        throw "Could not check availabilty on ipfs";
      }

    }
    catch (exc) {
      console.error(exc);
      break;
    }

  }

  meta.chunks = fileChunks;

  addMetaDataToLocalCache(meta);

  return meta;
}





