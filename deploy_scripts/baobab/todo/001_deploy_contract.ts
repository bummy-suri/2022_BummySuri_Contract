import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    // 배포 전 확인: 최초 URI 및 데이터
    const testURI = "QmQYMWbP4Y39vDHoTAj3v1Xez5JWPo2AGexH7WGs8h9uTe";
    const assetLimit = 3000;

    const MyLittleTiger = await deploy("MyLittleTiger", {
        from: deployer,
        proxy: {
            execute: {
                init: {
                    methodName: "initialize",
                    args: [testURI, assetLimit],
                },
            },
        },
        log: true,
        autoMine: true,
    });
};

export default func;

func.tags = ["deploy_contract"];
