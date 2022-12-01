BINARY=./build/evmosd
CHAINID_1="evmos_9000-1"
CHAINID_2="evmos_9000-2"

export DEMOWALLET_1=$($BINARY keys show demowallet1 -a --keyring-backend test --home ./data/$CHAINID_1) 
export DEMOWALLET_2=$($BINARY keys show demowallet2 -a --keyring-backend test --home ./data/$CHAINID_2)
#
#$BINARY tx ibc-transfer transfer transfer channel-0 $DEMOWALLET_1 2100aevmos --from $DEMOWALLET_2 --chain-id $CHAINID_2 --home ./data/$CHAINID_2 --gas-prices 30aevmos --node tcp://localhost:26657 --keyring-backend test -y
#$BINARY q bank balances $DEMOWALLET_1  --chain-id $CHAINID_1 --node tcp://localhost:16657
#$BINARY q ibc-transfer denom-trace C053D637CCA2A2BA030E2C5EE1B28A16F71CCB0E45E8BE52766DC1B241B77878 --chain-id $CHAINID_1 --node tcp://localhost:16657
#

#cat ./data/$CHAINID_1/config/genesis.json | jq -r '.app_state.genutil.gen_txs[0].body.messages[0].validator_address'



## register account on given connection

# $BINARY tx intertx register --from $DEMOWALLET_1 --connection-id connection-0 --chain-id $CHAINID_1 --home ./data/$CHAINID_1 --node tcp://localhost:16657 --keyring-backend test -y --gas-prices 100aevmos --gas 500000 

export ICADR=$($BINARY query intertx interchainaccounts connection-0 $DEMOWALLET_1 --home ./data/$CHAINID_1 --node tcp://localhost:16657 -o json | jq -r '.interchain_account_address')
# echo $ICADR
#$BINARY q bank balances $DEMOWALLET_2 --chain-id $CHAINID_2 --node tcp://localhost:26657

# $BINARY tx bank send $DEMOWALLET_2 $ICADR 2000evmos --node tcp://localhost:26657 --home ./data/$CHAINID_2 --chain-id $CHAINID_2 --from $DEMOWALLET_2 --keyring-backend test -y --gas-prices 30aevmos
#$BINARY q bank balances $ICADR --chain-id $CHAINID_2 --node tcp://localhost:26657

#$BINARY tx intertx submit tx.json --chain-id $CHAINID_1 --from $DEMOWALLET_1 --offline --account-number 0 --sequence 0 --connection-id connection-0 --generate-only

# $BINARY tx intertx submit \
# '{
#    "@type":"/cosmos.staking.v1beta1.MsgDelegate",
#    "delegator_address":"evmos16kt0s0e57wl7gjvyrhmnrl9epaa82r7qyv6dxzef4dj23akycutqnzchq7",
#    "validator_address":"evmosvaloper100s3yp8l3atuuvx98jmftttxzy4ee5mgk6uqtz",
#    "amount": {
#        "denom": "aevmos",
#        "amount": "1000"
#    }
# }' --connection-id connection-0 --from $DEMOWALLET_1 --chain-id $CHAINID_1 --home ./data/$CHAINID_1 --node tcp://localhost:16657 --keyring-backend test -y --gas-prices 30aevmos --gas 500000

#"{@type:/cosmos.staking.v1beta1.MsgDelegate,delegator_address:evmos16kt0s0e57wl7gjvyrhmnrl9epaa82r7qyv6dxzef4dj23akycutqnzchq7,validator_address:evmosvaloper100s3yp8l3atuuvx98jmftttxzy4ee5mgk6uqtz,amount: {denom: aevmos,amount: 1000}}"

#$BINARY tx intertx submit \
#'{
#  "@type": "/cosmos.bank.v1beta1.MsgSend",
#  "from_address": "evmos16kt0s0e57wl7gjvyrhmnrl9epaa82r7qyv6dxzef4dj23akycutqnzchq7",
#  "to_address": "evmos1n3t0zuwq4u47ke48qm3pfhj96f4ujhs77weln3",
#  "amount": [
#    {
#      "denom": "aevmos",
#      "amount": "10"
#    }
#  ]
#}' --connection-id connection-0 --from $DEMOWALLET_1 --chain-id $CHAINID_1 --home ./data/$CHAINID_1 --node tcp://localhost:16657 --keyring-backend test -y --gas-prices 30aevmos --gas 500000


#$BINARY tx intertx submit \
#'{
#    "@type":"/cosmos.staking.v1beta1.MsgDelegate",
#    "delegator_address":"evmos16kt0s0e57wl7gjvyrhmnrl9epaa82r7qyv6dxzef4dj23akycutqnzchq7",
#    "validator_address":"evmosvaloper103rx84uqa7n4mtmz8f88n4g9m7973rxuh2fkuf",
#    "amount": {
#        "denom": "stake",
#        "amount": "10"
#    }
#}' --connection-id connection-0 --from $DEMOWALLET_1 --chain-id ichainwd-controller --home ./data/ichainwd-controller --node tcp://localhost:16657 --keyring-backend test -y
#

#encoding for delegation msg
#eyJAdHlwZSI6Ii9jb3Ntb3Muc3Rha2luZy52MWJldGExLk1zZ0RlbGVnYXRlIiwiZGVsZWdhdG9yX2FkZHJlc3MiOiJldm1vczE2a3QwczBlNTd3bDdnanZ5cmhtbnJsOWVwYWE4MnI3cXl2NmR4emVmNGRqMjNha3ljdXRxbnpjaHE3IiwidmFsaWRhdG9yX2FkZHJlc3MiOiJldm1vc3ZhbG9wZXIxMDBzM3lwOGwzYXR1dXZ4OThqbWZ0dHR4enk0ZWU1bWdrNnVxdHoiLCJhbW91bnQiOnsiZGVub20iOiJhZXZtb3MiLCJhbW91bnQiOiIxMDAwIn19
$BINARY q  staking delegations-to evmosvaloper100s3yp8l3atuuvx98jmftttxzy4ee5mgk6uqtz --home ./data/$CHAINID_2 --node tcp://localhost:26657
# $BINARY query tx 8FE00BE30C1AD945C288DCC58DDA0C5432D3853C08DFB878309FAA339E87551F --node tcp://localhost:26657
#$BINARY query tx 9DD8E754CC355CAF9A4CBEC52BF487E677381FA6A4B751C96C8130CA96B359F6 --node tcp://localhost:26657
