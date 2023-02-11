import { create, Options } from 'ipfs-http-client'
import * as constants from "./constants";
import all from 'it-all'

let ipfs: null
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG === 'true';


export const confirmDocumentAvailable = async (cid: string): Promise<any> => {

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

  result.ipfsURL = `https://infura-ipfs.io/ipfs/${cid}`
  return result;

}

export const getNextIpfsGateway = (cid, trycount) => {

  const gateways = process.env.REACT_APP_IPFS_GATEWAYS.split(',');

  let numNext = trycount % gateways.length
  let nextUrl = gateways[numNext] + "/" + cid;
  console.log("numNext", numNext, "nextUrl", nextUrl);

  return nextUrl;
}


export const checkFileAvailability = async (url, _callback) => {

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  let options = {
    method: "HEAD",
    cache: "no-cache",
    signal: controller.signal
    //mode: "no-cors", 
    //redirect: "follow"
  };

  if (url.indexOf('cloudflare') === -1 && url.indexOf('pinata') === -1) {
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


export const addToIpfs = async (buf: Buffer,  pinTryCount?: number, node?: IPFS): Promise<string> => {

  node = node ? node : await getIPFS();
  const version = await node.version()

  pinTryCount = pinTryCount ? pinTryCount : 0;

  console.log("PIN TO IPFS tryCount", pinTryCount);
  //const node = await IPFS.create({ repo: 'ipfs-' + Math.random() });

  let newCid: string = "";
  try {

    const addResult = await node.add(buf);

    const data = await all(node.cat(addResult.cid));

    const checkResult = await confirmDocumentAvailable(addResult.cid.toString());

    if (checkResult.status === "SUCCESS") {
      console.log("Added file:", addResult.path, addResult.cid.toString(), checkResult, "pinTryCount", pinTryCount);
      newCid = addResult.cid.toString();
    }
    else {
      if (pinTryCount < 10) {
        newCid = await addToIpfs(buf, pinTryCount + 1, node);
      }
      else {
        alert(`Could not find document on ipfs`);
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