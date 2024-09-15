import { useEffect, useState } from "react";
import { format } from "date-fns";

import { getTxns, microalgosToAlgos } from "@/utils";
import Layout from "@/components/common/Layout";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageReturn,
  MessageType,
  processMessage,
} from "@/utils/processPost";
import { TxnProps } from "@/types";
import { shortenedAccountBase32 } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircleMore as IconMessageCircleMore,
  MoreHorizontal as IconMoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useApplicationState } from "@/store";
import { censorProfanity } from "@/utils/moderation";

const BREADCRUMBS = [
  { label: "Edaga", link: "/" },
  { label: "Topics", link: `/topics/` },
];

function Topics() {
  console.log("2. Topics.tsx");
  const { broadcastChannel, moderation } = useApplicationState();

  const [transactions, setTransactions] = useState<TxnProps[]>([]);

  useEffect(() => {
    getTxns(broadcastChannel.address).then((transactions) => {
      const filteredTransactions = transactions.filter((txn: TxnProps) => {
        const post = processMessage(txn);
        if ("type" in post)
          return (
            post.type === MessageType.Topic ||
            MessageType.Reply ||
            MessageType.Like ||
            MessageType.Dislike
          );
        return false;
      });
      setTransactions(filteredTransactions);
    });
  }, [broadcastChannel]);

  return (
    <Layout breadcrumbOptions={BREADCRUMBS}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        {transactions && transactions.length >= 1 ? (
          transactions.map((tx: TxnProps) => {
            const post = processMessage(tx) as MessageReturn;

            const {
              sender,
              id,
              block,
              nickname,
              message,
              timestamp,
              fee,
              topic,
            } = post;

            const formatMessage = moderation
              ? censorProfanity(message.raw)
              : message.raw;

            const formatTopicName = moderation
              ? censorProfanity(topic!)
              : topic;

            if (post.type === MessageType.Topic) {
              const isReply = "parentId" in post ? true : false;

              const replies = transactions.filter((txn) => {
                const replyPost = processMessage(txn);
                return !("error" in replyPost) && replyPost.parentId === id;
              });

              return (
                <div key={id} className="pb-12">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div>
                          {moderation ? censorProfanity(nickname) : nickname}
                          &nbsp;&nbsp;
                          <small
                            className="text-s font-light text-muted-foreground"
                            title={sender}
                          >
                            {moderation
                              ? censorProfanity(shortenedAccountBase32(sender))
                              : shortenedAccountBase32(sender)}
                          </small>
                        </div>
                        <Badge className="ml-auto">{formatTopicName}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pb-10">
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <h4 className="scroll-m-20 text-xl font-regular tracking-tight">
                            {formatMessage}
                          </h4>
                          {isReply && (
                            <Link to={`replies/${post.parentId}`}>
                              <blockquote className="mt-6 pl-6 border-l-2 text-muted-foreground">
                                <CardDescription>
                                  <small>Replying to:</small>
                                </CardDescription>

                                {censorProfanity(
                                  (
                                    processMessage(
                                      transactions.find(
                                        (txn) => txn.id === post.parentId
                                      ) || ({} as TxnProps)
                                    ) as MessageReturn
                                  ).message.raw
                                )}
                              </blockquote>
                            </Link>
                          )}
                        </div>
                      </div>
                      {/* <div
                      className="grid gap-3 mt-6"
                      style={{
                        width: 500,
                        overflow: "hidden",
                        overflowX: "scroll",
                        border: "1px dotted red",
                      }}
                    >
                      <pre className="text-xs">
                        {JSON.stringify(post, null, 2)}
                      </pre>
                    </div> */}
                    </CardContent>
                    <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
                      <div className="text-xs text-muted-foreground">
                        <time dateTime="2023-11-23">
                          {format(
                            new Date(timestamp * 1000),
                            " hh:mm:ss - do MMMM yyyy"
                          )}
                        </time>
                      </div>

                      <div className="flex items-center gap-4">
                        {replies.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <Button
                              aria-haspopup="true"
                              size="sm"
                              variant="ghost"
                              className="h-6"
                            >
                              <Link
                                className="flex items-center gap-1 text-xs text-muted-foreground"
                                to={`/replies/${id}`}
                              >
                                {`${replies.length} ${
                                  replies.length > 1 ? "Replies" : "Reply"
                                }`}
                                <IconMessageCircleMore className="h-4 w-4 ml-1.5 text-muted-foreground" />
                              </Link>
                            </Button>
                          </div>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                            >
                              <IconMoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link
                                to={`https://testnet.explorer.perawallet.app/tx/${id}/`}
                                target="_blank"
                                title="View transaction on Pera Explorer"
                              >
                                View Message ID
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                to={`https://testnet.explorer.perawallet.app/block/${block}/`}
                                target="_blank"
                                title="View block on Pera Explorer"
                              >
                                View Block
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-s text-muted-foreground"
                              title={`${microalgosToAlgos(
                                fee
                              )} was paid to post this message`}
                            >
                              {`${microalgosToAlgos(fee)}`}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              );
            }
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
}

export default Topics;
