import { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";
import { getTxns } from "@/utils";
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

const BREADCRUMBS = [
  { label: "Edaga", link: "#" },
  { label: "Conversations", link: "#" },
];

function All() {
  const [transactions, setTransactions] = useState<TxnProps[]>([]);

  useEffect(() => {
    getTxns().then((transactions) => {
      setTransactions(transactions);
    });
  }, []);

  return (
    <Layout breadcrumbOptions={BREADCRUMBS}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        {transactions.map((tx: TxnProps) => {
          const post = processMessage(tx) as MessageReturn;

          const { sender, id, block, nickname, message, timestamp } = post;

          if (
            post.type === MessageType.All ||
            post.type === MessageType.Reply
          ) {
            const isReply = "parentId" in post ? true : false;

            return (
              <Fragment key={id}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {nickname}&nbsp;&nbsp;
                      <small
                        className="text-s font-light text-muted-foreground"
                        title={sender}
                      >
                        {shortenedAccountBase32(sender)}
                      </small>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pb-10">
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <h4 className="scroll-m-20 text-xl font-regular tracking-tight">
                          {message}
                        </h4>
                        {isReply && (
                          <Link to={`replies/${post.parentId}`}>
                            <blockquote className="mt-6 pl-6 border-l-2 text-muted-foreground">
                              <CardDescription>
                                <small>Replying to:</small>
                              </CardDescription>
                              {
                                (
                                  processMessage(
                                    transactions.find(
                                      (txn) => txn.id === post.parentId
                                    ) || ({} as TxnProps)
                                  ) as MessageReturn
                                ).message
                              }
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
                      {!isReply && (
                        <div className="text-xs text-muted-foreground">
                          <Button
                            aria-haspopup="true"
                            size="sm"
                            variant="ghost"
                            className="h-6"
                          >
                            <Link
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                              to={`replies/${id}`}
                            >
                              Replies
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
                          {/* <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-foreground-muted">
                            {`Fee: ${microalgosToAlgos(fee)}`}
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              </Fragment>
            );
          }
        })}
      </div>
    </Layout>
  );
}

export default All;
