import React, { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import styles from "./CreateGame.module.css";
import { useGame } from '../contexts/GameContext'; 
import { useTransactionReceipt } from 'wagmi'

const CreateGame = () => {
  const { data: hash, error, transactionReceipt, isPending, writeContract } = useWriteContract();

  async function createGame() {
    try {
      toast.info("Creating game...");
      writeContract({
        address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
        abi,
        functionName: "createGame",
      });
    } catch (e) {
      toast.error(`Error initiating game creation: ${e.message}`);
    }
  }

  useEffect(() => {
    if (hash) {
      toast.success("Game creation submitted, waiting for confirmation.");
    }
    if (error) {
      toast.error(`Game creation failed: ${error.message}`);
    }
  }, [hash, error]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    });
    
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Your game ID is : ");
    }
  }, [isConfirmed]);

  return (
    <div className={styles.createGameContainer}>
      <Button disabled={isPending} onClick={createGame}>
        {isPending ? "Processing..." : "Create Game"}
      </Button>
    </div>
  );
};

export default CreateGame;
