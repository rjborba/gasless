// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";


contract CounterGelatoRelayerERC2771Context is ERC2771Context {

    uint private count = 0;
    string private message;

    event CountChangeEvent(uint oldValue, uint newValue);

    modifier onlyTrustedForwarder() {
        require(
            isTrustedForwarder(msg.sender),
            "Only callable by Trusted Forwarder"
        );
        _;
    }

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}


    function incrementCount() external onlyTrustedForwarder returns (uint) {
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
