import * as bufferUtils from "../../utils/BufferUtils.ts";
import FileChunk from "../../shared/FileChunk.ts";
import MetaData from "../../shared/metadata.ts";
import { fixObservableSubclass } from "@apollo/client/utilities";
import * as constants from "../../shared/constants";

//import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import * as sha1 from "js-sha1";

import { addToIpfs } from "../../shared/ipfsUtils.ts";

const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === 'true';

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
  if (Object.prototype.toString.call(arrayBuffer) === '[object String]') {
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
 * Split the file into n parts
 * @param  
 */
export async function uploadFileToIpfs(file: File): Promise<MetaData> {

  var { chunks, arrayBuffer, readResult, chunkSize, fileLength }: { chunks: number; arrayBuffer: ArrayBuffer; readResult: any; chunkSize: number; fileLength: number; } = await getBufferAndChunksFromFile(file);

  let fileChunks = new Array<FileChunk>();
  let fileUid: string = uuidv4().replaceAll('-', '');



  let meta = new MetaData();
  meta.fileName = file.name;
  meta.fileSize = arrayBuffer.byteLength;
  meta.categories = ["e-book"];
  meta.hash = readResult.hash;
  meta.uid = fileUid;


  //console.log("chunks", chunks, "chunkSize", chunkSize, "fileLength", fileLength, "chunks", chunks);

  var chunk = 0;
  while (chunk <= chunks) {
    var start = chunk * chunkSize;
    let end = start + chunkSize;
    end = end > fileLength ? fileLength : end;

    if (start >= fileLength) {
      break;
    }

    let chunkData = arrayBuffer.slice(start, end);

    var chunkDataAsBuffer = bufferUtils.toBuffer(chunkData);
    let fc = new FileChunk();
    fc.sequence = chunk;
    fc.size = chunkData.byteLength;
    fc.byteBegin = start;
    fc.byteEnd = end;

    console.log("fc", fc, end - start + 1);

    fc.name = `${fileUid}${chunk.toString(16)}`;


    try {
      let cid = await addToIpfs(chunkDataAsBuffer);

      if (cid && cid !== "") {
        // let cid = await uploadData(chunkDataAsBuffer, fc.name, arrayBuffer);
        fc.cid = cid;

        fileChunks.push(fc);
        console.log("uploadData added", chunk, "/", chunks);

        //console.log("filechunk", fc);

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

export async function getBufferAndChunksFromFile(file: File) {
  const readResult: any = await readFile(file);

  let arrayBuffer: ArrayBuffer = readResult.bytes;

  let chunkSize = constants.MAX_PART_SIZE_MB * 1024 * 1024;
  let fileLength = arrayBuffer.byteLength;


  if (fileLength < chunkSize) {
    chunkSize = Math.floor(fileLength / constants.MIN_NB_PARTS);
    console.log("Small file below ", constants.MAX_PART_SIZE_MB, " MB");
  }

  var chunks = Math.ceil(fileLength / chunkSize);
  return { chunks, arrayBuffer, readResult, chunkSize, fileLength };
}