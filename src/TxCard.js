import React from 'react';
import { Box, Card, CardHeader, CardBody, CardFooter, Text } from 'grommet';
import { Link } from 'react-router-dom';
import { getShortenedBase32 } from './utils';


const TxCard = ({ id, sender, fee, confirmedRound, body }) => {
  return (
    <Card height="small" width="large" padding="1" background="light-1">
      <CardHeader pad="small">By: <a href={'https://algoexplorer.io/address/' + sender}>{getShortenedBase32(sender)}</a></CardHeader>
      <CardBody pad="medium"><Box>{body}</Box></CardBody>
      <CardFooter pad={{ horizontal: "small" }} background="light-2">
        <Text>Fee: {fee}</Text>
        <Text>Id: <a href={'https://algoexplorer.io/tx/' + id}>{getShortenedBase32(id)}</a></Text>
        <Text><Link to={`/replies/${id}`}>See Replies</Link></Text>
        <Text>Block: <a href={'https://algoexplorer.io/block/' + confirmedRound}>{confirmedRound}</a></Text>
      </CardFooter>
    </Card>
  )
}

export default TxCard;
