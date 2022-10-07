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
    const ASSET_LIMIT = 300;

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
            const num = 1;
            await myLittleTiger.connect(deployer).singleMint(user[0].address);
            expect(await myLittleTiger.ownerOf(BigNumber.from(num))).to.equal(user[0].address);
            expect(await myLittleTiger.balanceOf(user[0].address)).to.equal(BigNumber.from(num));
            expect(await myLittleTiger.tokenURI(BigNumber.from(num))).to.equal(METADATA.concat(`${num}`));
        });
        it("테스트: multipleMint가 정상적으로 동작하는가?", async () => {
            const num = 3;
            await myLittleTiger.connect(deployer).multipleMint(user[0].address, BigNumber.from(num));
            for (let i = 0; i < num; i++) {
                expect(await myLittleTiger.ownerOf(BigNumber.from(i + 1))).to.equal(user[0].address);
            }
            expect(await myLittleTiger.balanceOf(user[0].address)).to.equal(BigNumber.from(num));
        });
        it("테스트: ASSET_LIMIT만큼 민팅이 이루어진 후 더 이상 민팅이 되지 않는가?", async () => {
            for (let i = 0; i < ASSET_LIMIT; i++) {
                await myLittleTiger.connect(deployer).singleMint(user[0].address);
            }
            await expect(myLittleTiger.connect(deployer).singleMint(user[0].address)).to.be.revertedWith(
                "MLTContract: ASSET_LIMIT",
            );
        });
    });
});
