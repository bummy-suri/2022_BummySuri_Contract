import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const KoreaUnivNFT = await deploy("MyLittleTiger", {
        from: deployer,
        proxy: true,
        log: true,
        autoMine: true,
    });

    console.log("🐯 고려대학교 NFT 컨트랙트 업그레이드 완료 :D 🐯");
    console.log("컨트랙트 주소: ", KoreaUnivNFT.address);

    const YonseiUnivNFT = await deploy("MyLittleEagle", {
        from: deployer,
        proxy: true,
        log: true,
        autoMine: true,
    });

    console.log("🦅 연세대학교 NFT 컨트랙트 업그레이드 완료 :D 🦅");
    console.log("컨트랙트 주소: ", YonseiUnivNFT.address);
};

export default func;

func.tags = ["upgrade_contract"];
