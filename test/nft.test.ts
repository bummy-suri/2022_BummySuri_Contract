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
    const ASSET_LIMIT = 50;

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

    describe("유저 프리민팅 관련 테스트", () => {
        it("테스트: 유저 민팅 로직이 정상적으로 동작하는가?", async () => {
            const num = 1;
            await myLittleTiger.connect(deployer).setWhiteList(user[0].address);
            await myLittleTiger.connect(user[0]).singleMint(user[0].address);

            expect(await myLittleTiger.ownerOf(BigNumber.from(num))).to.equal(user[0].address);
            expect(await myLittleTiger.balanceOf(user[0].address)).to.equal(BigNumber.from(num));
            expect(await myLittleTiger.tokenURI(BigNumber.from(num))).to.equal(METADATA.concat(`${num}.json`));
        });
        it("테스트: 화이트리스트에 없는 유저가 민팅을 시도할 시 Revert되는가?", async () => {
            await expect(myLittleTiger.connect(user[0]).singleMint(user[0].address)).to.be.revertedWith(
                "ContractError: ACCESS_DENIED",
            );
        });
        it("테스트: 화이트리스트 등록이 진행되어 민팅을 받은 유저가 다시 민팅을 시도할 시 Revert되는가?", async () => {
            await myLittleTiger.connect(deployer).setWhiteList(user[0].address);
            await myLittleTiger.connect(user[0]).singleMint(user[0].address);

            await expect(myLittleTiger.connect(user[0]).singleMint(user[0].address)).to.be.revertedWith(
                "ContractError: ACCESS_DENIED",
            );
        });
        it("테스트: ASSET_LIMIT만큼 민팅이 이루어진 후 더 이상 민팅이 되지 않는가?", async () => {
            for (let i = 0; i < ASSET_LIMIT; i++) {
                await myLittleTiger.connect(deployer).setWhiteList(user[0].address);
                await myLittleTiger.connect(user[0]).singleMint(user[0].address);
            }

            await myLittleTiger.connect(deployer).setWhiteList(user[0].address);
            await expect(myLittleTiger.connect(user[0]).singleMint(user[0].address)).to.be.revertedWith(
                "ContractError: ASSET_LIMIT",
            );
        });
    });

    describe("관리자 프리민팅 관련 테스트", () => {
        it("테스트: 관리자 민팅 로직이 정상적으로 동작하는가?", async () => {
            const num = 1;
            await myLittleTiger.connect(deployer).adminMint(user[0].address);

            expect(await myLittleTiger.ownerOf(BigNumber.from(num))).to.equal(user[0].address);
            expect(await myLittleTiger.balanceOf(user[0].address)).to.equal(BigNumber.from(num));
            expect(await myLittleTiger.tokenURI(BigNumber.from(num))).to.equal(METADATA.concat(`${num}.json`));
        });

        it("관리자는 여러 번 민팅이 가능한가?", async () => {
            await myLittleTiger.connect(deployer).adminMint(user[0].address);
            await myLittleTiger.connect(deployer).adminMint(user[0].address);
            await myLittleTiger.connect(deployer).adminMint(user[1].address);

            expect(await myLittleTiger.ownerOf(BigNumber.from(1))).to.equal(user[0].address);
            expect(await myLittleTiger.ownerOf(BigNumber.from(2))).to.equal(user[0].address);
            expect(await myLittleTiger.ownerOf(BigNumber.from(3))).to.equal(user[1].address);
        });
    });

    describe("전송 기능 제한 테스트", () => {
        it("전송 기능 제한 시 다른 유저에게 전송이 불가능한가?", async () => {
            await myLittleTiger.connect(deployer).setTransferBlock(true);

            await myLittleTiger.connect(deployer).setWhiteList(user[0].address);
            await myLittleTiger.connect(user[0]).singleMint(user[0].address);
            await myLittleTiger.connect(user[0]).approve(user[1].address, BigNumber.from(1));

            await expect(
                myLittleTiger.connect(user[1]).transferFrom(user[0].address, user[1].address, BigNumber.from(1)),
            ).to.be.revertedWith("ContractError: TRANSFER_BLOCKED");

            await expect(
                myLittleTiger
                    .connect(user[1])
                    ["safeTransferFrom(address,address,uint256)"](user[0].address, user[1].address, BigNumber.from(1)),
            ).to.be.revertedWith("ContractError: TRANSFER_BLOCKED");

            await expect(
                myLittleTiger
                    .connect(user[1])
                    ["safeTransferFrom(address,address,uint256,bytes)"](
                        user[0].address,
                        user[1].address,
                        BigNumber.from(1),
                        [],
                    ),
            ).to.be.revertedWith("ContractError: TRANSFER_BLOCKED");
        });

        it("전송 기능 해제 시 다시 다른 유저에게 전송이 가능한가?", async () => {
            await myLittleTiger.connect(deployer).setWhiteList(user[0].address);
            await myLittleTiger.connect(user[0]).singleMint(user[0].address);

            await myLittleTiger.connect(deployer).setTransferBlock(true);
            await myLittleTiger.connect(deployer).setTransferBlock(false);

            await myLittleTiger.connect(user[0]).approve(user[1].address, BigNumber.from(1));
            await myLittleTiger.connect(user[1]).transferFrom(user[0].address, user[1].address, BigNumber.from(1));
            expect(await myLittleTiger.ownerOf(BigNumber.from(1))).to.equal(user[1].address);
        });
    });
});
