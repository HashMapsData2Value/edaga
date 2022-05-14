import { Text } from 'grommet';
import { Link } from 'react-router-dom';


export function getShortenedBase32(input) {
  return input.slice(0, 7) + '...' + input.slice(-3)
}

export function defineBody(noteB64) {
  if (noteB64 === null || noteB64 === '' || noteB64 === undefined) {
    return
  }

  const noteTxt = atob(noteB64);
  console.log(noteTxt)
  const category = noteTxt.slice(8, 9);

  if (category === 'd') {
    const targetTxId = noteTxt.slice(10, 62);
    return <Text>&#128077; {'   -->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Text>
  }

  if (category === 'l') {
    const targetTxId = noteTxt.slice(10, 62);
    return <Text>&#128078; {'   -->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Text>
  }

  if (category === 't' || category === 'a' || category === 'r') {

    const parts = noteTxt.split(';');
    if (parts.length !== 5) {
      console.log(noteTxt);
      return <Text>Malformed transaction.</Text>
    }
    const handle = parts[3];
    const msg = parts[4];

    if (category === 'a') {
      return (
        <div>
          <Text>{handle} posted the following:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

    if (category === 'r') {
      const replyToTxId = parts[2];
      return (
        <div>
          <Text>{handle} replied to <Link to={`/replies/${replyToTxId}`}>{getShortenedBase32(replyToTxId)}</Link>:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

    if (category === 't') {
      const topic = parts[2];
      return (
        <div>
          <Text>{handle} posted in topic <Link to={`/topic/${topic}`}>{topic}</Link>:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

  }

  return <Text>Malformed transaction.</Text>
}

export function defineTopicBody(noteB64) {
  if (noteB64 === null || noteB64 === '' || noteB64 === undefined) {
    return
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === 't') {

    const parts = noteTxt.split(';');
    if (parts.length !== 5) {
      console.log(noteTxt);
      return <Text>Malformed transaction.</Text>
    }
    const handle = parts[3];
    const msg = parts[4];

    return (
      <div>
        <Text>{handle} posted:</Text>
        <br></br>
        <Text>{msg}</Text>
      </div>
    );
  }

  return <Text>Malformed transaction.</Text>
}


export function defineRepliesBody(noteB64) {
  if (noteB64 === null || noteB64 === '' || noteB64 === undefined) {
    return
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === 'd') {
    return <Text>&#128077;</Text>
  }

  if (category === 'l') {
    return <Text>&#128078;</Text>
  }

  if (category === 'r') {

    const parts = noteTxt.split(';');
    if (parts.length !== 5) {
      console.log(noteTxt);
      return <Text>Malformed transaction.</Text>
    }
    const handle = parts[3];
    const msg = parts[4];
    return (
      <div>
        <Text>{handle} replied</Text>
        <br></br>
        <Text>{msg}</Text>
      </div>
    );
  }

  return <Text>Malformed transaction.</Text>
}


export function defineAllBody(noteB64) {
  if (noteB64 === null || noteB64 === '' || noteB64 === undefined) {
    return
  }

  const noteTxt = atob(noteB64);
  const category = noteTxt.slice(8, 9);

  if (category === 'd') {
    const targetTxId = noteTxt.slice(10, 62);
    return <Text>&#128077; {'   -->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Text>
  }

  if (category === 'l') {
    const targetTxId = noteTxt.slice(10, 62);
    return <Text>&#128078; {'   -->'} <Link to={`/replies/${targetTxId}`}>{getShortenedBase32(targetTxId)}</Link></Text>
  }

  if (category === 't' || category === 'a' || category === 'r') {

    const parts = noteTxt.split(';');
    if (parts.length !== 5) {
      console.log(noteTxt);
      return <Text>Malformed transaction.</Text>
    }
    const handle = parts[3];
    const msg = parts[4];

    if (category === 'a') {
      return (
        <div>
          <Text>{handle} posted the following:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

    if (category === 'r') {
      const replyToTxId = parts[2];
      return (
        <div>
          <Text>{handle} replied to <Link to={`/replies/${replyToTxId}`}>{getShortenedBase32(replyToTxId)}</Link>:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

    if (category === 't') {
      const topic = parts[2];
      return (
        <div>
          <Text>{handle} posted in topic <Link to={`/topic/${topic}`}>{topic}</Link>:</Text>
          <br></br>
          <Text>{msg}</Text>
        </div>
      );
    }

  }

  return <Text>Malformed transaction.</Text>
}