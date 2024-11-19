import Layout from "@/components/common/Layout";
import {
  MessageReturn,
  // MessageType,
  processMessage,
} from "@/utils/processPost";
import { TxnProps } from "@/types";
import { useTransactionContext } from "@/context/TransactionContext";
// import DebugMessage from "@/components/debug/DebugMessage";
import {
  lookUpNFDAddress,
  fetchNFDAvatar,
  generateSVGImage,
} from "@/services/providers";
// import Post from "@/components/app/Post";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BREADCRUMBS = [
  { label: "Edaga", link: "#" },
  { label: "Profile", link: "#" },
];

const Profile = () => {
  const { transactions } = useTransactionContext();
  const { accountAddress } = useParams<{ accountAddress: string }>();

  // const [avatarSrcs, setAvatarSrcs] = useState<{ [key: string]: string }>({});
  const [, setAvatarSrcs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAvatarSrc = async (sender: string, id: string) => {
      const nfd = await lookUpNFDAddress(sender);
      let avatarURL = null;

      if (nfd) avatarURL = await fetchNFDAvatar(nfd);

      if (!avatarURL) {
        const svgImage = await generateSVGImage(sender);
        setAvatarSrcs((prev) => ({ ...prev, [id]: svgImage }));
      } else {
        setAvatarSrcs((prev) => ({ ...prev, [id]: avatarURL }));
      }
    };

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

  return (
    <Layout breadcrumbOptions={BREADCRUMBS}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 pb-12">
        <h1>{accountAddress}</h1>

        {/* {transactions && transactions.length >= 1 ? (
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
                avatarSrc={avatarSrcs[post.id] || ""}
              />
            );
          })
        ) : (
          <p className="text-muted-foreground pb-12">
            There are no conversations... yet.
          </p>
        )} */}
      </div>
    </Layout>
  );
};

export default Profile;
