import { MessageReturn } from "@/utils/processPost";

const DebugMessage = ({ post }: { post: MessageReturn }) => {
  return (
    <div
      className="grid gap-3 mt-6"
      style={{
        width: 500,
        overflow: "hidden",
        overflowX: "scroll",
        border: "1px dotted red",
      }}
    >
      <pre className="text-xs">{JSON.stringify(post, null, 2)}</pre>
    </div>
  );
};

export default DebugMessage;
