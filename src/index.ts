import { fundWallet } from "./actions/fundWallet";
import { sendTransaction } from "./actions/sendTransaction";
import { getChainInfo } from "./utils/config";
import { ethers } from "ethers"; // Correct import for ethers
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const userWallet = "0x49C2E4DB36D3AC470ad072ddC17774257a043097";
  const chainInfo = getChainInfo(process.env.CHAIN_TO_SEND_TX_ON || "polygon");

  if (!chainInfo || !chainInfo.rpcUrl) {
    throw new Error("Invalid chain info. Please check your configuration.");
  }

  const provider = new ethers.providers.JsonRpcProvider(chainInfo.rpcUrl);
  const balance = await provider.getBalance(userWallet);

  console.log(`Current balance: ${ethers.utils.formatEther(balance)} ETH`);

  if (parseFloat(ethers.utils.formatEther(balance)) < 0.001) {
    console.log("Insufficient balance. Funding user wallet...");
    await fundWallet(userWallet);
  }

  const unsignedTransaction = {
    to: userWallet,
    value: ethers.utils.parseEther("0.0001"),
    gasLimit: 21000,
    gasPrice: await provider.getGasPrice(),
    chainId: chainInfo.chainId,
  };

  console.log("Sending transaction...");
  await sendTransaction(unsignedTransaction);
};

main().catch(console.error);
