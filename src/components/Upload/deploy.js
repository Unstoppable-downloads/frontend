import {getIexec} from "../../shared/getIexec"; 

import * as usdl from "../../shared/constants";
const IS_DEBUG = process.env.REACT_APP_IS_DEBUG == 'true';


/**
 * Deploy a dataset contract on the blockchain
 * @param {string} name the dataset name
 * @param {string} multiaddr the dataset deployment address
 * @param {string} checksum the computed dataset file checksum
 * @returns the dataset address
 */
const deployDataset = async  (name, multiaddr, checksum)=> {
    try {
        let iexec = getIexec();
        const owner = await iexec.wallet.getAddress();
        console.log("Owner", owner);
        const { address, txHash } = await iexec.dataset.deployDataset({
            owner,
            name,
            multiaddr,
            checksum,
        });
        if (IS_DEBUG) console.log("Dataset deployed at", address);

        // VERIFICATION DATASET DEPLOYMENT
        if (IS_DEBUG) console.log("Deployed dataset\n", await iexec.dataset.showDataset(address));
        return address;
        // ...............................
    } catch (err) {
        console.error(err);
    }
};

/**
 * Push the dataset's encryption key to SMS
 * @param {string} datasetAddress encrypted dataset address
 * @param {string} datasetEncryptionKey
 */
const pushSecret = async(datasetAddress, datasetEncryptionKey) => {
    try {
        let iexec = getIexec();
        const pushed = await iexec.dataset.pushDatasetSecret(datasetAddress, datasetEncryptionKey);
        if (IS_DEBUG) console.log("Secret pushed ", pushed);
    } catch (err) {
        console.error(err);
    }
};

/**
 * Push a dataset order on the iExec marketplace making it available for a requester
 * @param {string} datasetAddress the dataset address
 * @param {string} requesterrestrict the requester address the dataset order is restricted for
 */
const pushOrder = async(datasetAddress) => {
    try {
        let iexec = getIexec();

        const orderTemplate = await iexec.order.createDatasetorder({
            dataset: datasetAddress,
            volume: 10000000,
            tag: "tee",
            apprestrict: usdl.APP_ADDRESS
        })
        const signedOrder = await iexec.order.signDatasetorder(orderTemplate)
        if (IS_DEBUG) console.log("Signed order", signedOrder)
        const pushedOrder = await iexec.order.publishDatasetorder(signedOrder)
        if (IS_DEBUG) console.log(pushedOrder);

        const foundorders = await iexec.orderbook.fetchDatasetOrderbook(
            datasetAddress, {
                app: usdl.APP_ADDRESS,
                workerpool: usdl.WORKERPOOL_ADDRESS,
                minTag: usdl.TEE_TAG,
                maxTag: usdl.TEE_TAG
            }
        );
        if (IS_DEBUG) console.log("dataset foundorders", foundorders);

    } catch (err) {
        console.log(err)
    }
}

export { deployDataset, pushSecret, pushOrder };