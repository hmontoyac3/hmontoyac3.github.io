/* ============================================================
   Backend del enlace del día · seminario 20941
   Pegar en Apps Script, ligado a una hoja de cálculo, y desplegar
   como Web App con acceso «Cualquier persona». La URL que acaba en
   /exec es la que va en ENDPOINT, en DOS sitios:
     · presentations-class/f/form.js
     · deck_friday.html
   Las dos tienen que ser la misma.

   Hace dos cosas:
     GET  ?slot=q2        devuelve {rows:[[cabecera],[fila],...]}
     POST slot=q2&payload={"word":"…"}   añade una fila

   El orden y el nombre de las columnas son un CONTRATO con el deck,
   que las busca por nombre en minúsculas. No renombrar nada aquí sin
   cambiarlo también en el deck y en form.js.

   Detalle que importa: la columna de hora se guarda en la hoja pero
   NO se devuelve en el GET. Si se devolviera, la slide del mapa de
   calor contaría las fechas como si fueran nombres de empresas.
   ============================================================ */

var SCHEMA = {
  'q1-fin': ['company1', 'company2', 'company3', 'timing'],
  'q1-afm': ['company1', 'company2', 'company3', 'timing'],
  'q2':     ['stopped', 'word'],
  'q3':     ['names', 'idea', 'conflict'],
  'q4':     ['number', 'against'],
  'q5':     ['version', 'why'],
  'q6':     ['sentence'],
  'q7':     ['pause_self', 'pause_other', 'eyes_self', 'eyes_other'],
  'q8':     ['group', 'awk_pred', 'ok_pred', 'depth_real', 'depth_want'],
  'q9':     ['awk_real', 'ok_real', 'remember', 'almost'],
  'q10':    ['commit']
};

var TS = 'ts_interno';

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetFor_(slot) {
  var cols = SCHEMA[slot];
  if (!cols) return null;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(slot);
  if (!sh) {
    sh = ss.insertSheet(slot);
    sh.appendRow([TS].concat(cols));
    sh.setFrozenRows(1);
  }
  return sh;
}

function doGet(e) {
  var slot = String((e && e.parameter && e.parameter.slot) || '').trim();
  var cols = SCHEMA[slot];
  if (!cols) return json_({ error: 'unknown slot', slot: slot });

  var sh = sheetFor_(slot);
  var out = [cols.slice()];
  var last = sh.getLastRow();
  if (last > 1) {
    // se salta la primera columna, la de la hora, a propósito
    var vals = sh.getRange(2, 2, last - 1, cols.length).getDisplayValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i].join('').trim()) out.push(vals[i]);
    }
  }
  return json_({ slot: slot, rows: out });
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var slot = String(p.slot || '').trim();
  var cols = SCHEMA[slot];
  if (!cols) return json_({ error: 'unknown slot', slot: slot });

  var data = {};
  try { data = JSON.parse(p.payload || '{}'); } catch (err) { data = {}; }

  var row = [new Date()];
  for (var i = 0; i < cols.length; i++) {
    var v = data[cols[i]];
    row.push(v === undefined || v === null ? '' : String(v));
  }
  if (row.slice(1).join('').trim() === '') return json_({ error: 'empty' });

  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try { sheetFor_(slot).appendRow(row); } finally { lock.releaseLock(); }
  return json_({ ok: true, slot: slot });
}

/* Ejecutar UNA vez a mano desde el editor: crea las once hojas con
   sus cabeceras, para no descubrir un fallo de permisos en clase. */
function setUp() {
  Object.keys(SCHEMA).forEach(function (s) { sheetFor_(s); });
}

/* Ejecutar a mano para dejar las hojas vacías entre la clase de FIN y
   la de AFM. Borra los datos y conserva las cabeceras.
   CUIDADO: no se puede deshacer. Exporta antes si quieres guardarlos. */
function wipeAll() {
  Object.keys(SCHEMA).forEach(function (s) {
    var sh = sheetFor_(s), last = sh.getLastRow();
    if (last > 1) sh.deleteRows(2, last - 1);
  });
}
