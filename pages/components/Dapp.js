import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FhenixClient } from "fhenixjs";
import { useEthersProvider } from "../components/useEthersProvider";
import CreateGame from "./createGame";
import JoinGame from "./joinGame";
import MakeMove from "./makeMove";
import styles from "./Dapp.module.css";
import { useReadContract } from "wagmi";

const Dapp = () => {
  const provider = useEthersProvider({ chainId: 42069 });
  const [fhenixClient, setFhenixClient] = useState(null);

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
      <div className={styles.topBar}>
        <h1>FHE Rock Paper Scissors</h1>
        <div className={styles.rightSection}>
          <ConnectButton />
          <div className={styles.actionButtons}>
            <CreateGame />
            <JoinGame />
          </div>
        </div>
      </div>
      {fhenixClient && <MakeMove fhenixClient={fhenixClient} />}
    </div>
  );
};

export default Dapp;
