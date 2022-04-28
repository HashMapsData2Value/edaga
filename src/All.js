import React, { useEffect, useState } from 'react';
import { Text, Page, PageContent } from 'grommet';
import { Link } from 'react-router-dom';
import TxCard from './TxCard';
import getShortenedBase32 from './utils';


function All() {

  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    getTxs();
  }, [])

  const getTxs = async () => {
    const url = `https://mainnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=QVJDMDAtMA==`
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


function defineAllBody(noteB64) {
  if (noteB64 === null || noteB64 === '') {
    return (
      <div></div>
    )
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === 'd') {
    const targetTxId = noteTxt.slice(10, 62);
    return <Text>+1 {'-->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Text>
  }

  if (category === 'l') {
    const targetTxId = noteTxt.slice(10, 62);
    return <Text>-1 {'-->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Text>
  }

  if (category === 't' || category === 'a' || category === 'r') {

    const parts = noteTxt.split(';');
    if (parts.length !== 5) {
      console.log(noteTxt);
      return <Text>Malformed transaction.</Text>
    }
    const handle = parts[3];
    const msg = parts[4];

    if (category === 'a') {
      return (
        <div>
          <Text>{handle} posted the following:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

    if (category === 'r') {
      const replyToTxId = parts[2];
      return (
        <div>
          <Text>{handle} replied to <Link to={`/replies/${replyToTxId}`}>{getShortenedBase32(replyToTxId)}</Link>:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

    if (category === 't') {
      const topic = parts[2];
      return (
        <div>
          <Text>{handle} posted in topic <Link to={`/topic/${topic}`}>{topic}</Link>:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

  }


  console.log(noteTxt);
  return <Text>Malformed transaction.</Text>
}

export default All;
