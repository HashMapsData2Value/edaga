import React, { useEffect, useState } from 'react';
import TxCard from './TxCard';
import { Grommet, Page, PageContent } from 'grommet';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getTxs();
  }, [query])

  const getTxs = async () => {
    const url = `https://mainnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=e0FSQzg2LXYwOw==`
    const response = await fetch(url);
    const data = await response.json();
    setTransactions(data.transactions);
  }

  const updateSearch = e => {
    setSearch(e.target.value);
  }

  const getSearchQuery = e => {
    e.preventDefault();
    setQuery(search);
  }

  return (
    <Grommet theme={theme}>
      <div>
        <form onSubmit={getSearchQuery} className="search-form">
          <input className="search-bar" type="text" value={search} onChange={updateSearch} />
          <button className="search-button">
            Search
          </button>
        </form>
      </div>
      <Page kind="narrow">
        <PageContent>
          {transactions.map((tx) => (
            <TxCard
              id={tx['id']}
              sender={tx['sender']}
              fee={tx['fee']}
              confirmedRound={tx['confirmed-round']}
              noteB64={tx['note']}
            />
          ))}

        </PageContent>
      </Page>

    </Grommet>
  );
}

export default App;
