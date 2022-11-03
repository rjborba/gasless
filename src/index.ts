import { e2eFlow } from "./e2eFlow";
// import {
//   gelatoRelayWithSponsoredUserAuthCall,
//   gelatoRelayWithSyncFee,
//   defenderRelayerOperation,
// } from "./gelato";

// Any ERC20 token that user has some balance
const ERC20TESTTOKEN__ADDRESS = "0xd3f3Beb38aC9b1C6d5b748fF5DDa7BFAbB5c258D";

(async () => {
  // await defenderRelayerOperation();
  // await gelatoRelayWithSyncFee();
  // await gelatoRelayWithSponsoredUserAuthCall();
  await e2eFlow(ERC20TESTTOKEN__ADDRESS);
})();
