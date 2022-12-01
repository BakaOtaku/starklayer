import { createRoot } from "react-dom/client";
import App from "./App";
import { WalletProvider } from "./context/ArgentConnect";
import "./index.css";

const element = document.getElementById("root");
const root = createRoot(element!);

const Index = () => (
  <WalletProvider>
    <App />
  </WalletProvider>
);

root.render(<Index />);
