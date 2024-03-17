import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";
import { isBytes, isHex, toHex, toBytes } from "viem";
import { useAccount } from 'wagmi'

const MakeMove = ({ fhenixClient }) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function makeMove() {
    const gameId = 0;
    const encryptedValue = await fhenixClient.encrypt_uint8(3);
    const encryptedMoveHex = toBytes(encryptedValue.data);
    
    console.log(encryptedMoveHex);
    writeContract({
      address: "0x2E309f9C8A707C1d9840dde8d3d00Fffd0be4e33",
      abi,
      functionName: "makeMove",
      args: [`0x${encryptedMoveHex}`],
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

export default MakeMove