import { useNavigate } from "react-router-dom";
import { useApplicationState } from "@/store";
import { shortenedAccountBase32 } from "@/utils";
import {
  type BroadcastChannel,
  BroadcastChannels,
} from "@/config/broadcast.config";
import Dialog from "@/components/common/Dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RadioTower as IconRadioTower } from "lucide-react";

export interface BroadcastChannelProps {
  openBroadcastAccountAlert: boolean;
  setOpenBroadcastAccountAlert(open: boolean): void;
}

const BroadcastChannel = ({
  openBroadcastAccountAlert,
  setOpenBroadcastAccountAlert,
}: BroadcastChannelProps) => {
  const navigate = useNavigate();

  const { broadcastChannel, setBroadcastChannel } = useApplicationState();
  const handleChannelChange = (newValue: string) => {
    const selectedChannel = BroadcastChannels.find(
      (channel) =>
        `${channel.owner}-${channel.address}-${channel.network.environment}` ===
        newValue
    );

    if (selectedChannel) {
      setBroadcastChannel(selectedChannel);
      navigate("/");
    }

    setOpenBroadcastAccountAlert(false);
  };

  return (
    <Dialog
      title="Select Broadcast Account"
      description="A broadcast account is an account where messages are sent to on
					Edaga."
      open={openBroadcastAccountAlert}
      onOpenChange={setOpenBroadcastAccountAlert}
    >
      <RadioGroup
        defaultValue={`${broadcastChannel.owner}-${broadcastChannel.address}-${broadcastChannel.network.environment}`}
        onValueChange={handleChannelChange}
      >
        {BroadcastChannels.map((account: BroadcastChannel) => {
          const { name, address, owner, description, network } = account;
          return (
            <Label
              key={address}
              htmlFor={`${owner}-${address}-${network.environment}`}
              className="flex items-center space-x-4 rounded-md border p-6"
            >
              <IconRadioTower className="text-muted-foreground" size={30} />
              <div className="flex-1 space-y-1 pl-2">
                <p className="text-md font-medium leading-none">{name}</p>
                <p className="text-sm font-light text-muted-foreground">
                  {description}
                </p>
                <p className="text-xs font-light text-muted-foreground">
                  {shortenedAccountBase32(address)}
                </p>
              </div>
              <RadioGroupItem
                className="w-[20px] h-[20px]"
                value={`${owner}-${address}-${network.environment}`}
                id={`${owner}-${address}-${network.environment}`}
              />
            </Label>
          );
        })}
      </RadioGroup>
    </Dialog>
  );
};

export default BroadcastChannel;
