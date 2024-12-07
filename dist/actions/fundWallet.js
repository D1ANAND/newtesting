"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundWallet = void 0;
const ethers_1 = require("ethers");
const config_1 = require("../utils/config");
const fundWallet = async (userWallet) => {
    // Validate private key
    const privateKey = process.env.ETHEREUM_PRIVATE_KEY;
    console.log(privateKey);
    if (!privateKey) {
        throw new Error("ETHEREUM_PRIVATE_KEY is not set in the environment variables.");
    }
    const chainInfo = (0, config_1.getChainInfo)(process.env.CHAIN_TO_SEND_TX_ON || "polygon");
    // Create the vault wallet
    const vaultWallet = new ethers_1.ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, new ethers_1.ethers.providers.JsonRpcProvider(chainInfo.rpcUrl));
    // Prepare transaction
    const tx = {
        to: userWallet,
        value: ethers_1.ethers.utils.parseEther("0.001"),
        gasLimit: 21000,
        gasPrice: await vaultWallet.provider.getGasPrice(), // Ensure you're calling `provider.getGasPrice()`
        chainId: chainInfo.chainId,
    };
    // Send transaction
    const txResponse = await vaultWallet.sendTransaction(tx);
    await txResponse.wait();
    console.log(`Gas funded for wallet: ${userWallet}. Tx Hash: ${txResponse.hash}`);
};
exports.fundWallet = fundWallet;
