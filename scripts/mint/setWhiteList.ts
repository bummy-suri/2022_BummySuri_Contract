import { Network, provider, wallet } from "../provider";
import addressInfo from "../addressInfo";
import { ethers } from "ethers";

export const setWhiteList = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI, myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const myLittleTigerContract = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider);
    const myLittleEagleContract = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider);

    await (
        await myLittleTigerContract.connect(wallet).setWhiteList(wallet.address, {
            gasLimit: 10000000,
        })
    ).wait();

    await (
        await myLittleEagleContract.connect(wallet).setWhiteList(wallet.address, {
            gasLimit: 10000000,
        })
    ).wait();

    console.log("고려대학교 / 연세대학교 컨트랙트 masterAdmin 화이트리스트 등록 완료 :D");
};

setWhiteList();
