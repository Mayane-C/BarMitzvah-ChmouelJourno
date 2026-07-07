/**
 * Google Apps Script — RSVP Bar Mitsva de Chmouel Journo.
 * Cases « Pas présent » (cases à cocher) intégrées aux blocs Soirée/Chabbat.
 *
 * MISE EN PLACE / RÉPARATION
 * 1. Colle TOUT ce code dans l'éditeur Apps Script → Enregistre.
 * 2. Fonction « setup » → ▶ Exécuter une fois (autorise les permissions,
 *    crée la feuille « Réponses » et l'onglet « Récapitulatif »).
 * 3. Déployer → Nouveau déploiement → Type : Web App
 *      Exécuter en tant que : moi
 *      Qui a accès : Tout le monde
 *    → Copier l'URL « /exec » et la coller dans .env.local
 *      sous NEXT_PUBLIC_GOOGLE_SCRIPT_URL=…
 * 4. À chaque modif du code : Déployer → Gérer les déploiements → ✏️ →
 *    Nouvelle version → Déployer (sinon les changements ne s'appliquent pas).
 */

var PROP_KEY = 'RSVP_SHEET_ID';
var LAYOUT_KEY = 'RSVP_LAYOUT';
var LAYOUT_V = 'v2-blocs';
var SECRET = 'chmouel-journo-2026-bm';

// Palette « royale Loubavitch » alignée sur le site (vert profond + or).
var C_SOIREE = '#1c4d2c';        // vert royal
var C_CHABBAT = '#c08e2c';       // or
var C_SOIREE_LIGHT = '#d3e0d6';  // vert clair
var C_CHABBAT_LIGHT = '#f3e6c4'; // or clair
var C_SAND = '#f6f1e6';          // crème
var C_INK = '#1a1a1a';
var C_BORDER = '#c9b88e';

function getSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_KEY);
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  var ss = SpreadsheetApp.create('RSVP — Bar Mitsva Chmouel');
  props.setProperty(PROP_KEY, ss.getId());
  return ss;
}

/** Case à cocher sur les colonnes G et K, UNIQUEMENT sur nRows lignes de données. */
function applyCheckboxes_(sheet, nRows) {
  if (nRows <= 0) return;
  var cb = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange(3, 7, nRows, 1).setDataValidation(cb);
  sheet.getRange(3, 11, nRows, 1).setDataValidation(cb);
}

/** En-tête (2 lignes) — sans toucher aux données. */
function buildHeader_(sheet) {
  sheet.setFrozenRows(0);
  var hdr = sheet.getRange(1, 1, 2, 13);
  hdr.breakApart();
  hdr.clearContent();
  hdr.clearFormat();

  sheet.getRange('A1:A2').merge().setValue('Date');
  sheet.getRange('B1:B2').merge().setValue('Prénom');
  sheet.getRange('C1:C2').merge().setValue('Nom');
  sheet.getRange('D1:G1').merge().setValue('LA SOIRÉE');
  sheet.getRange('H1:K1').merge().setValue('LE CHABBAT');
  sheet.getRange('L1:L2').merge().setValue('Message pour Chmouel');
  sheet.getRange('M1:M2').merge().setValue('Invitation');

  sheet.getRange('D2').setValue('Adultes');
  sheet.getRange('E2').setValue('Enfants');
  sheet.getRange('F2').setValue('Total');
  sheet.getRange('G2').setValue('Pas présent');
  sheet.getRange('H2').setValue('Adultes');
  sheet.getRange('I2').setValue('Enfants');
  sheet.getRange('J2').setValue('Total');
  sheet.getRange('K2').setValue('Pas présent');

  var header = sheet.getRange(1, 1, 2, 13);
  header.setFontWeight('bold').setVerticalAlignment('middle').setHorizontalAlignment('center')
        .setBorder(true, true, true, true, true, true, C_BORDER, SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange('A1:C2').setBackground(C_SAND).setFontColor(C_INK);
  sheet.getRange('L1:L2').setBackground(C_SAND).setFontColor(C_INK);
  sheet.getRange('M1:M2').setBackground(C_SAND).setFontColor(C_INK);
  sheet.getRange('D1:G1').setBackground(C_SOIREE).setFontColor('#ffffff').setFontSize(11);
  sheet.getRange('H1:K1').setBackground(C_CHABBAT).setFontColor('#ffffff').setFontSize(11);
  sheet.getRange('D2:G2').setBackground(C_SOIREE_LIGHT).setFontColor(C_INK);
  sheet.getRange('H2:K2').setBackground(C_CHABBAT_LIGHT).setFontColor(C_INK);

  sheet.setFrozenRows(2);
  sheet.setColumnWidth(1, 150); sheet.setColumnWidth(2, 120); sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 78); sheet.setColumnWidth(5, 78); sheet.setColumnWidth(6, 78); sheet.setColumnWidth(7, 95);
  sheet.setColumnWidth(8, 78); sheet.setColumnWidth(9, 78); sheet.setColumnWidth(10, 78); sheet.setColumnWidth(11, 95);
  sheet.setColumnWidth(12, 300);
  sheet.setColumnWidth(13, 150);
}

