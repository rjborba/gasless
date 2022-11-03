import {
  Counter__factory,
  CounterGelatoRelayerContext__factory,
  CounterGelatoRelayerERC2771Context__factory,
} from "../typechain-types/";

import { Provider } from "@ethersproject/providers";

import { ethers, Wallet } from "ethers";

import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";

import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";

export const defenderRelayerOperation = async () => {
  const credentials = {
    apiKey: "FEyRN8u5nA8ZtP3R6uZN1U66xntTsZb7",
    apiSecret:
      "54Q95hyUGWm9akf2o5aNsCmBzbczvijD1gQthEuuUCJgHEY24ufaJ2p84eg2p9RC",
  };
  console.log("Instantiating Defender PROVIDER and SIGNER");
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider as Provider, {
    speed: "fast",
  });

  console.log("Instantiating Counter Contract");

  const counterContract = Counter__factory.connect(
    "0xb5444f1FafDa9a83E712d36D057208275DF04D1D",
    signer
  );

  const tx = await counterContract.incrementCount();
  console.log("Waiting for confirmation");
  await tx.wait();
  console.log("Done!");
};

export const gelatoRelayWithSyncFee = async () => {
  const CounterGelatoRelayerContext_ContractAddress =
    "0xb9E648B4D8983bC4f19BB3B8702334E86BD07E23";

  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    "https://polygon-mumbai.g.alchemy.com/v2/5ml6XZXFNNRY6X6SJqnaCa-8oJbqUiqZ"
  );

  const signer = new Wallet(
    "24b9bb8dae8eedcfd72d3137cf7cd2755ed5eff63e615f24d8098e2b444f27ce",
    provider
  );

  const counterGelatoRelayerContext =
    CounterGelatoRelayerContext__factory.connect(
      CounterGelatoRelayerContext_ContractAddress,
      signer
    );

  const { data } =
    await counterGelatoRelayerContext.populateTransaction.incrementCount()!;

  console.log("Data: ");
  console.log(data);

  const request = {
    chainId: provider.network.chainId,
    target: CounterGelatoRelayerContext_ContractAddress,
    data: data!,
    feeToken: "0x0000000000000000000000000000000000000000",
  };

  const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);

  console.log(relayResponse);
};

export const gelatoRelayWithSponsoredUserAuthCall = async () => {
  const sponsorKey = "";
  const counterGelatoRelayerERC2771Context_ContractAddress =
    "0x2eC97635ACE1d7734Ab53b94953E604a93D4447f";

  const provider: any = new ethers.providers.AlchemyProvider(
    "maticmum",
    "https://polygon-mumbai.g.alchemy.com/v2/5ml6XZXFNNRY6X6SJqnaCa-8oJbqUiqZ"
  );

  const signer = new Wallet(
    "24b9bb8dae8eedcfd72d3137cf7cd2755ed5eff63e615f24d8098e2b444f27ce",
    provider
  );

  const counterGelatoRelayerERC2771Context =
    CounterGelatoRelayerERC2771Context__factory.connect(
      counterGelatoRelayerERC2771Context_ContractAddress,
      signer
    );

  const { data } =
    await counterGelatoRelayerERC2771Context.populateTransaction.incrementCount()!;

  console.log("Data: ");
  console.log(data);

  const request = {
    chainId: provider.network.chainId,
    target: counterGelatoRelayerERC2771Context_ContractAddress,
    data: data!,
    user: await signer.getAddress(),
  };

  const relayResponse = await GelatoRelaySDK.relayWithSponsoredUserAuthCall(
    request,
    provider,
    sponsorKey
  );

  console.log(relayResponse);
};
