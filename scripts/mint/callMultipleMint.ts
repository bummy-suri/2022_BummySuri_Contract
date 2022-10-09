import { Network, provider, wallet } from "../provider";
import addressInfo from "../addressInfo";
import { ethers, BigNumber } from "ethers";

// NFT 수령 대상
const getter = "0xf2616B64972Df1CfDD5301cc95dc3c07979CdA81";
// 민팅 개수
const mintNum = BigNumber.from("10");

export const callMultipleMint = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI } = addressInfo[network];
    const MyLittleTiger = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider);

    console.log(`🐅고려대학교🐅 NFT 민팅(1개 주소에 여러 개 민팅): to => ${getter}😎`);
    await (
        await MyLittleTiger.connect(wallet).multipleMint(getter, mintNum, {
            gasLimit: 10000000,
        })
    ).wait();

    console.log("민팅이 완료되었습니다 :D");
    console.log(`총 발행량 확인: ${await MyLittleTiger.totalSupply()}`);
};

callMultipleMint();