/**
 * RÉPARE : récupère les vraies réponses (où qu'elles soient), nettoie tout
 * sous l'en-tête (contenu + cases qui gonflaient la feuille), et les réécrit
 * proprement à partir de la ligne 3.
 */
function repair() {
  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName('Réponses');
  if (!sh) { sh = ss.getSheets()[0]; sh.setName('Réponses'); }

  var lastRow = sh.getLastRow();
  var lastCol = Math.max(12, sh.getLastColumn());
  var data = [];
  if (lastRow >= 3) {
    var vals = sh.getRange(3, 1, lastRow - 2, lastCol).getValues();
    for (var i = 0; i < vals.length; i++) {
      // garde seulement les vraies lignes (un prénom OU un nom)
      if (String(vals[i][1]).trim() !== '' || String(vals[i][2]).trim() !== '') {
        // Normalise à 13 colonnes (padding si l'ancien layout n'avait pas la col M).
        var padded = vals[i].slice(0, 13);
        while (padded.length < 13) padded.push('');
        if (!padded[12]) padded[12] = 'Complète'; // par défaut sur les anciennes lignes
        data.push(padded);
      }
    }
  }

  // Nettoie TOUT sous l'en-tête (contenu + validations qui gonflaient).
  var maxR = sh.getMaxRows();
  if (maxR >= 3) {
    var body = sh.getRange(3, 1, maxR - 2, 13);
    body.clearDataValidations();
    body.clearContent();
    body.setFontWeight('normal');
  }

  // Réécrit les données propres en haut.
  if (data.length) {
    sh.getRange(3, 1, data.length, 13).setValues(data);
    sh.getRange(3, 4, data.length, 3).setHorizontalAlignment('center');
    sh.getRange(3, 8, data.length, 3).setHorizontalAlignment('center');
    sh.getRange(3, 13, data.length, 1).setHorizontalAlignment('center');
    sh.getRange(3, 6, data.length, 1).setFontWeight('bold');
    sh.getRange(3, 10, data.length, 1).setFontWeight('bold');
    applyCheckboxes_(sh, data.length);
  }

  buildHeader_(sh);
  PropertiesService.getScriptProperties().setProperty(LAYOUT_KEY, LAYOUT_V);
  updateSummary(ss);
  Logger.log('✅ Réparé : ' + data.length + ' réponse(s). getLastRow=' + sh.getLastRow());
  Logger.log('FEUILLE : ' + ss.getUrl());
}

