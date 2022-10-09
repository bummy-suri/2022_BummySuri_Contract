import { ethers } from "ethers";

// Types
export type Network = "baobab" | "cypress";

type providerType = ethers.providers.JsonRpcProvider;
type walletType = ethers.Wallet;

// 배포 환경, 체인별 정보
export const rpcInfo: {
    [key in Network]: {
        url: string;
        chainId: number;
    };
} = {
    baobab: {
        url: "https://public-node-api.klaytnapi.com/v1/baobab",
        chainId: 1001,
    },
    cypress: {
        // TODO: 추가 필요
        url: "",
        chainId: 9999,
    },
};

const account = process.env.DEPLOYER_ACCOUNT;
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

if (!privateKey) throw new Error("개인키를 불러올 수 없습니다. 환경변수를 확인하세요.");
if (!account) throw new Error("계정을 불러올 수 없습니다. 환경변수를 확인하세요.");

const getProvider = () => {
    const network = process.env.NETWORK as Network;
    return new ethers.providers.JsonRpcProvider(rpcInfo[network].url);
};

export const provider = getProvider() as providerType;
export const wallet = new ethers.Wallet(privateKey, getProvider()) as walletType;
