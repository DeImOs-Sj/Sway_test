import { useEffect, useState } from "react";
import { useWallet } from "@fuels/react";
import LocalFaucet from "./LocalFaucet";
import { TestContract } from "../sway-api";
import Button from "./Button";
import { isLocal, contractId } from "../lib.tsx";
import { Address, BN } from "fuels"; // Assuming you need to handle large numbers
import { IdentityInput } from "../sway-api/contracts/TestContract.ts";
export default function Contract() {
  const [contract, setContract] = useState<TestContract>();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<string>(""); // Keep it as string initially
  const [balance, setBalance] = useState(""); // New state for balance
  const [transferAmount, setTransferAmount] = useState<string>();
  const [address, setAddress] = useState<string>(); // Keep address as a string for input field

  const { wallet, refetch } = useWallet();

  useEffect(() => {
    if (wallet) {
      const testContract = new TestContract(contractId, wallet);
      setContract(testContract);
    }
  }, [wallet]);

  // Function to deposit funds
  async function depositFunds() {
    if (!wallet || !contract || !amount) return;

    setIsLoading(true);

    try {
      await contract.functions.deposit_funds(amount).call();
      console.log(`Deposited ${amount} units successfully`);
    } catch (error) {
      console.error("Error depositing funds:", error);
    }

    setIsLoading(false);
  }

  async function getContractBalance() {
    if (!wallet || !contract) return;

    try {
      const result = await contract.functions.get_contract_balance().get(); // Call the contract function
      setBalance(result.value.toString()); // Store the balance in state
      console.log(`Contract balance: ${result.value.toString()}`);
    } catch (error) {
      console.error("Error fetching contract balance:", error);
    }
  }

  console.log("transferAmount", transferAmount);
  console.log("address", address);
  async function transferFunds() {
    console.log("hello world");
    console.log("wallet", wallet);
    console.log("contract", contract);
    console.log("amount", transferAmount);
    console.log("address", address);
    if (!wallet || !contract || !transferAmount || !address) return;
    try {
      console.log("hello world2");
      // Ensure transferAmount and address are the correct types
      const addressInput = { bits: Address.fromString(address).toB256() };
      const addressIdentityInput = { Address: addressInput };
      await contract!.functions
        .transfer(addressIdentityInput, parseFloat(transferAmount))
        .txParams({ gasLimit: new BN(1000000) });

      console.log(`Transferred ${amount} units successfully`);
    } catch (error) {
      console.error("Error transferring funds:", error);
    }

    setIsLoading(false);
  }

  return (
    <>
      <div>
        <h3 className="mb-1 text-sm font-medium dark:text-zinc-300/70">
          Enter Amount
        </h3>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-800 rounded-md px-2 py-1 mb-2 font-mono"
          data-testid="amount"
        />
        <Button onClick={depositFunds} disabled={isLoading}>
          Deposit Funds
        </Button>
        <div className="mt-4">
          <Button
            onClick={getContractBalance}
            disabled={isLoading}
            className="text-white"
          >
            Get Contract Balance
          </Button>
          {balance !== null && (
            <p className="mt-2 text-white">Contract Balance: {balance} units</p>
          )}
        </div>
        <p className="text-white">Transfer Amount</p>
        <input
          type="text"
          name=""
          id=""
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)} // Convert to number
        />
      </div>
      <p className="text-white">Enter Address</p>

      <input
        type="text"
        name=""
        id=""
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <Button onClick={transferFunds} disabled={isLoading}>
        Transfer Funds
      </Button>
      <div>
        <p className="pt-2">
          Contracts are a core program type on the Fuel network. You can read
          more about them{" "}
          <a
            href="https://docs.fuel.network/docs/fuels-ts/contracts/"
            className="text-green-500/80 transition-colors hover:text-green-500"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
      </div>

      {isLocal && <LocalFaucet refetch={refetch} />}
    </>
  );
}
