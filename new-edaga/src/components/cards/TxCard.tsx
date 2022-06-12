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
import { AllBody } from "../body";

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

const TxCard = ({ id, sender, fee, confirmedRound, body }) => {
  return (
    <Card sx={txCard}>
      <CardHeader title={renderHeader(sender)}></CardHeader>
      <CardContent sx={cardContent}>
        <AllBody noteB64={body} />
      </CardContent>
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
