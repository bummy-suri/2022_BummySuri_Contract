import { Network, provider, wallet } from "./provider";
import addressInfo from "./addressInfo";
import { ethers } from "ethers";
import { MyLittleTiger, MyLittleEagle } from "../typechain";

// Metadata Link
const koreaBaseURILink = "https://nftmetadata2022.s3.ap-northeast-2.amazonaws.com/metadata/";
const yonseiBaseURILink = "https://nftmetadata2022.s3.ap-northeast-2.amazonaws.com/metadata_suri/";

export const setMetadata = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI, myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const myLittleTigerContract = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider) as MyLittleTiger;
    const myLittleEagleContract = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider) as MyLittleEagle;

    await (
        await myLittleTigerContract.connect(wallet).setInitialReEntrancyValue({
            gasLimit: 10000000,
        })
    ).wait();

    await (
        await myLittleEagleContract.connect(wallet).setInitialReEntrancyValue({
            gasLimit: 10000000,
        })
    ).wait();

    console.log("세팅이 완료되었습니다 :D");
    console.log(`고려대학교 value 확인: ${await myLittleTigerContract.unlocked()}`);
    console.log(`연세대학교 value 확인: ${await myLittleEagleContract.unlocked()}`);
};

setMetadata();
