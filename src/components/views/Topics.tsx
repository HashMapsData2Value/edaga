import Layout from "@/components/common/Layout";
import {
  MessageReturn,
  MessageType,
  processMessage,
} from "@/utils/processPost";
import { TxnProps } from "@/types";
import { useTransactionContext } from "@/context/TransactionContext";
import { useEffect } from "react";
import Post from "../app/Post";

const BREADCRUMBS = [
  { label: "Edaga", link: "/" },
  { label: "Topics", link: `/topics/` },
];

const Topics = () => {
  const { transactions, loadTopicTransactions } = useTransactionContext();

  useEffect(() => loadTopicTransactions(), [loadTopicTransactions]);

  return (
    <Layout breadcrumbOptions={BREADCRUMBS}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        {transactions && transactions.length > 0 ? (
          transactions.map((tx: TxnProps) => {
            const post = processMessage(tx) as MessageReturn;
            const parentTxn = transactions.find(
              (txn) => txn.id === post.parentId
            );

            if (!post.message || !("raw" in post.message)) {
              console.warn("Invalid message format", post);
              return null;
            }

            const validPostTypes = new Set([MessageType.Topic]).has(post.type);

            const isReply = "parentId" in post ? true : false;

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
          <>
            <p className="text-muted-foreground pb-12">
              There are no topics... yet.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Topics;
