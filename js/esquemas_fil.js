// Generado por web_i18n/i18n_rebuild.js (eu) a partir de web/js/esquemas_fil.js. No editar a mano: editar la memoria tm/eu.json y regenerar.
const ESQUEMAS_FIL = {
 "FIL-T1-01": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 1. gaia",
  "title": "Zer da filosofia?",
  "mermaid": "flowchart TD\n  center[\"ZER DA FILOSOFIA?\"]:::axis\n  origen[\"mitotik logosera\"]:::key\n  mito[\"mitoa: jainkoen bidezko azalpena\"]\n  logos[\"logosa: azalpen arrazionala\"]\n  carac[\"ezaugarriak\"]:::key\n  c1[\"arrazionala (arrazoiak ematen ditu)\"]\n  c2[\"kritikoa (ez du onartzen aztertu gabe)\"]\n  c3[\"erradikala (erroraino doa)\"]\n  c4[\"unibertsala (dena pentsa daiteke)\"]\n  saber[\"bigarren mailako jakintza: oinarriak galdegiten ditu\"]:::key\n  center -->|\"sortzen da\"| origen\n  origen --> mito\n  origen -->|\"igarotzen da\"| logos\n  center -->|\"jakintza bat da\"| carac\n  carac --> c1\n  carac --> c2\n  carac --> c3\n  carac --> c4\n  center -->|\"horregatik da\"| saber\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T1-02": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 1. gaia",
  "title": "Filosofiaren adarrak",
  "mermaid": "flowchart TD\n  fil[\"FILOSOFIA\"]:::axis\n  q1[\"zer da errealitatea?\"]\n  met[\"Metafisika eta Ontologia\"]:::key\n  q2[\"zer ezagut dezakegu?\"]\n  epi[\"Epistemologia\"]:::key\n  q3[\"nola jokatu behar dugu?\"]\n  eti[\"Etika\"]:::key\n  q4[\"nola antolatu bizikidetza?\"]\n  pol[\"Filosofia politikoa\"]:::key\n  q5[\"zer dira edertasuna eta artea?\"]\n  est[\"Estetika\"]:::key\n  q6[\"nola arrazoitu zuzen?\"]\n  log[\"Logika\"]:::key\n  fil --> q1 --> met\n  fil --> q2 --> epi\n  fil --> q3 --> eti\n  fil --> q4 --> pol\n  fil --> q5 --> est\n  fil --> q6 --> log\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T2-01": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 2. gaia",
  "title": "Natura eta kultura gizakiarengan",
  "mermaid": "flowchart TD\n  center[\"GIZAKIA\"]:::axis\n  bio[\"dimentsio biologikoa\"]:::key\n  hom[\"hominizazioa: gorputzaren eboluzioa\"]\n  ev[\"hominidoak, bipedismoa, eskua, entzefaloa\"]\n  cul[\"dimentsio kulturala\"]:::key\n  hum[\"humanizazioa: ikaskuntza soziala\"]\n  simb[\"animalia sinbolikoa: hizkuntza, teknika, kultura\"]\n  sintesis[\"natura eta kultura elkarlotu egiten dira\"]:::key\n  center --> bio\n  bio --> hom --> ev\n  center --> cul\n  cul --> hum --> simb\n  bio -->|\"hemen konbinatzen dira\"| sintesis\n  cul -->|\"hemen konbinatzen dira\"| sintesis\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T2-02": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 2. gaia",
  "title": "Gogo-gorputz arazoa",
  "mermaid": "flowchart TD\n  q[\"GORPUTZA ETA GOGOA?\"]:::axis\n  dual[\"Dualismoa\"]:::key\n  d1[\"bi errealitate ezberdin: arima eta gorputza (Platon, Descartes)\"]\n  mon[\"Monismoa\"]:::key\n  m1[\"errealitate bakarra\"]\n  mat[\"materialismoa: dena materia da\"]\n  emer[\"emergentismoa: gogoa garunetik sortzen da\"]\n  q --> dual --> d1\n  q --> mon --> m1\n  m1 --> mat\n  m1 --> emer\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T3-01": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 3. gaia",
  "title": "Arrazionalismoa, enpirismoa eta Kant",
  "mermaid": "flowchart TD\n  con[\"EZAGUTZA\"]:::axis\n  fuente[\"zein da bere iturria?\"]:::key\n  rac[\"Arrazionalismoa\"]:::key\n  r1[\"arrazoia; jaiotzetiko ideiak (Descartes)\"]\n  emp[\"Enpirismoa\"]:::key\n  e1[\"esperientzia; gogoa tabula rasa gisa (Locke, Hume)\"]\n  kant[\"Kant: sintesi kritikoa\"]:::key\n  k1[\"fenomenoak ezagutzen ditugu: esperientzia + a priori formak\"]\n  con --> fuente\n  fuente --> rac --> r1\n  fuente --> emp --> e1\n  rac -->|\"biltzen ditu\"| kant\n  emp -->|\"biltzen ditu\"| kant\n  kant --> k1\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T3-02": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 3. gaia",
  "title": "Zientzia eta bere metodoa",
  "mermaid": "flowchart TD\n  ci[\"ZIENTZIA\"]:::axis\n  met[\"metodo hipotetiko-deduktiboa\"]:::key\n  h[\"arazoa, hipotesia, kontrastazioa, legea\"]\n  pop[\"Popper: faltsazionismoa\"]:::key\n  p1[\"teoria bat zientifikoa da errefusa badaiteke\"]\n  kuhn[\"Kuhn: paradigmak\"]:::key\n  ku[\"zientzia normala, krisia, iraultza, paradigma berria\"]\n  ci --> met --> h\n  ci --> pop --> p1\n  ci --> kuhn --> ku\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T5-01": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 5. gaia",
  "title": "Etika eta morala: teoria motak",
  "mermaid": "flowchart TD\n  center[\"ETIKA\"]:::axis\n  moral[\"MORALAZ hausnartzen du\"]:::key\n  m1[\"komunitate baten arauak eta balioak\"]\n  tipos[\"etika-teoria motak\"]:::key\n  mat[\"materialak: ongia edo helburua zein den esaten dute\"]:::key\n  form[\"formalak: betebeharraren forma ematen dute, ez edukia\"]:::key\n  tele[\"teleologikoak: helburuari eta ondorioei begiratzen diete\"]\n  deon[\"deontologikoak: betebeharrari berari begiratzen diote\"]\n  center -->|\"honetaz hausnartzen du\"| moral --> m1\n  center --> tipos\n  tipos --> mat\n  tipos --> form\n  mat -->|\"izan ohi dira\"| tele\n  form -->|\"izan ohi dira\"| deon\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T5-02": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 5. gaia",
  "title": "Etika-teoria handiak",
  "mermaid": "flowchart TD\n  et[\"ETIKA-TEORIAK\"]:::axis\n  ar[\"Eudaimonismoa (Aristoteles)\"]:::key\n  a1[\"helburua: zoriontasuna (eudaimonia) bertutearen bidez\"]\n  ep[\"Hedonismoa eta Utilitarismoa (Epikuro, Mill)\"]:::key\n  e1[\"helburua: plazera, edo zoriontasunik handiena ahalik eta gehienentzat\"]\n  ka[\"Deontologia (Kant)\"]:::key\n  k1[\"betebeharra legearen errespetuagatik: inperatibo kategorikoa\"]\n  em[\"Emotibismoa (Hume)\"]:::key\n  h1[\"judizio moralek sentimenduak adierazten dituzte\"]\n  et --> ar --> a1\n  et --> ep --> e1\n  et --> ka --> k1\n  et --> em --> h1\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T7-01": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 7. gaia",
  "title": "Zer da edertasuna?",
  "mermaid": "flowchart TD\n  bel[\"EDERTASUNA\"]:::axis\n  q[\"non dago?\"]:::key\n  obj[\"Objektibismoa: objektuan\"]:::key\n  o1[\"proportzioa eta harmonia (klasikoak)\"]\n  sub[\"Subjektibismoa: subjektuan\"]:::key\n  s1[\"gustuei buruz ez dago ezer idatzita\"]\n  jui[\"judizio estetikoa\"]:::key\n  j1[\"Kant: kontzepturik gabeko gustua, unibertsaltasun-asmoarekin\"]\n  bel --> q\n  q --> obj --> o1\n  q --> sub --> s1\n  bel -->|\"honek konpontzen du\"| jui --> j1\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-T7-02": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · 7. gaia",
  "title": "Arteari buruzko teoriak",
  "mermaid": "flowchart TD\n  art[\"ZER DA ARTEA?\"]:::axis\n  mim[\"Mimesia: errealitatea imitatzea\"]:::key\n  exp[\"Adierazpena: emozioak komunikatzea\"]:::key\n  form[\"Formalismoa: forma da garrantzitsua (artea artearengatik)\"]:::key\n  inst[\"Teoria instituzionala: artea da arte-munduak aitortzen duena\"]:::key\n  fun[\"artearen funtzioak\"]:::key\n  f1[\"estetikoa, kognitiboa, soziala eta kritikoa\"]\n  art --> mim\n  art --> exp\n  art --> form\n  art --> inst\n  art -->|\"betetzen ditu\"| fun --> f1\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-TA-01": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · Argudiaketa-tailerra",
  "title": "Argudioa: baliozkotasuna eta egia",
  "mermaid": "flowchart TD\n  arg[\"ARGUDIOA\"]:::axis\n  prem[\"premisak\"]:::key\n  conc[\"ondorioa\"]:::key\n  tipos[\"motak\"]:::key\n  ded[\"deduktiboa: ondorioa beharrez dator\"]\n  ind[\"induktiboa: ondorioa probablea baino ez da\"]\n  eval[\"ebaluazioa\"]:::key\n  val[\"baliozkotasuna: forma zuzena da\"]\n  ver[\"egia: premisak egiazkoak dira\"]\n  sol[\"sendoa: baliozkoa + premisa egiazkoak\"]:::key\n  arg --> prem\n  prem -->|\"hau babesten dute\"| conc\n  arg --> tipos\n  tipos --> ded\n  tipos --> ind\n  arg --> eval\n  eval --> val\n  eval --> ver\n  val -->|\"elkarrekin ematen dute\"| sol\n  ver -->|\"elkarrekin ematen dute\"| sol\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 },
 "FIL-TA-02": {
  "subject": "fil",
  "block": "F1",
  "tema": "Filosofia · Argudiaketa-tailerra",
  "title": "Faltsukeriak",
  "mermaid": "flowchart TD\n  fal[\"FALTSUKERIAK\"]:::axis\n  def[\"baliozkoak diruditen baina ez diren argudioak\"]\n  formal[\"formalak: hutsegitea egitura logikoan\"]:::key\n  inf[\"informalak: hutsegitea edukian edo hizkuntzan\"]:::key\n  ah[\"ad hominem: pertsonari erasotzea\"]\n  ap[\"ad populum: gehiengoari deitzea\"]\n  aver[\"ad verecundiam: aginteari deitzea\"]\n  fc[\"kausa faltsua: korrelazioa kausarekin nahastea\"]\n  hp[\"lastozko gizona: aurkariaren tesia desitxuratzea\"]\n  fal --> def\n  fal --> formal\n  fal --> inf\n  inf --> ah\n  inf --> ap\n  inf --> aver\n  inf --> fc\n  inf --> hp\nclassDef axis fill:#1f5d5a,color:#fff,stroke:#1f5d5a;\nclassDef key fill:#9a6a22,color:#fff,stroke:#9a6a22;"
 }
};
