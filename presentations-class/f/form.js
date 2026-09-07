/* ============================================================
   EL ENLACE DEL DÍA · seminario 20941
   Diez formularios en una sola página. Todos los QR del deck
   aterrizan aquí y el alumno elige desde la lista.

   El ENDPOINT tiene que ser EL MISMO que el de deck_friday.html.
   Si cambias uno, cambia el otro.

   CONTRATO CON EL DECK, no se toca a la ligera:
   el deck busca las columnas por NOMBRE y en minúsculas, con
   colOf(rows, 'word') y compañía. Si renombras un campo aquí, la
   slide que lo lee se queda en blanco sin avisar de nada.
   ============================================================ */

var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzMqKFcjnvkifQkto1nDnXd3naMoFKoXxsPnSCK_W5zbtz2nIDAETfoTR7NQfnaM-vaNQ/exec';

/* Las mismas listas que dibujan el mapa de calor en el deck. Si aquí
   escriben el nombre de otra forma, la celda no se enciende: por eso
   se ofrecen como opciones y no como texto libre a secas. */
var RECRUITERS = {
  fin: ['Goldman Sachs','J.P. Morgan','Morgan Stanley','BlackRock','Bank of America Merrill Lynch',
        'Barclays','Citigroup','Deutsche Bank','UBS','HSBC Group','BNP Paribas','Credit Agricole Group',
        'Lazard','Rothschild','Mediobanca','Royal Bank of Canada','London Stock Exchange Group',
        'Intesa Sanpaolo','UniCredit','McKinsey & Company','The Boston Consulting Group',
        'Deloitte','EY','KPMG','PwC'],
  afm: ['European Central Bank','Amazon',"L'Oréal",'Luxottica','Pirelli','General Electric',
        'Accenture','Accuracy','Banco Santander','Bank of America Merrill Lynch','BNP Paribas','BPCE',
        'HSBC Group','Societe Generale','Marsh & McLennan','Intesa Sanpaolo','UniCredit','UBI Banca',
        'Mediobanca','UBS','McKinsey & Company','The Boston Consulting Group',
        'Deloitte','EY','KPMG','PwC','Partners Consulenti e Professionisti Associati']
};

var RANGES = ['under 2 weeks','2–4 weeks','1–2 months','2–3 months','3–6 months','6–12 months','over a year'];

function scale(name, label, hint) {
  return { name: name, label: label, hint: hint || '0 = not at all · 10 = extremely', type: 'scale' };
}

/* slot: lo que pide el deck. 'q1' se resuelve a q1-fin o q1-afm. */
var FORMS = [
  { n: 1, slot: 'q1', when: 'Session 1', title: 'Where would you like to be working in two years?',
    blurb: 'Be honest, not diplomatic. Do not look anything up, and do not agree with your neighbour.',
    fields: [
      { name: 'company1', label: 'First choice',  type: 'firm' },
      { name: 'company2', label: 'Second choice', type: 'firm' },
      { name: 'company3', label: 'Third choice',  type: 'firm' },
      { name: 'timing', label: 'A Bocconi graduate who finds a job: how long from graduating to starting?',
        hint: 'Pick one. Do not look it up.', type: 'radio', options: RANGES }
    ] },

  { n: 2, slot: 'q2', when: 'Session 1', title: 'Why you stopped listening',
    blurb: 'The last time you were in an audience and you stopped listening. No names, and no courses from this university.',
    fields: [
      { name: 'stopped', label: 'What made you stop?', type: 'text' },
      { name: 'word', label: 'In one word: what was missing?', hint: 'One word. It goes straight on the screen.', type: 'word' }
    ] },

  { n: 3, slot: 'q3', when: 'Session 1 · Tip 2', title: 'Your story, in two lines',
    blurb: 'One submission per trio. Talk through all eight boxes, write down only these two.',
    fields: [
      { name: 'names', label: 'The three names', type: 'text' },
      { name: 'idea', label: 'Your core idea, in one line', type: 'text' },
      { name: 'conflict', label: 'Your conflict, in one line', hint: 'What broke, and who it hurts.', type: 'text' }
    ] },

  { n: 4, slot: 'q4', when: 'Session 2', title: 'Rescue the chart',
    blurb: 'One submission per trio. Two decisions only. Do not redesign it and do not draw anything.',
    fields: [
      { name: 'number', label: 'Which is THE number?', type: 'text' },
      { name: 'against', label: 'What do you compare it against?', type: 'text' }
    ] },

  { n: 5, slot: 'q5', when: 'Session 2 · Tip 3b', title: 'A or B?',
    blurb: 'Vote on your own phone, not with your hand.',
    fields: [
      { name: 'version', label: 'Which version?', type: 'radio', options: ['A','B'] },
      { name: 'why', label: 'Five words for why', type: 'text' }
    ] },

  { n: 6, slot: 'q6', when: 'Session 2 · Tip 4', title: 'One sentence',
    blurb: 'One submission per trio. Your one message, in one sentence. That is all.',
    fields: [ { name: 'sentence', label: 'Your one sentence', type: 'text' } ] },

  { n: 7, slot: 'q7', when: 'Session 2', title: 'The asymmetry',
    blurb: 'One each, not one per trio. Four numbers, 0 to 10.',
    fields: [
      scale('pause_self',  'The pause. When it was you: how long did three seconds feel?'),
      scale('pause_other', 'The pause. When you listened: how confident did they look?'),
      scale('eyes_self',   'Eye contact. When it was you: how hard was holding it?'),
      scale('eyes_other',  'Eye contact. When they held yours: how confident did they look?')
    ] },

  { n: 8, slot: 'q8', when: 'Session 3 · before', title: 'Before I tell you anything',
    blurb: 'You are about to have a conversation with your group. This is NOT attendance.',
    fields: [
      { name: 'group', label: 'Your group number', type: 'text' },
      scale('awk_pred', 'How awkward do you predict it will be?'),
      scale('ok_pred',  'How comfortable do you predict you will end up?'),
      scale('depth_real', 'How deep are your conversations with them right now?', '0 = pure small talk · 10 = it really matters'),
      scale('depth_want', 'How deep would you like them to be?', '0 = pure small talk · 10 = it really matters')
    ] },

  { n: 9, slot: 'q9', when: 'Session 3 · after', title: 'Same exercise, backwards',
    blurb: 'Four answers about what just happened.',
    fields: [
      scale('awk_real', 'How awkward was it, really?'),
      scale('ok_real',  'How comfortable did you end up?'),
      { name: 'remember', label: 'One thing someone said that you will remember', hint: 'No names.', type: 'text' },
      { name: 'almost', label: 'Was there something you almost said and did not?', type: 'radio', options: ['yes','no'] }
    ] },

  { n: 10, slot: 'q10', when: 'Session 3 · last thing', title: 'One thing you will do differently',
    blurb: 'Because of something that happened in this room. One line. Some of these are on screen at half past eight tomorrow.',
    fields: [ { name: 'commit', label: 'One line', type: 'text' } ] }
];
