import state from "../state/state";

export default {
  setUsername(state, newVal) {
    state.username = newVal;
  },
  setRolename(state, newVal) {
    state.rolename = newVal;
  },
  setAccountId(state, newVal) {
    state.accountId = newVal;
  },
  setSearchContent(state, newVal) {
    state.searchContent = newVal;
  },
  setMembers(state, newVal) {
    state.members = newVal;
  },
  setMenuList(state, newVal) {
    state.menuList = newVal;
  },
  setRegisterTotal(state, newVal){
    state.registerTotal = newVal
  },
  setSuccessTotal(state, newVal){
    state.successTotal = newVal
  },
  setFailTotal(state, newVal){
    state.failTotal = newVal
  },
  setSocketPort(state, newVal){
    state.socketPort = newVal
  },
  setLanguage(state, newVal){
    state.language = newVal
  },
  setArcFaceServerversion(state, newVal){
    state.arcFaceServerVersion = newVal
  },
  setArcFaceGoversion(state, newVal){
    state.arcFaceGoversion = newVal
  },
  setVersion(state, newVal){
    state.version = newVal
  },
};
