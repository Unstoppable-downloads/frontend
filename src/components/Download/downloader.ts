import MetaData from '../../shared/metadata';
import * as constants from "../../shared/constants";
import FileChunk from '../../shared/FileChunk';
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == 'true';


const fetchFromIpfs = async (url, _callback):Promise<ArrayBuffer> => {

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    let options = {
        method: "GET",
        //cache: "no-cache",
        signal: controller.signal
        //mode: "no-cors", 
        //redirect: "follow"
    };

    try {
        if (IS_DEBUG) console.log("fetching url", url, "options", options);

        const response = await fetch(url, options);

        _callback()

        if ( response.status === 200 )
        {
            return response.arrayBuffer() ;
        }
        else
        {
            return new ArrayBuffer(0) ;
        }

        // await delay(2) ;

    } catch (error) {
        console.error(error);
        return false;
    }
};




const getNextIpfsGateway = (cid, trycount) => {

    const gateways = process.env.REACT_APP_IPFS_GATEWAYS.split(',');

    let numNext = trycount % gateways.length
    let nextUrl = gateways[numNext] + "/" + cid;
//    console.log("numNext", numNext, "nextUrl", nextUrl);

    return nextUrl;
}

const fetchChunk = async (cid: string): Promise<Buffer> => {

    const nbGateways = process.env.REACT_APP_IPFS_GATEWAYS.split(',').length;

    let contents: ArrayBuffer = new ArrayBuffer(0);
    let trycount: number = 0;
    let result = { "status": "FAILED", ipfsURL: "" };
    while (contents.byteLength == 0 && trycount < nbGateways * 10) {
        let ipfsUrl = getNextIpfsGateway(cid, trycount);
        if (IS_DEBUG) console.log("Checking file availability at", ipfsUrl);
        contents = await fetchFromIpfs(ipfsUrl, () => { if (IS_DEBUG) console.log("fetchFromIpfs ended...") }); //fileUrl
        trycount++;
    }

    return  Buffer.from(contents);

}


function arrayBufferToBufferCycle(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}


export async function downloadFile(meta: MetaData) {

    let allChunks = new Array(meta.chunks.length) ; 

    let isok:boolean = true ;
    for (let i:number=0;i<allChunks.length;i++) {
        let fc:FileChunk = meta.chunks[i] ;
        let contents:Buffer = await fetchChunk(fc.cid) ; 
        if (contents.byteLength>0) {
            allChunks[fc.sequence] = contents ;
        }
        else {
            isok = false ;
            console.log("Could not fetch data for part " , i) ;
        }
    }

    if (isok) {
        var joinedBuff = Buffer.concat(allChunks);
        saveFile(joinedBuff, "DOWNLOADED-" + meta.fileName) ;
    }

}


const saveFile = (buff, fileName) => {

    let fileBlob = new Blob([buff], { type: 'application/octet-stream' });
  
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
  
    console.log("blobdata", fileBlob);
  
    var url = window.URL.createObjectURL(fileBlob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };