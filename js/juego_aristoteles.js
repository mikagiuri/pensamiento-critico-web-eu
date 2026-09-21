// Datos del juego «El camino de la eudaimonía» (Aristóteles) — adaptado del material de
// gamificación del Gabriel Aresti BHI (BATX 2), traducido. Arte de cartas en media/juegos/aristoteles/.
// Modelo: se llevan tres bienes (Alma 🧠, Cuerpo 🏋️, Bienes externos 💰) + Phrónesis 🧭.
// Eudaimonía = Alma + Cuerpo + Bienes. Si cae a 0 o menos → fracaso existencial (fin).
const JUEGO_ARIS = {
  meta: { rounds: 10, imgBase: "media/juegos/aristoteles/" },
  chars: [
    { id:"socrates",  name:"Sócrates",       alma:9, cuerpo:5, bienes:3, phronesis:9, virtud:"Examen e ironía", debilidad:"Incomprendido", orient:"Contemplativa", frase:"Solo sé que no sé nada." },
    { id:"hipatia",   name:"Hipatia",        alma:9, cuerpo:4, bienes:5, phronesis:7, virtud:"Sabiduría", debilidad:"Desconfianza social", orient:"Contemplativa", frase:"El conocimiento es mi fuerza." },
    { id:"platon",    name:"Platón",         alma:9, cuerpo:5, bienes:6, phronesis:8, virtud:"Idealismo", debilidad:"Rigidez", orient:"Contemplativa", frase:"Que gobierne quien ama la sabiduría." },
    { id:"aspasia",   name:"Aspasia",        alma:8, cuerpo:4, bienes:7, phronesis:4, virtud:"Elocuencia", debilidad:"Dependencia", orient:"Discursiva", frase:"Las palabras también tienen poder." },
    { id:"aristofanes",name:"Aristófanes",   alma:6, cuerpo:5, bienes:6, phronesis:6, virtud:"Ingenio y sátira", debilidad:"Mordacidad", orient:"Discursiva", frase:"La risa también dice la verdad." },
    { id:"alcibiades",name:"Alcibíades",     alma:6, cuerpo:8, bienes:9, phronesis:3, virtud:"Carisma y audacia", debilidad:"Hedonismo", orient:"Política", frase:"Mi brillo guiará a los demás." },
    { id:"cleon",     name:"Cleón",          alma:3, cuerpo:6, bienes:8, phronesis:3, virtud:"Oratoria popular", debilidad:"Demagogia", orient:"Política", frase:"El pueblo quiere firmeza." },
    { id:"critias",   name:"Critias",        alma:4, cuerpo:6, bienes:8, phronesis:4, virtud:"Astucia política", debilidad:"Tiranía", orient:"Política", frase:"El orden se impone." },
    { id:"trasimaco", name:"Trasímaco",      alma:6, cuerpo:5, bienes:7, phronesis:2, virtud:"Astucia", debilidad:"Cinismo moral", orient:"Política", frase:"La justicia sirve al poderoso." },
    { id:"alejandro", name:"Alejandro Magno",alma:4, cuerpo:9, bienes:10,phronesis:4, virtud:"Ambición y mando", debilidad:"Desmesura", orient:"Política", frase:"El mundo no basta." }
  ],
  // Dilemas: cada opción con efectos sobre a(lma)/c(uerpo)/b(ienes)/phr y risk (dado, ayuda la phrónesis).
  dilemmas: [
    { virtue:"Valor (andreía)", sit:"Los enemigos están a las puertas de la ciudad.", opts:[
      { t:"Huir para salvar la vida", a:-3, b:-2 }, { t:"Ataque temerario al frente", c:-4, b:2, risk:true }, { t:"Organizar una defensa racional", a:2, risk:true } ] },
    { virtue:"Valor (andreía)", sit:"Humillan a un amigo en plena plaza.", opts:[
      { t:"Mirar hacia otro lado", a:-3, phr:-1 }, { t:"Responder con violencia", c:-2, b:-2 }, { t:"Intervenir con firmeza y palabra", a:2, phr:1 } ] },
    { virtue:"Valor (andreía)", sit:"Un gobierno corrupto te ofrece un cargo a cambio de tu silencio.", opts:[
      { t:"Aceptar el cargo y callar", b:4, a:-4 }, { t:"Denunciarlo en público", b:-3, a:3, risk:true }, { t:"Callar por miedo", a:-2, phr:-2 } ] },
    { virtue:"Templanza (sophrosýne)", sit:"Un banquete interminable de excesos.", opts:[
      { t:"Entregarte al placer", c:1, b:-2, a:-3 }, { t:"Rechazarlo todo con desprecio", a:-1, b:-1 }, { t:"Disfrutar con medida", a:2 } ] },
    { virtue:"Templanza (sophrosýne)", sit:"Puedes hacerte con el poder absoluto esta noche.", opts:[
      { t:"Tomarlo por la fuerza", b:5, a:-4, risk:true }, { t:"Renunciar sin más", phr:1, b:-1 }, { t:"Buscar un poder compartido y legítimo", a:2, phr:1, risk:true } ] },
    { virtue:"Templanza (sophrosýne)", sit:"Te ofrecen una fortuna por una obra deshonesta.", opts:[
      { t:"Aceptar", b:5, a:-5 }, { t:"Negarte", a:2, b:-1 } ] },
    { virtue:"Justicia (dikaiosýne)", sit:"Un amigo poderoso ha cometido un crimen.", opts:[
      { t:"Encubrirlo", b:2, a:-4, phr:-1 }, { t:"Denunciarlo sin piedad", a:1, c:-2, risk:true }, { t:"Buscar una justicia proporcionada", a:3, risk:true } ] },
    { virtue:"Justicia (dikaiosýne)", sit:"Como juez, un soborno cambiaría el veredicto.", opts:[
      { t:"Aceptar el soborno", b:4, a:-5 }, { t:"Juzgar con rectitud", a:3, b:-2 } ] },
    { virtue:"Justicia (dikaiosýne)", sit:"Puedes prosperar arruinando a otra familia.", opts:[
      { t:"Hacerlo", b:4, a:-4 }, { t:"Renunciar a ese beneficio", a:2 }, { t:"Pactar un reparto justo", a:1, b:1, phr:1, risk:true } ] },
    { virtue:"Generosidad (eleuthería)", sit:"Un ciudadano arruinado te pide ayuda.", opts:[
      { t:"Ignorarlo", a:-3 }, { t:"Darlo todo sin medida", b:-3, a:1 }, { t:"Ayudar con mesura", a:2, b:-1 } ] },
    { virtue:"Generosidad (eleuthería)", sit:"Recibes una herencia inesperada.", opts:[
      { t:"Acumularla", b:3, a:-2 }, { t:"Derrocharla en lujos", c:1, b:-4 }, { t:"Compartir parte con la ciudad", a:3, b:-1 } ] },
    { virtue:"Veracidad (alétheia)", sit:"Puedes mentir para salvar tu reputación.", opts:[
      { t:"Mentir con habilidad", b:2, a:-2, phr:-2 }, { t:"Soltar una verdad brutal", a:1, c:-2 }, { t:"Decir la verdad con prudencia", a:2, phr:1 } ] },
    { virtue:"Veracidad (alétheia)", sit:"Un sofista te reta a un debate público.", opts:[
      { t:"Vencer con trampas retóricas", b:2, a:-3 }, { t:"Rehuir el debate", a:-2, phr:-1 }, { t:"Debatir con honestidad", a:2, risk:true } ] },
    { virtue:"Veracidad (alétheia)", sit:"Descubres una verdad incómoda para la ciudad.", opts:[
      { t:"Ocultarla por prudencia", phr:1, a:-1 }, { t:"Proclamarla sin filtro", a:2, b:-3, risk:true }, { t:"Revelarla poco a poco", a:1, phr:1 } ] },
    { virtue:"Poder y ciudad", sit:"El pueblo reclama una guerra popular pero injusta.", opts:[
      { t:"Encabezarla para ganar fama", b:4, c:-3, a:-3, risk:true }, { t:"Oponerte en público", b:-3, a:3, risk:true }, { t:"Frenarla con argumentos", a:2, phr:1 } ] },
    { virtue:"Poder y ciudad", sit:"Estalla una peste; podrías acaparar el remedio.", opts:[
      { t:"Acapararlo y venderlo caro", b:5, a:-5 }, { t:"Repartirlo gratis", a:4, b:-3 }, { t:"Guardar solo lo tuyo", c:1, a:-2 } ] },
    { virtue:"Poder y ciudad", sit:"Un tirano te ofrece ser su consejero.", opts:[
      { t:"Aceptar por influencia", b:4, a:-4, phr:-1 }, { t:"Rechazar y exiliarte", b:-4, a:2, c:-1 }, { t:"Aceptar para moderarlo desde dentro", a:-1, phr:1, risk:true } ] },
    { virtue:"Existencia", sit:"Te enfrentas a un juicio injusto que puede condenarte a muerte.", opts:[
      { t:"Adular a los jueces para salvarte", a:-4, b:1 }, { t:"Defender tu verdad aunque mueras", a:5, c:-5, risk:true }, { t:"Aceptar el destierro", b:-3, a:1 } ] }
  ],
  // Cartas de azar: efecto por bien. `img` = arte disponible (si falta, tarjeta sin foto). `bad` marca las adversas.
  chance: [
    { t:"Apoyo del pueblo", d:"El pueblo se pone de tu lado.", b:3, a:1, img:"azar-apoyo" },
    { t:"Discurso sutil", d:"Tus palabras logran un equilibrio admirable.", a:2, img:"azar-sutil" },
    { t:"Reforma exitosa", d:"Una medida tuya sale bien.", a:2, b:1, img:"azar-reforma" },
    { t:"Inspiración", d:"Encuentras una claridad que ordena tu juicio.", phr:2, img:"azar-inspiracion" },
    { t:"Tratado de paz", d:"Se firma la paz y la ciudad respira.", c:2, b:1, img:"azar-paz" },
    { t:"Golpe de suerte", d:"La fortuna sonríe por una vez.", b:3, a:1, img:"azar-suerte" },
    { t:"Resistencia de las élites", d:"Los poderosos bloquean tu iniciativa.", b:-4, img:"azar-elites", bad:true },
    { t:"Reacción de los fanáticos", d:"Recibes una respuesta violenta.", c:-3, b:-2, img:"azar-fanaticos", bad:true },
    { t:"La peste", d:"Una epidemia asola la ciudad.", c:-5, img:"azar-peste", bad:true },
    { t:"Ruina económica", d:"Una mala inversión te deja sin recursos.", b:-5, img:"azar-ruina", bad:true },
    { t:"Traición", d:"Alguien de confianza te vende.", a:-4, b:-2, img:"azar-traicion", bad:true },
    { t:"Guerra civil", d:"El conflicto interno lo devora todo.", c:-4, b:-3, img:"azar-guerra", bad:true },
    { t:"Escándalo público", d:"Tu nombre se arrastra por el fango.", a:-3, b:-2, img:"azar-escandalo", bad:true },
    { t:"Destierro", d:"Te expulsan de la ciudad.", b:-4, a:-1, img:"azar-destierro", bad:true }
  ],
  chanceProb: 0.7,   // probabilidad de que salte una carta de azar tras cada decisión
  bands: [
    { min:26, emoji:"🌿", label:"Vida feliz y excelente" },
    { min:16, emoji:"⚖️", label:"Vida equilibrada" },
    { min:6,  emoji:"⚠️", label:"Vida conflictiva" },
    { min:1,  emoji:"🥀", label:"Vida al borde del fracaso" },
    { min:-999, emoji:"💀", label:"Fracaso existencial" }
  ],
  reflect: [
    "¿Quién ha alcanzado la mayor eudaimonía y por qué?",
    "¿Qué ha pesado más: los bienes externos, las virtudes del alma o el azar?",
    "Según Aristóteles, ¿por qué es tan importante la phrónesis (prudencia)?",
    "¿Puede la mala fortuna arruinar una vida virtuosa? ¿Hasta qué punto?",
    "¿Qué distingue la vida política, la discursiva y la contemplativa?"
  ]
};
