import fs from "fs";
import {
  Account,
  Contract,
  json,
  ec,
  shortString,
  SequencerProvider,
  uint256,
} from "starknet";

const provider = new SequencerProvider({ baseUrl: "https://alpha4.starknet.io" });

const myContractInstance = json.parse(
  fs.readFileSync("./star-test/build/main.json").toString("ascii")
);
console.log(myContractInstance.abi)
// get account
const privateKey = ""
const starkKeyPair = ec.getKeyPair(privateKey);
const accountAddress = ""
const account = new Account(provider, accountAddress, starkKeyPair);

const contractAddress = ""

// Create a new myContract contract object
const myContract = new Contract(myContractInstance.abi, contractAddress, provider);

// Connect the current account to execute transactions
myContract.connect(account);

// Retrieve get_balance
console.log(`Retrieving total get_balance...`);
let get_balance = await myContract.get_balance();
console.log(get_balance);
get_balance = parseInt(shortString.decodeShortString(uint256.bnToUint256(get_balance[0].low).low));
console.log("Total supply", get_balance);

export function strToFeltArr(str) {
  const size = Math.ceil(str.length / 31);
  const arr = Array(size);

  let offset = 0;
  for (let i = 0; i < size; i++) {
    const substr = str.substring(offset, offset + 31).split("");
    const ss = substr.reduce(
      (memo, c) => memo + c.charCodeAt(0).toString(16),
      ""
    );
    arr[i] = BigInt("0x" + ss);
    offset += 31;
  }
  return arr;
}
const arr = "5467456485745656456346475567"
console.log(arr)

// Make a transaction to increase_balance
console.log(`Increasing total get_balance...`);
// const increase_balance = await myContract.increase_balance(arr);
// console.log("increase_balance", increase_balance);

// listen to all starknet provider events
provider.getBlockNumber().then((blockNumber) => {
  console.log("Block number", blockNumber);
});
