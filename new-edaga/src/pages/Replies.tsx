import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchAllTxnReplies, fetchTxn } from "./api";
import { useQuery } from "react-query";
import TxCard from "../components/cards/TxCard";

// TYPES
type TxnParams = {
  txnId: string;
};

// STYLES
const wrapper = {
  border: "1px solid tomato",
  display: "flex",
  flexFlow: "column no-wrap",
};

const Replies = () => {
  const { txnId } = useParams<TxnParams>();
  const txQuery = useQuery(txnId || "default-txn-id", () => fetchTxn(txnId));
  const allTxnRepliesQuery = useQuery("all-txn-replies", () =>
    fetchAllTxnReplies(txnId)
  );
  const isLoading = txQuery.isLoading || allTxnRepliesQuery.isLoading;

  const txn = txQuery.data?.transaction;
  const replies = allTxnRepliesQuery.data?.reduce(
    (acc, curReply) => [...acc, ...curReply.transactions],
    []
  );
  console.log({ txn, replies });

  return (
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx="wrapper">
          <Typography variant="h2">Original Message</Typography>
          <TxCard txn={txn} />
          <Typography variant="h2">Replies</Typography>
          {replies.map((reply) => (
            <TxCard key={reply.id} txn={reply} type="reply" />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Replies;
