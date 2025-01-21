import { useWallet } from "@txnlab/use-wallet-react";
import algosdk from "algosdk";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownLeft as IconCornerDownLeft } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useApplicationState } from "@/store";
import { useTransactionContext } from "@/context/TransactionContext";
import { quotes } from "@/assets/data/quotes";
import { Input } from "@/components/ui/input";

interface ComposeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isTopic?: boolean;
  isReply?: boolean;
  replyToTxId?: string;
  // currentPath: string;
}

const Compose = ({
  open,
  onOpenChange,
  isTopic,
  isReply,
  replyToTxId,
}: ComposeProps) => {
  const {
    algodClient,
    activeAddress,
    // activeNetwork,
    // setActiveNetwork,
    transactionSigner,
  } = useWallet();

  const { broadcastChannel, handles } = useApplicationState();
  const { loadTransactions, loadReplies } = useTransactionContext();

  const [message, setMessage] = useState("");
  const maxMessageLength = 800;
  const [topicName, setTopicName] = useState("");
  const maxTopicLength = 60;
  const [fee, setFee] = useState(0.001);
  const [isSending, setIsSending] = useState(false);

  const activeHandle = activeAddress ? handles[activeAddress] || "" : "";

  const sendMessage = async () => {
    if (!activeAddress) throw new Error("No active account");
    if (
      isTopic &&
      !isReply &&
      (topicName.length === 0 || topicName.length > maxTopicLength)
    ) {
      alert(`Please provide a topic name within ${maxTopicLength} characters.`);
      return;
    }
    if (message.length === 0) {
      alert("Type a message before posting");
      return;
    }
    if (message.length > maxMessageLength) {
      alert(
        `Your message exceeds the maximum length of ${maxMessageLength} characters.`
      );
      return;
    }

    setIsSending(true);

    try {
      let prefix = "";
      if (isReply) {
        prefix = `r;${replyToTxId}`;
      } else if (isTopic && !isReply) {
        prefix = `t;${topicName}`;
      } else {
        prefix = "a;";
      }

      const note = new Uint8Array(
        Buffer.from(`ARC00-0;${prefix};${activeHandle};${message}`)
      );

      const transactionComposer = new algosdk.AtomicTransactionComposer();
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      suggestedParams.flatFee = true;
      suggestedParams.fee = fee*1_000_000;

      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: broadcastChannel.address,
        amount: 0,
        note,
        suggestedParams,
      });

      transactionComposer.addTransaction({
        txn: transaction,
        signer: transactionSigner,
      });

      console.info("Sending message...", transaction);

      const result = await transactionComposer.execute(algodClient, 4);

      console.info("✅ Successfully sent transaction!", {
        confirmedRound: result.confirmedRound,
        txIDs: result.txIDs,
      });

      if (isReply && replyToTxId) {
        await loadReplies(replyToTxId);
      } else {
        await loadTransactions();
      }

      setMessage("");
      setTopicName(""); // Reset topic name
    } catch (err) {
      console.error("Failed to post message", err);
    } finally {
      setIsSending(false);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add("sheet-open");
    } else {
      document.body.classList.remove("sheet-open");
    }
    return () => document.body.classList.remove("sheet-open");
  }, [open]);

  const quote = useMemo(() => getDescriptionQuote(), []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
      <SheetContent side="bottom" className="p-2 pt-4 sm:p-4 md:p-8">
        <SheetHeader className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pt-2 pb-6">
          <SheetTitle>{`New ${
            isReply ? "Reply" : isTopic ? "Topic" : "Conversation"
          }`}</SheetTitle>
          <SheetDescription className="max-sm:hidden text-muted-foreground italic">
            {quote}
          </SheetDescription>
        </SheetHeader>

        {isTopic && !isReply && (
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pb-4">
            <Input
              id="topicName"
              type="text"
              placeholder="Enter topic name"
              className="p-2 border rounded-md"
              value={topicName}
              onChange={(evt) => {
                const inputTopic = evt.target.value;
                if (inputTopic.length <= maxTopicLength) {
                  setTopicName(inputTopic);
                } else {
                  setTopicName(inputTopic.slice(0, maxTopicLength));
                }
              }}
            />
          </div>
        )}

        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <form
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            x-chunk=""
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 text-base"
              value={message}
              onChange={(evt) => {
                const inputMessage = evt.target.value;
                if (inputMessage.length <= maxMessageLength) {
                  setMessage(inputMessage);
                } else {
                  setMessage(inputMessage.slice(0, maxMessageLength));
                }
              }}
            />
            <div className="flex items-center justify-between p-3 pt-0">
              <span
                className="text-xs text-muted-foreground m-2"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
              >
                {maxMessageLength - message.length}/{maxMessageLength}
              </span>
              <Button
                type="submit"
                size="default"
                className="ml-auto gap-1.5"
                onClick={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    Posting
                    <UpdateIcon className="size-3.5 motion-safe:animate-spin-slow" />
                  </>
                ) : (
                  <>
                    Post
                    <IconCornerDownLeft className="size-3.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pb-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fee">
              Fee (higher fee equals a more visible the transaction)
            </Label>
            <Input
              id="fee"
              type="number"
              min="0.001"
              step="0.001"
              placeholder="Enter fee in microAlgo"
              className="p-2 border rounded-md no-arrows w-48"
              value={fee}
              onChange={(evt) => {
                const value = parseFloat(evt.target.value);
                if (!isNaN(value) && value >= 0.001) {
                  setFee(value);
                }
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function getDescriptionQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

export default Compose;