import { ethers } from "hardhat";

async function main() {
  // const Counter = await ethers.getContractFactory("Counter");
  // const counter = await Counter.deploy();
  // await counter.deployed();
  // console.log(`Counter was deployed to ${counter.address}`);

  // const CounterGelatoRelayerContext = await ethers.getContractFactory(
  //   "CounterGelatoRelayerContext"
  // );
  // const counterGelatoRelayerContext =
  //   await CounterGelatoRelayerContext.deploy();
  // await counterGelatoRelayerContext.deployed();
  // console.log(
  //   `CounterGelatoRelayerContext was deployed to ${counterGelatoRelayerContext.address}`
  // );

  // // Gelatos's Trusted Forwarder
  // const GelatoRelay = "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92";
  // const CounterGelatoRelayerERC2771Context = await ethers.getContractFactory(
  //   "CounterGelatoRelayerERC2771Context"
  // );
  // const counterGelatoRelayerERC2771Context =
  //   await CounterGelatoRelayerERC2771Context.deploy(GelatoRelay);
  // await counterGelatoRelayerERC2771Context.deployed();
  // console.log(
  //   `CounterGelatoRelayerERC2771Context was deployed to ${counterGelatoRelayerERC2771Context.address}`
  // );

  // ERC20TestToken
  // const ERC20TestToken = await ethers.getContractFactory("ERC20TestToken");
  // const _ERC20TestToken = await ERC20TestToken.deploy(10000);
  // await _ERC20TestToken.deployed();
  // console.log(`ERC20TestToken was deployed to ${_ERC20TestToken.address}`);

  // Account Wallet
  const AccountWallet = await ethers.getContractFactory("AccountWallet");
  const accountWallet = await AccountWallet.deploy();
  await accountWallet.deployed();
  console.log(`AccountWallet was deployed to ${accountWallet.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
