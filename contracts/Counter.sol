// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Counter {
    uint private count = 0;

    event CountChangeEvent(uint oldValue, uint newValue);

    function incrementCount() public {
        count += 1;
        emit CountChangeEvent(count - 1, count);
    }

    function getCount() public view returns (uint) {
        return count;
    }
}
