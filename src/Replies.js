import React from 'react';
import { useParams } from "react-router-dom";
import { Text } from 'grommet';

function Replies() {
  let { txId } = useParams();
  console.log(txId);

  return (
  <div>
    <Text>Replies {txId}</Text>
  </div>
  )
}

export default Replies;