contract;

abi TestContract {
    #[storage(read), payable]
    fn increment_counter(amount: u64) -> u64;

    #[storage(read)]
    fn get_counter() -> u64;
}

storage {
    counter: u64 = 0,
}

storage {
base_token: b256 = 0x0000000000000000000000000000000000000000000000000000000000000000,
}
impl TestContract for Contract {
#[storage(read), payable]
    fn increment_counter(amount: u64, recipient: Address) -> u64  {
    let amount_to_mint = msg_amount() ;
    require(amount>0,"Please enter amount graeter than 1");
    assert(storage.base_token.read() == msg_asset_id());
        let incremented = storage.counter.read() + amount;
        mint_to_address(recipient, ZERO_B256, amount_to_mint);
        storage.counter.write(incremented);
        incremented
    }

    #[storage(read)]
    fn get_counter() -> u64 {
        storage.counter.read()
    }
}