import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";
import { toHex } from "viem";

const MakeMove = ({ fhenixClient }) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function makeMove() {
    const gameId = 0;
    const encryptedMove = await fhenixClient.encrypt_uint8(3);
    const encryptedMoveHex = toHex(encryptedMove.data);

    writeContract({
      address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
      abi,
      functionName: "makeMove",
      args: [encryptedMoveHex],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div>
      <button disabled={isPending} onClick={makeMove}>
        {isPending ? "Processing..." : "Do scissors"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && <div>Error: {error.shortMessage || error.message}</div>}
    </div>
  );
};

export default MakeMove;
