export default class VarRouter {

  status = false;
  approute = {
    "*": ["*", "/404", "Page404"],
    "404": ["404", "/404", "Page404"],
    "500": ["500", "/500", "Page500"],
    "auto-loc": ["auto-loc", "/auto-loc", "Auto GPS Location"],

    "page-qr": ["page-qr", "/page-qr", "QR Page"],
    "forgot-password": ["forgot-password", "/forgot-password", "Forgot Password"],
    "login": ["login", "/login", "Login"],
    "logout": ["logout", "/logout", "Logout"],
    "user-profile": ["user-profile", "/user-profile", "User Profile"],

    "start": ["start", "/start", "Start"],
    "home": ["home", "/home", "Home"],
    "dashboard": ["", "/", "Dashboard"],
    "well": ["well", "/well", "Well"],
    "inline-crossline": ["inline-crossline", "/well/inline-crossline", "Inline & Crossline"],
    "seismicviewer": ["seismicviewer", "/inline-crossline/seismic-viewer", "Seismic Viewer"],
    "geobody": ["geobody", "/geobody", "Geobody"],
    "geobody-info": ["geobody-info", "/geobody/geobody-info", "Geobody Info"],

    "segy-list": ["segy-list", "/segy-list", "SEGY List"],
    "processwizard": ["process-wizard", "/process-wizard", "Process Wizard"],
    "processwizard1": ["process-wizard1", "/process-wizard1", "Process Wizard Step 1"],
    "processwizard2": ["process-wizard2", "/process-wizard2", "Process Wizard Step 2"],
    "processwizard2-1": ["process-wizard2-1", "/process-wizard2-1", "Process Wizard Step 2"],
    "processwizard2-2": ["process-wizard2-2", "/process-wizard2-2", "Process Wizard Step 2"],
    "processwizard3": ["process-wizard3", "/process-wizard3", "Process Wizard Step 3"],
    "processwizard3-1": ["process-wizard3-1", "/process-wizard3-1", "Process Wizard Step 3"],
    "processwizard3-1-pick": ["process-wizard3-1-pick", "/process-wizard3-1-pick", "Process Wizard Step 3"],
    "processwizard3-2": ["process-wizard3-2", "/process-wizard3-2", "Process Wizard Step 3"],
    "processwizard3-3": ["process-wizard3-3", "/process-wizard3-3", "Process Wizard Step 3"],
    "processwizard3-3-ilz": ["process-wizard3-3-ilz", "/process-wizard3-3-ilz", "Process Wizard Step 3"],
    "processwizard4": ["process-wizard4", "/process-wizard4", "Process Wizard Step 4"],
    "processwizard5": ["process-wizard5", "/process-wizard5", "Process Wizard Step 5"],
    "processwizard6": ["process-wizard6", "/process-wizard6", "Process Wizard Step 6"],
  };

  httptype = {
    "area-list": "/api/area/list"
  };

  schematype = {
    "login" : "login",
    "list" : "list",
    "delete" : "delete",
    "schema_create" : "schema_create",
    "create" : "create",
    "schema_update" : "schema_update",
    "update" : "update",
    "schema_detail" : "schema_detail",
    "approve" : "approve",
    "list_summ" : "list_summ",
    "detail" : "detail",
    "search_QRcode" : "search_QRcode",
    "search_fullname" : "search_fullname",
    "subuser_list" : "user_list",
    "extend" : "extend"
  };

  constructor() {
    this.status = true;
  }

  getRoute(strid, idtype) {
    return (this.approute[strid][idtype]);
  }

  getHttpType(strid) {
    return (this.httptype[strid]);
  }
  getSchemaType(strid) {
    return (this.schematype[strid]);
  }
}
