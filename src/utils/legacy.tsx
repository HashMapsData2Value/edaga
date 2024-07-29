import { Text } from "grommet";
import { Link } from "react-router-dom";

export const getTxns = async () => {
  const url = `https://testnet-idx.algonode.cloud/v2/accounts/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI/transactions?note-prefix=QVJDMDAtMA==`;
  const response = await fetch(url);
  const data = await response.json();
  return data.transactions;
};

export function getShortenedBase32(
  input: string | null | undefined
): string | undefined {
  if (input === null || input === "" || input === undefined) {
    return;
  }
  return input.slice(0, 7) + "..." + input.slice(-3);
}

export function defineBody(noteB64: string | null | undefined): JSX.Element {
  if (noteB64 === null || noteB64 === "" || noteB64 === undefined) {
    return <p>Invalid note</p>;
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === "d") {
    const targetTxId = noteTxt.slice(10, 62);
    return (
      <p>
        &#128077; {"   -->"}{" "}
        <Link to={`/replies/${targetTxId}`}>
          {getShortenedBase32(targetTxId)}
        </Link>
      </p>
    );
  }

  if (category === "l") {
    const targetTxId = noteTxt.slice(10, 62);
    return (
      <p>
        &#128078; {"   -->"}{" "}
        <Link to={`/replies/${targetTxId}`}>
          {getShortenedBase32(targetTxId)}
        </Link>
      </p>
    );
  }

  if (category === "t" || category === "a" || category === "r") {
    const parts = noteTxt.split(";");
    if (parts.length !== 5) {
      return <p>Malformed transaction.</p>;
    }
    const handle = parts[3];
    const msg = parts[4];

    if (category === "a") {
      return (
        <div>
          <p>{handle} posted the following:</p>
          <br />
          <p>{msg}</p>
        </div>
      );
    }

    if (category === "r") {
      const replyToTxId = parts[2];
      return (
        <div>
          <p>
            {handle} replied to{" "}
            <Link to={`/replies/${replyToTxId}`}>
              {getShortenedBase32(replyToTxId)}
            </Link>
            :
          </p>
          <br />
          <p>{msg}</p>
        </div>
      );
    }

    if (category === "t") {
      const topic = parts[2];
      return (
        <div>
          <p>
            {handle} posted in topic <Link to={`/topic/${topic}`}>{topic}</Link>
            :
          </p>
          <br />
          <p>{msg}</p>
        </div>
      );
    }
  }

  return <p>Malformed transaction.</p>;
}

export function defineTopicBody(
  noteB64: string | null | undefined
): JSX.Element {
  if (noteB64 === null || noteB64 === "" || noteB64 === undefined) {
    return <p>Invalid note</p>;
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === "t") {
    const parts = noteTxt.split(";");
    if (parts.length !== 5) {
      return <p>Malformed transaction.</p>;
    }
    const handle = parts[3];
    const msg = parts[4];

    return (
      <div>
        <p>{handle} posted:</p>
        <br />
        <p>{msg}</p>
      </div>
    );
  }

  return <p>Malformed transaction.</p>;
}

export function defineRepliesBody(
  noteB64: string | null | undefined
): JSX.Element {
  if (noteB64 === null || noteB64 === "" || noteB64 === undefined) {
    return <p>Invalid note</p>;
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === "d") {
    return <p>&#128077;</p>;
  }

  if (category === "l") {
    return <p>&#128078;</p>;
  }

  if (category === "r") {
    const parts = noteTxt.split(";");
    if (parts.length !== 5) {
      return <p>Malformed transaction.</p>;
    }
    const handle = parts[3];
    const msg = parts[4];
    return (
      <div>
        <p>{handle} replied</p>
        <br />
        <p>{msg}</p>
      </div>
    );
  }

  return <p>Malformed transaction.</p>;
}

export function defineAllBody(noteB64: string | null | undefined): JSX.Element {
  if (noteB64 === null || noteB64 === "" || noteB64 === undefined) {
    return <p>Invalid note</p>;
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === "d") {
    const targetTxId = noteTxt.slice(10, 62);
    return (
      <p>
        &#128077; {"   -->"}{" "}
        <Link to={`/replies/${targetTxId}`}>
          {getShortenedBase32(targetTxId)}
        </Link>
      </p>
    );
  }

  if (category === "l") {
    const targetTxId = noteTxt.slice(10, 62);
    return (
      <p>
        &#128078; {"   -->"}{" "}
        <Link to={`/replies/${targetTxId}`}>
          {getShortenedBase32(targetTxId)}
        </Link>
      </p>
    );
  }

  if (category === "t" || category === "a" || category === "r") {
    const parts = noteTxt.split(";");
    if (parts.length !== 5) {
      return <p>Malformed transaction.</p>;
    }
    const handle = parts[3];
    const msg = parts[4];

    if (category === "a") {
      return (
        <div>
          <p>{handle} posted the following:</p>
          <br />
          <p>{msg}</p>
        </div>
      );
    }

    if (category === "r") {
      const replyToTxId = parts[2];
      return (
        <div>
          <p>
            {handle} replied to{" "}
            <Link to={`/replies/${replyToTxId}`}>
              {getShortenedBase32(replyToTxId)}
            </Link>
            :
          </p>
          <br />
          <p>{msg}</p>
        </div>
      );
    }

    if (category === "t") {
      const topic = parts[2];
      return (
        <div>
          <p>
            {handle} posted in topic <Link to={`/topic/${topic}`}>{topic}</Link>
            :
          </p>
          <br />
          <p>{msg}</p>
        </div>
      );
    }
  }

  return <p>Malformed transaction.</p>;
}
