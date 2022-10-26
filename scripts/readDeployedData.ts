import { Network, provider, wallet } from "./provider";
import addressInfo from "./addressInfo";
import { ethers, BigNumber } from "ethers";

export const readDeployedData = async () => {
    const network = process.env.NETWORK as Network;
    const { myLittleTigerAddr, myLittleTigerABI } = addressInfo[network];
    const MyLittleTiger = new ethers.Contract(myLittleTigerAddr, myLittleTigerABI, provider);

    console.log("Name: ", await MyLittleTiger.name());
    console.log("Symbol: ", await MyLittleTiger.symbol());
    console.log("Asset Limit: ", (await MyLittleTiger.assetLimit()).toString());
    console.log("TotalSupply: ", (await MyLittleTiger.totalSupply()).toString());
    console.log("MasterAdmin: ", await MyLittleTiger.masterAdmin());
    console.log("URISet: ", await MyLittleTiger.uriSet());
    console.log("baseURI: ", await MyLittleTiger.baseURIextended());
    console.log("Transfer Check: ", await MyLittleTiger.isTransferBlocked());
    console.log("Admin WhiteList Check: ", await MyLittleTiger.isWhiteListed(wallet.address));
    console.log("1st metadata url: ", await MyLittleTiger.tokenURI(BigNumber.from(1)));

    console.log("정보를 모두 조회하였습니다. :D");

    const { myLittleEagleAddr, myLittleEagleABI } = addressInfo[network];
    const MyLittleEagle = new ethers.Contract(myLittleEagleAddr, myLittleEagleABI, provider);

    console.log("Name: ", await MyLittleEagle.name());
    console.log("Symbol: ", await MyLittleEagle.symbol());
    console.log("Asset Limit: ", (await MyLittleEagle.assetLimit()).toString());
    console.log("TotalSupply: ", (await MyLittleEagle.totalSupply()).toString());
    console.log("MasterAdmin: ", await MyLittleEagle.masterAdmin());
    console.log("URISet: ", await MyLittleEagle.uriSet());
    console.log("baseURI: ", await MyLittleEagle.baseURIextended());
    console.log("Transfer Check: ", await MyLittleEagle.isTransferBlocked());
    console.log("Admin WhiteList Check: ", await MyLittleEagle.isWhiteListed(wallet.address));
    console.log("1st metadata url: ", await MyLittleEagle.tokenURI(BigNumber.from(1)));

    console.log("정보를 모두 조회하였습니다. :D");
};

readDeployedData();
