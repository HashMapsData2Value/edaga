import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Main, Page, PageContent, Text } from 'grommet';

import TxCard from './TxCard';
import { defineTopicBody } from './utils';

function Topic() {
  const { topic } = useParams();

  const [topicTxs, setTopicTxs] = useState([]);

  useEffect(() => {
    getTopicTxs(topic);
  }, [topic])

  const getTopicTxs = async (topic) => {
    const topicTxsUrl = `https://testnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=${btoa('ARC00-0;t;' + topic)}`
    const response = await fetch(topicTxsUrl);
    const data = await response.json();
    setTopicTxs(data.transactions);
  }

  return (
  <div>
    <Main pad="large">
      <Text>Viewing Topic: {topic}</Text>
    </Main>

    <Page kind="narrow">
        {topicTxs.map((tx) => (
          <PageContent>
            <TxCard
              id={tx['id']}
              sender={tx['sender']}
              fee={tx['fee']}
              confirmedRound={tx['confirmed-round']}
              body={defineTopicBody(tx['note'])}
            />
          </PageContent>
        ))}
      </Page>

  </div>
  )
}

export default Topic;