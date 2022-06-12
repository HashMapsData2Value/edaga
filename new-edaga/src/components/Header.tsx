import { FC, CSSProperties } from "react";
import { AppBar, Box, Button, Toolbar } from "@mui/material";

const header: CSSProperties = {
  height: "75px",
  justifyContent: "space-between",
};
const Header: FC = () => {
  return (
    <AppBar>
      <Toolbar sx={header}>
        <Box>Logo</Box>
        <Button variant="contained">Connect Wallet</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
