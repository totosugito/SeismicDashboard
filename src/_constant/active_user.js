// utils/active-user.js
const key_active_user = "user";
// const key_selected_user = "selected_user";
// const key_projects = "projects";
// const key_location = "location";

const key_research_user = "research_user";
const key_research_project = "research_projects";
const key_chart_color = "chart_color";

export function researchIsValidUser(item_) {
  if(item_==null) //null data
    return(false);

  if (item_['TOKEN'].length > 2)
    return (true);
  else
    return (false);
}


export function getDefaultColor() {
  let data = JSON.parse(localStorage.getItem(key_chart_color));
  return(data);
}

export function saveDefaultChartColor(chartColor){
  // let chart_color = {
  //   0: chartColor,
  //   1: chartColor,
  //   2: chartColor,
  //   3: chartColor,
  // };
  localStorage.setItem(key_chart_color, JSON.stringify(chartColor)); //save chart color data
  return(chartColor);
}
export function deleteDefaultChartColor(){
  if (localStorage.getItem(key_chart_color) !== null) {
    localStorage.removeItem(key_chart_color);
  }
}

export function researchLogOut()
{
  if (localStorage.getItem(key_research_user) !== null) {
    localStorage.removeItem(key_research_user);
  }
}
export function researchSaveUser(item_)
{
  localStorage.setItem(key_research_user, JSON.stringify(item_)); //save data
}

export function researchGetUser()
{
  let user = JSON.parse(localStorage.getItem(key_research_user));
  return(user);
}
export function researchSaveProjects(item_)
{
  localStorage.setItem(key_research_project, JSON.stringify(item_)); //save data
}
export function researchGetProjects()
{
  return(JSON.parse(localStorage.getItem(key_research_project)));
}


export function isValidUser(item_) {
  if(item_==null) //null data
    return(false);

  if (item_.token.length > 5)
    return (true);
  else
    return (false);
}
export function logOut()
{
  if (localStorage.getItem(key_active_user) !== null) {
    localStorage.removeItem(key_active_user);
  }
}

export function saveUser(item_)
{
  // if(item_.message!=="user already login")
  localStorage.setItem(key_active_user, JSON.stringify(item_)); //save data
}

export function getUser()
{
  let user = JSON.parse(localStorage.getItem(key_active_user));
  return(user);
}

export function saveProspectData(item) {
  localStorage.setItem(item["id"], JSON.stringify(item))
}
export function readProspectData(key_id) {
  let r = localStorage.getItem(key_id);
  return(JSON.parse(r));
}
