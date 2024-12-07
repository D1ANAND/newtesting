import { ethers } from "ethers";
import { getChainInfo } from "../utils/config";

export const fundWallet = async (userWallet: string) => {
  // Validate private key
  const privateKey = process.env.ETHEREUM_PRIVATE_KEY;
  console.log(privateKey)
  if (!privateKey) {
    throw new Error("ETHEREUM_PRIVATE_KEY is not set in the environment variables.");
  }

  const chainInfo = getChainInfo(process.env.CHAIN_TO_SEND_TX_ON || "polygon");

  // Create the vault wallet
  const vaultWallet = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY!,
    new ethers.providers.JsonRpcProvider(chainInfo.rpcUrl)
  );

  // Prepare transaction
  const tx = {
    to: userWallet,
    value: ethers.utils.parseEther("0.001"),
    gasLimit: 21000,
    gasPrice: await vaultWallet.provider.getGasPrice(), // Ensure you're calling `provider.getGasPrice()`
    chainId: chainInfo.chainId,
  };

  // Send transaction
  const txResponse = await vaultWallet.sendTransaction(tx);
  await txResponse.wait();

  console.log(`Gas funded for wallet: ${userWallet}. Tx Hash: ${txResponse.hash}`);
};
