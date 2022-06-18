import { useQuery } from "react-query";

const ALL_TXNS_URL =
  "https://testnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=QVJDMDAtMA==";
const REPLY_TYPES = ["ARC00-0;r;", "ARC00-0;l;", "ARC00-0;d;"];

const getTxnRepliesUrl = (prefix: string) =>
  `https://testnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=${prefix}`;

export const fetchAllTxns = async () => {
  const response = await fetch(ALL_TXNS_URL);
  const data = await response.json();
  return data;
};

export const fetchTxn = async (txnId: string | undefined) => {
  if (!txnId) {
    return {};
  }
  const txUrl = `https://testnet-idx.algonode.cloud/v2/transactions/${txnId}`;
  const response = await fetch(txUrl);
  const data = await response.json();

  return data;
};

export const fetchTxnsByTopic = async (topic: string | undefined) => {
  if (!topic) {
    return {};
  }
  const prefix = window.btoa("ARC00-0;t;" + topic);
  const topicTxsUrl = `https://testnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=${prefix}`;
  const response = await fetch(topicTxsUrl);
  const data = await response.json();

  return data;
};

export const fetchAllTxnReplies = async (txnID: string | undefined) => {
  const queries = REPLY_TYPES.map((reply_type) => {
    const prefix = window.btoa(reply_type + txnID);
    return fetch(getTxnRepliesUrl(prefix))
      .then((response) => response.json())
      .then((data) => data);
  });
  const replies = await Promise.all(queries);

  return replies;
};
