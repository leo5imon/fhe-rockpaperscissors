import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { defineChain } from "viem";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { FhenixClient } from 'fhenixjs';
import Dapp from "./components/Dapp";

const fhenix_testnet = defineChain({
  id: 42069,
  name: "Fhenix Frontier",
  nativeCurrency: { name: "tFHE", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.testnet.fhenix.zone:7747"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://explorer.testnet.fhenix.zone" },
  }
});

const config = getDefaultConfig({
  appName: "fhe-rockpaperscissors",
  projectId: "YOUR_PROJECT_ID",
  chains: [fhenix_testnet],
  ssr: true
});

const queryClient = new QueryClient();
const fhenixClient = new FhenixClient({provider});

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Dapp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}