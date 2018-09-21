const SET_HASH_STORE_CONTRACT_INSTANCE = 'blockchain/SET_HASH_STORE_CONTRACT_INSTANCE';
const SET_PROOF_STORE_CONTRACT_INSTANCE = 'blockchain/SET_PROOF_STORE_CONTRACT_INSTANCE';
const SET_WEB3 = 'blockchain/SET_WEB3';
const SET_IPFS = 'blockchain/SET_IPFS';
const SET_ADDRESS = 'blockchain/SET_ADDRESS';

// Reducers
const initialState = {
    hashStoreContractInstance: null,
    web3: null,
    address: null
};

export default (state=initialState, action) => {
    switch (action.type) {

        case SET_HASH_STORE_CONTRACT_INSTANCE:
            return {
                ...state,
                hashStoreContractInstance: action.hashStoreContractInstance.hashStoreContractInstance
            };

        case SET_PROOF_STORE_CONTRACT_INSTANCE:
            return {
                ...state,
                proofStoreContractInstance: action.proofStoreContractInstance.proofStoreContractInstance
            };

        case SET_WEB3:
            return {
                ...state,
                web3: action.web3.web3
            };

        case SET_IPFS:
            return {
                ...state,
                ipfs: action.ipfs.ipfs
            };

        case SET_ADDRESS:
            return {
                ...state,
                address: action.address.address
            };

        default:
            return state;
    }
}

export const setHashStoreContractInstance = (hashStoreContractInstance) => (dispatch) => {
    dispatch({
        type: SET_HASH_STORE_CONTRACT_INSTANCE,
        hashStoreContractInstance
    });
};

export const setProofStoreContractInstance = (proofStoreContractInstance) => (dispatch) => {
    dispatch({
        type: SET_PROOF_STORE_CONTRACT_INSTANCE,
        proofStoreContractInstance
    });
};

export const setWeb3Instance = (web3) => (dispatch) => {
    dispatch({
        type: SET_WEB3,
        web3
    });
};

export const setIpfsInstance = (ipfs) => (dispatch) => {
    dispatch({
        type: SET_IPFS,
        ipfs
    });
};

export const setAddressInstance = (address) => (dispatch) => {
    dispatch({
        type: SET_ADDRESS,
        address
    });
};