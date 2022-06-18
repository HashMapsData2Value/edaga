import { FC } from "react";
import { Box, Typography } from "@mui/material";

// TYPES
type Props = { noteB64: string };

const ReplyBody: FC<Props> = ({ noteB64 }) => {
  if (noteB64 === null || noteB64 === "" || noteB64 === undefined) {
    return;
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === "d") {
    return <Typography>&#128077;</Typography>;
  }

  if (category === "l") {
    return <Typography>&#128078;</Typography>;
  }

  if (category === "r") {
    const parts = noteTxt.split(";");
    if (parts.length !== 5) {
      return <Typography>Malformed transaction.</Typography>;
    }
    const handle = parts[3];
    const msg = parts[4];
    return (
      <Box>
        <Typography>{handle} replied</Typography>
        <br></br>
        <Typography>{msg}</Typography>
      </Box>
    );
  }

  return <Typography>Malformed transaction.</Typography>;
};

export default ReplyBody;
