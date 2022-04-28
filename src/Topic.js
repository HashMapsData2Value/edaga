import React from 'react';
import { useParams } from "react-router-dom";
import { Text } from 'grommet';

function Topic() {
  let { topic } = useParams();
  return (
  <div>
    <Text>Topic {topic}</Text>
  </div>
  )
}

export default Topic;