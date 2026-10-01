// Generado por web_i18n/i18n_rebuild.js (eu) a partir de web/js/pistas_uhs.js. No editar a mano: editar la memoria tm/eu.json y regenerar.
const PISTAS = [
 {
  "id": "ipc-falacias",
  "subject": "ipc",
  "tema": "Faltsukeriak",
  "unidad": "ipc-falacias",
  "materia": "Pentsamendu kritikoa · DBH 2",
  "titulo": "Zer da faltsukeria bat?",
  "lede": "Ikasi tranpa ezagutzen. Eskatu behar dituzun pistak bakarrik.",
  "ciclos": [
   {
    "fase": "1. fasea · Berreskuratzea",
    "etiqueta": "Hasierako galdera",
    "pregunta": "Zer da faltsukeria bat?",
    "intro": [
     "Saiatu zure hitzekin azaltzen. Ez duzu izen arraroren bat jakin beharrik."
    ],
    "pistas": [
     "Faltsukeria <em>argudio</em> mota bat da, ez gezur soil bat.",
     "Baditu trikimailu apur bat: lehen begiratuan argudio ona dirudi.",
     "Konbentzitzea lortzen du, baina bere arrazoiek ez diote benetan eusten esaten duenari.",
     "Faltsukeria <strong>ona dirudien baina ona ez den</strong> argudioa da: arrazoirik izan gabe konbentzitzen du."
    ],
    "comprobacion": {
     "pregunta": "Esaldi hauetatik zeinek azaltzen du hobekien zer den faltsukeria?",
     "opciones": [
      [
       "Ona dirudien argudioa, baina bere arrazoiek esaten duena frogatzen ez dutena.",
       true
      ],
      [
       "Edozein gezur.",
       false,
       "Gezurra zerbait faltsua jakinaren gainean esatea da. Faltsukeria arrazoitzean egindako hutsegitea da, erabiltzen duenak konturatu ere egiten ez badu ere."
      ],
      [
       "Ados ez nagoen iritzi bat.",
       false,
       "Ados ez egoteak ez du argudio bat faltsukeria bihurtzen: begiratu behar da ea bere arrazoiek ondorioari eusten dioten."
      ],
      [
       "Testu bateko ortografia-akatsa.",
       false,
       "Faltsukeriak arrazoitzean egindako akatsak dira, ez idaztean."
      ]
     ],
     "ok": "Ondo. Gakoa da argudio ona <em>dirudiela</em>, baina ez dela.",
     "mal": "Oraindik ez."
    },
    "rescate": [
     {
      "boton": "Adibide bat behar dut",
      "etiqueta": "Adibidea",
      "titulo": "Begiratu elkarrizketa hau",
      "definicion": [
       "Ane: «Gelan gehiago birziklatu beharko genuke: botatzen dugun papera aprobetxa daiteke».",
       "Iker: «Zuk? Baina beste egunean lata bat lurrera botatzen ikusi zintudan. Ez egin kasurik»."
      ],
      "parrafos": [
       "Ikerrek lortzen du gelak Aneren zalantza egitea. Baina esan al du ezer papera birziklatzeko ideiaren aurka?"
      ],
      "comprobacion": {
       "etiqueta": "Adibidearen egiaztapena",
       "pregunta": "Zer egiten du Ikerrek?",
       "opciones": [
        [
         "Aneri erasotzen dio, bere argudioari erantzun beharrean.",
         true
        ],
        [
         "Papera birziklatzeak ez duela balio frogatzen du.",
         false,
         "Ez du paperari buruz ezer esaten: Anek egin zuenaz bakarrik hitz egiten du."
        ],
        [
         "Anerena baino arrazoi hobea ematen du.",
         false,
         "Anek lata batekin egin zuenak ez du ezer esaten papera birziklatzea komeni den ala ez."
        ],
        [
         "Ezer arraro: argudio ona da.",
         false,
         "Konbentzitzen du, baina ez dio Anek proposatzen duenari erantzuten: hor dago tranpa."
        ]
       ],
       "ok": "Zuzen. Bere erantzunak argudio bat dirudi, baina ez du Aneren ideia ukitzen: faltsukeria da.",
       "mal": "Irakurri berriro elkarrizketa.",
       "intentos": 2
      }
     },
     {
      "etiqueta": "Definizioa eta azalpena",
      "titulo": "Faltsukeria",
      "definicion": [
       "<strong>Faltsukeria</strong> ona dirudien baina ona ez den argudioa da: arrazoirik izan gabe konbentzitzen du.",
       "Ez da gezur baten berdina: gauza egiazkoak esan eta gaizki arrazoitu dezakezu, edo faltsukeria bat erabili konturatu gabe.",
       "Horregatik ez da nahikoa izenak jakitea: trikimailua non dagoen ikusten ikasi behar da."
      ],
      "comprobacion": {
       "boton": "Ulermena egiaztatu",
       "etiqueta": "Azken egiaztapena",
       "pregunta": "Baieztapen hauetatik zein da egiazkoa?",
       "opciones": [
        [
         "Faltsukeria batek konbentzi dezake, bere arrazoiek ezer frogatzen ez badute ere.",
         true
        ],
        [
         "Faltsukeria batek beti esaten ditu gauza faltsuak.",
         false,
         "Gauza egiazkoak esan ditzake: hutsegitea nola arrazoitzen duen da."
        ],
        [
         "Engainatu nahi dutenek bakarrik erabiltzen dituzte faltsukeriak.",
         false,
         "Nahi gabe ere sartzen dira: horregatik komeni da haiek detektatzen ikastea."
        ],
        [
         "Argudio batek konbentzitzen badu, ezin da faltsukeria izan.",
         false,
         "Justu alderantziz: faltsukeriak arriskutsuak dira konbentzitzen dutelako."
        ]
       ],
       "ok": "Zuzen.",
       "mal": "Oraindik ez."
      }
     }
    ]
   },
   {
    "fase": "2. fasea · Sakontzea",
    "etiqueta": "Galdera berria",
    "pregunta": "Zergatik da tranpa pertsonari erasotzea, bere argudioari erantzun beharrean?",
    "intro": [
     "Ikerrek egin zuenak izena du: <em>ad hominem</em> («pertsonaren aurka»). Pentsatu zergatik ez duen erantzun gisa balio."
    ],
    "pistas": [
     "Bereizi bi gauza: <em>nork</em> esaten duen zerbait eta <em>zer</em> esaten duen.",
     "Ideia bat ona izan daiteke, betetzen ez duen norbaitek esan arren.",
     "Norbaitek pertsona kritikatzen badu, ideia hor jarraitzen du, erantzunik gabe.",
     "Eraso pertsonalak arreta desbideratzen du: elkarrizketa ideiatik pertsonara pasatzen da, eta ideia eztabaidatu gabe geratzen da."
    ],
    "comprobacion": {
     "pregunta": "Erantzun hauetatik zein da pertsonaren aurkako erasoa?",
     "opciones": [
      [
       "«Ez egin kasurik mugikorrari buruz esaten duenari: astuna da».",
       true
      ],
      [
       "«Mugikorrak gelan distraitzen duela dio, baina beste zerbait diote ikerketa batzuek».",
       false,
       "Hemen mugikorrari buruzko arrazoi batekin erantzuten da, ez pertsonaren aurka."
      ],
      [
       "«Baliteke arrazoia izatea, baina datuak ikusi nahiko nituzke».",
       false,
       "Frogak eskatzea ideia bati erantzuteko modu zentzuzkoa da."
      ],
      [
       "«Ez nago ados, mugikorrak informazioa bilatzeko ere balio duelako».",
       false,
       "Kontraargudio bat da: ideia eztabaidatzen du, ez esaten duena."
      ]
     ],
     "ok": "Hala da. «Astuna da» esateak ez du mugikorrari buruz ezer esaten: hitz egiten duena gutxiesten du bakarrik.",
     "mal": "Ez zehazki."
    },
    "rescate": [
     {
      "boton": "Azalpena erakutsi",
      "etiqueta": "Ad hominem faltsukeria",
      "titulo": "Pertsonaren aurka",
      "definicion": [
       "<strong>Ad hominem</strong> faltsukeria pertsonari erasotzean datza (nolakoa den, zer egin zuen, nondik datorren), esaten duenari erantzun beharrean.",
       "Tranpa da ideia ukitzen ez duelako: proposamen bat ez da hobea ez okerragoa nork esaten duen arabera.",
       "Ondo erantzuteko, galdetu zeure buruari: zer arrazoi ematen ditu? Onak dira? Hori da eztabaidatu behar dena."
      ],
      "comprobacion": {
       "boton": "Egiaztatuz amaitu",
       "pregunta": "Zerbait proposatzen duenak betetzen ez badu, zer esan dezakegu bere proposamenaz?",
       "opciones": [
        [
         "Ezer ez oraindik: bere arrazoiak aztertu behar dira, ez pertsona.",
         true
        ],
        [
         "Proposamena faltsua dela.",
         false,
         "Norbaitek ideia bat ez betetzeak ez du faltsu bihurtzen."
        ],
        [
         "Ez dela entzun behar.",
         false,
         "Hori da hain zuzen faltsukeria: ideia pertsonagatik baztertzea."
        ],
        [
         "Proposamena egiazkoa dela.",
         false,
         "Hori ere ez: pertsonak ez du kontatzen ez alde ez aurka."
        ]
       ],
       "ok": "Zuzen: ideia bere arrazoien arabera epaitzen da.",
       "mal": "Irakurri berriro azalpena."
      }
     }
    ]
   }
  ],
  "cierre": {
   "titulo": "Badakizu trikimailua detektatzen",
   "parrafos": [
    "Faltsukeria ona dirudien baina ona ez den argudioa da. Pertsonaren aurkako erasoa (ad hominem) ohikoenetako bat da: gaiz aldatzen du eta ideia erantzunik gabe uzten du.",
    "Erronka: bilatu gaur benetako adibide bat (sareetan, telebistan, eztabaida batean) eta azaldu non dagoen tranpa."
   ]
  }
 }
];
