export const getChainInfo = (chain: string) => {
  const chains: { [key: string]: { rpcUrl: string; chainId: number } } = {
    polygon: { rpcUrl: "https://polygon-rpc.com", chainId: 137 },
    ethereum: { rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", chainId: 1 },
  };

  return chains[chain] || chains["polygon"];
};
