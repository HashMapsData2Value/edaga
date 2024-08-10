import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { format } from "date-fns";

import Layout from "@/components/common/Layout";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageReturn, processMessage } from "@/utils/processPost";
import { Txn, TxnProps } from "@/types";
import { microalgosToAlgos, shortenedAccountBase32 } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal as IconMoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useApplicationState } from "@/store";
import { censorProfanity } from "@/utils/moderation";

// TODO - Redirect to homepage if reply is not on current broadcast channel
function Replies() {
  const { broadcastChannel, moderation } = useApplicationState();

  const { originalTxId } = useParams<{ originalTxId: string }>();

  const [originalTx, setOriginalTx] = useState<TxnProps>();
  const [replies, setReplies] = useState<TxnProps[]>([]);
  const [processedMessage, setProcessedMessage] = useState<MessageReturn>();

  useEffect(() => {
    if (originalTxId === undefined) return;
    getOriginalTx(originalTxId);
  }, [originalTxId]);

  useEffect(() => {
    const getReplies = async (originalTxId: string) => {
      const repliesAll: TxnProps[] = [];

      const replyTypes = ["ARC00-0;r;", "ARC00-0;l;", "ARC00-0;d;"];
      for (let i = 0; i < replyTypes.length; i++) {
        const prefix = btoa(replyTypes[i] + originalTxId);
        const response = await fetch(
          `https://testnet-idx.algonode.cloud/v2/accounts/${broadcastChannel.address}/transactions?tx-type=pay&note-prefix=${prefix}`
        );
        const data = await response.json();
        if (data.transactions.length > 0) {
          repliesAll.push(...data.transactions);
        }
      }
      setReplies(
        repliesAll.sort((a, b) => a["confirmed-round"] - b["confirmed-round"])
      );
    };
    if (originalTxId === undefined) return;
    getReplies(originalTxId);
  }, [broadcastChannel.address, originalTxId]);

  const getOriginalTx = async (originalTxId: string) => {
    const originalTxUrl = `https://testnet-idx.algonode.cloud/v2/transactions/${originalTxId}`;
    const response = await fetch(originalTxUrl);
    const data: Txn = await response.json();
    const transaction = data.transaction;
    setOriginalTx(transaction);
  };

  useEffect(() => {
    if (originalTx)
      setProcessedMessage(processMessage(originalTx) as MessageReturn);
  }, [originalTx]);

  const BREADCRUMBS = [
    { label: "Edaga", link: "/" },
    { label: "Home", link: `/` },
    { label: "Replies", link: `/replies/${originalTxId}` },
  ];

  if (!processedMessage) return;

  const formatMessage = moderation
    ? censorProfanity(processedMessage.message.raw)
    : processedMessage.message.raw;

  return (
    <>
      <Layout breadcrumbOptions={BREADCRUMBS}>
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 pb-12">
          <Card>
            <CardHeader>
              <CardTitle>
                {processedMessage.nickname}&nbsp;&nbsp;
                <small
                  className="text-s font-light text-muted-foreground"
                  title={processedMessage?.sender}
                >
                  {shortenedAccountBase32(processedMessage.sender)}
                </small>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pb-10">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <h4 className="scroll-m-20 text-xl font-regular tracking-tight">
                    {formatMessage}
                  </h4>
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
                  {JSON.stringify(processedMessage, null, 2)}
                </pre>
              </div> */}
            </CardContent>

            <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                <time dateTime="2023-11-23">
                  {format(
                    new Date(processedMessage.timestamp * 1000),
                    " hh:mm:ss - do MMMM yyyy"
                  )}
                </time>
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
                      to={`https://testnet.explorer.perawallet.app/tx/${processedMessage.id}/`}
                      target="_blank"
                      title="View transaction on Pera Explorer"
                    >
                      View Message ID
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to={`https://testnet.explorer.perawallet.app/block/${processedMessage.block}/`}
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
                      processedMessage.fee
                    )} was paid to post this message`}
                  >
                    {`${microalgosToAlgos(processedMessage.fee)}`}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>

          {replies.map((tx: TxnProps) => {
            const post = processMessage(tx) as MessageReturn;
            const { sender, id, block, nickname, message, timestamp, fee } =
              post;

            const formatMessage = moderation
              ? censorProfanity(message.raw)
              : message.raw;

            return (
              <Fragment key={id}>
                <Card className={"bg-muted/25"}>
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
                  <CardContent className="p-6 pb-12">
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <h4 className="scroll-m-20 text-xl font-regular tracking-tight">
                          {formatMessage}
                        </h4>
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
          })}
        </div>
      </Layout>
    </>
  );
}

export default Replies;