function getDataSheet_(ss) {
  var sheet = ss.getSheetByName('Réponses');
  if (!sheet) { sheet = ss.getSheets()[0]; sheet.setName('Réponses'); }
  if (sheet.getFrozenRows() < 2) buildHeader_(sheet);
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var d = {};
    if (e && e.postData && e.postData.contents) {
      try { d = JSON.parse(e.postData.contents); } catch (er) { d = (e && e.parameter) ? e.parameter : {}; }
    } else if (e && e.parameter) { d = e.parameter; }
    if (String(d.token) !== SECRET) return json_({ result: 'error', error: 'unauthorized' });

    var num = function (v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
    var sAd = num(d.soireeAdultes), sEn = num(d.soireeEnfants);
    var cAd = num(d.chabbatAdultes), cEn = num(d.chabbatEnfants);
    var truthy = function (v) { return v === true || v === 'true' || v === 1 || v === '1'; };

    var ss = getSpreadsheet_();
    var sheet = getDataSheet_(ss);

    var invitationLabel = String(d.version) === 'soiree' ? 'Soirée uniquement' : 'Complète';

    var row = [
      d.date || new Date().toLocaleDateString('fr-FR'),
      d.prenom || '', d.nom || '',
      sAd, sEn, sAd + sEn, truthy(d.soireeAbsent),
      cAd, cEn, cAd + cEn, truthy(d.chabbatAbsent),
      d.message || '',
      invitationLabel
    ];

    sheet.appendRow(row);
    var r = sheet.getLastRow();
    sheet.getRange(r, 4, 1, 3).setHorizontalAlignment('center');
    sheet.getRange(r, 8, 1, 3).setHorizontalAlignment('center');
    sheet.getRange(r, 13).setHorizontalAlignment('center');
    sheet.getRange(r, 6).setFontWeight('bold');
    sheet.getRange(r, 10).setFontWeight('bold');
    // Cases à cocher SUR CETTE LIGNE uniquement (pas de gonflage).
    var cb = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    sheet.getRange(r, 7).setDataValidation(cb);
    sheet.getRange(r, 11).setDataValidation(cb);

    updateSummary(ss);
    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Le service RSVP de Chmouel est actif.').setMimeType(ContentService.MimeType.TEXT);
}

function updateSummary(ss) {
  ss = ss || getSpreadsheet_();
  var data = ss.getSheetByName('Réponses');
  if (!data) return;
  var last = data.getLastRow();
  var sAd = 0, sEn = 0, cAd = 0, cEn = 0;
  var nCompletes = 0, nSoireeOnly = 0;
  if (last >= 3) {
    var vals = data.getRange(3, 1, last - 2, 13).getValues();
    for (var i = 0; i < vals.length; i++) {
      sAd += Number(vals[i][3]) || 0;
      sEn += Number(vals[i][4]) || 0;
      cAd += Number(vals[i][7]) || 0;
      cEn += Number(vals[i][8]) || 0;
      if (String(vals[i][12]) === 'Soirée uniquement') nSoireeOnly++;
      else if (String(vals[i][1]).trim() !== '' || String(vals[i][2]).trim() !== '') nCompletes++;
    }
  }
  var sheet = ss.getSheetByName('Récapitulatif');
  if (!sheet) sheet = ss.insertSheet('Récapitulatif', 1);
  sheet.clear();
  var rows = [
    ['RÉCAPITULATIF', ''],
    ['', ''],
    ['LA SOIRÉE', ''],
    ['Adultes', sAd], ['Enfants', sEn], ['Total Soirée', sAd + sEn],
    ['', ''],
    ['LE CHABBAT', ''],
    ['Adultes', cAd], ['Enfants', cEn], ['Total Chabbat', cAd + cEn],
    ['', ''],
    ['RÉPONSES', ''],
    ['Invitations complètes', nCompletes],
    ['Invitations soirée uniquement', nSoireeOnly],
    ['Total familles', nCompletes + nSoireeOnly]
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.getRange('A1:B1').merge().setFontSize(14).setFontWeight('bold').setFontColor(C_INK);
  sheet.getRange('A3').setBackground(C_SOIREE).setFontColor('#ffffff').setFontWeight('bold');
  sheet.getRange('B3').setBackground(C_SOIREE);
  sheet.getRange('A8').setBackground(C_CHABBAT).setFontColor('#ffffff').setFontWeight('bold');
  sheet.getRange('B8').setBackground(C_CHABBAT);
  sheet.getRange('A13').setBackground(C_SAND).setFontColor(C_INK).setFontWeight('bold');
  sheet.getRange('B13').setBackground(C_SAND);
  sheet.getRange('A6').setFontWeight('bold'); sheet.getRange('B6').setFontWeight('bold');
  sheet.getRange('A11').setFontWeight('bold'); sheet.getRange('B11').setFontWeight('bold');
  sheet.getRange('A16').setFontWeight('bold'); sheet.getRange('B16').setFontWeight('bold');
  sheet.setColumnWidth(1, 220); sheet.setColumnWidth(2, 130);
}

function setup() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName('Réponses');
  if (!sheet) { sheet = ss.getSheets()[0]; sheet.setName('Réponses'); }
  buildHeader_(sheet);
  installTriggers_();
  updateSummary(ss);
  Logger.log('✅ FEUILLE RSVP : ' + ss.getUrl());
  return ss.getUrl();
}

function onSheetChange() { updateSummary(getSpreadsheet_()); }

function installTriggers_() {
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'onSheetChange') ScriptApp.deleteTrigger(existing[i]);
  }
  ScriptApp.newTrigger('onSheetChange').forSpreadsheet(getSpreadsheet_()).onChange().create();
}

function lienDuSheet() { Logger.log('FEUILLE RSVP : ' + getSpreadsheet_().getUrl()); }
