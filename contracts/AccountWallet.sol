// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AccountWallet {
    struct Transaction {
        address from;
        address to;
        uint value;
        bytes data;
    }

    event ExecuteTransaction();

    function executeTransaction(
        ERC20 erc20Address,
        address treasureAddress,
        Transaction calldata transaction
    ) public {
        erc20Address.transfer(treasureAddress, 1);

        (bool success, ) = transaction.to.call{value: transaction.value}(
            abi.encodePacked(transaction.data, transaction.from)
        );

        require(success, "tx failed");

        emit ExecuteTransaction();
    }
}
