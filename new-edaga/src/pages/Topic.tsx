import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchTxnsByTopic } from "./api";
import TxCard from "../components/cards/TxCard";

// TYPES
type TxnParams = {
  topic: string;
};

// STYLES
const wrapper = {
  border: "1px solid tomato",
  display: "flex",
  flexFlow: "column no-wrap",
};

const Topic = () => {
  const { topic } = useParams<TxnParams>();
  console.log({ topic });
  const topicQuery = useQuery(topic || "default-topic-id", () =>
    fetchTxnsByTopic(topic)
  );
  const isLoading = topicQuery.isLoading;
  const txns = topicQuery.data?.transactions;

  return (
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx="wrapper">
          <Typography variant="h2">{topic}</Typography>
          {txns.map((txn) => (
            <TxCard key={txn.id} txn={txn} type="topic" />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Topic;
