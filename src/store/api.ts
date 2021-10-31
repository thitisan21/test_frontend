import {
    GetterTree,
    ActionTree,
    MutationTree,
    Module,
    Store,
    ActionContext,
} from "vuex";
import { RootState } from ".";
import axios from 'axios';
import User from '@/interfaces/User';

export interface IState {
    dataTable: Array<User>
    dataSize: Number
}

const state = (): IState => ({
    dataTable: [{
        "id": "",
        "name": "",
        "username": "",
        "email": "",
        "street": "",
        "suite": "",
        "city": "",
        "zipcode": "",
        "phone": "",
        "website": ""
    }],
    dataSize: 0
});

const getters: GetterTree<IState, RootState> = {
    dataTable: (state) => state.dataTable,
    dataSize: (state) => state.dataSize,
};

const actions: ActionTree<IState, RootState> = {
    async getUser({ commit }, params) {
        try {
            const { data } = await axios({ method: 'get', params: params, url: `${process.env.VUE_APP_API_PATH}/api/user` });
            commit("setUser", data.data);
            commit("setUserSize", data.size)
            return data
        } catch (error) {
            console.log(error)
        }
    },
};

const mutations: MutationTree<IState> = {
    setUser(state, dataResponse: User[]) {
        state.dataTable = dataResponse;
    },
    setUserSize(state, dataResponse: Number) {
        state.dataSize = dataResponse;
    }
};

const User: Module<IState, RootState> = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};

export default User;
