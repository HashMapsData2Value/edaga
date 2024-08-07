import { type TxnProps } from "@/types/index";

export enum MessageType {
  All = "a",
  Topic = "t",
  Reply = "r",
  Like = "l",
  Dislike = "d",
}

export interface MessageReturn {
  sender: string;
  id: string;
  block: number;
  fee: number;
  nickname: string;
  type: MessageType;
  message?: string;
  timestamp: number;
  parentId?: string;
  topic?: string;
  debug: unknown;
}

export interface ErrorReturn {
  error: string;
}

export type Message = MessageReturn | ErrorReturn;

const decodeBase64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeUint8ArrayToString = (uint8Array: Uint8Array): string => {
  return new TextDecoder().decode(uint8Array);
};

export const processMessage = (txn: TxnProps): Message => {
  const parseNoteField = decodeBase64ToUint8Array(txn.note);
  const decodeNoteField = decodeUint8ArrayToString(parseNoteField);
  const parsedNoteArray = decodeNoteField.split(";");

  if (parsedNoteArray[0] !== "ARC00-0")
    return { error: "Invalid message format" };

  const msgType: MessageType = parsedNoteArray[1] as MessageType;

  const messageParsers: { [key in MessageType]: () => MessageReturn } = {
    [MessageType.All]: (): MessageReturn => ({
      sender: txn.sender,
      id: txn.id,
      block: txn["confirmed-round"],
      fee: txn.fee,
      nickname: parsedNoteArray[3] || "",
      type: MessageType.All,
      message: parsedNoteArray[4] || "",
      timestamp: txn["round-time"],
      debug: {
        parsedNoteArray,
        txn,
      },
    }),
    [MessageType.Topic]: (): MessageReturn => ({
      sender: txn.sender,
      id: txn.id,
      block: txn["confirmed-round"],
      fee: txn.fee,
      nickname: parsedNoteArray[3] || "",
      type: MessageType.Topic,
      topic: parsedNoteArray[2] || "",
      message: parsedNoteArray[4] || "",
      timestamp: txn["round-time"],
      debug: {
        parsedNoteArray,
        txn,
      },
    }),
    [MessageType.Reply]: (): MessageReturn => ({
      sender: txn.sender,
      id: txn.id,
      block: txn["confirmed-round"],
      fee: txn.fee,
      nickname: parsedNoteArray[3] || "",
      type: MessageType.Reply,
      parentId: parsedNoteArray[2] || "",
      message: parsedNoteArray[4] || "",
      timestamp: txn["round-time"],
      debug: {
        parsedNoteArray,
        txn,
      },
    }),
    [MessageType.Like]: (): MessageReturn => ({
      sender: txn.sender,
      id: txn.id,
      block: txn["confirmed-round"],
      fee: txn.fee,
      nickname: parsedNoteArray[3] || "",
      type: MessageType.Like,
      parentId: parsedNoteArray[2] || "",
      timestamp: txn["round-time"],
      message: "👍", // TODO - Refactor into actual likes
      debug: {
        parsedNoteArray,
        txn,
      },
    }),
    [MessageType.Dislike]: (): MessageReturn => ({
      sender: txn.sender,
      id: txn.id,
      block: txn["confirmed-round"],
      fee: txn.fee,
      nickname: parsedNoteArray[3] || "",
      type: MessageType.Dislike,
      parentId: parsedNoteArray[2] || "",
      timestamp: txn["round-time"],
      message: "👎", // TODO - Refactor into actual dislikes
      debug: {
        parsedNoteArray,
        txn,
      },
    }),
  };

  return messageParsers[msgType]();
};
