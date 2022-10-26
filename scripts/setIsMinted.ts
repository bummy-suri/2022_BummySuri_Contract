import { Network, provider, wallet } from "./provider";
import addressInfo from "./addressInfo";
import { ethers } from "ethers";
import { MyLittleTiger, MyLittleEagle } from "../typechain";

// const userAddr = "";
const userAddr = "0xed53ee23c578216c22C5Dff8500374827849b81E";

export const setMetadata = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI, myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const myLittleTigerContract = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider) as MyLittleTiger;
    const myLittleEagleContract = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider) as MyLittleEagle;

    console.log("세팅 이전 값 확인 :D");
    console.log(`is MINTED 확인: ${await myLittleTigerContract.isMinted(userAddr)}`);
    console.log(`is MINTED 확인: ${await myLittleEagleContract.isMinted(userAddr)}`);

    await (
        await myLittleTigerContract.connect(wallet).setIsMinted(userAddr, false, {
            gasLimit: 10000000,
        })
    ).wait();

    await (
        await myLittleEagleContract.connect(wallet).setIsMinted(userAddr, false, {
            gasLimit: 10000000,
        })
    ).wait();

    console.log("세팅이 완료되었습니다 :D");
    console.log(`is MINTED 확인: ${await myLittleTigerContract.isMinted(userAddr)}`);
    console.log(`is MINTED 확인: ${await myLittleEagleContract.isMinted(userAddr)}`);
};

setMetadata();
