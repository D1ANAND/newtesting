import { ethers } from "ethers";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { litActionCode } from "./litAction";
import { AuthCallbackParams, AuthSig } from "@lit-protocol/types";

export const sendTransaction = async (unsignedTransaction: ethers.UnsignedTransaction) => {
  const litClient = new LitNodeClient({ litNetwork: "datil" });
  await litClient.connect();

  // Get the session signatures (remove authMethods)
  const sessionSigs = await litClient.getSessionSigs({
    pkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY!,
    authNeededCallback: function (params: AuthCallbackParams): Promise<AuthSig> {
      throw new Error("Function not implemented.");
    },
    resourceAbilityRequests: []
  });

  // Compute the transaction hash to sign
  const txHash = ethers.utils.keccak256(ethers.utils.serializeTransaction(unsignedTransaction));

  // Call the Lit Action with the corrected structure
  const result = await litClient.executeJs({
    code: litActionCode,
    sessionSigs, // Include sessionSigs here at the top level
    jsParams: {
      toSign: ethers.utils.arrayify(txHash),
      publicKey: process.env.LIT_PKP_PUBLIC_KEY!,
      sigName: "mainTransaction",
      chain: process.env.CHAIN_TO_SEND_TX_ON!,
      unsignedTransaction,
    },
  });

  console.log("Transaction executed. Result:", result);
};
