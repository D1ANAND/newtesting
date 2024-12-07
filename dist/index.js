"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fundWallet_1 = require("./actions/fundWallet");
const sendTransaction_1 = require("./actions/sendTransaction");
const config_1 = require("./utils/config");
const ethers_1 = __importDefault(require("ethers"));
const main = async () => {
    const userWallet = "0x49C2E4DB36D3AC470ad072ddC17774257a043097";
    const chainInfo = (0, config_1.getChainInfo)(process.env.CHAIN_TO_SEND_TX_ON || "polygon");
    const provider = new ethers_1.default.providers.JsonRpcProvider(chainInfo.rpcUrl);
    const balance = await provider.getBalance(userWallet);
    if (parseFloat(ethers_1.default.utils.formatEther(balance)) < 0.001) {
        console.log("Insufficient balance. Funding user wallet...");
        await (0, fundWallet_1.fundWallet)(userWallet);
    }
    const unsignedTransaction = {
        to: userWallet,
        value: ethers_1.default.utils.parseEther("0.0001"),
        gasLimit: 21000,
        gasPrice: await provider.getGasPrice(),
        chainId: chainInfo.chainId,
    };
    await (0, sendTransaction_1.sendTransaction)(unsignedTransaction);
};
main().catch(console.error);
