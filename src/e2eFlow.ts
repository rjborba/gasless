import {
  Counter__factory,
  ERC20TestToken__factory,
  AccountWallet__factory,
} from "../typechain-types/";

import { BigNumber, BigNumberish, ethers, Wallet } from "ethers";
import axios from "axios";

import { BigNumber as BigNumberJs } from "bignumber.js";

const provider: ethers.providers.JsonRpcProvider =
  new ethers.providers.JsonRpcProvider(
    // "maticmum",
    "https://polygon-testnet.public.blastapi.io"
  );

// EOA owned by the Realyer platform (Gasbit)
const RELAYER_WALLET_PK =
  "24b9bb8dae8eedcfd72d3137cf7cd2755ed5eff63e615f24d8098e2b444f27ce";
const RELAYER_WALLET_SIGNER = new Wallet(RELAYER_WALLET_PK, provider);

// Destination to fee paid with ERC20
const TREASURE_WALLET_PK =
  "e3001e71f918e3a8f0c7fa2f441b14308a8c200edeedb6b7f0e3e6dac784275f";

const TREASURE_WALLET_ADDRESS = "0x359ea9Bc6d3c771d18905dB828ed5c4a655B61d2";

// Wallet account associeted with the plataform User
const ACCOUNTWALLET__ADDRESS = "0xbC71b0d5248E6622DB276b5FA1AFBD4e8a4d58dc";

// Target contract where the method is called after the forwarders
const COUNTER_CONTRACT_ADDRESS = "0xb5444f1fafda9a83e712d36d057208275df04d1d";

export const e2eFlow = async (ERC20TESTTOKEN__ADDRESS: string) => {
  const erc20TestToken = ERC20TestToken__factory.connect(
    ERC20TESTTOKEN__ADDRESS,
    provider
  );

  const accountWalletRelayerSigner = AccountWallet__factory.connect(
    ACCOUNTWALLET__ADDRESS,
    RELAYER_WALLET_SIGNER
  );

  const counterContractRelayerSigner = Counter__factory.connect(
    COUNTER_CONTRACT_ADDRESS,
    RELAYER_WALLET_SIGNER
  );

  // Encoded destination contract call
  const { data } =
    await counterContractRelayerSigner.populateTransaction.incrementCount()!;

  // Calculate required gas
  const estimatedGas =
    await accountWalletRelayerSigner.estimateGas.executeTransaction(
      ERC20TESTTOKEN__ADDRESS,
      TREASURE_WALLET_ADDRESS,
      {
        from: ACCOUNTWALLET__ADDRESS,
        to: COUNTER_CONTRACT_ADDRESS,
        value: 0,
        data: data as any,
      }
    );
  console.log("estimatedGas: " + estimatedGas.toString());

  // Get converted ERC20 price for this transaction
  const estimatedFeeInERC20 = await getEstimatedFeeInERC20(estimatedGas);

  // Check balance of Wallet Account for given ERC20
  const accountWalletBalance = await erc20TestToken.balanceOf(
    ACCOUNTWALLET__ADDRESS
  );
  console.log(
    "Account Wallet balance for given ERC20 is: ",
    (await accountWalletBalance).toString()
  );

  if (estimatedFeeInERC20.gt(accountWalletBalance.toString())) {
    throw new Error("Insufficient funds to cover gas fee");
  }

  // Execute transaction
  const tx = await accountWalletRelayerSigner.executeTransaction(
    ERC20TESTTOKEN__ADDRESS,
    TREASURE_WALLET_ADDRESS,
    {
      from: ACCOUNTWALLET__ADDRESS,
      to: COUNTER_CONTRACT_ADDRESS,
      value: 0,
      data: data as any,
    }
  );

  const recipt = await tx.wait();

  console.log(recipt);
};

// Assuming USD stable coins
const getMaticPriceInERC20 = async (): Promise<number> => {
  return axios({
    method: "get",
    url: "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=matic-network",
  }).then((resp) => resp.data["matic-network"].usd);
};

const getGweiGasFee = async (): Promise<{
  maxPriorityFee: number;
  maxFee: number;
  estimatedBaseFee: number;
}> => {
  return axios({
    method: "get",
    url: "https://gasstation-mumbai.matic.today/v2",
  }).then(({ data }: any) => {
    return {
      maxFee: data.fast.maxFee,
      maxPriorityFee: data.fast.maxPriorityFee,
      estimatedBaseFee: data.estimatedBaseFee,
    };
  });
};

const getEstimatedFeeInERC20 = async (
  estimatedGas: BigNumberish
): Promise<BigNumberJs> => {
  const gweiGasFee = await getGweiGasFee();

  console.log("Max fee in gwei: " + gweiGasFee.maxFee);

  const maxFeeBn = new BigNumberJs(gweiGasFee.maxFee);

  const totalGweiGasFee = maxFeeBn.multipliedBy(estimatedGas.toString());

  console.log("Total fee in GWEI: ", totalGweiGasFee.toString());

  const totalMaticGasFee = totalGweiGasFee.dividedBy(10 ** 9);

  console.log("Total fee in MATIC: ", totalMaticGasFee.toString());

  const maticPriceInERC20 = await getMaticPriceInERC20();
  const totalERC20FeeAmount = totalMaticGasFee.multipliedBy(maticPriceInERC20);

  console.log(
    "Total fee in ERC20 (USD stable coin): ",
    // TODO: get ERC20 decimals dinamically
    totalERC20FeeAmount.toFormat(18)
  );

  return totalERC20FeeAmount;
};
