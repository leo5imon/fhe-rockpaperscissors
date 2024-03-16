import React, { useEffect } from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FhenixClient } from "fhenixjs";
import { useEthersProvider } from "../components/useEthersProvider";
import CreateGame from './createGame';

const Dapp = () => {
  const provider = useEthersProvider({ chainId: 42069 });

  useEffect(() => {
    if (provider) {
      const fhenixClient = new FhenixClient({ provider });
      console.log(fhenixClient);
    }
  }, [provider]);

  return (
    <div>
      <ConnectButton />
      <CreateGame />
    </div>
  );
};

export default Dapp;