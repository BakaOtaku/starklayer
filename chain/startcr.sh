BINARY=./build/evmosd
CHAINID_1="evmos_9000-1"
CHAINID_2="evmos_9000-2"
make init

export DEMOWALLET_1=$($BINARY keys show demowallet1 -a --keyring-backend test --home ./data/$CHAINID_1) && echo $DEMOWALLET_1;
export DEMOWALLET_2=$($BINARY keys show demowallet2 -a --keyring-backend test --home ./data/$CHAINID_2) && echo $DEMOWALLET_2;

make init-hermes-rly
make setup-hermes-rly
make start-hermes-rly