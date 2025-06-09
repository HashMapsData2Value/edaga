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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import Algorand from "@/assets/icons/currency.algorand.svg";

interface ComposeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isTopic?: boolean;
  isReply?: boolean;
  replyToTxId?: string;
  // currentPath: string;
}

interface TransactionFeeOption {
  label: string;
  value: number;
}
const TXN_FEE: TransactionFeeOption[] = [
  { label: "Default", value: 0.001 },
  { label: "Medium", value: 0.01 },
  { label: "High", value: 0.1 },
  { label: "Priority", value: 1.0 },
];

const FEE_CAP = 5; // Maximum fee in ALGO for custom fees

const Compose = ({
  open,
  onOpenChange,
  isTopic,
  isReply,
  replyToTxId,
}: ComposeProps) => {
  const { algodClient, activeAddress, transactionSigner } = useWallet();

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
      suggestedParams.fee = fee * 1_000_000;

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
      setTopicName("");
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

  const [fees, setFees] = useState(TXN_FEE);
  const [customFee, setCustomFee] = useState("");

  const selectedOption = fees.find((f) => f.value === fee) ?? {
    value: fee,
    label: "Custom",
  };

  const { addCustomFee } = useApplicationState();

  const handleCustomFee = () => {
    const parsed = parseFloat(customFee);

    if (
      !isNaN(parsed) &&
      parsed >= 0.001 &&
      parsed <= FEE_CAP &&
      !fees.some((f) => f.value === parsed)
    ) {
      const newFees = [...fees, { value: parsed, label: "Custom" }];

      setFees(newFees);
      setFee(parsed);
      setCustomFee("");

      addCustomFee(parsed);
    }
  };

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
              className="min-h-12 resize-none border-0 p-3 pr-20 pb-12 shadow-none focus-visible:ring-0 text-base"
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

              <div className="ml-auto flex items-center gap-2">
                <Select
                  value={fee.toString()}
                  onValueChange={(value) => {
                    if (value === "") return;
                    setFee(Number(value));
                  }}
                >
                  <SelectTrigger className="flex items-center justify-between">
                    <div className="flex items-center gap-x-1 w-35">
                      <span className="text-xs text-muted-foreground p-1">
                        {selectedOption?.label}
                      </span>
                      <div className="bg-accent px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        {selectedOption?.value}
                        <Algorand width={10} height={10} />
                      </div>
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Visibility</SelectLabel>

                      <div className="px-2 pt-1 pb-3 text-xs text-muted-foreground leading-snug border-b border-border">
                        Select a higher fee to boost visibility
                      </div>

                      {fees.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          <div className="flex items-center gap-x-1">
                            <span className="text-xs text-muted-foreground p-1">
                              {option.label}
                            </span>
                            <div className="bg-accent px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-medium text-muted-foreground">
                              {option.value}
                              <Algorand width={10} height={10} />
                            </div>
                          </div>
                        </SelectItem>
                      ))}

                      <div className="flex items-center gap-2 px-2 pt-3 pb-1 border-t border-border">
                        <Input
                          id="customFee"
                          type="number"
                          step="0.001"
                          min="0.001"
                          max={FEE_CAP}
                          placeholder="Enter fee"
                          value={customFee}
                          onChange={(evt) => {
                            const v = evt.target.value;
                            if (/^[0-9]*\.?[0-9]*$/.test(v)) {
                              const num = parseFloat(v);
                              if (v === "" || (!isNaN(num) && num <= FEE_CAP)) {
                                setCustomFee(v);
                              }
                            }
                          }}
                          onKeyDown={(evt) => {
                            if (evt.key === "Enter") {
                              evt.preventDefault();
                              handleCustomFee();
                            }
                          }}
                        />

                        <Button
                          type="button"
                          size="sm"
                          variant="default"
                          className="h-8 px-3 text-xs"
                          onClick={handleCustomFee}
                        >
                          Add
                        </Button>
                      </div>
                    </SelectGroup>
                  </SelectContent>
                </Select>

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
