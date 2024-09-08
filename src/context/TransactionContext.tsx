import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { TxnProps } from "@/types";
import { getTxns } from "@/utils";
import { useApplicationState } from "@/store";

interface TransactionContextType {
  transactions: TxnProps[];
  loadTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { broadcastChannel } = useApplicationState();
  const [transactions, setTransactions] = useState<TxnProps[]>([]);

  const loadTransactions = useCallback(() => {
    if (!broadcastChannel.address) return;
    getTxns(broadcastChannel.address).then((transactions) => {
      setTransactions(transactions);
    });
  }, [broadcastChannel]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <TransactionContext.Provider value={{ transactions, loadTransactions }}>
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
