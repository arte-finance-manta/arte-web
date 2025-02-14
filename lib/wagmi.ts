import { http, createConfig } from "wagmi"
import { mantaSepoliaTestnet } from "wagmi/chains"
import { bitgetWallet, coinbaseWallet, metaMaskWallet, okxWallet, rabbyWallet, rainbowWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

export const projectId = "04251f8180896efb96c57a0984864657"

const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [
                okxWallet,
                rabbyWallet,
            ]
        },
        {
            groupName: "Others",
            wallets: [
                walletConnectWallet,
                metaMaskWallet,
                coinbaseWallet,
                rainbowWallet,
                bitgetWallet,
            ],
        },
    ],
    { appName: "RainbowKit App", projectId: projectId },
);

export const config = createConfig({
    chains: [mantaSepoliaTestnet],
    connectors: connectors,
    transports: {
        [mantaSepoliaTestnet.id]: http("https://pacific-rpc.sepolia-testnet.manta.network/http")
    }
})