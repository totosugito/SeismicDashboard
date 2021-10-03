export default class VarRouter {

  status = false;
  approute = {
    "*": ["*", "/404", "Page404"],
    "404": ["404", "/404", "Page404"],
    "500": ["500", "/500", "Page500"],
    "auto-loc": ["auto-loc", "/auto-loc", "Auto GPS Location"],

    "dashboard-login": ["dashboard-login", "/dashboard-login", "Login"],
    "dashboard": ["", "/", "Dashboard"],

    "page-qr": ["page-qr", "/page-qr", "QR Page"],
    "forgot-password": ["forgot-password", "/forgot-password", "Forgot Password"],
    "login": ["login", "/login", "Login"],
    "logout": ["logout", "/logout", "Logout"],
    "user-profile": ["user-profile", "/user-profile", "User Profile"],

    "start": ["start", "/start", "Start"],
    "home": ["home", "/home", "Home"],
    "well": ["well", "/well", "Well"],
    "inline-crossline": ["inline-crossline", "/well/inline-crossline", "Inline & Crossline"],
    "seismicviewer": ["seismicviewer", "/inline-crossline/seismic-viewer", "Seismic Viewer"],
    "geobody": ["geobody", "/geobody", "Geobody"],
    "geobody-info": ["geobody-info", "/geobody/geobody-info", "Geobody Info"],

    "admin-dashboard": ["admin-dashboard", "/admin-dashboard", "Admin Dashboard"],
    "admin-area-list": ["admin-area-list", "/admin-area-list", "Admin Area"],
    "admin-segy-list": ["admin-segy-list", "/admin-segy-list", "Admin SEGY"],
    "admin-geobody-list": ["admin-geobody-list", "/admin-geobody-list", "Admin Geobody"],
    "admin-mlmodel-list": ["admin-mlmodel-list", "/admin-mlmodel-list", "Admin Model"],
    "admin-well-list": ["admin-well-list", "/admin-well-list", "Admin Well"],

    "dashboard-user-list": ["dashboard-user-list", "/dashboard-user-list", "Dashboard Users"],

    "segy-list": ["segy-list", "/segy-list", "SEGY List"],
    "processwizard": ["process-wizard", "/process-wizard", "Process Wizard"],
    "processwizard1": ["process-wizard1", "/process-wizard1", "Process Wizard Step 1"],
    "processwizard2": ["process-wizard2", "/process-wizard2", "Process Wizard Step 2"],
    "processwizard2-0": ["process-wizard2-0", "/process-wizard2-0", "Process Wizard Step 2"],
    "processwizard2-1": ["process-wizard2-1", "/process-wizard2-1", "Process Wizard Step 2"],
    "processwizard2-2": ["process-wizard2-2", "/process-wizard2-2", "List Section"],

    "processwizard3": ["process-wizard3", "/process-wizard3", "Process Wizard Step 3"],
    "processwizard3-1": ["process-wizard3-1", "/process-wizard3-1", "Process Wizard Step 3"],
    "processwizard3-1-pick": ["process-wizard3-1-pick", "/process-wizard3-1-pick", "Process Wizard Step 3"],
    "processwizard3-2": ["process-wizard3-2", "/process-wizard3-2", "Process Wizard Step 3"],
    "processwizard3-3": ["process-wizard3-3", "/process-wizard3-3", "Process Wizard Step 3"],
    "processwizard3-3-ilz": ["process-wizard3-3-ilz", "/process-wizard3-3-ilz", "Process Wizard Step 3"],
    "processwizard4": ["process-wizard4", "/process-wizard4", "Process Wizard Step 4"],
    "processwizard5": ["process-wizard5", "/process-wizard5", "Process Wizard Step 5"],
    "processwizard6": ["process-wizard6", "/process-wizard6", "Process Wizard Step 6"],

    'seismic-viewer-by-xy': ["seismic-viewer-by-xy", "/seismic-viewer-by-xy", "Seismic Viewer"],
    'prospect-edit': ["prospect-edit", "/prospect-edit", "Prospect Edit"],
    'prospect-analysis': ["prospect-analysis", "/prospect-analysis", "Prospect Analysis"],
    'plot-ava-gather': ["plot-ava-gather", "/plot-ava-gather", "Ava Gather"],
    'plot-ava-gather-section': ["plot-ava-gather-section", "/plot-ava-gather-section", "Ava Gather Section"],

    'prospect-management': ["prospect-management", "/prospect-management", "Prospect Management"],
    'new-prospect-wizard': ["new-prospect-wizard", "/new-prospect-wizard", "New Prospect Wizard"],
  };

  httptype = {
    "user-login": "/api/user/login",
    "user-logout": "/api/user/logout",
    "user-list": "/api/user/list",
    "user-register": "/api/user/register",

    "area-list": "/api/area/list",
    "area-register": "/api/area/register",
    "area-delete": "/api/area/delete",
    "area-update": "/api/area/update",
    "area-info": "/api/area/info",

    "segy-list": "/api/segy/file-list",
    "segy-register": "/api/segy/file-register",
    "segy-delete": "/api/segy/file-delete",
    "segy-update": "/api/segy/file-update",
    "segy-view-list-ava": "/api/segy/view-list-ava",
    "segy-view-gather": "/api/segy/view-list-gather",
    "segy-view-section": "/api/segy/view-list-section",
    "segy-find-gather-from-latlng": "/api/segy/find-gather",

    "ava-segy-view-gather": "/api/segy/view-gather",
    "ava-segy-view-gather-section": "/api/segy/view-gather-section",
    "ava-segy-get-gather-section": "/api/segy/get-gather-section",

    "mlmodel-list": "/api/mlmodel/file-list",
    "mlmodel-register": "/api/mlmodel/file-register",
    "mlmodel-delete": "/api/mlmodel/file-delete",
    "mlmodel-update": "/api/mlmodel/file-update",

    "geobody-list": "/api/geobody/info-list",
    "geobody-ava-list": "/api/geobody/find-ava-data",
    "geobody-register": "/api/geobody/file-register",
    "geobody-delete": "/api/geobody/file-delete",
    "geobody-find-section": "/api/geobody/find-section",

    "point-ava-list": "/api/point/find-ava-data",
    "point-calc-prob": "/api/point/calc-prob",

    "well-info-list": "/api/well/info-list",
    "well-find-rad": "/api/well/find-rad",

    "demo-heatmap": "/api/heatmap/data",
    "demo-heatmap-multi": "/api/heatmap/multi",
    "get_section_data": "/api/heatmap/find-sandbox",

    "probmap-get-list": "/api/probmap/get-list/",
    "probmap_multi": "/api/probmap/multi",
    "probmap_sandbox": "/api/probmap/find-sandbox",
    "potprosp-propose": "/api/potprosp/propose",
    "potprosp-data": "/api/potprosp/data",
    "potprosp-score": "/api/potprosp/calc-score",

    "prospect-list": "/api/prospect/list",
    "prospect-data": "/api/prospect/data",
    "prospect-save": "/api/prospect/save",
    "prospect-update": "/api/prospect/update",
    "prospect-update-group": "/api/prospect/create-group",
    "prospect-analysis": "/api/prospect/analysis",
    "prospect-update-star": "/api/prospect/update-star",
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
