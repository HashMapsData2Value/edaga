import Layout from "@/components/common/Layout";
import {
  MessageReturn,
  MessageType,
  processMessage,
} from "@/utils/processPost";
import { TxnProps } from "@/types";
import { useTransactionContext } from "@/context/TransactionContext";
import Post from "../app/Post";

const BREADCRUMBS = [
  { label: "Edaga", link: "#" },
  { label: "Conversations", link: "#" },
];

const All = () => {
  const { transactions } = useTransactionContext();

  return (
    <Layout breadcrumbOptions={BREADCRUMBS}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 pb-12">
        {transactions && transactions.length >= 1 ? (
          transactions.map((tx: TxnProps) => {
            const post = processMessage(tx) as MessageReturn;
            const parentTxn = transactions.find(
              (txn) => txn.id === post.parentId
            );
            const validPostTypes = new Set([
              MessageType.All,
              MessageType.Reply,
            ]).has(post.type);
            const isReply = "parentId" in post;

            if (!validPostTypes) return;

            const replies = transactions.filter((txn) => {
              const replyPost = processMessage(txn);
              return !("error" in replyPost) && replyPost.parentId === post.id;
            });

            return (
              <Post
                key={`${post.id}-${post.block}`}
                tx={tx}
                parentTxn={parentTxn}
                validPostTypes={validPostTypes}
                isReply={isReply}
                replies={replies}
              />
            );
          })
        ) : (
          <p className="text-muted-foreground pb-12">
            There are no conversations... yet.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default All;
