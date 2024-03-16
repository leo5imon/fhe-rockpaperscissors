import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";

const CreateGame = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function createGame() {
    writeContract({
      address: "0x123667758b62dc474F590a1A065e54E734e2b9DC",
      abi,
      functionName: "createGame",
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div>
      <button disabled={isPending} onClick={createGame}>
        {isPending ? "Processing..." : "Create Game"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && <div>Error: {error.shortMessage || error.message}</div>}
    </div>
  );
};

export default CreateGame;
