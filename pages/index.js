import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { defineChain } from "viem";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Dapp from "./components/Dapp";
import { Toaster } from "@/components/ui/sonner"

require('dotenv').config();

const fhenixTestnet = defineChain({
  id: 42069,
  name: "Fhenix Frontier",
  nativeCurrency: { name: "tFHE", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.testnet.fhenix.zone:7747"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.testnet.fhenix.zone",
    },
  },
});

const config = getDefaultConfig({
  appName: "fhe-rockpaperscissors",
  projectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID,
  chains: [fhenixTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Dapp />
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
