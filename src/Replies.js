import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Main, Heading, Page, PageContent, Text } from 'grommet';
import TxCard from './TxCard';
import { defineBody, defineRepliesBody, getShortenedBase32 } from './utils';


function Replies() {
  const { originalTxId } = useParams();

  const [originalTx, setOriginalTx] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    if(originalTxId === undefined){
      return;
    }
    getOriginalTx(originalTxId);
  }, [originalTxId])

  useEffect(() => {
    if(originalTxId === undefined){
      return;
    }
    getReplies(originalTxId);
  }, [originalTxId])

  const getOriginalTx = async (originalTxId) => {
    const originalTxUrl = `https://mainnet-idx.algonode.cloud/v2/transactions/${originalTxId}`
    const response = await fetch(originalTxUrl);
    const data = await response.json();
    setOriginalTx(data.transaction);
  }

  const getReplies = async (originalTxId) => {
    let repliesAll = [];

    const replyTypes = ['ARC00-0;r;', 'ARC00-0;l;', 'ARC00-0;d;'];
    for (let i = 0; i < replyTypes.length; i++) {
        const prefix = btoa(replyTypes[i] + originalTxId);
        const response = await fetch(`https://mainnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=${prefix}`);
        const data = await response.json();
        if(data.transactions.length > 0){
          repliesAll.push(data.transactions[0]);
          console.log(repliesAll);
        }
      }
    setReplies(repliesAll.sort((a, b) => {
      return a['confirmed-round'] < b['confirmed-round']
    }));
  }

  return (
    <div>
      <Main pad="large">
        <Heading><Text><a href={'https://algoexplorer.io/tx/' + originalTxId}>{originalTxId}</a></Text></Heading>
        {defineBody(originalTx['note'])}
        <Text>Fee: {originalTx['fee']}</Text>
        <Text>Block: <a href={'https://algoexplorer.io/block/' + originalTx['confirmed-round']}>{originalTx['confirmed-round']}</a></Text>
        <Text>Sender: <a href={'https://algoexplorer.io/address/' + originalTx['sender']}>{getShortenedBase32(originalTx['sender'])}</a></Text>
      </Main>

      <Page kind="narrow">
        {replies.map((tx) => (
          <PageContent>
            <TxCard
              id={tx['id']}
              sender={tx['sender']}
              fee={tx['fee']}
              confirmedRound={tx['confirmed-round']}
              body={defineRepliesBody(tx['note'])}
            />
          </PageContent>
        ))}
      </Page>
    </div>
  )
}

export default Replies;