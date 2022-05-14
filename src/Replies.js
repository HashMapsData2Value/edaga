import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { Box, Main, Heading, Paragraph, Page, PageContent, Text } from 'grommet';
import TxCard from './TxCard';
import { defineBody } from './utils';


function Replies() {
  let { txId } = useParams();

  const [originalTx, setOriginalTx] = useState([]);
  const [replies, setReplies] = useState([]);

  const getOriginalTx = async () => {
    const originalTxUrl = `https://mainnet-idx.algonode.cloud/v2/transactions/${txId}`
    const response = await fetch(originalTxUrl);
    const data = await response.json();
    setOriginalTx(data.transaction);
  }


  const getReplies = async () => {
    const repliesUrl = `https://mainnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=QVJDMDAtMA==`
    const response = await fetch(repliesUrl);
    const data = await response.json();
    setReplies(data.transactions);
  }

  getOriginalTx();
  //getReplies();
  return (
    <div>
      <Main pad="large">
        <Heading><Text><a href={'https://algoexplorer.io/tx/' + txId}>{txId}</a></Text></Heading>
        <Paragraph>{defineBody(originalTx['note'])}</Paragraph>

        <Text>Fee: {originalTx['fee']}</Text>
        <Text>Block: <a href={'https://algoexplorer.io/block/' + originalTx['confirmed-round']}>{originalTx['confirmed-round']}</a></Text>
      </Main>

      {/* <Page kind="narrow">
        {replies.map((tx) => (
          <PageContent>
            <TxCard
              id={tx['id']}
              sender={tx['sender']}
              fee={tx['fee']}
              confirmedRound={tx['confirmed-round']}
              body={defineBody(tx['note'])}
            />
          </PageContent>
        ))}
      </Page> */}
    </div>
  )
}

export default Replies;