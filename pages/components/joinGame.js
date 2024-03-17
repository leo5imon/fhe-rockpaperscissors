import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";

const JoinGame = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function joinGame() {
    writeContract({
      address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
      abi,
      functionName: "joinGame",
      args: [0],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div>
      <button disabled={isPending} onClick={joinGame}>
        {isPending ? "Processing..." : "Join Game"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && <div>Error: {error.shortMessage || error.message}</div>}
    </div>
  );
};

export default JoinGame;
