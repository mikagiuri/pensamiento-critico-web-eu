// Generado por web_i18n/i18n_rebuild.js (eu) a partir de web/js/camino.js. No editar a mano: editar la memoria tm/eu.json y regenerar.
const CAMINOS = [
 {
  "id": "audio",
  "subject": "ipc",
  "emoji": "🔊",
  "titulo": "Taldeko audioa",
  "tema": "Buloak eta hedabideak",
  "intro": "Audio bat dabil klaseko taldean. Zer egiten duzu zuk harekin?",
  "start": "inicio",
  "escenas": {
   "inicio": {
    "texto": "Igandea, 22:30. Klaseko WhatsApp taldean norbaitek audio bat birbidaltzen du: ahots batek dio bihar institutua itxiko dutela zimitz-izurri batengatik eta «zuzendariak esan duela». Bost minututan berrogei mezu daude.",
    "opciones": [
     {
      "t": "Nire familiaren taldera eta taldekideen taldera birbidaltzea.",
      "to": "reenvio"
     },
     {
      "t": "Taldean galdetzea: «Nork esan du? Ba al dago ezer ofizialik?»",
      "to": "preguntar"
     },
     {
      "t": "Lehenik institutuaren webgunea eta jakinarazpen ofizialak begiratzea.",
      "to": "comprobar"
     }
    ]
   },
   "reenvio": {
    "texto": "Zure amak lanean abisatzen du bihar ezin izango duela joan, zure anaiarekin geratuko delako. Bitartean, taldean norbaitek idazten du: «Nondik atera da hau? Webgunean ez dago ezer».",
    "opciones": [
     {
      "t": "Tematzea: «Hainbeste jendek esaten badu, egia izango da».",
      "to": "f_bulo"
     },
     {
      "t": "Mezua ezabatzea eta egiaztatuta ez dagoela abisatzea.",
      "to": "f_rectificar"
     }
    ]
   },
   "preguntar": {
    "texto": "Erantzuten dizute: «Aneren lehengusinak esan du, zuzendaria ezagutzen du eta». Pare batek jai-zapuztaile deitzen dizute galdetzeagatik.",
    "opciones": [
     {
      "t": "Isilik geratzea, gaizki ez geratzeko.",
      "to": "f_silencio"
     },
     {
      "t": "Birbidaltzen jarraitu aurretik egiaztatzea proposatzea.",
      "to": "comprobar"
     }
    ]
   },
   "comprobar": {
    "texto": "Institutuaren webgunean ez dago ezer. Audioko esaldi bat bilatzen duzu interneten eta agertu egiten da: duela bi urteko audio bat da… eta beste hiri bateko institutu batekoa.",
    "opciones": [
     {
      "t": "Taldean kontatzea eta esteka jartzea.",
      "to": "f_detective"
     },
     {
      "t": "Ezer ez esatea: «Ez da nire arazoa».",
      "to": "f_silencio"
     }
    ]
   }
  },
  "finales": {
   "f_bulo": {
    "emoji": "📣",
    "titulo": "Bulo kateatua",
    "texto": "Audioa ehunka pertsonarengana iristen da. Biharamunean institutua ohi bezala irekitzen da, eta hainbat familiak beren eguna alferrik berrantolatu dute.",
    "idea": "«Jende askok esaten badu, egia izango da» faltsukeria bat da: gehiengoari deia. Bulo bat ez da egia bihurtzen errepikatzeagatik; arriskutsuago bihurtzen da."
   },
   "f_rectificar": {
    "emoji": "↩️",
    "titulo": "Zuzentzea ere pentsatzea da",
    "texto": "Zure mezuak birbidaltzera zihoazen hainbat pertsona gelditzen ditu. Kosta egin zaizu akatsa onartzea, baina taldeak eskertu egiten du.",
    "idea": "Edonori gertatzen zaio oker ibiltzea; garrantzitsuena zuzentzea da. Frogen aurrean iritziz aldatzea ez da ahultasuna: kritikoki pentsatzea da."
   },
   "f_silencio": {
    "emoji": "🤐",
    "titulo": "Isiltasunak ere badu garrantzia",
    "texto": "Buloak zabaltzen jarraitzen du. Zuk bazenekien (edo susmatzen zenuen) faltsua zela, baina nabarmen ez geratzea nahiago izan zenuen.",
    "idea": "«Isiltasunaren espirala»: gehiengoak bestela pentsatzen duela uste dugunean, isildu egiten gara, eta horrela akatsa are gehiengoagoa dela dirudi. Isiltzea ere erabakitzeko modu bat da."
   },
   "f_detective": {
    "emoji": "🕵️",
    "titulo": "Buloen detektibea",
    "texto": "Estekarekin, taldea lasaitu egiten da. Norbaitek eskerrak ere ematen dizkizu. Bihar eskola dago, beti bezala.",
    "idea": "Sinetsi edo partekatu aurreko lau galderak: nork dio (iturria)?, noizkoa da (data)?, beste leku fidagarri batzuek baieztatzen dute (kontrastea)?, nork irabazten du nik sinesten badut (interesa)?"
   }
  }
 },
 {
  "id": "foto",
  "subject": "ipc",
  "emoji": "📸",
  "titulo": "Jolas-orduko argazkia",
  "tema": "Taldearen presioa",
  "intro": "Zure koadrilak ikaskide baten argazki bat igo nahi du. Denak zuri begira daude.",
  "start": "inicio",
  "escenas": {
   "inicio": {
    "texto": "Jolas-orduan, zure koadrila barrez ari da Ikerren argazki batekin —zure klasekoa da—, Gorputz Hezkuntzan estropezu egiten. Mikelek Instagramera meme batekin igotzea proposatzen du. Denak zuri begira daude, zure erreakzioaren zain.",
    "opciones": [
     {
      "t": "Barre egitea eta esatea: «Igo ezazu!».",
      "to": "sube"
     },
     {
      "t": "Esatea: «Ni ez, hori gehiegi da».",
      "to": "paso"
     },
     {
      "t": "Ezer ez esatea eta gaia aldatzea.",
      "to": "callo"
     }
    ]
   },
   "sube": {
    "texto": "Argazkiak berrehun «atsegin dut» eta iruzkin mordoa lortzen ditu. Biharamunean Iker ez da klasera etortzen. Taldean diote: «Txantxa bat zen, ez du ezer jasaten».",
    "opciones": [
     {
      "t": "Arrazoia ematea: «Txantxa bat besterik ez zen».",
      "to": "f_broma"
     },
     {
      "t": "Ikerri pribatuan idaztea, nola dagoen jakiteko.",
      "to": "f_reparar"
     }
    ]
   },
   "paso": {
    "texto": "Mikelek iseka egiten du: «Zein aspergarria zaren». Baina Unaik, isilik zegoenak, begiratu eta baietz egiten dizu buruarekin: zuk bezala pentsatzen duela dirudi.",
    "opciones": [
     {
      "t": "Nire arrazoiak azaltzea eta Unairen babesa bilatzea.",
      "to": "f_valiente"
     },
     {
      "t": "Amore ematea, kanpoan ez geratzeko.",
      "to": "sube"
     }
    ]
   },
   "callo": {
    "texto": "Argazkia igo egiten dute hala ere. Arratsalde osoan ezin duzu horretan pentsatzeari utzi, eta deseroso sentitzen zara.",
    "opciones": [
     {
      "t": "Ikerrekin hitz egitea edo tutoreari kontatzea.",
      "to": "f_reparar"
     },
     {
      "t": "Ahaztea: «Nik ez dut ezer egin».",
      "to": "f_testigo"
     }
    ]
   }
  },
  "finales": {
   "f_broma": {
    "emoji": "😶",
    "titulo": "Txantxa bat besterik ez?",
    "texto": "Ikerrek egunak behar ditu itzultzeko eta taldea saihesten du. Argazkiak zabaltzen jarraitzen du, nahiz eta zuek ezabatu duzuen.",
    "idea": "Txantxa bat denentzat da barregarria; batzuk bakarrik barre egiten badute beste baten kontura, umiliazio bat da. Internetera igotzen dena ezin da guztiz jaso."
   },
   "f_reparar": {
    "emoji": "🤝",
    "titulo": "Inoiz ez da berandu konpontzeko",
    "texto": "Ikerrek mezua eskertzen du. Tutorearen laguntzarekin, argazkia kentzen da eta gaia tutoretzan lantzen da.",
    "idea": "Kaltea konpontzea (barkamena eskatzea, ondoan egotea, heldu bati abisatzea) ere alde hartzea da. Enpatia: bestearen lekuan jartzea eta horren arabera jokatzea."
   },
   "f_valiente": {
    "emoji": "🦁",
    "titulo": "Taldean ezetz esatea",
    "texto": "Unai zure alde dagoela, plana hustu egiten da. Argazkia ez da igotzen. Mikelek marmar egiten du, baina ez da ezer gehiago gertatzen.",
    "idea": "Asch-en esperimentuan, nahikoa zen taldeko pertsona bakar batek bat ez etortzea besteak pentsatzen zutena esatera ausartzeko. Aliatu batek dena aldatzen du."
   },
   "f_testigo": {
    "emoji": "👀",
    "titulo": "Lekukoak ere erabakitzen du",
    "texto": "Inork ez zaitu errudun jotzen, baina argazkiak min egiten du eta zuk bazenekien. Beste batzuetan berriro gertatuko da.",
    "idea": "Jazarpenean ez daude erasotzen duena eta jasaten duena bakarrik: lekukoak ere badaude. Ikusleek egiten dutenak (edo egiten ez dutenak) erabakitzen du askotan istorioa nola amaitzen den."
   }
  }
 }
];
