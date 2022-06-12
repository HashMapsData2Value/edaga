import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getShortenedBase32 } from "../../utils";

const MessageBody = ({}) => {
  <div></div>;
  // return <div>
  //   if (noteB64 === null || noteB64 === '' || noteB64 === undefined) {
  //   return
  // }

  // const noteTxt = atob(noteB64);
  // const category = noteTxt.slice(8, 9);

  // if (category === 'd') {
  //   const targetTxId = noteTxt.slice(10, 62);
  //   return <Typography>&#128077; {'   -->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Typography>
  // }

  // if (category === 'l') {
  //   const targetTxId = noteTxt.slice(10, 62);
  //   return <Typography>&#128078; {'   -->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Typography>
  // }

  // if (category === 't' || category === 'a' || category === 'r') {

  //   const parts = noteTxt.split(';');
  //   if (parts.length !== 5) {
  //     return <Typography>Malformed transaction.</Typography>
  //   }
  //   const handle = parts[3];
  //   const msg = parts[4];

  //   if (category === 'a') {
  //     return (
  //       <div>
  //         <Typography>{handle} posted the following:</Typography>
  //         <br></br>
  //         <Typography>{msg}</Typography>
  //       </div>
  //     );
  //   }

  //   if (category === 'r') {
  //     const replyToTxId = parts[2];
  //     return (
  //       <div>
  //         <Typography>{handle} replied to <Link to={`/replies/${replyToTxId}`}>{getShortenedBase32(replyToTxId)}</Link>:</Typography>
  //         <br></br>
  //         <Typography>{msg}</Typography>
  //       </div>
  //     );
  //   }

  //   if (category === 't') {
  //     const topic = parts[2];
  //     return (
  //       <div>
  //         <Typography>{handle} posted in topic <Link to={`/topic/${topic}`}>{topic}</Link>:</Typography>
  //         <br></br>
  //         <Typography>{msg}</Typography>
  //       </div>
  //     );
  //   }

  // }

  // return <Typography>Malformed transaction.</Typography>
  // </div>;
};

export default MessageBody;
