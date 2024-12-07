"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = void 0;
const ethers_1 = require("ethers");
const lit_node_client_1 = require("@lit-protocol/lit-node-client");
const litAction_1 = require("./litAction");
const sendTransaction = async (unsignedTransaction) => {
    const litClient = new lit_node_client_1.LitNodeClient({ litNetwork: "datil" });
    await litClient.connect();
    // Get the session signatures (remove authMethods)
    const sessionSigs = await litClient.getSessionSigs({
        pkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
        authNeededCallback: function (params) {
            throw new Error("Function not implemented.");
        },
        resourceAbilityRequests: []
    });
    // Compute the transaction hash to sign
    const txHash = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.serializeTransaction(unsignedTransaction));
    // Call the Lit Action with the corrected structure
    const result = await litClient.executeJs({
        code: litAction_1.litActionCode,
        sessionSigs, // Include sessionSigs here at the top level
        jsParams: {
            toSign: ethers_1.ethers.utils.arrayify(txHash),
            publicKey: process.env.LIT_PKP_PUBLIC_KEY,
            sigName: "mainTransaction",
            chain: process.env.CHAIN_TO_SEND_TX_ON,
            unsignedTransaction,
        },
    });
    console.log("Transaction executed. Result:", result);
};
exports.sendTransaction = sendTransaction;
