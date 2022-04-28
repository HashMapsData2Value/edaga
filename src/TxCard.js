import React from 'react';
import { Box, ResponsiveContext, Card, CardHeader, CardBody, CardFooter, Text, Paragraph } from 'grommet';


const TxCard = ({ id, sender, fee, confirmedRound, noteB64 }) => {
  const size = React.useContext(ResponsiveContext);
  if (noteB64 == null || noteB64 == null) {
    return (
      <div></div>
    )
  }
  const noteTxt = atob(noteB64)

  return (
    <Card height="small" width="large" background="light-1">
      <CardHeader pad="small">By:  {sender.slice(0, 7) + '...' + sender.slice(-3)}</CardHeader>
      <CardBody pad="medium"><Box>{noteTxt}</Box></CardBody>
      <CardFooter pad={{ horizontal: "small" }} background="light-2">
        <Text>Fee: {fee}</Text>
        <Text>Id: {id.slice(0, 7) + '...' + id.slice(-3)}</Text>
        <Text>Block: {confirmedRound}</Text>
      </CardFooter>
    </Card>
  )
}

export default TxCard;

