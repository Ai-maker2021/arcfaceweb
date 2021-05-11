export default {
  setUsername(store, data) {
    store.commit("setUsername", data);
  },
  setRolename(store, data) {
    store.commit("setRolename", data);
  },
  setAccountId(store, data) {
    store.commit("setAccountId", data);
  },
  setMenuList(store, data) {
    store.commit("setMenuList", data);
  },
  setRegisterTotal(store, data){
    store.commit("setRegisterTotal", data);
  },
  setSuccessTotal(store, data){
    store.commit("setSuccessTotal", data);
  },
  setFailTotal(store, data){
    store.commit("setFailTotal", data);
  },
  setSocketPort(store, data){
    store.commit("setSocketPort", data);
  },
  setArcFaceGoversion(store, data){
    store.commit("setArcFaceGoversion", data);
  },
  setArcFaceServerversion(store, data){
    store.commit("setArcFaceServerversion", data);
  },
  setVersion(store, data){
    store.commit("setVersion", data);
  },
};
