import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getShortenedBase32 } from "../../utils";

type Props = { noteB64: string };

const AllBody: FC<Props> = ({ noteB64 }) => {
  if (noteB64 === null || noteB64 === "" || noteB64 === undefined) {
    return;
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === "d") {
    const targetTxId = noteTxt.slice(10, 62);
    return (
      <Typography>
        &#128077; {"   -->"}{" "}
        <Link to={`/replies/${targetTxId}`}>
          {getShortenedBase32(targetTxId)}
        </Link>
      </Typography>
    );
  }

  if (category === "l") {
    const targetTxId = noteTxt.slice(10, 62);
    return (
      <Typography>
        &#128078; {"   -->"}{" "}
        <Link to={`/replies/${targetTxId}`}>
          {getShortenedBase32(targetTxId)}
        </Link>
      </Typography>
    );
  }

  if (category === "t" || category === "a" || category === "r") {
    const parts = noteTxt.split(";");
    if (parts.length !== 5) {
      return <Typography>Malformed transaction.</Typography>;
    }
    const handle = parts[3];
    const msg = parts[4];

    if (category === "a") {
      return (
        <Box>
          <Typography>{handle} posted the following:</Typography>
          <br></br>
          <Typography>{msg}</Typography>
        </Box>
      );
    }

    if (category === "r") {
      const replyToTxId = parts[2];
      return (
        <Box>
          <Typography>
            {handle} replied to{" "}
            <Link to={`/replies/${replyToTxId}`}>
              {getShortenedBase32(replyToTxId)}
            </Link>
            :
          </Typography>
          <br></br>
          <Typography>{msg}</Typography>
        </Box>
      );
    }

    if (category === "t") {
      const topic = parts[2];
      return (
        <Box>
          <Typography>
            {handle} posted in topic <Link to={`/topic/${topic}`}>{topic}</Link>
            :
          </Typography>
          <br></br>
          <Typography>{msg}</Typography>
        </Box>
      );
    }
  }

  return <Typography>Malformed transaction.</Typography>;
};

export default AllBody;
