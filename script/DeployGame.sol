// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Game.sol";

contract DeployGame is Script {
    function run() external {
        vm.startBroadcast();

        Game game = new Game();

        console.log("Game contract deployed at:", address(game));

        vm.stopBroadcast();
    }
}
