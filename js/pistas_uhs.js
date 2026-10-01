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
 },
 {
  "id": "ipc-sesgos",
  "subject": "ipc",
  "tema": "Alborapenak",
  "unidad": "ipc-sesgos",
  "materia": "Pentsamendu kritikoa · DBH 2",
  "titulo": "Zer da baieztapen-alborapena?",
  "lede": "Kanpoan ez, gure buruaren barruan dagoen tranpa bat. Eskatu behar dituzun pistak bakarrik.",
  "ciclos": [
   {
    "fase": "1. fasea · Berreskuratzea",
    "etiqueta": "Hasierako galdera",
    "pregunta": "Zer da baieztapen-alborapena?",
    "intro": [
     "Saiatu zure hitzekin azaltzen. Pentsatu zerbaitez ziur dagoen eta arrazoia ematen dionari bakarrik kasu egiten dion norbaitengan."
    ],
    "pistas": [
     "Alborapena buruaren lasterbide bat da, okerreko moduan pentsarazten diguna konturatu gabe.",
     "Faltsukeriak argudioetan daude; alborapenak, aldiz, gure <em>barruan</em> daude.",
     "Begiratu «berrespen» hitzari: zer nahi dugu berretsi?",
     "Lehendik pentsatzen genuena <strong>berresten duena bakarrik bilatzeko eta sinesteko</strong> joera da, eta kontra egiten digunari ez ikusiarena egitekoa."
    ],
    "comprobacion": {
     "pregunta": "Kasu hauetatik, zein da berrespen-alborapena?",
     "opciones": [
      [
       "Nire ikaskidea jatorra ez dela uste dut, eta hori berresten duten keinuei bakarrik erreparatzen diet.",
       true
      ],
      [
       "Iritziz aldatzen naiz datu berriak ikusi ondoren.",
       false,
       "Hori justu kontrakoa da: frogek pentsatzen duzuna aldatzen uztea."
      ],
      [
       "Hainbat pertsonari galdetzen diet erabaki aurretik.",
       false,
       "Iritzi desberdinak bilatzeak alborapena saihesten laguntzen du."
      ],
      [
       "Batuketa batean huts egiten dut, arreta faltagatik.",
       false,
       "Akats bat da, baina ez du zerikusirik lehendik pentsatzen zenuena berrestearekin."
      ]
     ],
     "ok": "Ondo. Alborapenak ikusten duguna iragazten du, lehendik uste genuenarekin bat etor dadin.",
     "mal": "Oraindik ez."
    },
    "rescate": [
     {
      "boton": "Adibide bat behar dut",
      "etiqueta": "Adibidea",
      "titulo": "Leireren matematikak",
      "definicion": [
       "Leirek pentsatzen du: «Matematikak fatal ematen zaizkit».",
       "Primeran gogoratzen du urrian suspenditu zuen azterketa.",
       "Baina ahaztu egiten zaizkio gero gainditu zituen hirurak, eta atzo bakarrik ebatzi zuela problema zail bat."
      ],
      "parrafos": [
       "Zer ari da egiten Leireren burua bere oroitzapenekin?"
      ],
      "comprobacion": {
       "etiqueta": "Adibidearen egiaztapena",
       "pregunta": "Zer gertatzen zaio Leireri?",
       "opciones": [
        [
         "Bere ideia berresten duena bakarrik gogoratzen du, eta kontra egiten diona ahazten du.",
         true
        ],
        [
         "Oroimen txarra du denetarako.",
         false,
         "Suspentsoa oso ondo gogoratzen du: bere oroimenak aukeratzen du zer gorde."
        ],
        [
         "Arrazoi du: matematikak fatal ematen zaizkio.",
         false,
         "Datuek (hiru gainditu eta problema zail bat ebatzita) beste zerbait diote."
        ],
        [
         "Nahita gezurra esaten du.",
         false,
         "Ez du gezurrik esaten: alborapenak konturatu gabe jokatzen du."
        ]
       ],
       "ok": "Zuzen. Aurretiko ideiak erabakitzen du zer gogoratzen duen: hori da berrespen-alborapena.",
       "mal": "Irakurri berriro kasua.",
       "intentos": 2
      }
     },
     {
      "etiqueta": "Definizioa eta azalpena",
      "titulo": "Berrespen-alborapena",
      "definicion": [
       "<strong>Berrespen-alborapena</strong> lehendik pentsatzen genuena berresten duena bakarrik bilatzeko, gogoratzeko eta sinesteko joera da.",
       "Kontra egiten diguna ez dugu ikusten, ahaztu egiten dugu edo gutxietsi egiten dugu.",
       "Ez da gezurra esatea ezta tontoa izatea ere: denoi gertatzen zaigu. Horregatik ikasi behar da zaintzen."
      ],
      "comprobacion": {
       "boton": "Ulermena egiaztatu",
       "etiqueta": "Azken egiaztapena",
       "pregunta": "Berrespen-alborapenari buruzko esaldi hauetatik, zein da egia?",
       "opciones": [
        [
         "Denoi eragiten digu, konturatu ez arren.",
         true
        ],
        [
         "Adimen gutxiko pertsonei bakarrik gertatzen zaie.",
         false,
         "Denei gertatzen zaie, oso azkarrak direnei ere bai."
        ],
        [
         "Gezurra esatearen berdina da.",
         false,
         "Gezurra esaten duenak badaki zerbait faltsua esaten ari dela; alborapenak guk nabaritu gabe jokatzen du."
        ],
        [
         "Besteak konbentzitzeko erabiltzen dugun faltsukeria bat da.",
         false,
         "Faltsukeriak argudioetan daude; alborapenak, gure buruaren barruan."
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
    "pregunta": "Zer egin dezakegu berrespen-alborapenean ez erortzeko?",
    "intro": [
     "Alborapena gure barruan badago, ez da nahikoa badagoela jakitea. Zer ohiturak lagun diezazukete hura zaintzen?"
    ],
    "pistas": [
     "Alborapenak arrazoia ematen diguna bakarrik bilatzera garamatza. Zer gertatuko litzateke kontrakoa egingo bazenu?",
     "Sare sozialek batez ere lehendik gustatzen zaiguna erakusten digute. Pentsatu horrek zer egiten duen gure ideiekin.",
     "Galdera on bat hau da: «Zerk aldaraziko ninduke iritziz?».",
     "Bilatu nahita kontra egiten dizuten frogak eta iritziak, eta entzun itzazu erabaki aurretik."
    ],
    "comprobacion": {
     "pregunta": "Ohitura hauetatik, zeinek laguntzen du gehien berrespen-alborapena saihesten?",
     "opciones": [
      [
       "Nahita bilatzea pentsatzen dudanaren kontra doan informazioa.",
       true
      ],
      [
       "Ni bezala pentsatzen duten kontuak bakarrik jarraitzea.",
       false,
       "Horrek alborapena elikatzen du: lehendik arrazoia ematen dizuna bakarrik ikusiko duzu."
      ],
      [
       "Inoiz iritziz ez aldatzea, koherentea izateko.",
       false,
       "Koherentea izatea ez da inoiz ez aldatzea: arrazoi onak agertzen badira, aldatzea zentzuzkoa da."
      ],
      [
       "Azkar erabakitzea, zalantzarik ez izateko.",
       false,
       "Presak buruaren lasterbideen alde egiten du, eta alborapena horietako bat da."
      ]
     ],
     "ok": "Hala da. Kontra egiten dizuna bilatzea da alborapenaren aurkako txertorik onena.",
     "mal": "Ez zehazki."
    },
    "rescate": [
     {
      "boton": "Azalpena erakutsi",
      "etiqueta": "Antidotoak",
      "titulo": "Nola zaindu alborapena",
      "definicion": [
       "<strong>Bilatu kontrakoa.</strong> Erabaki aurretik, bilatu gutxienez arrazoi edo datu bat pentsatzen duzunaren kontra.",
       "<strong>Galdetu zeure buruari zerk aldaraziko zintuzkeen iritziz.</strong> Erantzuna «ezerk ez» bada, kontuz: ez zaude pentsatzen, defendatzen baizik.",
       "<strong>Hautsi burbuila.</strong> Sareek lehendik gustatzen zaizuna erakusten dizute: entzun desberdin pentsatzen duenari ere."
      ],
      "comprobacion": {
       "boton": "Egiaztatuz amaitu",
       "pregunta": "Ezerk ezin bazaitu iritziz aldarazi, zer gertatzen zaizu?",
       "opciones": [
        [
         "Seguruenik ideia bat defendatzen ari zarela, hura pentsatu beharrean.",
         true
        ],
        [
         "Arrazoi osoa duzula.",
         false,
         "Kontrako frogarik ezin irudikatzea alarma-seinale bat da, ez asmatu duzunaren seinale."
        ],
        [
         "Oso koherentea zarela.",
         false,
         "Koherentzia ez datza frogei ixtean."
        ],
        [
         "Ezer ez: normala da.",
         false,
         "Normala da, baina justu hori da zaindu behar dena."
        ]
       ],
       "ok": "Zuzen: pentsatzea arrazoi onak badaude aldatzeko prest egotea da.",
       "mal": "Irakurri berriro azalpena."
      }
     }
    ]
   }
  ],
  "cierre": {
   "titulo": "Badakizu zure burua zaintzen",
   "parrafos": [
    "Berrespen-alborapenak lehendik pentsatzen genuena berresten duena bakarrik bilatzera eta gogoratzera garamatza. Denoi gertatzen zaigu; antidotoa nahita kontra egiten diguna bilatzea da.",
    "Erronka: aukeratu oso ziur zauden ideia bat eta bilatu gaur haren kontrako argudio on bat."
   ]
  }
 },
 {
  "id": "ipc-medios",
  "subject": "ipc",
  "tema": "Begiratu hedabideak lupaz",
  "unidad": "ipc-medios",
  "materia": "Pentsamendu kritikoa · DBH 2",
  "titulo": "Nola jakin albiste bat buloa den?",
  "lede": "Sinetsi edo birbidali aurretik, begiratu lupaz. Eskatu behar dituzun pistak bakarrik.",
  "ciclos": [
   {
    "fase": "1. fasea · Berreskuratzea",
    "etiqueta": "Hasierako galdera",
    "pregunta": "Zer da buloa eta zergatik zabaltzen da hain azkar?",
    "intro": [
     "Pentsatu «bidali denei!» zekarren azken mezuan. Saiatu azaltzen laguntza eskatu aurretik."
    ],
    "pistas": [
     "Buloa (edo <em>fake news</em>) albiste bat da, baina arazo batekin.",
     "Faltsua da, nahiz eta egiazkoa balitz bezala aurkezten den.",
     "Buloek emozioa ukitu ohi dute: beldurra, amorrua edo barrea eragiten dute.",
     "Buloa <strong>egiazko gisa zabaltzen den albiste faltsua</strong> da; hain azkar zabaltzen da barrutik astintzen gaituelako eta pentsatu gabe partekatzeko gogoa ematen duelako."
    ],
    "comprobacion": {
     "pregunta": "Zergatik zabaltzen dira hain azkar buloak?",
     "opciones": [
      [
       "Emozioa ukitzen dutelako eta egiaztatu gabe partekatzeko gogoa ematen dutelako.",
       true
      ],
      [
       "Egunkari serioenek argitaratzen dituztelako beti.",
       false,
       "Buloak mezu eta sare sozialetan ibili ohi dira, askotan iturri argirik gabe."
      ],
      [
       "Benetako albisteak baino aspergarriagoak direlako.",
       false,
       "Alderantziz: arreta erakartzeko pentsatuta daude."
      ],
      [
       "Jendeak beti egiaztatzen duelako dena birbidali aurretik.",
       false,
       "Hala egingo bagenu, buloak ez lirateke hain azkar zabalduko."
      ]
     ],
     "ok": "Ondo. Emozioa egiaztapena baino azkarrago doa.",
     "mal": "Oraindik ez."
    },
    "rescate": [
     {
      "boton": "Adibide bat behar dut",
      "etiqueta": "Adibidea",
      "titulo": "Mezu bat klaseko taldean",
      "definicion": [
       "«PREMIAZKOA!! Bihar institutu guztiak itxiko dituzte birus berri baten ondorioz. Nire izebaren lagun den mediku batek esan du. Bidali denei!!»",
       "Ez du esaten zein medikuk, ezta zein iturri ofizialek argitaratu duen ere.",
       "Letra larriz idatzita dago, presaz eta beldurrez."
      ],
      "parrafos": [
       "Zer alarma-seinale ikusten dituzu mezu honetan?"
      ],
      "comprobacion": {
       "etiqueta": "Adibidearen egiaztapena",
       "pregunta": "Zein da buloa izan daitekeelako seinalerik onena?",
       "opciones": [
        [
         "Ez du iturri identifikagarririk, eta presaka birbidaltzea nahi du.",
         true
        ],
        [
         "Institutuei buruz ari da.",
         false,
         "Gaiak ez du buloa bihurtzen: iturririk ez izatea da hutsegitea."
        ],
        [
         "Klaseko norbaitek bidali du.",
         false,
         "Birbidaltzen duena konfiantzazkoa izan daiteke eta, hala ere, bulo bat sinetsi izana."
        ],
        [
         "Gaztelaniaz dago.",
         false,
         "Hizkuntzak ez du zerikusirik."
        ]
       ],
       "ok": "Zuzen: iturririk gabe, premiaz eta beldurrez badator, kontu handiz.",
       "mal": "Irakurri berriro mezua.",
       "intentos": 2
      }
     },
     {
      "etiqueta": "Definizioa eta azalpena",
      "titulo": "Buloa eta post-egia",
      "definicion": [
       "<strong>Buloa</strong> egiazko gisa zabaltzen den albiste faltsua da.",
       "<strong>Post-egiaren</strong> garaian bizi gara: askotan emozioek eta sinesmenek egiaztatutako gertaerek baino pisu handiagoa dute.",
       "Horregatik, edozein mezuren aurrean lehen galdera hau da: <strong>nork bidaltzen du eta zer irabazten du horrekin?</strong>"
      ],
      "comprobacion": {
       "boton": "Ulermena egiaztatu",
       "etiqueta": "Azken egiaztapena",
       "pregunta": "Zer da post-egia?",
       "opciones": [
        [
         "Emozioek eta sinesmenek egiaztatutako gertaerek baino pisu handiagoa duten egoera.",
         true
        ],
        [
         "Gertaera baten ondoren argitaratzen den albistea.",
         false,
         "Ez du zerikusirik denboran duen ordenarekin."
        ],
        [
         "Zientzialariek egiaztatutako egia.",
         false,
         "Ia kontrakoa da: gertaerek pisua galtzen dute emozioen aurrean."
        ],
        [
         "Sare sozial mota bat.",
         false,
         "Fenomeno bat da, ez plataforma bat."
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
    "pregunta": "Zer egin behar dut albiste bat sinetsi edo birbidali aurretik?",
    "intro": [
     "Badakizu zer den buloa. Orain pentsatu plan bat: zer urrats egingo zenituzke «birbidali» sakatu aurretik?"
    ],
    "pistas": [
     "Lehenik, gelditu: mezu batek presa handia sartzen badizu, susmatu.",
     "Begiratu nondik datorren: nork sinatzen du? Iturri ezaguna eta fidagarria da?",
     "Bilatu beste iturri fidagarri batzuek gauza bera kontatzen duten.",
     "Sinetsi edo partekatu aurretik, <strong>egiaztatu</strong>: begiratu informazioa iturri fidagarri batzuetan."
    ],
    "comprobacion": {
     "pregunta": "Zer esan nahi du informazio bat egiaztatzeak?",
     "opciones": [
      [
       "Iturri fidagarri batzuetan begiratzea, sinetsi aurretik.",
       true
      ],
      [
       "Jende askori birbidaltzea, zer iritzi duten ikusteko.",
       false,
       "Horrela zabaltzen da buloa: lehenik egiaztatu egiten da eta gero, beharbada, partekatu."
      ],
      [
       "Sinestea «atsegin dut» asko baditu.",
       false,
       "Ospeak ez du frogatzen zerbait egia denik."
      ],
      [
       "Titularra bakarrik irakurtzea.",
       false,
       "Titularrak engaina dezake: iturria eta edukia begiratu behar dira."
      ]
     ],
     "ok": "Hala da. Egiaztatzea iturri fidagarriekin kontrastatzea da.",
     "mal": "Ez zehazki."
    },
    "rescate": [
     {
      "boton": "Erakutsi urratsak",
      "etiqueta": "Birbidali aurretik",
      "titulo": "Lau urrats",
      "definicion": [
       "<strong>1. Gelditu.</strong> Beldurra, amorrua edo presa sentitzen baduzu, hartu arnasa ezer egin aurretik.",
       "<strong>2. Begiratu iturria.</strong> Nork dio? Hedabide edo erakunde ezaguna da?",
       "<strong>3. Kontrastatu.</strong> Bilatu beste iturri fidagarri batzuek gauza bera kontatzen duten.",
       "<strong>4. Erabaki.</strong> Ezin baduzu egiaztatu, ez birbidali."
      ],
      "comprobacion": {
       "boton": "Egiaztatuz amaitu",
       "pregunta": "Ez duzu mezu bat berresten duen iturri fidagarririk aurkitzen. Zer egiten duzu?",
       "opciones": [
        [
         "Ez dut birbidaltzen.",
         true
        ],
        [
         "Birbidali egiten dut, badaezpada egia bada.",
         false,
         "«Badaezpada» da, hain zuzen, buloak zabaltzeko modua."
        ],
        [
         "Birbidali egiten dut, «ez dakit egia den» gehituta.",
         false,
         "Hala ere, zabaltzen ari zara."
        ],
        [
         "Sinetsi egiten dut, baina ez diot inori esaten.",
         false,
         "Iturri fidagarririk gabe, ez dago sinesteko arrazoirik ere."
        ]
       ],
       "ok": "Zuzen: egiaztatu ezin dena ez da partekatzen.",
       "mal": "Irakurri berriro urratsak."
      }
     }
    ]
   }
  ],
  "cierre": {
   "titulo": "Hedabideei lupaz begiratzen diezu jada",
   "parrafos": [
    "Buloa egiazko gisa zabaltzen den albiste faltsua da, emozioa ukitzen duelako. Sinetsi edo birbidali aurretik: gelditu, begiratu iturria, kontrastatu eta, ezin baduzu egiaztatu, ez partekatu.",
    "Erronka: hartu aste honetako mezu edo titular bat eta aplikatu lau urratsak."
   ]
  }
 }
];
