import { getStarknet } from "@argent/get-starknet";
import { shortString } from "starknet";

export const chainId = (): string | undefined => {
  const starknet = getStarknet();
  if (!starknet?.isConnected) {
    return;
  }
  try {
    return shortString.decodeShortString(starknet.provider.chainId);
  } catch {}
};
