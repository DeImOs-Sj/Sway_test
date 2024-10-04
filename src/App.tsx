import { useConnectUI, useIsConnected, useNetwork } from "@fuels/react";
import { useEffect } from "react";

import { useRouter } from "./hooks/useRouter";
import Button from "./components/Button";
import Info from "./components/Info";
import Wallet from "./components/Wallet";
import Contract from "./components/Contract";
import Predicate from "./components/Predicate";
import Script from "./components/Script";
import Faucet from "./components/Faucet";
import { providerUrl } from "./lib.tsx";

function App() {
  const { connect } = useConnectUI();
  const { isConnected, refetch } = useIsConnected();
  const { network } = useNetwork();
  const { view, views, setRoute } = useRouter();
  const isConnectedToCorrectNetwork = network?.url === providerUrl;

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Contract />
    </>
  );
}

export default App;
