"use strict";
/* ===== Juego «El Ágora» (debate) ===== datos de los debates =====
   El jugador defiende una tesis contra un rival guionado. Cada ronda:
   1) el rival argumenta (a veces con falacia, a veces válido); 2) el jugador
   detecta si hay falacia; 3) construye su réplica eligiendo una opción (solo
   una es limpia; las demás esconden una falacia). Un jurado se mueve según
   los aciertos. Falacias procedentes de fil/TA01-02 y del glosario. */
const DEBATE_DECKS = [
  {
    id: "etica", subject: "fil", emoji: "⚖️", nombre: "Ética · la pena de muerte",
    tesis: "La pena de muerte debería abolirse.",
    postura: "Defiendes la abolición: el Estado no debe matar.",
    rondas: [
      {
        rival: "Si alguien mata, merece morir: ojo por ojo.",
        falacia: "ad-baculum", falacia_nombre: "Apelación a la fuerza (ojo por ojo)",
        por_que: "Reclama venganza, no razones. Que algo «se merezca» no demuestra que sea justo ni que funcione.",
        opciones: [
          { t: "El castigo debe justificarse por su utilidad (prevención) o por la justicia, no por venganza; y no está probado que disuada.", valida: true },
          { t: "Todo el mundo está de acuerdo en que quien mata merece morir.", falacia: "ad-populum" },
          { t: "Solo defiende a los asesinos quien no ha sufrido a una víctima.", falacia: "ad-hominem" }
        ]
      },
      {
        rival: "Todos los países serios mantienen la pena de muerte; es lo natural.",
        falacia: "ad-populum", falacia_nombre: "Apelación a la mayoría",
        por_que: "Que muchos países la mantengan no prueba que sea correcta: la mayoría también puede equivocarse.",
        opciones: [
          { t: "El valor de una ley no depende de cuántos países la tengan, sino de las razones y las pruebas que la sostienen.", valida: true },
          { t: "Un filósofo célebre la defendió, así que debe de ser justa.", falacia: "ad-verecundiam" },
          { t: "O la mantenemos o los criminales se ríen de la justicia.", falacia: "falso-dilema" }
        ]
      },
      {
        rival: "Donde hay pena de muerte hay menos homicidios, así que funciona.",
        falacia: "post-hoc", falacia_nombre: "Causa falsa (confundir correlación con causalidad)",
        por_que: "Que dos cosas ocurran juntas no prueba que una cause la otra; influyen la renta, la policía o la cultura.",
        opciones: [
          { t: "Los estudios que comparan países parecidos no encuentran que la pena de muerte reduzca los homicidios.", valida: true },
          { t: "Conozco un país donde bajaron los crímenes, luego siempre funciona.", falacia: "generalizacion" },
          { t: "Si la abolimos, pronto no habrá castigo para nada.", falacia: "pendiente" }
        ]
      },
      {
        rival: "El Estado debe protegerse, y eliminar al agresor es una forma de legítima defensa.",
        falacia: null, falacia_nombre: "Argumento válido",
        por_que: "Es un argumento razonable: se puede rebatir mostrando alternativas, pero no contiene una falacia.",
        opciones: [
          { t: "Es un punto serio; mi réplica es que la cadena perpetua también protege sin el riesgo de ejecutar a un inocente.", valida: true },
          { t: "Eso lo dices porque no te importan los inocentes.", falacia: "ad-hominem" },
          { t: "Entonces, o matamos o dejamos libres a los asesinos.", falacia: "falso-dilema" }
        ]
      }
    ]
  },
  {
    id: "politica", subject: "fil", emoji: "🏛️", nombre: "Política · la democracia",
    tesis: "La democracia es el mejor régimen posible.",
    postura: "Defiendes la democracia frente a sus críticos.",
    rondas: [
      {
        rival: "La democracia deja que decidan los ignorantes; la mayoría no entiende de política.",
        falacia: "ad-hominem", falacia_nombre: "Ad hominem (contra los votantes)",
        por_que: "Ataca a las personas (los votantes) en vez de evaluar el sistema; no demuestra que otro régimen sea mejor.",
        opciones: [
          { t: "La democracia no exige expertos, exige ciudadanos con derechos; y la educación puede mejorar su juicio.", valida: true },
          { t: "Deben mandar los expertos porque un premio Nobel lo apoya.", falacia: "ad-verecundiam" },
          { t: "La democracia es buena porque es lo que piensa todo el mundo.", falacia: "ad-populum" }
        ]
      },
      {
        rival: "Si cuestionamos las instituciones, acabaremos en el caos y la anarquía.",
        falacia: "pendiente", falacia_nombre: "Pendiente resbaladiza",
        por_que: "Da por hecha una cadena inevitable de desastres sin evidencia; criticar no equivale a destruir.",
        opciones: [
          { t: "Reformar y criticar es parte del propio sistema; no lleva por sí solo al caos, que depende de otros factores.", valida: true },
          { t: "O aceptamos todo sin crítica o lo destruimos todo.", falacia: "falso-dilema" },
          { t: "Si sigues criticando, habrá represalias.", falacia: "ad-baculum" }
        ]
      },
      {
        rival: "Tú defiendes la democracia solo porque te conviene estar en la mayoría.",
        falacia: "tu-quoque", falacia_nombre: "Tu quoque (tú también)",
        por_que: "Aun si fuera cierto, no refuta el argumento: ataca al hablante, no a la tesis.",
        opciones: [
          { t: "Mis motivos no cambian los argumentos: evalúa la propuesta por sus razones, no por quién la dice.", valida: true },
          { t: "Quien lo niega es un antidemócrata.", falacia: "ad-hominem" },
          { t: "Todas las democracias son corruptas.", falacia: "generalizacion" }
        ]
      },
      {
        rival: "La democracia requiere ciudadanos informados; sin educación crítica degenera en demagogia.",
        falacia: null, falacia_nombre: "Argumento válido",
        por_que: "Reconoce una condición necesaria de la democracia: no es una falacia, es una premisa seria.",
        opciones: [
          { t: "Cierto: por eso democracia y educación pública van juntas, y mejorar esta fortalece aquella.", valida: true },
          { t: "La democracia es lo que la mayoría quiere, y punto.", falacia: "ad-populum" },
          { t: "O democracia sin educación o dictadura ilustrada.", falacia: "falso-dilema" }
        ]
      }
    ]
  },
  {
    id: "epistemo", subject: "ipc", emoji: "🔬", nombre: "Epistemología · pseudociencia",
    tesis: "Las pseudociencias no son conocimiento científico.",
    postura: "Defiendes el método científico frente a las pseudociencias.",
    rondas: [
      {
        rival: "La astrología funciona: millones de personas la siguen desde hace siglos.",
        falacia: "ad-populum", falacia_nombre: "Apelación a la mayoría y a la tradición",
        por_que: "La antigüedad y la popularidad no son pruebas; muchas creencias falsas fueron populares durante siglos.",
        opciones: [
          { t: "Popularidad y antigüedad no demuestran verdad; lo que cuenta son las pruebas y las predicciones contrastables.", valida: true },
          { t: "Nadie ha demostrado que la astrología falle.", falacia: "ad-ignorantiam" },
          { t: "Eso lo dicen científicos que cobran de la industria.", falacia: "ad-hominem" }
        ]
      },
      {
        rival: "Nadie ha demostrado que la homeopatía no funcione, así que puede funcionar.",
        falacia: "ad-ignorantiam", falacia_nombre: "Apelación a la ignorancia",
        por_que: "La ausencia de prueba en contra no es una prueba a favor; la carga de la prueba recae en quien afirma.",
        opciones: [
          { t: "La carga de la prueba es de quien afirma; y los ensayos controlados no muestran efecto más allá del placebo.", valida: true },
          { t: "Me curé tras tomarla, luego me curó.", falacia: "post-hoc" },
          { t: "Un actor famoso la recomienda.", falacia: "ad-verecundiam" }
        ]
      },
      {
        rival: "Mi primo se curó con acupuntura, así que funciona.",
        falacia: "generalizacion", falacia_nombre: "Generalización apresurada / causa falsa",
        por_que: "Un caso aislado no demuestra eficacia; la mejoría pudo deberse a otras causas (regresión, placebo, azar).",
        opciones: [
          { t: "Un caso no es evidencia: hacen falta muestras grandes y grupos de control.", valida: true },
          { t: "Mucha gente se cura con acupuntura.", falacia: "ad-populum" },
          { t: "O es eficaz o todos los que la usan mienten.", falacia: "falso-dilema" }
        ]
      },
      {
        rival: "La ciencia también se ha equivocado muchas veces; no es infalible.",
        falacia: null, falacia_nombre: "Argumento válido",
        por_que: "Es cierto y no es falaz: la ciencia se autocorrige. Hay que matizarlo, no refutarlo.",
        opciones: [
          { t: "Exacto: la ciencia no es infalible, pero es el único método que corrige sus errores con pruebas; por eso es más fiable.", valida: true },
          { t: "Tú también te equivocas, así que da igual.", falacia: "tu-quoque" },
          { t: "Los científicos también mienten por dinero.", falacia: "ad-hominem" }
        ]
      }
    ]
  }
];

/* catálogo de falacias para mostrar la definición cuando se revela una */
const DEBATE_FALACIAS = {
  "ad-baculum": "Apelación a la fuerza: convencer por miedo o amenaza, no por razones.",
  "ad-populum": "Apelación a la mayoría: «todo el mundo lo cree», sin prueba.",
  "ad-hominem": "Ataque a la persona en vez de a su argumento.",
  "ad-ignorantiam": "«No se ha demostrado lo contrario» tomado como prueba.",
  "ad-verecundiam": "Citar una autoridad fuera de su campo como prueba.",
  "falso-dilema": "Presentar solo dos opciones cuando hay más.",
  "pendiente": "Pendiente resbaladiza: «un paso lleva inevitablemente al desastre».",
  "post-hoc": "Causa falsa: confundir «después de» con «causado por».",
  "generalizacion": "Generalización apresurada: concluir de una muestra pequeña.",
  "tu-quoque": "«Tú también»: desviar señalando el fallo del otro."
};
