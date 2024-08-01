import algosdk from "algosdk";

export const shortenedAccountBase32 = (account: string) =>
  `${account.slice(0, 5)}...${account.slice(-5)}`;

export const microalgosToAlgos = (fee: number) => {
  const feeInAlgos = algosdk.microalgosToAlgos(fee);
  return `${feeInAlgos} ALGO`;
};

export const algosToMicroalgos = (algo: number) => {
  const amountInMicroAlgos = algosdk.algosToMicroalgos(algo);
  return amountInMicroAlgos;
};

export const getTxns = async () => {
  const url = `https://testnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=QVJDMDAtMA==`;
  const response = await fetch(url);
  const data = await response.json();
  return data.transactions;
};
