// import { Fragment, useEffect, useState } from "react";
import { Fragment } from "react";
import { format } from "date-fns";
// import { getTxns, microalgosToAlgos } from "@/utils";
import { microalgosToAlgos } from "@/utils";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  // MessageCircleMore as IconMessageCircleMore,
  MessageCircle as IconMessageCircle,
  MoreHorizontal as IconMoreHorizontal,
  Reply as IconReply,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApplicationState } from "@/store";
import { censorProfanity } from "@/utils/moderation";
import { useTransactionContext } from "@/context/TransactionContext";
// import DebugMessage from "@/components/debug/DebugMessage";

const BREADCRUMBS = [
  { label: "Edaga", link: "#" },
  { label: "Conversations", link: "#" },
];

function All() {
  // const { broadcastChannel, moderation } = useApplicationState();
  const { moderation } = useApplicationState();

  const { transactions } = useTransactionContext();

  return (
    <Layout breadcrumbOptions={BREADCRUMBS}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 pb-12">
        {transactions && transactions.length >= 1 ? (
          transactions.map((tx: TxnProps) => {
            const post = processMessage(tx) as MessageReturn;

            if ("error" in post) {
              console.error("Error processing message:", post.error);
              return null;
            }

            const { sender, id, block, nickname, message, timestamp, fee } =
              post;

            if (!("raw" in message)) return;

            const formatMessage = moderation
              ? censorProfanity(message.raw)
              : message.raw;

            if (
              post.type === MessageType.All ||
              post.type === MessageType.Reply
            ) {
              const isReply = "parentId" in post;

              const parentTxn = transactions.find(
                (txn) => txn.id === post.parentId
              );
              if (parentTxn) {
                const parentPost = processMessage(parentTxn);
                if (
                  "type" in parentPost &&
                  parentPost.type === MessageType.Topic
                )
                  return null;
              }

              const replies = transactions.filter((txn) => {
                const replyPost = processMessage(txn);
                return !("error" in replyPost) && replyPost.parentId === id;
              });

              return (
                <Fragment key={id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
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
                                {(() => {
                                  const parentTxn = transactions.find(
                                    (txn) => txn.id === post.parentId
                                  );
                                  if (!parentTxn) return "";

                                  const parentPost = processMessage(parentTxn);
                                  if (
                                    !parentPost ||
                                    "error" in parentPost ||
                                    !("raw" in parentPost.message)
                                  )
                                    return "";

                                  const rawMessage = parentPost.message.raw;

                                  return moderation
                                    ? censorProfanity(rawMessage)
                                    : rawMessage;
                                })()}
                              </blockquote>
                            </Link>
                          )}
                        </div>
                      </div>
                      {/* <DebugMessage post={post} /> */}
                    </CardContent>
                    <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-1 md:px-6 md:py-3">
                      <div className="text-xs text-muted-foreground">
                        <time dateTime="2023-11-23">
                          {format(
                            new Date(timestamp * 1000),
                            " hh:mm:ss - do MMMM yyyy"
                          )}
                        </time>
                      </div>

                      <div
                        // className="flex items-center gap-4"
                        className="flex items-center gap-2 max-sm:gap-1"
                        // style={{ border: "1px solid red" }}
                      >
                        {replies.length > 0 && (
                          <div
                            className="text-xs text-muted-foreground"
                            // style={{ border: "1px solid red" }}
                          >
                            <Button
                              aria-haspopup="true"
                              size="sm"
                              variant="ghost"
                              className="h-8 max-sm:p-0 max-sm:pl-1 max-sm:pr-2"
                              // style={{ border: "1px solid red" }}
                            >
                              <Link
                                className="flex items-center text-xs text-muted-foreground"
                                // style={{ border: "1px solid red" }}
                                to={`replies/${id}`}
                              >
                                {replies.length}&nbsp;
                                <span className="max-sm:hidden">
                                  {replies.length > 1 ? "Replies" : "Reply"}
                                </span>
                                <IconMessageCircle className="h-5 w-5 ml-1 text-muted-foreground" />
                              </Link>
                            </Button>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          <Button
                            aria-haspopup="true"
                            size="sm"
                            variant="ghost"
                            // className="h-8 max-sm:p-0 max-sm:pl-1 max-sm:pr-2"
                            className="h-8 max-sm:p-0 max-sm:pl-1 max-sm:pr-2"
                            // style={{ border: "1px solid red" }}
                          >
                            <Link
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                              to={`replies/${id}`}
                            >
                              <span className="max-sm:hidden">Reply</span>
                              <IconReply className="h-5 w-5 ml-1 text-muted-foreground" />
                            </Link>
                          </Button>
                        </div>

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
                            <DropdownMenuSeparator />
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
                </Fragment>
              );
            }
          })
        ) : (
          <>
            <p className="text-muted-foreground pb-12">
              There are no conversations... yet.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}

export default All;
