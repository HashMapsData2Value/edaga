import { getDefaultNetwork } from "@/config/network.config";
import algosdk from "algosdk";

export const shortenedAccountBase32 = (
  account: string | undefined | null,
  slice: number = 5
) => {
  if (!account) return "Unknown Account";
  return `${account.slice(0, slice)}...${account.slice(-slice)}`;
};
export const microalgosToAlgos = (fee: number) => {
  const feeInAlgos = algosdk.microalgosToAlgos(fee);
  return `${feeInAlgos} ALGO`;
};

export const algosToMicroalgos = (algo: number) => {
  const amountInMicroAlgos = algosdk.algosToMicroalgos(algo);
  return amountInMicroAlgos;
};

export const getTxns = async (broadcastChannel: string) => {
  const defaultNetwork = getDefaultNetwork();
  const url = `${defaultNetwork?.endpoints?.[0].indexer}/v2/accounts/${broadcastChannel}/transactions?note-prefix=QVJDMDAtMA==`;
  const response = await fetch(url);
  const data = await response.json();
  return data.transactions;
};
