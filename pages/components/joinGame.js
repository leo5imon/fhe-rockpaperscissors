import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import React, { useEffect } from "react";
import abi from "../../contracts/abi.json";
import { toast } from "sonner";

const JoinGame = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function joinGame() {
    try {
      toast.info("Joining game...");
      writeContract({
        address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
        abi,
        functionName: "joinGame",
        args: [0],
      });
    } catch (e) {
      toast.error(`Error initiating join game transaction: ${e.message}`);
    }
  }

  useEffect(() => {
    if (hash) {
      toast.success(
        "Join game transaction submitted, waiting for confirmation."
      );
    }
    if (error) {
      toast.error(`Join game transaction failed: ${error.message}`);
    }
  }, [hash, error]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
    
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Successfully joined the game!");
    }
  }, [isConfirmed]);

  

  return (
    <div>
      <button disabled={isPending} onClick={joinGame}>
        {isPending ? "Processing..." : "Join Game"}
      </button>
    </div>
  );
};

export default JoinGame;
