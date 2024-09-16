import { useWallet, Wallet } from "@txnlab/use-wallet-react";
import Dialog from "@/components/common/Dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SvgIcon from "@/components/common/SvgIcon";
import { shortenedAccountBase32 } from "@/utils";
import { useApplicationState } from "@/store";

export interface WalletProps {
  openWalletModal: boolean;
  setOpenWalletModal(open: boolean): void;
}

const WalletSelect = ({ openWalletModal, setOpenWalletModal }: WalletProps) => {
  const { wallets, activeWallet, activeAccount } = useWallet();
  const { handle, setHandle } = useApplicationState();

  const handleWalletChange = (wallet: Wallet) => {
    document.body.style.pointerEvents = "auto";
    wallet.connect();
    // setOpenWalletModal(false);
  };

  const handleSetHandle = () => {
    if (handle.trim() === "") {
      alert("Please enter a handle before proceeding");
      return;
    }
    setOpenWalletModal(false);
  };

  return (
    <Dialog
      title={`${activeWallet ? "Connected" : "Connect"} to Edaga`}
      description={`${
        activeWallet ? "P" : "Connect to p"
      }ost a message, topic or reply`}
      open={openWalletModal}
      // onOpenChange={setOpenWalletModal}
      onOpenChange={(isOpen) => {
        if (!activeWallet) {
          setOpenWalletModal(isOpen);
        } else if (handle.trim() !== "") {
          setOpenWalletModal(isOpen);
        } else {
          alert("Please enter a handle");
        }
      }}
    >
      {activeWallet ? (
        <>
          <div className="pb-6">
            <div className="flex items-center gap-2 pb-2">
              <Input
                type="text"
                placeholder="Type a handle"
                className="flex-1 p-2 border rounded-md"
                // value={handle}
                // onChange={(evt) => setHandle(evt.target.value)}
                value={handle}
                onChange={(evt) => setHandle(evt.target.value)}
              />
              <Button
                className="ml-auto"
                variant="outline"
                onClick={handleSetHandle}
              >
                Set Handle
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: your handle (username) will appear posts and can be changed
              ay anytime
            </p>
          </div>

          <RadioGroup defaultValue={``}>
            <Label
              key={activeWallet.id}
              htmlFor={`${activeWallet.id}`}
              className="flex items-center space-x-4 rounded-md border p-6 pt-3 pb-3"
            >
              <SvgIcon
                icon={activeWallet.metadata.icon}
                className="activeWallet-icon opacity-85"
                size={48}
              />
              <div className="flex-1 space-y-1 pl-2">
                <p className="text-md font-medium leading-none">
                  {activeWallet.metadata.name}
                </p>
                <p
                  className="text-md font-light text-muted-foreground leading-none"
                  title={activeAccount!.address}
                >
                  {shortenedAccountBase32(activeAccount!.address, 6)}
                </p>
              </div>
              <Button
                // variant="secondary"
                variant="destructive"
                onClick={() => activeWallet.disconnect()}
              >
                Disconnect
              </Button>
            </Label>
          </RadioGroup>
        </>
      ) : (
        <RadioGroup defaultValue={``}>
          {/* <RadioGroup defaultValue={``} onValueChange={handleWalletChange}> */}
          {wallets.map((wallet: Wallet) => {
            return (
              <Label
                key={wallet.id}
                htmlFor={`${wallet.id}`}
                className="flex items-center space-x-4 rounded-md border p-6 pt-3 pb-3"
                onClick={() => handleWalletChange(wallet)}
              >
                <SvgIcon
                  icon={wallet.metadata.icon}
                  className="wallet-icon opacity-85"
                  size={48}
                />
                <div className="flex-1 space-y-1 pl-2">
                  <p className="text-lg font-medium leading-none">
                    {wallet.metadata.name}
                  </p>
                </div>
                <RadioGroupItem
                  className="w-[20px] h-[20px]"
                  value={`${wallet.id}`}
                  id={`${wallet.id}`}
                />
              </Label>
            );
          })}
        </RadioGroup>
      )}
    </Dialog>
  );
};

export default WalletSelect;
