import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    // 배포 전 확인: 최초 URI 및 데이터
    const KUNftName = "Bummy";
    const KUNftSymbol = "BAS";
    const KUAssetLimit = 1500;

    const YUNftName = "Suri";
    const YUNftSymbol = "BAS";
    const YUAssetLimit = 1500;

    const KoreaUnivNFT = await deploy("MyLittleTiger", {
        from: deployer,
        proxy: {
            execute: {
                init: {
                    methodName: "initialize",
                    args: [KUNftName, KUNftSymbol, KUAssetLimit],
                },
            },
        },
        log: true,
        autoMine: true,
    });

    console.log("🐯 고려대학교 NFT 컨트랙트 배포 완료 :D 🐯");
    console.log("컨트랙트 주소: ", KoreaUnivNFT.address);

    const YonseiUnivNFT = await deploy("MyLittleEagle", {
        from: deployer,
        proxy: {
            execute: {
                init: {
                    methodName: "initialize",
                    args: [YUNftName, YUNftSymbol, YUAssetLimit],
                },
            },
        },
        log: true,
        autoMine: true,
    });

    console.log("🦅 연세대학교 NFT 컨트랙트 배포 완료 :D 🦅");
    console.log("컨트랙트 주소: ", YonseiUnivNFT.address);
};

export default func;

func.tags = ["deploy_contract"];
