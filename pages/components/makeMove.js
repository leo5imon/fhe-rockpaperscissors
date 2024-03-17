import React, { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "../../contracts/abi.json";
import { toHex } from "viem";
import { toast } from "sonner";
import Image from 'next/image';
import styles from './MakeMove.module.css';
import { useGame } from '../contexts/GameContext'; 

const MakeMove = ({ fhenixClient }) => {
  const { gameId } = useGame();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function handleMove(move) {
    if (!gameId) {
      console.error("Game ID is not set");
      return;
    }
    try {
      const encryptedMove = await fhenixClient.encrypt_uint8(move);
      const encryptedMoveHex = toHex(encryptedMove.data);

      toast.info("Transaction initiated");

      writeContract({
        address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
        abi,
        functionName: "makeMove",
        args: [gameId, encryptedMoveHex],
      });
    } catch (e) {
      toast.error(`Error initiating transaction`);
    }
  }

  useEffect(() => {
    if (hash) {
      toast.success("Transaction submitted, waiting for confirmation.");
    }
    if (error) {
      toast.error(`Transaction failed`);
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
    <div className={styles.container}>
      <h2 className={styles.heading}>Pick Your Move</h2>
      <div className={styles.choices}>
        <button onClick={() => handleMove(1)} className={styles.choiceButton}>
          <Image src="/rock.png" alt="Rock" width="100" height="100" />
        </button>
        <button onClick={() => handleMove(2)} className={styles.choiceButton}>
          <Image src="/paper.png" alt="Paper" width="100" height="100" />
        </button>
        <button onClick={() => handleMove(3)} className={styles.choiceButton}>
          <Image src="/scissors.png" alt="Scissors" width="100" height="100" />
        </button>
      </div>
    </div>
  );
};

export default MakeMove;
