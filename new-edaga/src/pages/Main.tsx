import React from "react";
import { Box } from "@mui/material";
import { data } from "../sampleData";
import TxCard from "../components/cards/TxCard";

const Main = () => {
  return (
    <Box>
      {data.transactions.map((tx) => {
        return (
          <Box>
            <TxCard
              id={tx["id"]}
              sender={tx["sender"]}
              fee={tx["fee"]}
              confirmedRound={tx["confirmed-round"]}
              body={tx["note"]}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default Main;
