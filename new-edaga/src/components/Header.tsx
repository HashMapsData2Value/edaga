import { FC, CSSProperties } from "react";
import { Link } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const header: CSSProperties = {
  height: "75px",
  justifyContent: "space-between",
};
const Header: FC = () => {
  return (
    <AppBar>
      <Toolbar sx={header}>
        <Box>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: (theme) => theme.palette.common.white,
              }}
            >
              Home
            </Typography>
          </Link>
        </Box>
        <Button variant="contained">Connect Wallet</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
