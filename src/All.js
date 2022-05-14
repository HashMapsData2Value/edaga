import React, { useEffect, useState } from 'react';
import { Page, PageContent } from 'grommet';
import TxCard from './TxCard';
import { defineAllBody } from './utils';


function All() {

  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    getTxs();
  }, [])

  const getTxs = async () => {
    const url = `https://testnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=QVJDMDAtMA==`
    const response = await fetch(url);
    const data = await response.json();
    setTransactions(data.transactions);
  }

  return (
    <div>
      <Page kind="narrow">
        {transactions.map((tx) => (
          <PageContent>
            <TxCard
              id={tx['id']}
              sender={tx['sender']}
              fee={tx['fee']}
              confirmedRound={tx['confirmed-round']}
              body={defineAllBody(tx['note'])}
            />
          </PageContent>
        ))}
      </Page>
    </div>
  )

}


export default All;
