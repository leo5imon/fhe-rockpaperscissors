import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FhenixClient } from "fhenixjs";
import { useEthersProvider } from "../components/useEthersProvider";
import CreateGame from "./createGame";
import JoinGame from "./joinGame";
import MakeMove from "./makeMove";
import styles from "./Dapp.module.css";
import { useReadContract } from "wagmi";
import { useGame } from "../contexts/GameContext";

const Dapp = () => {
  const provider = useEthersProvider({ chainId: 42069 });
  const [fhenixClient, setFhenixClient] = useState(null);
  const { gameId } = useGame();

  const gameRunning = useReadContract({
    address: process.env.NEXT_PUBLIC_RPS_CONTRACT_ADDRESS,
    functionName: "gameId",
  });

  useEffect(() => {
    if (provider) {
      const client = new FhenixClient({ provider });
      setFhenixClient(client);
    }
  }, [provider]);

  return (
    <div className={styles.fullHeight}>
      <div className={styles.rightSection}>
        <ConnectButton />
        <CreateGame />
        <JoinGame />
      </div>
      {fhenixClient && gameId && <MakeMove fhenixClient={fhenixClient} />}
    </div>
  );
};

export default Dapp;
