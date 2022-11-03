import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      // polygon Testnet
      url: "https://polygon-mumbai.g.alchemy.com/v2/5ml6XZXFNNRY6X6SJqnaCa-8oJbqUiqZ",
      accounts: [
        "0x24b9bb8dae8eedcfd72d3137cf7cd2755ed5eff63e615f24d8098e2b444f27ce",
      ],
    },
    matic: {
      // polygon Mainnet
      url: "https://polygon-mainnet.g.alchemy.com/v2/pZeNwDzPr46JgI5oGyuEoobufgMp2Co0",
      accounts: [
        "0x24b9bb8dae8eedcfd72d3137cf7cd2755ed5eff63e615f24d8098e2b444f27ce",
      ],
    },
  },
};

export default config;
