export const litActionCode = `
const _litActionCode = async () => {
  const signature = await Lit.Actions.signAndCombineEcdsa({
    toSign,
    publicKey,
    sigName,
  });

  const jsonSignature = JSON.parse(signature);
  jsonSignature.r = "0x" + jsonSignature.r.substring(2);
  jsonSignature.s = "0x" + jsonSignature.s;
  const hexSignature = ethers.utils.joinSignature(jsonSignature);

  const signedTx = ethers.utils.serializeTransaction(unsignedTransaction, hexSignature);

  const response = await Lit.Actions.runOnce({ waitForResponse: true, name: "txnSender" }, async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(await Lit.Actions.getRpcUrl({ chain }));
      const txReceipt = await provider.sendTransaction(signedTx);
      return \`Transaction sent successfully. Hash: \${txReceipt.hash}\`;
    } catch (error) {
      return \`Error sending transaction: \${error.message}\`;
    }
  });

  Lit.Actions.setResponse({ response });
};

export default litActionCode;
`;
