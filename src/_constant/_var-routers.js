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
    "segy-list": ["segy-list", "/segy-list", "SEGY List"],
    "processwizard": ["process-wizard", "/process-wizard", "Process Wizard"],
    "processwizard1": ["process-wizard1", "/process-wizard1", "Process Wizard Step 1"],
    "processwizard2": ["process-wizard2", "/process-wizard2", "Process Wizard Step 2"],
    "processwizard3": ["process-wizard3", "/process-wizard3", "Process Wizard Step 3"],
    "processwizard4": ["process-wizard4", "/process-wizard4", "Process Wizard Step 4"],
    "processwizard5": ["process-wizard5", "/process-wizard5", "Process Wizard Step 5"],
    "processwizard6": ["process-wizard6", "/process-wizard6", "Process Wizard Step 6"],

    "lokasi-menu": ["lokasi-menu", "/lokasi-menu", "Menu Lokasi"],
    "lokasi-edit": ["lokasi-edit", "/lokasi-edit", "Edit Lokasi"],
    "lokasi-map": ["lokasi-map", "/lokasi-map", "Lokasi di Peta"],
    "lokasi-data": ["lokasi-data", "/lokasi-data", "Managemen Lokasi"],

    "street-data": ["street-data", "/street-data", "Data Jalan"],

    "sips-menu": ["sips-menu", "/sips-menu", "SIPS"],
    "sips-menu-payment" : ["sips-menu-payment", "/sips-menu-payment", "Menu Pembayaran"],
    "sips-pungutan-qr" : ["sips-pungutan-qr", "/sips-pungutan-qr", "Pungutan QR"],
    "sips-pungutan-rekap" : ["sips-pungutan-rekap", "/sips-pungutan-rekap", "Pungutan Rekap"],
    "sips-pungutan-setor" : ["sips-pungutan-setor", "/sips-pungutan-setor", "Pungutan Setor"],
    "sips-pungutan-sukses" : ["sips-pungutan-sukses", "/sips-pungutan-sukses", "Pungutan Sukses"],
    "sips-setoran-qr" : ["sips-setoran-qr", "/sips-setoran-qr", "Setoran QR"],
    "sips-setoran-rekap" : ["sips-setoran-rekap", "/sips-setoran-rekap", "Setoran Rekap"],
    "sips-setoran-setor" : ["sips-setoran-setor", "/sips-setoran-setor", "Setoran Setor"],
    "sips-setoran-sukses" : ["sips-setoran-sukses", "/sips-setoran-sukses", "Setoran Sukses"],
    "sips-user-table" : ["sips-user-table", "/sips-user-table", "SIPS User Table"],

    "kontrak-menu": ["kontrak-menu", "/kontrak-menu", "Menu Kontrak"],
    "kontrak-edit": ["kontrak-edit", "/kontrak-edit", "Edit Kontrak"],
    "kontrak-dokumen": ["kontrak-dokumen", "/kontrak-dokumen", "Kontrak Dokumen"],
    "kontrak-data": ["kontrak-data", "/kontrak-data", "Managemen Kontrak"],
    "kontrak-card": ["kontrak-card", "/kontrak-card", "ID Card"],

    "perizinan-data": ["perizinan-data", "/perizinan-data", "Perizinan Data"],
    "persetujuan-data": ["persetujuan-data", "/persetujuan-data", "Persetujuan Data"],

    "user-menu": ["user-menu", "/user-menu", "Menu User"],
    "user-edit": ["user-edit", "/user-edit", "Edit User"],
    "user-detail": ["user-detail", "/user-detail", "Detil User"],
    "user-data": ["user-data", "/user-data", "Managemen User"],

    "subuser-data": ["subuser-data", "/subuser-data", "Managemen Asisten"],
    "subuser-create": ["subuser-create", "/subuser-create", "Tambah Sub User"],
    "subuser-edit": ["subuser-edit", "/subuser-edit", "Edit Sub User"],
    "subuser-detail": ["subuser-detail", "/subuser-detail", "Detil Sub User"],

    "pembayaran-data": ["pembayaran-data", "/pembayaran-data", "Pembayaran Data"],

    "history-parkir": ["history-parkir", "/history-parkir", "History Parkir"],
    "history-parkir-detail": ["history-parkir-detail", "/history-parkir-detail", "History Parkir Detail"],
    "history-parkir-map": ["history-parkir-map", "/history-parkir-map", "Peta History Parkir"]
  };

  httptype = {
    "user" : "user",
    "location" : "location",
    "contract" : "contract",
    "contract_permit" : "contract_permit",
    "contract_approval" : "contract_approval",
    "invoice" : "invoice",
    "street" : "street",
    "subuser" : "subuser",
    "parkSumm" : "parkSumm"
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
