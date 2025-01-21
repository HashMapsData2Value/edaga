import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/common/Layout";
import { MessageReturn, processMessage } from "@/utils/processPost";
import { TxnProps } from "@/types";
import { useApplicationState } from "@/store";
import { useTransactionContext } from "@/context/TransactionContext";
import Post from "@/components/app/Post";
import { lookUpNFDAddress, fetchNFDAvatar, generateSVGImage } from "@/services/providers"; // Import necessary functions

function Replies() {
  const navigate = useNavigate();
  const { broadcastChannel } = useApplicationState();
  const { originalTxId } = useParams<{ originalTxId: string }>();

  const { originalTx, replies, loadOriginalTransaction, loadReplies, transactions } =
    useTransactionContext();

  const [avatarSrcs, setAvatarSrcs] = useState<{ [key: string]: string }>({});

  const fetchAvatarSrc = async (sender: string, id: string) => {
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
  };
  
  useEffect(() => {
    if (transactions && transactions.length >= 1) {
      transactions.forEach((tx: TxnProps) => {
        const post = processMessage(tx) as MessageReturn;
        if ("error" in post) {
          console.warn("Error processing message:", post.error);
          return;
        }
        const { sender, id } = post;
        fetchAvatarSrc(sender, id);
      });
    }
  }, [transactions]);

  useEffect(() => {
    if (originalTxId) {
      loadOriginalTransaction(originalTxId);
      loadReplies(originalTxId);
    }
  }, [originalTxId, loadOriginalTransaction, loadReplies, replies.length]);

  useEffect(() => {
    if (originalTx) {
      const post = processMessage(originalTx) as MessageReturn;
      if (!("error" in post)) {
        const { sender, id } = post;
        fetchAvatarSrc(sender, id);
      }
    }
  }, [originalTx]);

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
            avatarSrc={avatarSrcs[originalTx.id] || ""}
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

              return (
                <Post
                  key={tx.id}
                  tx={tx}
                  parentTxn={parentTxn}
                  validPostTypes={true}
                  isReplyInline={true}
                  isReply={true}
                  avatarSrc={avatarSrcs[post.id] || ""}
                />
              );
            })}
        </div>
      </Layout>
    </>
  );
}

export default Replies;