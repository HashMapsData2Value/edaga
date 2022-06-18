import React from "react";
import { Box, CircularProgress } from "@mui/material";
import TxCard from "../components/cards/TxCard";
import { fetchAllTxns } from "./api";
import { useQuery } from "react-query";

const Main = () => {
  const allTxnsQuery = useQuery("all_txns", fetchAllTxns);
  console.log({ allTxnsQuery });

  return (
    <>
      {allTxnsQuery.isFetching ? (
        <CircularProgress />
      ) : (
        <Box>
          {allTxnsQuery.data.transactions.map((txn) => {
            return (
              <Box>
                <TxCard key={txn.id} txn={txn} type="all" />
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default Main;
