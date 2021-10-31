import Vue from "vue";
import Vuex from "vuex";
import api from "./api";
Vue.use(Vuex);
import { StoreOptions } from "vuex";

export interface RootState { }
export type TMapState<T> = Partial<Record<keyof T, (state: T) => T[keyof T]>>;

// export type TGetters<T> = Partial<Record<keyof T, (state: T) => T[keyof T]>>;

const moduleIndex: StoreOptions<RootState> = {
  modules: { api },
};
export default new Vuex.Store(moduleIndex);