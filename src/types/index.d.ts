export interface TxnProps {
  "close-rewards": number;
  "closing-amount": number;
  "confirmed-round": number;
  fee: number;
  "first-valid": number;
  "genesis-hash": string;
  "genesis-id": string;
  id: string;
  "intra-round-offset": number;
  "last-valid": number;
  note: string;
  "payment-transaction": {
    amount: number;
    "close-amount": number;
    receiver: string;
  };
  "receiver-rewards": number;
  "round-time": number;
  sender: string;
  "sender-rewards": number;
  signature: {
    sig: string;
  };
  "tx-type": string;
}
