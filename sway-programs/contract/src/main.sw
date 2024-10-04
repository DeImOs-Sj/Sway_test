contract;

use std::address::Address;
use std::storage::storage_vec::*;

use std::{asset::transfer, auth::msg_sender, call_frames::msg_asset_id, context::this_balance,};

abi Payroll {
    #[storage(write)]
    fn deposit_funds(amount: u64) -> bool;

    #[storage(read)]
    fn get_contract_balance() -> u64;

    #[payable]
    #[storage(read, write)]
    fn transfer(recipient: Identity, amount: u64, asset: Option<AssetId>);
}

storage {
    // amount: u64 = 0,
    total_balance: u64 = 0,
    deposits: StorageMap<Address, u64> = StorageMap {},
    depositiors_address: StorageVec<Address> = StorageVec {},
}

impl Payroll for Contract {
    #[storage(write)]
    fn deposit_funds(amount: u64) -> bool {
        let current_balance = storage.total_balance.read();
        storage.total_balance.write(current_balance + amount);

        true
    }

    #[payable]
    #[storage(read, write)]
    fn transfer(recipient: Identity, amount: u64, asset: Option<AssetId>) {
        let sender = msg_sender().unwrap();
        let token = asset.unwrap_or(AssetId::default());

        if token == AssetId::default() {
            // For native token, use the amount sent with the transaction
            let native_amount = storage.total_balance.read();
            require(native_amount >= amount, "Insufficient native tokens sent");
        }
        storage
            .total_balance
            .write(storage.total_balance.read() - amount);

        transfer(recipient, token, amount);

        log(TransferEvent {
            token,
            from: sender,
            to: recipient,
            amount,
        });
    }

    #[storage(read)]
    fn get_contract_balance() -> u64 {
        storage.total_balance.read()
    }
}

struct TransferEvent {
    token: AssetId,
    from: Identity,
    to: Identity,
    amount: u64,
}
// Wallet mnemonic phrase: cherry weather fit brother rude aisle fitness violin derive year differ shoulder jazz pattern broom lens approve zoo worry couple option mushroom canyon parade
// Wallet address: fuel1zzekyn08rp56htz3cu9g8jx4wf6trmedtu6emy5gnl4yxtlgzwvq007e7z
//contract :- 0x163616dfa045ceea140a1fe5a122cb2da4afb9f0c846d97249deb673c0908d1d
