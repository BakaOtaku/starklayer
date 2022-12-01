%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

@storage_var
func balance() -> (res: felt) {
}

@storage_var
func registerAddress() -> (res: felt) {
}

@event
func payload_sent(
    payload_len: felt,
    payload: felt*
) {
}

@external
func increase_balance{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    payload_len: felt,
    payload: felt*
) {
    payload_sent.emit(payload_len,payload);
    let (res) = balance.read();
    balance.write(res + payload[0]);
    return ();
}

@external
func register_ica{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    payload_len: felt,
    payload: felt*
) {
    payload_sent.emit(payload_len,payload);
    registerAddress.write(payload[0]);
    return ();
}

@external
func pass_calldata{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    payload_len: felt,
    payload: felt*
) {
    payload_sent.emit(payload_len,payload[0]);
    return ();
}

@view
func get_balance{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (res: felt) {
    let (res) = balance.read();
    return (res,);
}

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    balance.write(0);
    return ();
}
