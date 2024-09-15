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

interface ComposeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isReply?: boolean;
  replyToAddress?: string;
}

const Compose = ({
  open,
  onOpenChange,
  isReply,
  replyToAddress,
}: ComposeProps) => {
  const {
    algodClient,
    activeAddress,
    // activeNetwork,
    // setActiveNetwork,
    transactionSigner,
  } = useWallet();

  const { broadcastChannel, handle } = useApplicationState();
  const { loadTransactions } = useTransactionContext();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // const hash = crypto.randomUUID().slice(-5);

  const sendMessage = async () => {
    if (!activeAddress) throw new Error("No active account");
    if (message.length === 0) {
      alert("Type a message before posting");
      return;
    }

    setIsSending(true);

    try {
      // Prepare message
      const prefix = isReply ? `r;${replyToAddress}` : "a;";
      const note = new Uint8Array(
        Buffer.from(`ARC00-0;${prefix};${handle};${message}`)
      );

      // const note = new Uint8Array(Buffer.from(`ARC00-0;a;;LeslieOA;${message}`));

      const transactionComposer = new algosdk.AtomicTransactionComposer();
      const suggestedParams = await algodClient.getTransactionParams().do();

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

      loadTransactions();

      setMessage("");
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
          <SheetTitle>New Conversation</SheetTitle>
          <SheetDescription className="max-sm:hidden text-muted-foreground italic">
            {quote}
          </SheetDescription>
        </SheetHeader>

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
              onChange={(evt) => setMessage(evt.target.value)}
            />
            <div className="flex items-center p-3 pt-0">
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
      </SheetContent>
    </Sheet>
  );
};

function getDescriptionQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

export default Compose;
