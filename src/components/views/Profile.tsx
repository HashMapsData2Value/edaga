import Layout from "@/components/common/Layout";
import { useTransactionContext } from "@/context/TransactionContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BREADCRUMBS = [
  { label: "Edaga", link: "#" },
  { label: "Profile", link: "#" },
];

const Profile = () => {
  const { /*transactions,*/ fetchAvatarSrc, avatarSrcs } =
    useTransactionContext();
  const { accountAddress } = useParams<{ accountAddress: string }>();

  useEffect(() => {
    if (accountAddress) fetchAvatarSrc(accountAddress, accountAddress);
  }, [accountAddress, fetchAvatarSrc]);

  return (
    <Layout breadcrumbOptions={BREADCRUMBS}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 pb-12">
        <h1>{accountAddress}</h1>
        <Avatar className="w-16 h-16 sm:w-24 sm:h-24">
          <AvatarImage
            src={accountAddress ? avatarSrcs[accountAddress] : undefined}
            alt="User Avatar"
          />
          <AvatarFallback>
            {accountAddress ? accountAddress.slice(0, 6) : "User"}
          </AvatarFallback>
        </Avatar>

        {/* TODO - A profile of sorts */}
      </div>
    </Layout>
  );
};

export default Profile;
