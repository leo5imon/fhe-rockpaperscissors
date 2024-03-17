import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";

const MakeMove = ({ fhenixClient }) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function makeMove() {

    const gameId = 0;
    const encryptedAmount = await fhenixClient.encrypt_uint8(3);
    const hexEncryptedAmount = encryptedAmount.data;

    console.log(hexEncryptedAmount);
    writeContract({
      address: "0x2dcc1128351d6ec9C7f911b2D982eE4C1883Bb45",
      abi,
      functionName: "makeMove",
      args: [hexEncryptedAmount],
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