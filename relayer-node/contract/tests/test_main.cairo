%lang starknet
from src.main import balance, increase_balance
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc

@external
func test_increase_balance{syscall_ptr: felt*, range_check_ptr, pedersen_ptr: HashBuiltin*}() {
    let (result_before) = balance.read();
    assert result_before = 0;
    let (array : felt*) = alloc();
    assert [array] = 1;
    assert [array + 1] = 2;

    increase_balance(2, array);

    let (result_after) = balance.read();
    assert result_after = 1;
    return ();
}
