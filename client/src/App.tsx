import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useWalletContext } from "./context/ArgentConnect";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import mainBg from "./images/paper.webp";
import { Account, Contract, ec, SequencerProvider } from "starknet";
import { contractAddress, contractInstance } from "./utils";

const App = () => {
  const classes = useStyles();
  const { address, account } = useWalletContext();
  const [data, setData] = useState("");
  const [step, setStep] = useState(2);

  const registerICA = async () => {
    if (!account) return;
    // const provider = new SequencerProvider({
    //   baseUrl: "https://alpha4.starknet.io",
    // });
    // // get account
    // const privateKey = "";
    // const starkKeyPair = ec.getKeyPair(privateKey);
    // const accountAddress = "";
    // const acc = new Account(provider, accountAddress, starkKeyPair);
    console.log(contractInstance, (account as any).provider);
    // Create a new myContract contract object
    const myContract = new Contract(
      contractInstance,
      contractAddress,
      (account as any).signer
    );
    console.log(myContract);

    // Call the registerICA method of the contract
    const tx = await myContract.register_ica([
      "0x0578B7188aCbf485541716585f655f5F1eb68e77E01E9092e4cC9B8789a403f7",
    ]);
    console.log(tx);
    console.log(myContract);
    setStep(2);
  };

  const Step1 = () => (
    <div>
      <h1>Step 1 - Resgiter ICA</h1>
      <Button title="Send data" onClickFunc={registerICA} />
    </div>
  );

  const sendData = async () => {
    console.log(address, account);
    setStep(2);
  };

  const Step2 = () => (
    <div>
      <h1>Step 2 - Send data</h1>
      <input
        type="text"
        placeholder="ewhdfbhkbd"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className={classes.input}
      />

      <Button title="Send data" onClickFunc={sendData} />
    </div>
  );

  return (
    <div className={classes.bgCover}>
      <Navbar />

      <div className={classes.main}>
        <h3 className={"classes.h3Title"}>Starknet Proofs on Cosmos</h3>

        {/* 1. regsiter ica */}
        {step === 1 && <Step1 />}

        {/* 2. pass call data */}
        {step === 2 && <Step2 />}

        {/* 3. pass call data */}
        {step === 3 && <Step2 />}
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    backgroundColor: "#f5f4f1",
    backgroundImage: `url(${mainBg})`,
    // backgroundSize: "cover",
    backgroundPosition: "0 0",
    backgroundAttachment: "scroll",
    fontFamily: "'GT America Standard',sans-serif",
    fontWeight: 400,
    minHeight: "100vh",
  },
  main: {
    maxWidth: "1080px",
    margin: "auto",
    padding: "0",
    "@media (max-width:1120px)": {
      padding: "0 20px",
    },
    "@media (max-width:599px)": {
      padding: "0 15px",
    },
  },
  input: {
    maxWidth: 350,
    width: "100%",
    padding: "12px 20px",
    margin: "8px 0",
    boxSizing: "border-box",
    outlineColor: "#BDC2FF",
    backgroundColor: "#EFF5F5",
    border: "1px solid #BDC2FF",
    marginBottom: 20,
  },
}));

export default App;
