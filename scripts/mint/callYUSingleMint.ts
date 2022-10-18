import { Network, provider, wallet } from "../provider";
import addressInfo from "../addressInfo";
import { ethers } from "ethers";

// NFT 수령 대상
const getter = "0xf2616B64972Df1CfDD5301cc95dc3c07979CdA81";

export const callYUSingleMint = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const myLittleEagleContract = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider);

    console.log(`🦅연세대학교🦅 NFT 민팅(1개 주소에 1개 민팅): to => ${getter}😎`);
    await (
        await myLittleEagleContract.connect(wallet).singleMint(getter, {
            gasLimit: 10000000,
        })
    ).wait();

    console.log("민팅이 완료되었습니다 :D");
    console.log(`총 발행량 확인: ${await myLittleEagleContract.totalSupply()}`);
};

callYUSingleMint();
