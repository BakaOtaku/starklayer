import React, { useCallback, useContext, useEffect, useState } from "react";
import { AccountInterface } from "starknet";
import { connect, getStarknet } from "@argent/get-starknet";
import { supportsSessions } from "@argent/x-sessions";
import { chainId } from "../services/walletService";

interface walletContextType {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  chainId: string;
  address: string;
  account: AccountInterface | null;
  isConnected: boolean;
}
export const WalletContext = React.createContext<walletContextType>({
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  chainId: "",
  address: "",
  account: null,
  isConnected: false,
});
export const useWalletContext = () => useContext(WalletContext);

export const WalletProvider = ({ children }: any) => {
  const [address, setAddress] = useState<string>();
  const [supportSessions, setSupportsSessions] = useState<boolean | null>(null);
  const [chain, setChain] = useState(chainId());
  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);

  const silentConnectWallet = async () => {
    const windowStarknet = await connect({ showList: false });
    if (!windowStarknet?.isConnected) {
      await windowStarknet?.enable({
        showModal: false,
        starknetVersion: "v4",
      } as any);
    }
    return windowStarknet;
  };
  const connectWallet = async () => {
    const windowStarknet = await connect({
      include: ["argentX"],
    });
    await windowStarknet?.enable({ starknetVersion: "v4" } as any);
    return windowStarknet;
  };

  const handleConnectClick = async () => {
    const wallet = await connectWallet();
    setAddress(wallet?.selectedAddress);
    setChain(chainId());
    setConnected(!!wallet?.isConnected);
    if (wallet?.account) {
      setAccount(wallet.account);
    }
    setSupportsSessions(null);
    if (wallet?.selectedAddress) {
      const sessionSupport = await supportsSessions(
        wallet.selectedAddress,
        wallet.provider as any
      );
      setSupportsSessions(sessionSupport);
    }
  };

  const addWalletChangeListener = async (
    handleEvent: (accounts: string[]) => void
  ) => {
    const starknet = getStarknet();
    if (!starknet?.isConnected) {
      return;
    }
    starknet.on("accountsChanged", handleEvent);
  };
  const removeWalletChangeListener = async (
    handleEvent: (accounts: string[]) => void
  ) => {
    const starknet = getStarknet();
    if (!starknet?.isConnected) {
      return;
    }
    starknet.off("accountsChanged", handleEvent);
  };

  useEffect(() => {
    const handler = async () => {
      const wallet = await silentConnectWallet();
      setAddress(wallet?.selectedAddress);
      setChain(chainId());
      setConnected(!!wallet?.isConnected);
      if (wallet?.account) {
        setAccount(wallet.account);
      }
      setSupportsSessions(null);
      if (wallet?.selectedAddress) {
        try {
          const sessionSupport = await supportsSessions(
            wallet.selectedAddress,
            wallet.provider as any
          );
          setSupportsSessions(sessionSupport);
        } catch {
          setSupportsSessions(false);
        }
      }
    };

    (async () => {
      await handler();
      addWalletChangeListener(handler);
    })();

    return () => {
      removeWalletChangeListener(handler);
    };
  }, []);

  const disconnect = useCallback(async () => {}, []);

  return (
    <WalletContext.Provider
      value={{
        connect: handleConnectClick,
        disconnect,
        chainId: chain || "",
        address: address || "",
        account: account || null,
        isConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
