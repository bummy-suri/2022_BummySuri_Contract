import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MyLittleTiger } from "../typechain";

export interface RT {
    deployer: SignerWithAddress;
    user: SignerWithAddress[];
    myLittleTiger: MyLittleTiger;
}

export const deployNFT = async (): Promise<RT> => {
    const [deployer, ...user] = await ethers.getSigners();

    // sample data
    const NAME = "TEST_NFT";
    const METADATA = "https://gateway.pinata.cloud/ipfs/QmQYMWbP4Y39vDHoTAj3v1Xez5JWPo2AGexH7WGs8h9uTe/";
    const ASSET_LIMIT = 50;

    const MyLittleTigerContract = await ethers.getContractFactory("MyLittleTiger");
    const myLittleTiger = (await upgrades.deployProxy(MyLittleTigerContract, [
        NAME,
        NAME,
        ASSET_LIMIT,
    ])) as MyLittleTiger;
    await myLittleTiger.deployed();

    await myLittleTiger.connect(deployer).setBaseURI(METADATA);

    return {
        deployer,
        user,
        myLittleTiger,
    };
};
