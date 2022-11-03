// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {
    GelatoRelayContext
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";


contract CounterGelatoRelayerContext is GelatoRelayContext {
    uint private count = 0;
    string private message;

    event CountChangeEvent(uint oldValue, uint newValue);

    function incrementCount() external onlyGelatoRelay returns (uint) {
        _transferRelayFee();

        count += 1;
        emit CountChangeEvent(count - 1, count);

        return count;
    }

    function saveMessage(string memory _message) external {
        message = _message;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}
