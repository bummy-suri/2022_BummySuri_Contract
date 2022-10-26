import { Network, provider, wallet } from "./provider";
import addressInfo from "./addressInfo";
import { ethers, BigNumber } from "ethers";
import { MyLittleTiger, MyLittleEagle } from "../typechain";

export const setAssetLimit = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI, myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const myLittleTigerContract = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider) as MyLittleTiger;
    const myLittleEagleContract = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider) as MyLittleEagle;

    await (
        await myLittleTigerContract.connect(wallet).setAssetLimit(BigNumber.from(1800), {
            gasLimit: 10000000,
        })
    ).wait();

    await (
        await myLittleEagleContract.connect(wallet).setAssetLimit(BigNumber.from(1800), {
            gasLimit: 10000000,
        })
    ).wait();

    console.log("Asset Limit 세팅이 완료되었습니다 :D");
    console.log(`고려대학교 assetLimit 확인: ${await myLittleTigerContract.assetLimit()}`);
    console.log(`연세대학교 assetLimit 확인: ${await myLittleEagleContract.assetLimit()}`);
};

setAssetLimit();
