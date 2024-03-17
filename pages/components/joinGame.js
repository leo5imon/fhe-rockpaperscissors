import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import React, { useEffect, useState } from "react";
import abi from "../../contracts/abi.json";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import styles from "./JoinGame.module.css";
import { useGame } from '../contexts/GameContext'; 

const JoinGame = () => {
  const [idValue, setIdValue] = useState("");
  const { setGameId } = useGame();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const validId = /^\d+$/.test(idValue);

  async function joinGame() {
    try {
      toast.info("Joining game...");
      writeContract({
        address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
        abi,
        functionName: "joinGame",
        args: [idValue],
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
      setGameId(idValue);
    }
  }, [isConfirmed, idValue, setGameId]);

  return (
    <div className={styles.joinGameContainer}>
      <Input
        type="text"
        id="id"
        placeholder="Id"
        value={idValue}
        onChange={(e) => setIdValue(e.target.value)}
      />
      <Button disabled={isPending || !validId} onClick={joinGame}>
        {isPending ? "Processing..." : "Join Game"}
      </Button>
    </div>
  );
};
export default JoinGame;
