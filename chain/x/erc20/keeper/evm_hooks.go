package keeper

import (
	"encoding/base64"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	ethtypes "github.com/ethereum/go-ethereum/core/types"
	evmtypes "github.com/tharsis/ethermint/x/evm/types"

	"github.com/tharsis/evmos/v4/contracts"
	//"github.com/tharsis/evmos/v4/contracts"
	"github.com/tharsis/evmos/v4/x/erc20/types"
)

var _ evmtypes.EvmHooks = Hooks{}

// Hooks wrapper struct for erc20 keeper
type Hooks struct {
	k Keeper
}

// Return the wrapper struct
func (k Keeper) Hooks() Hooks {
	return Hooks{k}
}

// PostTxProcessing implements EvmHooks.PostTxProcessing. The EVM hooks allows
// users to convert ERC20s to Cosmos Coins by sending an Ethereum tx transfer to
// the module account address. This hook applies to both token pairs that have
// been registered through a native Cosmos coin or an ERC20 token. If token pair
// has been registered with:
//   - coin -> burn tokens and transfer escrowed coins on module to sender
//   - token -> escrow tokens on module account and mint & transfer coins to sender
//
// Note that the PostTxProcessing hook is only called by sending an EVM
// transaction that triggers `ApplyTransaction`. A cosmos tx with a
// `ConvertERC20` msg does not trigger the hook as it only calls `ApplyMessage`.
func (h Hooks) PostTxProcessing(
	ctx sdk.Context,
	msg core.Message,
	receipt *ethtypes.Receipt,
) error {
	params := h.k.GetParams(ctx)
	h.k.Logger(ctx).Info("in post tx here", "contract address", receipt.ContractAddress)

	if !params.EnableErc20 || !params.EnableEVMHook {
		// no error is returned to avoid reverting the tx and allow for other post
		// processing txs to pass and
		return nil
	}

	//erc20 := contracts.ERC20MinterBurnerDecimalsContract.ABI
	icacall := contracts.Icacalldata.ABI

	for _, log := range receipt.Logs {

		// Check if event is included in ERC20
		eventID := log.Topics[0]
		event, err := icacall.EventByID(eventID)
		if err != nil {
			continue
		}
		h.k.Logger(ctx).Info("this is event name", "name", event.Name)
		if event.Name == types.ICARegisterEvent {
			h.k.Logger(ctx).Info("ICA REGISTER EVENT")
			_, err := icacall.Unpack(event.Name, log.Data)
			h.k.Logger(ctx).Error(err.Error())

			to := common.BytesToAddress(log.Topics[1].Bytes())
			senderAddress := sdk.AccAddress(to.Bytes())
			h.k.Logger(ctx).Info("this is the sender", "sender", senderAddress, "other", to)
			err = h.k.IntertxKeeper.RegisterInterchainAccount(ctx, "connection-0", senderAddress.String())
			if err != nil {
				h.k.Logger(ctx).Error(err.Error())
			}
		} else if event.Name == types.ICACALLEvent {
			h.k.Logger(ctx).Info("ICA CALL EVENT")

			to := common.BytesToAddress(log.Topics[1].Bytes())
			senderAddress := sdk.AccAddress(to.Bytes())

			h.k.Logger(ctx).Info("ica call event", "sender address", senderAddress)
			h.k.Logger(ctx).Info("ica call event", "call data", string(log.Data))
			// encoded in smart contract
			logdata, err := icacall.Unpack(event.Name, log.Data)
			if err != nil {
				h.k.Logger(ctx).Error(err.Error())
			}

			h.k.Logger(ctx).Info("ica log event", "log", logdata[0])

			msgdata := logdata[0].(string)
			data, err := base64.StdEncoding.DecodeString(msgdata)
			if err != nil {
				h.k.Logger(ctx).Error(err.Error())
			}

			// unmarshall data to sdk.msg
			var msgcall sdk.Msg
			err = h.k.jsoncdc.UnmarshalInterfaceJSON(data, &msgcall)
			if err != nil {
				h.k.Logger(ctx).Error(err.Error())
			}

			h.k.Logger(ctx).Info("this is the sender", "sender", senderAddress, "other", to, "data", msgcall.String())
			err = h.k.IntertxKeeper.SubmitTxICA(ctx, "connection-0", senderAddress.String(), msgcall)
			if err != nil {
				h.k.Logger(ctx).Error(err.Error())
			}
		}
	}

	return nil
}
