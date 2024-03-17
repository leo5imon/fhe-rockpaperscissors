import { FallbackProvider, JsonRpcProvider } from "ethers";
import { useMemo } from "react";
import { useClient } from "wagmi";

export function clientToProvider(client) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback") {
    const providers = transport.transports.map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }
  return new JsonRpcProvider(transport.url, network);
}

export function useEthersProvider({ chainId } = {}) {
  const client = useClient({ chainId });
  return useMemo(() => clientToProvider(client), [client]);
}
