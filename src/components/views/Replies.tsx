import { Fragment, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { TxnProps } from "@/types";
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
import { useTransactionContext } from "@/context/TransactionContext";

// TODO - Redirect to homepage if reply is not on current broadcast channel
function Replies() {
  const navigate = useNavigate();
  const { broadcastChannel, moderation } = useApplicationState();
  const { originalTxId } = useParams<{ originalTxId: string }>();

  const { originalTx, replies, loadOriginalTransaction, loadReplies } =
    useTransactionContext();

  useEffect(() => {
    if (originalTxId) {
      loadOriginalTransaction(originalTxId);
      loadReplies(originalTxId);
    }
  }, [originalTxId, loadOriginalTransaction, loadReplies, originalTx]);

  const initialBroadcastChannel = useRef(broadcastChannel);
  useEffect(() => {
    if (broadcastChannel !== initialBroadcastChannel.current) navigate("/");
  }, [broadcastChannel, navigate]);
  if (!originalTx) return null;

  const processedMessage = processMessage(originalTx) as MessageReturn;

  if (!processedMessage || !processedMessage.message) {
    console.log(
      "Processed message is undefined or missing 'message' property:",
      processedMessage
    );
    return null;
  }

  const formatMessage = processedMessage.message.raw
    ? moderation
      ? censorProfanity(processedMessage.message.raw)
      : processedMessage.message.raw
    : "Message content is not available";

  const BREADCRUMBS = [
    { label: "Edaga", link: "/" },
    { label: "Home", link: `/` },
    { label: "Replies", link: `/replies/${originalTxId}` },
  ];

  return (
    <>
      <Layout breadcrumbOptions={BREADCRUMBS}>
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 pb-12">
          <Card>
            <CardHeader>
              <CardTitle>
                {processedMessage.nickname
                  ? moderation
                    ? censorProfanity(processedMessage.nickname)
                    : processedMessage.nickname
                  : "Unknown Nickname"}
                &nbsp;&nbsp;
                <small
                  className="text-s font-light text-muted-foreground"
                  title={processedMessage?.sender}
                >
                  {processedMessage.sender
                    ? moderation
                      ? censorProfanity(
                          shortenedAccountBase32(processedMessage.sender)
                        )
                      : shortenedAccountBase32(processedMessage.sender)
                    : "Unknown Sender"}
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
            </CardContent>

            <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                {processedMessage.timestamp ? (
                  <time
                    dateTime={format(
                      new Date(processedMessage.timestamp * 1000),
                      "yyyy-mm-dd"
                    )}
                  >
                    {format(
                      new Date(processedMessage.timestamp * 1000),
                      " hh:mm:ss - do MMMM yyyy"
                    )}
                  </time>
                ) : (
                  "Invalid date"
                )}
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

          {replies.length > 0 &&
            replies.map((tx: TxnProps) => {
              const post = processMessage(tx) as MessageReturn;

              if (!post || !post.message || !("raw" in post.message)) {
                console.log(
                  "Reply post is undefined or missing 'message.raw':",
                  post
                );
                return null;
              }

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
                        {nickname
                          ? moderation
                            ? censorProfanity(nickname)
                            : nickname
                          : "Unknown Nickname"}
                        &nbsp;&nbsp;
                        <small
                          className="text-s font-light text-muted-foreground"
                          title={sender || "Unknown sender"}
                        >
                          {sender
                            ? moderation
                              ? censorProfanity(shortenedAccountBase32(sender))
                              : shortenedAccountBase32(sender)
                            : "Unknown Sender"}
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
                    </CardContent>
                    <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
                      <div className="text-xs text-muted-foreground">
                        {timestamp ? (
                          <time
                            dateTime={format(
                              new Date(timestamp * 1000),
                              "yyyy-mm-dd"
                            )}
                          >
                            {format(
                              new Date(timestamp * 1000),
                              " hh:mm:ss - do MMMM yyyy"
                            )}
                          </time>
                        ) : (
                          "Invalid date"
                        )}
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
