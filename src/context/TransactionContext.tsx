import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { TxnProps, Txn } from "@/types";
import { getTxns } from "@/utils";
import { useApplicationState } from "@/store";

interface TransactionContextType {
  transactions: TxnProps[];
  replies: TxnProps[];
  loadTransactions: () => void;
  loadReplies: (originalTxId: string) => void;
  loadOriginalTransaction: (originalTxId: string) => Promise<void>;
  originalTx: TxnProps | undefined;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { broadcastChannel } = useApplicationState();
  const [transactions, setTransactions] = useState<TxnProps[]>([]);
  const [replies, setReplies] = useState<TxnProps[]>([]);
  const [originalTx, setOriginalTx] = useState<TxnProps>();

  const loadTransactions = useCallback(() => {
    if (!broadcastChannel.address) return;
    getTxns(broadcastChannel.address).then((transactions) => {
      setTransactions(transactions);
    });
  }, [broadcastChannel]);

  const loadReplies = useCallback(
    async (originalTxId: string) => {
      const repliesAll: TxnProps[] = [];
      const replyTypes = ["ARC00-0;r;", "ARC00-0;l;", "ARC00-0;d;"];

      for (let i = 0; i < replyTypes.length; i++) {
        const prefix = btoa(replyTypes[i] + originalTxId);
        const response = await fetch(
          `https://testnet-idx.algonode.cloud/v2/accounts/${broadcastChannel.address}/transactions?tx-type=pay&note-prefix=${prefix}`
        );
        const data = await response.json();
        if (data.transactions.length >= 1) {
          repliesAll.push(...data.transactions);
        }
      }

      setReplies(
        repliesAll.sort((a, b) => a["confirmed-round"] - b["confirmed-round"])
      );
    },
    [broadcastChannel.address]
  );

  const loadOriginalTransaction = useCallback(async (originalTxId: string) => {
    const originalTxUrl = `https://testnet-idx.algonode.cloud/v2/transactions/${originalTxId}`;
    const response = await fetch(originalTxUrl);
    const data: Txn = await response.json();
    setOriginalTx(data.transaction);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loadTransactions,
        replies,
        loadReplies,
        loadOriginalTransaction,
        originalTx,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
};
