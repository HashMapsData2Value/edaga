import { format } from "date-fns";
import { microalgosToAlgos } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle as IconMessageCircle,
  MoreHorizontal as IconMoreHorizontal,
  Reply as IconReply,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApplicationState } from "@/store";
import { censorProfanity } from "@/utils/moderation";
// import DebugMessage from "@/components/debug/DebugMessage";

export interface PostProps {
  tx: TxnProps;
  validPostTypes: boolean;
  parentTxn?: TxnProps | undefined;
  isReply?: boolean;
  isReplyInline?: boolean;
  replies?: TxnProps[];
  avatarSrc: string;
}

const Post = ({
  tx,
  parentTxn,
  validPostTypes,
  isReply,
  isReplyInline,
  replies,
  avatarSrc,
}: PostProps) => {
  const { moderation } = useApplicationState();

  const post = processMessage(tx) as MessageReturn;

  console.log("Valid Post Types", validPostTypes);
  if (!validPostTypes) return;

  if ("error" in post) {
    console.warn("Error processing message:", post.error);
    return null;
  }

  const { sender, id, block, nickname, message, timestamp, fee, topic } = post;

  if (!("raw" in message)) return;

  // const formatMessage = moderation ? censorProfanity(message.raw) : message.raw;

  const formatMessage =
    moderation && message?.raw
      ? censorProfanity(message.raw)
      : message.raw || "Message content is not available";

  const formatTopicName =
    post.type === MessageType.Topic && topic
      ? moderation
        ? censorProfanity(topic)
        : topic
      : null;

  return (
      <Card
        key={id}
        className={`post-container ${isReplyInline ? "bg-muted/25" : ""}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
          <Avatar className="w-8 h-8 sm:w-12 sm:h-12">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>Edaga</AvatarFallback>
          </Avatar>
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
            {formatTopicName && (
              <Badge className="ml-auto bg-gray-500 cursor-default">
                {formatTopicName}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pb-10">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <h4
                className="scroll-m-20 text-xl font-regular tracking-tight"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {formatMessage}
              </h4>
              {isReply && (
                <Link to={`/replies/${post.parentId}`}>
                  <blockquote className="mt-6 pl-6 border-l-2 text-muted-foreground">
                    <CardDescription>
                      <small>Replying to:</small>
                    </CardDescription>
                    {(() => {
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
              {format(new Date(timestamp * 1000), " hh:mm:ss - do MMMM yyyy")}
            </time>
          </div>

          <div className="flex items-center gap-2 max-sm:gap-1">
            {replies && replies.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <Button
                  aria-haspopup="true"
                  size="sm"
                  variant="ghost"
                  className="h-8 max-sm:p-0 max-sm:pl-1 max-sm:pr-2"
                >
                  <Link
                    className="flex items-center text-xs text-muted-foreground"
                    to={`/replies/${id}`}
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
                className="h-8 max-sm:p-0 max-sm:pl-1 max-sm:pr-2"
              >
                <Link
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                  to={`/replies/${id}`}
                  state={{ isReplying: true }}
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
  );
};
export default Post;
