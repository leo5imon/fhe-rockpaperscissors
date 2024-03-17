import React, { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";
import { toHex } from "viem";
import { toast } from "sonner";

const MakeMove = ({ fhenixClient }) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function makeMove() {
    const gameId = 0;
    try {
      const encryptedMove = await fhenixClient.encrypt_uint8(3);
      const encryptedMoveHex = toHex(encryptedMove.data);

      toast.info("Transaction initiated");

      writeContract({
        address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
        abi,
        functionName: "makeMove",
        args: [gameId, encryptedMoveHex],
      });
    } catch (e) {
      toast.error(`Error initiating transaction: ${e.message}`);
    }
  }

  useEffect(() => {
    if (hash) {
      toast.success("Transaction submitted, waiting for confirmation.");
    }
    if (error) {
      toast.error(`Transaction failed: ${error.message}`);
    }
  }, [hash, error]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
    
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed!");
    }
  }, [isConfirmed]);

  

  return (
    <div>
      <button disabled={isPending} onClick={makeMove}>
        {isPending ? "Processing..." : "Do scissors"}
      </button>
    </div>
  );
};

export default MakeMove;
