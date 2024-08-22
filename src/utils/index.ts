import algosdk from "algosdk";

export const shortenedAccountBase32 = (account: string, slice: number = 5) =>
  `${account.slice(0, slice)}...${account.slice(-slice)}`;

export const microalgosToAlgos = (fee: number) => {
  const feeInAlgos = algosdk.microalgosToAlgos(fee);
  return `${feeInAlgos} ALGO`;
};

export const algosToMicroalgos = (algo: number) => {
  const amountInMicroAlgos = algosdk.algosToMicroalgos(algo);
  return amountInMicroAlgos;
};

export const getTxns = async (broadcastChannel: string) => {
  const url = `https://testnet-idx.algonode.cloud/v2/accounts/${broadcastChannel}/transactions?note-prefix=QVJDMDAtMA==`;
  const response = await fetch(url);
  const data = await response.json();
  return data.transactions;
};
