import { useApplicationState } from "@/store";
import { shortenedAccountBase32 } from "@/utils";
import { censorProfanity } from "@/utils/moderation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface PostHeaderProps {
  nickname: string;
  accountAddress: string;
  avatarSrc: string;
  topicName?: string | null;
}

const PostHeader = ({
  nickname,
  accountAddress,
  avatarSrc,
  topicName,
}: PostHeaderProps) => {
  const { moderation } = useApplicationState();
  return (
    <Link to={`/profile/${accountAddress}`}>
      <CardTitle className="flex items-center space-x-4">
        <Avatar className="w-8 h-8 sm:w-12 sm:h-12">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>
            {moderation ? censorProfanity(nickname) : nickname}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span
            className="edaga-user-handle font-medium"
            title={accountAddress}
          >
            {moderation ? censorProfanity(nickname) : nickname}
          </span>
          <small
            className="edaga-user-account-address text-xs font-light text-muted-foreground"
            title={accountAddress}
          >
            {moderation
              ? censorProfanity(shortenedAccountBase32(accountAddress))
              : shortenedAccountBase32(accountAddress)}
          </small>
        </div>
        {topicName && (
          <Badge className="ml-auto bg-gray-500 cursor-default">
            {topicName}
          </Badge>
        )}
      </CardTitle>
    </Link>
  );
};

export default PostHeader;
