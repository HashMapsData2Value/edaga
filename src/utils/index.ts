export const shortenedAccountBase32 = (account: string) => `${account.slice(0, 5)}...${account.slice(-5)}`;
