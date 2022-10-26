import { Network, provider, wallet } from "./provider";
import addressInfo from "./addressInfo";
import { ethers, BigNumber } from "ethers";
import { MyLittleTiger, MyLittleEagle } from "../typechain";

// 팀 물량 수령 대상
const recipient = [
    "0xF26060c3433da01364A8Da79e3011f0d4A94b6Fc",
    "0xe870C9AE3FAe95111976957fc675967f9ab1f9d3",
    "0x3a8b0A5c7C39b795A7eDBdC4589cF2698b053142",
    "0x61356FC38DBE2768f8ca169ED033d7B19e6635D1",
    "0x0F1e5b64D2B1E13051BfF4093701FdBaB13c4308",
    "0x3AF3B3e2b69a18F7fa323a980D7676885ed19013",
    "0x72FB608efA178D73f1e1deC2D39F631AAD785480",
    "0xA238aFb13554419659B32eC9DAE8Cdec9664d0bD",
    "0x049d792764C71F62B8c79c7aa36444020DBfCc3d",
    "0x9f37B10311e3258be9b88cA117Ef8e272abE89b6",
    "0x7E78501Dbb35427D85e17fEC28b5c8A552AB438e",
];

export const transferTeamAmount = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI, myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const myLittleTigerContract = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider) as MyLittleTiger;
    const myLittleEagleContract = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider) as MyLittleEagle;

    for (let i = 0; i < recipient.length; i++) {
        console.log(`NFT 팀 물량 민팅: to => ${recipient[i]}😎`);
        await (
            await myLittleTigerContract.connect(wallet).adminMint(recipient[i], BigNumber.from(4), {
                gasLimit: 10000000,
            })
        ).wait();
        console.log(`NFT 팀 물량 민팅: to => ${recipient[i]}😎`);
        await (
            await myLittleEagleContract.connect(wallet).adminMint(recipient[i], BigNumber.from(4), {
                gasLimit: 10000000,
            })
        ).wait();

        console.log("민팅이 완료되었습니다 :D");
        console.log(`버미 총 발행량 확인: ${await myLittleTigerContract.totalSupply()}`);
        console.log(`수리 총 발행량 확인: ${await myLittleEagleContract.totalSupply()}`);
    }

    console.log("! 프로젝트 팀 물량 민팅 완료 !");
};

transferTeamAmount();
