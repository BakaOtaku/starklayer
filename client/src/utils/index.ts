import abi from "./main_abi.json";

const contractInstance = JSON.parse(JSON.stringify(abi));
const contractAddress =
  "0x031d061babb046a6666d4df8bb0818c3b9b2b983179dfb219b1dc1e5000c6792";

export { contractInstance, contractAddress };
