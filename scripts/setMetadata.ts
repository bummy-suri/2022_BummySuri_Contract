import { Network, provider, wallet } from "./provider";
import addressInfo from "./addressInfo";
import { ethers } from "ethers";
import { MyLittleTiger, MyLittleEagle } from "../typechain";

// Metadata Link
const koreaBaseURILink = "https://gateway.pinata.cloud/ipfs/QmRqWYevvsX2m8qopRj7oAs4uWLPR2x9bNwVZBf3r5ajAw/";
const yonseiBaseURILink = "https://gateway.pinata.cloud/ipfs/QmPAXpp65V6LBifM1wNbo1NGUQia6KmHYTGNbHzv2wwXWH/";

export const setMetadata = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI, myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const myLittleTigerContract = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider) as MyLittleTiger;
    const myLittleEagleContract = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider) as MyLittleEagle;

    await (
        await myLittleTigerContract.connect(wallet).setBaseURI(koreaBaseURILink, {
            gasLimit: 10000000,
        })
    ).wait();

    await (
        await myLittleEagleContract.connect(wallet).setBaseURI(yonseiBaseURILink, {
            gasLimit: 10000000,
        })
    ).wait();

    console.log("baseURI 세팅이 완료되었습니다 :D");
    console.log(`고려대학교 baseURI Link 확인: ${await myLittleTigerContract.baseURIextended()}`);
    console.log(`연세대학교 baseURI Link 확인: ${await myLittleEagleContract.baseURIextended()}`);
};

setMetadata();
