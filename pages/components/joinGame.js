import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";

const JoinGame = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function joinGame() {
    writeContract({
      address: "0x2dcc1128351d6ec9C7f911b2D982eE4C1883Bb45",
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
