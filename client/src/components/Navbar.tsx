import { AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useWalletContext } from "../context/ArgentConnect";
import Button from "./Button";

const Navbar = () => {
  const classes = useStyles();
  const { address, connect } = useWalletContext();

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <div className={classes.flexContainer}>
        <img src="logo.svg" alt="logo" className={classes.logo} />
        <div className={classes.walletBtnContainer}>
          gege
          <Button
            title={address ? ellipseAddress(address, 8) : "Connect Wallet"}
            onClickFunc={connect}
            // isLoading={loading}
          />
        </div>
      </div>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  nav: {
    height: "70px",
    boxShadow: "none",
    background: "inherit",
    // marginBottom: "40px",
    borderBottom: "2px solid #393E46",
    "@media (max-width:1100px)": {
      padding: "0 20px",
    },
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "auto",
    maxWidth: "1080px",
    padding: "0",
    // maxWidth: 1080,
    width: "90%",
  },
  logo: {
    width: 90,
  },
  walletBtnContainer: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  btnTitle: {
    opacity: 0.56,
    fontSize: 12,
    position: "absolute",
    top: -10,
  },
  modal: {
    position: "absolute",
    top: 24,
    right: 10,
    backgroundColor: "#21325E",
    borderLeft: "2px solid #3E497A",
    borderRight: "2px solid #3E497A",
    boxShadow: "4px 5px #3E497A",
    width: "100%",
    // height: "36px",
    lineHeight: "36px",
    padding: "2 8px",
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "center",
    fontWeight: 600,
    transform: "translate(10%, 35%)",

    [theme.breakpoints.down("xs")]: {
      width: "auto",
    },
  },
  element: {
    padding: "0 5px",
    display: "flex",
    // border: "1px solid #F5E8E4",
    justifyContent: "space-between",
    borderRadius: 10,

    "&:hover": {
      backgroundColor: "#191F2A",
    },
  },
  elementText: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 5,
  },
  copyText: {
    margin: "auto",
    fontSize: 14,
    padding: "0 5px",
    "&:hover": {
      backgroundColor: "#2C3333",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    width: 72,
  },
}));

export default Navbar;

export function ellipseAddress(address = "", width = 10): string {
  if (!address) {
    return "";
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}
