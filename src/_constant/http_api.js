import axios from "axios";

const DEBUG_MODE = false;
const DEBUG_SERVER = true;
const SERVER_DEVEL = 2;
// const DEBUG_MODE = false;
// const DEBUG_SERVER = false;

export function appDebugMode() {
  return (DEBUG_MODE);
}
export function appDebugServer() {
  return (DEBUG_SERVER);
}

export function url_http_post(userData) {
  return axios.post(getApronServerAPI() + '/app-scripts', userData);
}

export function getDefaultUserIcon()
{
  return("https://storage.googleapis.com/public-datas/user_icon.png");
}

export function getApronPinMarker()
{
  return("https://storage.googleapis.com/public-datas/pin_location.png");
}

export function getMarkerColor(item, statusSetting)
{
  let idx = item.state;
  let n = statusSetting['marker_color'].length;
  if(idx>=n)
    return (statusSetting['marker_color'][n-1])
  return(statusSetting['marker_color'][idx]);
}

export function getMapServer()
{
  return ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  // return ('http://117.54.250.86:8080/styles/osm-bright/{z}/{x}/{y}.png');
}

export function getApronServerAPI()
{
  if (SERVER_DEVEL === 1)
  {
    return ('http://jasdig.com:5154'); // return ('http://jasdig.com:5155');
  }
  else if(SERVER_DEVEL === 0)
  {
    return ('https://rest.dazbor.com/'); //'http://jasdig.com:5156/apron/api';
  }
  else
    return ('http://192.168.99.51:5151/')
}

export function create_auth_header()
{
  let auth_headers = {
    // 'Authorization': 'Bearer ' + userData['token'],
    // 'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  return(auth_headers);
}

export function auto_error_message_parse(error)
{
  // console.log('Error no valid: ', error);
  let str_msg = "Error Network";
  let n = 100;
  if (error !== undefined)
  {
    error = JSON.stringify(error);
    if (error.length > n)
      str_msg = error.substr(0, n);
    else
      str_msg = error;
  }
  return(str_msg);
}

export function url_http_get_with_header(url_api, header, userData)
{
  return axios.get(getApronServerAPI() + url_api, userData,
    {
      headers: header
    });
}
