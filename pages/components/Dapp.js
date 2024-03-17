import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FhenixClient } from "fhenixjs";
import { useEthersProvider } from "../components/useEthersProvider";
import CreateGame from "./createGame";
import JoinGame from "./joinGame";
import MakeMove from "./makeMove";

const Dapp = () => {
  const provider = useEthersProvider({ chainId: 42069 });
  const [fhenixClient, setFhenixClient] = useState(null);

  useEffect(() => {
    if (provider) {
      const client = new FhenixClient({ provider });
      setFhenixClient(client);
    }
  }, [provider]);

  return (
    <div>
      <ConnectButton />
      <CreateGame />
      <JoinGame />
      {fhenixClient && <MakeMove fhenixClient={fhenixClient} />}
    </div>
  );
};

export default Dapp;
