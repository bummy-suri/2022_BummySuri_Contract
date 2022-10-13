import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    // 배포 전 확인: 최초 URI 및 데이터
    const nftName = "Bumi And Suri Test";
    const nftSymbol = "BAS";
    const testURI = "https://gateway.pinata.cloud/ipfs/QmRqWYevvsX2m8qopRj7oAs4uWLPR2x9bNwVZBf3r5ajAw/";
    const assetLimit = 3000;

    const MyLittleTiger = await deploy("MyLittleTiger", {
        from: deployer,
        proxy: {
            execute: {
                init: {
                    methodName: "initialize",
                    args: [nftName, nftSymbol, testURI, assetLimit],
                },
            },
        },
        log: true,
        autoMine: true,
    });

    console.log("🐯 MyLittleTiger NFT 컨트랙트 배포 완료 :D 🐯");
    console.log("컨트랙트 Address: ", MyLittleTiger.address);
};

export default func;

func.tags = ["deploy_contract"];
