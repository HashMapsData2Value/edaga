import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Link as MuiLink,
  Typography,
  SxProps,
} from "@mui/material";
import { getShortenedBase32 } from "../../utils";
import { AllBody, ReplyBody, TopicBody } from "../body";

const txCard: SxProps = { my: 3 };

const cardContent: SxProps = {
  minHeight: "150px",
  display: "flex",
  flexFlow: "column no-wrap",
  alignItems: "center",
};

const cardActions: SxProps = {
  justifyContent: "space-between",
};

const renderHeader = (sender) => {
  return (
    <Typography>
      {`By: `}
      <MuiLink
        href={`https://testnet.algoexplorer.io/address/${sender}`}
        target="_blank"
      >
        {getShortenedBase32(sender)}
      </MuiLink>
    </Typography>
  );
};

const renderBody = (txn, type: string) => {
  if (type === "all") {
    return <AllBody noteB64={txn.note} />;
  }
  if (type === "reply") {
    return <ReplyBody noteB64={txn.note} />;
  }
  if (type === "topic") {
    return <TopicBody noteB64={txn.note} />;
  }
};

const TxCard = ({ txn, type }) => {
  const { id, sender, fee, confirmedRound, note } = txn;
  console.log({ txn });
  return (
    <Card sx={txCard}>
      <CardHeader title={renderHeader(sender)}></CardHeader>
      <CardContent sx={cardContent}>{renderBody(txn, "all")}</CardContent>
      <CardActions sx={cardActions}>
        <Typography>Fee: {fee}</Typography>
        <Typography>
          Id:{" "}
          <MuiLink
            href={`https://testnet.algoexplorer.io/tx/${id}`}
            target="_blank"
          >
            {getShortenedBase32(id)}
          </MuiLink>
        </Typography>
        <Typography>
          <Link to={`/replies/${id}`}>See Replies</Link>
        </Typography>
        <Typography>
          Block:{" "}
          <MuiLink
            href={`https://testnet.algoexplorer.io/block/${confirmedRound}`}
            target="_blank"
          >
            {confirmedRound}
          </MuiLink>
        </Typography>
      </CardActions>
    </Card>
  );
};

export default TxCard;
