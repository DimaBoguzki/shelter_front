const NAME_ITEM="User";

const getUser=()=>{
  let employee = window.localStorage.getItem(NAME_ITEM);
  return employee ? JSON.parse(employee) : null;
}

const setUser=(employee)=>{
  window.localStorage.setItem(NAME_ITEM, employee)
};
const clearUser=()=>{
  window.localStorage.removeItem(NAME_ITEM)
}


const userStorage = {
  getUser: getUser,
  setUser: setUser,
  clearUser: clearUser,
}

export default userStorage;