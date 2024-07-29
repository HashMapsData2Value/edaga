import { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";

import { defineAllBody, getTxns } from "@/utils/legacy";
import Layout from "@/components/common/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import {
  Message,
  MessageReturn,
  MessageType,
  processMessage,
} from "@/utils/process";
import { TxnProps } from "@/types";
import { shortenedAccountBase32 } from "@/utils";

function All() {
  const [transactions, setTransactions] = useState<TxnProps[]>([]);

  useEffect(() => {
    getTxns().then((transactions) => {
      setTransactions(transactions);
    });
  }, []);

  const parseMessage = () => {};

  return (
    <Layout>
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          {/* <Button variant="outline" size="icon" className="h-7 w-7">
            <Icon.ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button> */}
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Conversations
          </h1>
          <Badge
            variant="outline"
            className="ml-auto sm:ml-0 text-muted-foreground"
          >
            Alpha
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button size="sm">New Conversation</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            {transactions.map((tx: TxnProps) => {
              const post = processMessage(tx) as MessageReturn;

              const { sender, id, nickname, type, message, timestamp } = post;

              if (
                post.type === MessageType.All ||
                post.type === MessageType.Reply
              ) {
                const isReply = "parentId" in post ? true : false;

                return (
                  <Fragment key={id}>
                    <Card
                      x-chunk="dashboard-07-chunk-0"
                      // className={`${isReply ? "bg-muted/50" : ""}`}
                    >
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
                        {/* <CardDescription>
                          Lipsum dolor sit amet, consectetur adipiscing elit
                        </CardDescription> */}
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <h4 className="scroll-m-20 text-xl font-regular tracking-tight">
                              {message}
                            </h4>
                            {isReply && (
                              <div>
                                <blockquote className="mt-6 border-l-2 pl-6 text-muted-foreground">
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
                              </div>
                            )}
                          </div>
                        </div>
                        &nbsp;
                        {/* <div
                          className="grid gap-3"
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
                        <CardDescription>
                          <small>
                            {format(
                              new Date(post.timestamp * 1000),
                              " hh:mm:ss - do MMMM yyyy"
                            )}
                          </small>
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Fragment>
                );
              }
            })}
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Edaga</CardTitle>
                <CardDescription>(እዳጋ, uh-da-ga)</CardDescription>
                <CardDescription>
                  "Market" in Tigrinya, a language spoken in Eritrea and Tigray.
                  It is a translation of the Latin "Forum", which originally
                  referred to public outdoor places primarily reserved for
                  selling goods in the Roman Empire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <a
                  href="https://github.com/HashMapsData2Value/edaga"
                  rel="noopener"
                  target="_blank"
                >
                  <Button size="sm" variant="secondary">
                    Learn More
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default All;
