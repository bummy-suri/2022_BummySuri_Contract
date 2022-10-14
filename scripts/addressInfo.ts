import { contracts as baobabContracts } from "../deployments/baobab.json";
import { contracts as cypressContracts } from "../deployments/cypress.json";

const addressInfo: {
    [key: string]: {
        myLittleTigerAddr: string;
        myLittleTigerABI: any;
        myLittleEagleAddr: string;
        myLittleEagleABI: any;
    };
} = {
    baobab: {
        myLittleTigerAddr: baobabContracts.MyLittleTiger.address,
        myLittleTigerABI: baobabContracts.MyLittleTiger.abi,
        myLittleEagleAddr: baobabContracts.MyLittleEagle.address,
        myLittleEagleABI: baobabContracts.MyLittleEagle.abi,
    },
    cypress: {
        myLittleTigerAddr: cypressContracts.MyLittleTiger.address,
        myLittleTigerABI: cypressContracts.MyLittleTiger.abi,
        myLittleEagleAddr: cypressContracts.MyLittleEagle.address,
        myLittleEagleABI: cypressContracts.MyLittleEagle.abi,
    },
};

export default addressInfo;
