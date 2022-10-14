import { Network, provider, wallet } from "./provider";
import addressInfo from "./addressInfo";
import { ethers } from "ethers";

// Metadata Link
const baseURILink = "https://gateway.pinata.cloud/ipfs/QmRqWYevvsX2m8qopRj7oAs4uWLPR2x9bNwVZBf3r5ajAw/";

export const setMetadata = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI } = addressInfo[network];
    const MyLittleTiger = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider);

    await (
        await MyLittleTiger.connect(wallet).setBaseURI(baseURILink, {
            gasLimit: 10000000,
        })
    ).wait();

    console.log("baseURI 세팅이 완료되었습니다 :D");
    console.log(`baseURI Link 확인: ${await MyLittleTiger.baseURIextended()}`);
};

setMetadata();
