"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainInfo = void 0;
const getChainInfo = (chain) => {
    const chains = {
        polygon: { rpcUrl: "https://polygon-rpc.com", chainId: 137 },
        ethereum: { rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", chainId: 1 },
    };
    return chains[chain] || chains["polygon"];
};
exports.getChainInfo = getChainInfo;
