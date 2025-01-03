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
import { MessageType, processMessage } from "@/utils/processPost";
import { getDefaultNetwork } from "@/config/network.config";
import {
  lookUpNFDAddress,
  fetchNFDAvatar,
  generateSVGImage,
} from "@/services/providers";

interface TransactionContextType {
  transactions: TxnProps[];
  replies: TxnProps[];
  loadTransactions: () => void;
  loadTopicTransactions: () => void;
  loadReplies: (originalTxId: string) => void;
  loadOriginalTransaction: (originalTxId: string) => Promise<void>;
  originalTx: TxnProps | undefined;
  // TODO: avatar support
  fetchAvatarSrc: (sender: string, id: string) => Promise<void>;
  avatarSrcs: { [key: string]: string };
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
  const [avatarSrcs, setAvatarSrcs] = useState<{ [key: string]: string }>({});

  const defaultNetwork = getDefaultNetwork();

  const fetchAvatarSrc = useCallback(
    async (sender: string, id: string) => {
      if (avatarSrcs[id]) return; // Avoid redundant fetches

      const nfd = await lookUpNFDAddress(sender);
      let avatarURL = null;

      if (nfd) {
        avatarURL = await fetchNFDAvatar(nfd);
      }

      if (!avatarURL) {
        const svgImage = await generateSVGImage(sender);
        setAvatarSrcs((prev) => ({ ...prev, [id]: svgImage }));
      } else {
        setAvatarSrcs((prev) => ({ ...prev, [id]: avatarURL }));
      }
    },
    [avatarSrcs]
  );

  const loadTransactions = useCallback(() => {
    if (!broadcastChannel.address) return;
    getTxns(broadcastChannel.address).then((transactions) => {
      setTransactions(transactions);
    });
  }, [broadcastChannel]);

  const loadTopicTransactions = useCallback(() => {
    if (!broadcastChannel.address) return;
    getTxns(broadcastChannel.address).then((transactions) => {
      const topicTransactions = transactions.filter((txn: TxnProps) => {
        const post = processMessage(txn);
        return "type" in post && post.type === MessageType.Topic;
      });
      setTransactions(topicTransactions);
    });
  }, [broadcastChannel]);

  const loadReplies = useCallback(
    async (originalTxId: string) => {
      const repliesAll: TxnProps[] = [];
      const replyTypes = ["ARC00-0;r;", "ARC00-0;l;", "ARC00-0;d;"];

      for (let i = 0; i < replyTypes.length; i++) {
        const prefix = btoa(replyTypes[i] + originalTxId);
        const response = await fetch(
          `${defaultNetwork?.endpoints?.[0].indexer}/v2/accounts/${broadcastChannel.address}/transactions?tx-type=pay&note-prefix=${prefix}`
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
    [broadcastChannel.address, defaultNetwork?.endpoints]
  );

  const loadOriginalTransaction = useCallback(async (originalTxId: string) => {
    const originalTxUrl = `${defaultNetwork?.endpoints?.[0].indexer}/v2/transactions/${originalTxId}`;
    const response = await fetch(originalTxUrl);
    const data: Txn = await response.json();
    setOriginalTx(data.transaction);
  }, [defaultNetwork?.endpoints]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loadTransactions,
        loadTopicTransactions,
        replies,
        loadReplies,
        loadOriginalTransaction,
        originalTx,
        avatarSrcs,
        fetchAvatarSrc,
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
