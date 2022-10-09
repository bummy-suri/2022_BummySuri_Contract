import { contracts as baobabContracts } from "../deployments/baobab.json";

const addressInfo: {
    [key: string]: { myLittleTigerAddr: string; myLittleTigerABI: any };
} = {
    baobab: {
        myLittleTigerAddr: baobabContracts.MyLittleTiger.address,
        myLittleTigerABI: baobabContracts.MyLittleTiger.abi,
    },
    cypress: {
        // TODO: cypress 추가
        myLittleTigerAddr: "",
        myLittleTigerABI: "",
    },
};

export default addressInfo;
