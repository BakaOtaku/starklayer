const {ethToEvmos, evmosToEth} =require("@tharsis/address-converter")

// let address = ethToEvmos("0xd530495B5c95E448E086B494e681D14Ca36d16c0")
// // "evmos1z3t55m0l9h0eupuz3dp5t5cypyv674jj7mz2jw"
// console.log(address)

let address = evmosToEth("evmos1reujya8a7px2afvcdd8hv62n70e28hem3gx8kl")
console.log(address)
// "0x14574a6DFF2Ddf9e07828b4345d3040919AF5652"