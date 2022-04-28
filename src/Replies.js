import React from 'react';
import { useParams } from "react-router-dom";
import { Text } from 'grommet';

function Replies() {
  let { txId } = useParams();
  console.log(txId);

  useEffect(() => {
    getDownvotes();
  }, [])

  const getDownvotes = async () => {
    const prefix = btoa(`ARC00-0;d;${txId}`);
    const url = `https://mainnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=${prefix}`
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
  }

  return (
  <div>
    <Text>Replies {txId}</Text>
  </div>
  )
}

export default Replies;