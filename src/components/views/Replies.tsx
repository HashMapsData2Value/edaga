import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/common/Layout";
import { MessageReturn, processMessage } from "@/utils/processPost";
import { TxnProps } from "@/types";
import { useApplicationState } from "@/store";
import { useTransactionContext } from "@/context/TransactionContext";
import Post from "@/components/app/Post";

function Replies() {
  const navigate = useNavigate();
  const { broadcastChannel } = useApplicationState();
  const { originalTxId } = useParams<{ originalTxId: string }>();

  const { originalTx, replies, loadOriginalTransaction, loadReplies } =
    useTransactionContext();

  useEffect(() => {
    if (originalTxId) {
      loadOriginalTransaction(originalTxId);
      loadReplies(originalTxId);
    }
  }, [originalTxId, loadOriginalTransaction, loadReplies, replies.length]);

  const initialBroadcastChannel = useRef(broadcastChannel);
  useEffect(() => {
    if (broadcastChannel !== initialBroadcastChannel.current) navigate("/");
  }, [broadcastChannel, navigate]);
  if (!originalTx) return null;

  const parentTxn = originalTx;

  const BREADCRUMBS = [
    { label: "Edaga", link: "/" },
    { label: "Home", link: `/` },
    { label: "Replies", link: `/replies/${originalTxId}` },
  ];

  return (
    <>
      <Layout breadcrumbOptions={BREADCRUMBS}>
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 pb-12">
          <Post
            tx={originalTx}
            parentTxn={parentTxn}
            validPostTypes={true}
            replies={replies}
          />

          {replies &&
            replies.length > 0 &&
            replies.map((tx: TxnProps) => {
              const post = processMessage(tx) as MessageReturn;

              if (!post || !post.message || !("raw" in post.message)) {
                console.log(
                  "Reply post is undefined or missing 'message.raw':",
                  post
                );
                return null;
              }

              // TODO - Render link to nested replies
              // const nestedReplies = replies.filter((txn) => {
              //   const replyPost = processMessage(txn);
              //   return (
              //     !("error" in replyPost) && replyPost.parentId === post.id
              //   );
              // });

              return (
                <Post
                  key={tx.id}
                  tx={tx}
                  parentTxn={parentTxn}
                  validPostTypes={true}
                  isReplyInline={true}
                  isReply={true}
                  // replies={nestedReplies}
                />
              );
            })}
        </div>
      </Layout>
    </>
  );
}

export default Replies;
