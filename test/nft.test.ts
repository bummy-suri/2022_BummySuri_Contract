import { deployNFT } from "./deploy";
import { MyLittleTiger } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";

describe("NFT 테스트", () => {
    let deployer: SignerWithAddress;
    let user: SignerWithAddress[];
    let myLittleTiger: MyLittleTiger;

    // sample data
    const NAME = "TEST_NFT";
    const METADATA = "https://gateway.pinata.cloud/ipfs/QmQYMWbP4Y39vDHoTAj3v1Xez5JWPo2AGexH7WGs8h9uTe/";
    const ASSET_LIMIT = 3000;

    beforeEach(async () => {
        // contract deployment
        const deployed = await deployNFT();
        deployer = deployed.deployer;
        user = deployed.user;
        myLittleTiger = deployed.myLittleTiger;
    });

    it("initialize 테스트: 초기값 설정이 정상적으로 진행되었는가?", async () => {
        expect(await myLittleTiger.name()).to.equal(NAME);
        expect(await myLittleTiger.symbol()).to.equal(NAME);
        expect(await myLittleTiger.baseURIextended()).to.equal(METADATA);
        expect(await myLittleTiger.assetLimit()).to.equal(ASSET_LIMIT);
        expect(await myLittleTiger.masterAdmin()).to.equal(deployer.address);
    });

    describe("프리민팅 관련 테스트", () => {
        it("테스트: singleMint가 정상적으로 동작하는가?", async () => {
            await myLittleTiger.connect(deployer).singleMint(user[0].address);
            expect(await myLittleTiger.ownerOf(BigNumber.from(1))).to.equal(user[0].address);
            // expect(await myLittleTiger.)
            // expect(await myLittleTiger.tokenURI(BigNumber.from(1))).to.equal
        });
    });
});
