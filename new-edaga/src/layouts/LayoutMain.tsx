import { CSSProperties, FC, ReactNode } from "react";
import { Box, Container } from "@mui/material";
import { SxProps } from "@mui/system";

import Header from "../components/Header";

type Props = { children: ReactNode };
const container: SxProps = {
  mt: "75px",
  // border: "2px solid tomato",
};

const LayoutMain: FC<Props> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Container sx={container}>{children}</Container>
    </Box>
  );
};

export default LayoutMain;
