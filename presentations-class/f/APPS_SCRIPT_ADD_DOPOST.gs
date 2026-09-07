/* ============================================================
   LO ÚNICO QUE FALTA EN TU APPS SCRIPT · seminario 20941

   Tu Web App ya funciona para LEER: `GET ?slot=q2` devuelve
   {ok,n,rows} y el deck lo consume bien. Comprobados los once slots
   el 7 de septiembre de 2026.

   Lo que NO tiene es ESCRITURA. Un POST devuelve la página de Google
   y no añade ninguna fila, así que hoy los formularios del hub no
   pueden entregar nada.

   CÓMO USARLO
   1. Abre tu proyecto de Apps Script, el de la hoja de respuestas.
   2. Pega este bloque AL FINAL. No borres nada de lo que ya hay:
      esto solo añade doPost y dos ayudas, y no toca tu doGet.
   3. Implementar > Gestionar implementaciones > el lápiz > Versión
      «nueva» > Implementar. LA URL NO CAMBIA si editas la
      implementación que ya existe en vez de crear otra.
   4. Prueba desde el móvil en /presentations-class/f/

   POR QUÉ NO TRAE UN ESQUEMA
   Lee la fila de cabecera de cada pestaña y escribe en ese orden. Así
   no hay una segunda copia del esquema que se desincronice, y si
   algún día cambias una columna en la hoja, esto sigue funcionando.
   ============================================================ */

/* Solo para pestañas que todavía no existen o están sin cabecera.
   Hoy el único caso es q1-afm, que nunca ha recibido nada. */
var FALLBACK_HEADERS = {
  'q1-fin': ['companies', 'timing'],
  'q1-afm': ['companies', 'timing'],
  'q2':     ['what', 'word'],
  'q3':     ['names', 'idea', 'conflict'],
  'q4':     ['number', 'against'],
  'q5':     ['version', 'why'],
  'q6':     ['sentence'],
  'q7':     ['pause_self', 'pause_other', 'eyes_self', 'eyes_other'],
  'q8':     ['group', 'awk_pred', 'ok_pred', 'depth_real', 'depth_want'],
  'q9':     ['awk_real', 'ok_real', 'remember', 'held_back'],
  'q10':    ['commit']
};

function post_out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function post_headers_(sh, slot) {
  var lastCol = sh.getLastColumn();
  var hdr = lastCol > 0
    ? sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(function (h) { return String(h).trim(); })
    : [];
  while (hdr.length && !hdr[hdr.length - 1]) hdr.pop();
  if (hdr.join('')) return hdr;

  hdr = FALLBACK_HEADERS[slot];
  if (!hdr) return null;
  sh.getRange(1, 1, 1, hdr.length).setValues([hdr]);
  sh.setFrozenRows(1);
  return hdr;
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var slot = String(p.slot || '').trim();
  if (!slot) return post_out_({ error: 'no slot' });

  var data = {};
  try { data = JSON.parse(p.payload || '{}'); } catch (err) { data = {}; }
  // por si algún día se manda con los campos sueltos en vez de en payload
  if (!Object.keys(data).length) {
    Object.keys(p).forEach(function (k) { if (k !== 'slot' && k !== 'payload') data[k] = p[k]; });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(slot);
  if (!sh) {
    if (!FALLBACK_HEADERS[slot]) return post_out_({ error: 'unknown slot', slot: slot });
    sh = ss.insertSheet(slot);
  }

  var hdr = post_headers_(sh, slot);
  if (!hdr) return post_out_({ error: 'no headers', slot: slot });

  // se busca sin distinguir mayúsculas, y se escribe en el orden de la hoja
  var lower = {};
  Object.keys(data).forEach(function (k) { lower[String(k).toLowerCase().trim()] = data[k]; });

  var row = hdr.map(function (h) {
    var v = lower[h.toLowerCase()];
    return (v === undefined || v === null) ? '' : String(v);
  });
  if (row.join('').trim() === '') return post_out_({ error: 'empty', slot: slot });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sh.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return post_out_({ ok: true, slot: slot, wrote: row.length });
}

/* Crea las pestañas que falten con su cabecera. Ejecutar a mano una vez.
   Hoy sirve para q1-afm, que está sin cabecera. */
function ensureSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(FALLBACK_HEADERS).forEach(function (slot) {
    var sh = ss.getSheetByName(slot) || ss.insertSheet(slot);
    post_headers_(sh, slot);
  });
}

/* Vacía los datos y conserva las cabeceras.
   HAY QUE EJECUTARLO ENTRE EL VIERNES DE FIN Y EL DE AFM: de q2 a q10
   las dos clases comparten pestaña, así que si no, AFM ve proyectadas
   las respuestas de FIN.
   NO SE PUEDE DESHACER. Duplica la hoja antes si quieres guardarlas. */
function wipeSlots() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(FALLBACK_HEADERS).forEach(function (slot) {
    var sh = ss.getSheetByName(slot);
    if (!sh) return;
    var last = sh.getLastRow();
    if (last > 1) sh.deleteRows(2, last - 1);
  });
}
