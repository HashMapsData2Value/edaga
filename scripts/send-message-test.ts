import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

const senderAddress = `${process.env.SENDER_ACCOUNT_ADDRESS}`;
const senderMnemonic = `${process.env.SENDER_ACCOUNT_MNEMONIC}`;

console.log("Swag", senderAddress);

const senderAccount = algosdk.mnemonicToSecretKey(senderMnemonic);

// TODO - Change to Edaga receiver account address
const receiverAddress =
  "K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI";
// const receiverAddress = senderAddress;

const amount = 0;

// const note = new Uint8Array(Buffer.from("ARC00-0;a;;LeslieOA;Hello humans 👋🏾"));
const note = new Uint8Array(Buffer.from("ARC00-0;r;5R42AR2X3X7W2EJPPAP4UOZDYLVAZGRZG6PTJ2E4EJD4NIQPQRSA;LeslieOA;...but what if I'm a robot? 🤖"));

const sendTransaction = async () => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: senderAddress,
      to: receiverAddress,
      amount,
      note,
      suggestedParams,
    });

    const signedTxn = txn.signTxn(senderAccount.sk);

    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    console.log("Transaction sent with ID:", txId);

    const confirmedTxn = await algosdk.waitForConfirmation(
      algodClient,
      txId,
      4
    );
    console.log(
      "Transaction confirmed in round:",
      confirmedTxn["confirmed-round"]
    );
  } catch (error) {
    console.error("Failed to send transaction:", error);
  }
};

sendTransaction();
