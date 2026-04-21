// data.js — all content for the Gym Spanish app
// Source: Jonathan's PT Spanish Crash Course (Apr 2026, Puerto Escondido)
// Edit this file to add/fix vocabulary. Card IDs are stable — do not renumber.

export const META = {
  version: "1.0.0",
  generated: "2026-04-21",
  target: "Mexican Spanish (Puerto Escondido trainer)",
  level: "B1 production / B2 comprehension",
};

// ---------------------------------------------------------------------------
// FLASHCARDS — single source of truth for everything speakable.
// Every vocab/phrase in the app should be a card here so we can track mastery.
// ---------------------------------------------------------------------------
// Schema:
//   id         stable unique id (never renumber)
//   es         Spanish front
//   en         English back
//   tags       array of domain tags (used for deck filtering)
//   notes      optional — grammar / error-trap pointer
//   day        day introduced (1..7), used to gate flashcard decks to progress

export const CARDS = [
  // ---- greetings / arrival (Day 1) ----
  { id: "g01", es: "Buenos días", en: "Good morning", tags: ["greetings"], day: 1 },
  { id: "g02", es: "¿Cómo amaneciste?", en: "How did you wake up? (common MX morning greeting)", tags: ["greetings"], day: 1 },
  { id: "g03", es: "Listo para darle", en: "Ready to get to it (MX)", tags: ["greetings"], day: 1 },
  { id: "g04", es: "Vamos a darle", en: "Let's get to it (MX)", tags: ["greetings"], day: 1 },
  { id: "g05", es: "¿Qué toca hoy?", en: "What's on the plan today?", tags: ["greetings"], day: 1 },
  { id: "g06", es: "Le entramos", en: "Let's do it (MX colloquial)", tags: ["greetings"], day: 1 },
  { id: "g07", es: "¿Qué onda?", en: "What's up (MX informal)", tags: ["greetings"], day: 1 },

  // ---- body parts (Day 1) — gender watchlist ----
  { id: "b01", es: "el pecho", en: "chest (m)", tags: ["body"], day: 1 },
  { id: "b02", es: "la espalda", en: "back (f) — watch gender", tags: ["body", "error-trap"], day: 1, notes: "feminine; Jonathan error risk" },
  { id: "b03", es: "el hombro", en: "shoulder (m)", tags: ["body"], day: 1 },
  { id: "b04", es: "el brazo", en: "arm (m)", tags: ["body"], day: 1 },
  { id: "b05", es: "el bíceps", en: "biceps (m, same in plural)", tags: ["body"], day: 1 },
  { id: "b06", es: "el tríceps", en: "triceps (m, same in plural)", tags: ["body"], day: 1 },
  { id: "b07", es: "el antebrazo", en: "forearm (m)", tags: ["body"], day: 1 },
  { id: "b08", es: "el abdomen", en: "core/abs (m)", tags: ["body"], day: 1 },
  { id: "b09", es: "la cintura", en: "waist (f)", tags: ["body", "error-trap"], day: 1 },
  { id: "b10", es: "la cadera", en: "hip (f)", tags: ["body", "error-trap"], day: 1 },
  { id: "b11", es: "los glúteos", en: "glutes (m pl)", tags: ["body"], day: 1 },
  { id: "b12", es: "la pierna", en: "leg (f)", tags: ["body", "error-trap"], day: 1 },
  { id: "b13", es: "el cuádriceps", en: "quad (m)", tags: ["body"], day: 1 },
  { id: "b14", es: "el isquiotibial", en: "hamstring (m)", tags: ["body"], day: 1 },
  { id: "b15", es: "la pantorrilla", en: "calf (f, MX common)", tags: ["body", "error-trap"], day: 1 },
  { id: "b16", es: "el gemelo", en: "calf (m, alt.)", tags: ["body"], day: 1 },
  { id: "b17", es: "la rodilla", en: "knee (f)", tags: ["body", "error-trap"], day: 1 },
  { id: "b18", es: "el tobillo", en: "ankle (m)", tags: ["body"], day: 1 },
  { id: "b19", es: "el codo", en: "elbow (m)", tags: ["body"], day: 1 },
  { id: "b20", es: "la muñeca", en: "wrist (f)", tags: ["body", "error-trap"], day: 1 },
  { id: "b21", es: "el cuello", en: "neck (m)", tags: ["body"], day: 1 },

  // ---- equipment (Day 2) ----
  { id: "e01", es: "la mancuerna", en: "dumbbell", tags: ["equipment"], day: 2 },
  { id: "e02", es: "la barra", en: "barbell", tags: ["equipment"], day: 2 },
  { id: "e03", es: "el disco", en: "weight plate", tags: ["equipment"], day: 2 },
  { id: "e04", es: "la polea", en: "cable / pulley machine", tags: ["equipment"], day: 2 },
  { id: "e05", es: "la cuerda", en: "rope attachment", tags: ["equipment"], day: 2 },
  { id: "e06", es: "el banco plano", en: "flat bench", tags: ["equipment"], day: 2 },
  { id: "e07", es: "el banco inclinado", en: "incline bench", tags: ["equipment"], day: 2 },
  { id: "e08", es: "la máquina", en: "machine", tags: ["equipment"], day: 2 },
  { id: "e09", es: "el rack", en: "the rack", tags: ["equipment"], day: 2 },
  { id: "e10", es: "el kilo", en: "kilogram (MX uses kg)", tags: ["equipment"], day: 2 },
  { id: "e11", es: "el peso", en: "the weight", tags: ["equipment"], day: 2 },
  { id: "e12", es: "la colchoneta", en: "mat", tags: ["equipment"], day: 2 },
  { id: "e13", es: "la banda / la liga", en: "resistance band", tags: ["equipment"], day: 2 },

  // ---- your exercises (Day 2) ----
  { id: "x01", es: "press con mancuernas en banco inclinado", en: "incline DB bench press", tags: ["exercises"], day: 2 },
  { id: "x02", es: "press con mancuernas en banco plano", en: "flat DB bench press", tags: ["exercises"], day: 2 },
  { id: "x03", es: "patada de tríceps", en: "triceps kickback", tags: ["exercises"], day: 2 },
  { id: "x04", es: "extensión de tríceps en polea con cuerda", en: "rope triceps pushdown", tags: ["exercises"], day: 2 },
  { id: "x05", es: "press de hombros sentado", en: "seated DB shoulder press", tags: ["exercises"], day: 2 },
  { id: "x06", es: "jalón al pecho", en: "lat pulldown", tags: ["exercises"], day: 2 },
  { id: "x07", es: "remo sentado en polea", en: "seated cable row", tags: ["exercises"], day: 2 },
  { id: "x08", es: "curl de bíceps con mancuernas", en: "DB bicep curl", tags: ["exercises"], day: 2 },
  { id: "x09", es: "jalón a la cara", en: "face pull", tags: ["exercises"], day: 2 },
  { id: "x10", es: "curl martillo", en: "hammer curl", tags: ["exercises"], day: 2 },

  // ---- legs (Day 2 leg vocab) ----
  { id: "l01", es: "sentadilla", en: "squat", tags: ["legs", "exercises"], day: 2 },
  { id: "l02", es: "sentadilla goblet", en: "goblet squat", tags: ["legs", "exercises"], day: 2 },
  { id: "l03", es: "prensa de piernas", en: "leg press", tags: ["legs", "exercises"], day: 2 },
  { id: "l04", es: "extensión de cuádriceps", en: "leg extension", tags: ["legs", "exercises"], day: 2 },
  { id: "l05", es: "curl femoral", en: "leg curl (hamstrings)", tags: ["legs", "exercises"], day: 2 },
  { id: "l06", es: "peso muerto rumano", en: "Romanian deadlift / RDL", tags: ["legs", "exercises"], day: 2 },
  { id: "l07", es: "elevación de pantorrillas", en: "calf raise", tags: ["legs", "exercises"], day: 2 },
  { id: "l08", es: "empuje de cadera", en: "hip thrust", tags: ["legs", "exercises"], day: 2 },
  { id: "l09", es: "desplante", en: "lunge (MX)", tags: ["legs", "exercises"], day: 2 },
  { id: "l10", es: "zancada", en: "lunge (alt.)", tags: ["legs", "exercises"], day: 2 },
  { id: "l11", es: "patada de glúteo", en: "glute kickback", tags: ["legs", "exercises"], day: 2 },

  // ---- numbers 1–15 (Day 3) ----
  { id: "n01", es: "uno", en: "1", tags: ["numbers"], day: 3 },
  { id: "n02", es: "dos", en: "2", tags: ["numbers"], day: 3 },
  { id: "n03", es: "tres", en: "3", tags: ["numbers"], day: 3 },
  { id: "n04", es: "cuatro", en: "4", tags: ["numbers"], day: 3 },
  { id: "n05", es: "cinco", en: "5", tags: ["numbers"], day: 3 },
  { id: "n06", es: "seis", en: "6", tags: ["numbers"], day: 3 },
  { id: "n07", es: "siete", en: "7", tags: ["numbers"], day: 3 },
  { id: "n08", es: "ocho", en: "8", tags: ["numbers"], day: 3 },
  { id: "n09", es: "nueve", en: "9", tags: ["numbers"], day: 3 },
  { id: "n10", es: "diez", en: "10", tags: ["numbers"], day: 3 },
  { id: "n11", es: "once", en: "11", tags: ["numbers"], day: 3 },
  { id: "n12", es: "doce", en: "12", tags: ["numbers"], day: 3 },
  { id: "n13", es: "trece", en: "13", tags: ["numbers"], day: 3 },
  { id: "n14", es: "catorce", en: "14", tags: ["numbers"], day: 3 },
  { id: "n15", es: "quince", en: "15", tags: ["numbers"], day: 3 },
  { id: "n20", es: "veinte", en: "20", tags: ["numbers"], day: 3 },

  // ---- reps/sets/rest (Day 3) ----
  { id: "r01", es: "la serie", en: "set", tags: ["reps"], day: 3 },
  { id: "r02", es: "la repetición", en: "rep", tags: ["reps"], day: 3 },
  { id: "r03", es: "tres series de quince", en: '3 sets of 15 — use "de", never "para"', tags: ["reps", "error-trap"], day: 3, notes: "preposition trap: de, not para" },
  { id: "r04", es: "tres por quince", en: "3 by 15 (MX gym shorthand)", tags: ["reps"], day: 3 },
  { id: "r05", es: "descansa un minuto", en: "rest a minute", tags: ["reps"], day: 3 },
  { id: "r06", es: "una más", en: "one more", tags: ["reps"], day: 3 },
  { id: "r07", es: "la última", en: "the last one (f)", tags: ["reps"], day: 3 },
  { id: "r08", es: "al fallo", en: "to failure", tags: ["reps"], day: 3 },
  { id: "r09", es: "la pesada", en: "the heavy set (MX slang)", tags: ["reps"], day: 3 },

  // ---- commands (Day 3) — recognize, not produce ----
  { id: "c01", es: "sube", en: "up / lift", tags: ["commands"], day: 3 },
  { id: "c02", es: "baja", en: "down / lower", tags: ["commands"], day: 3 },
  { id: "c03", es: "aprieta", en: "squeeze", tags: ["commands"], day: 3 },
  { id: "c04", es: "controla", en: "control it", tags: ["commands"], day: 3 },
  { id: "c05", es: "mantén", en: "hold / maintain", tags: ["commands"], day: 3 },
  { id: "c06", es: "aguanta", en: "hang on / hold it", tags: ["commands"], day: 3 },
  { id: "c07", es: "despacio", en: "slow", tags: ["commands"], day: 3 },
  { id: "c08", es: "más rápido", en: "faster", tags: ["commands"], day: 3 },
  { id: "c09", es: "respira", en: "breathe", tags: ["commands"], day: 3 },
  { id: "c10", es: "inhala", en: "inhale", tags: ["commands"], day: 3 },
  { id: "c11", es: "exhala", en: "exhale", tags: ["commands"], day: 3 },
  { id: "c12", es: "concentrado", en: "focused", tags: ["commands"], day: 3 },
  { id: "c13", es: "no pares", en: "don't stop", tags: ["commands"], day: 3 },
  { id: "c14", es: "otra vez", en: "again", tags: ["commands"], day: 3 },
  { id: "c15", es: "eso es", en: "that's it / nailed it", tags: ["commands"], day: 3 },
  { id: "c16", es: "muy bien", en: "very good", tags: ["commands"], day: 3 },
  { id: "c17", es: "ahí la llevas", en: "you got it (MX)", tags: ["commands"], day: 3 },
  { id: "c18", es: "una más, tú puedes", en: "one more, you can do it", tags: ["commands"], day: 3 },
  { id: "c19", es: "va", en: "got it / OK (MX filler)", tags: ["commands"], day: 3 },
  { id: "c20", es: "dale", en: "go for it / let's go", tags: ["commands"], day: 3 },

  // ---- form cues (Day 4) ----
  { id: "f01", es: "espalda recta", en: "straight back", tags: ["form"], day: 4 },
  { id: "f02", es: "saca el pecho", en: "chest out / chest up", tags: ["form"], day: 4 },
  { id: "f03", es: "mete el abdomen", en: "tuck the belly / brace", tags: ["form"], day: 4 },
  { id: "f04", es: "aprieta el core", en: "brace the core", tags: ["form"], day: 4 },
  { id: "f05", es: "codos pegados", en: "elbows tucked to body", tags: ["form"], day: 4 },
  { id: "f06", es: "no bloquees los codos", en: "don't lock your elbows", tags: ["form"], day: 4 },
  { id: "f07", es: "baja más", en: "go lower", tags: ["form"], day: 4 },
  { id: "f08", es: "sube más", en: "go higher", tags: ["form"], day: 4 },
  { id: "f09", es: "rango completo", en: "full range of motion", tags: ["form"], day: 4 },
  { id: "f10", es: "controla la bajada", en: "control the descent", tags: ["form"], day: 4 },
  { id: "f11", es: "aprieta arriba", en: "squeeze at the top", tags: ["form"], day: 4 },
  { id: "f12", es: "mantén la tensión", en: "maintain tension", tags: ["form"], day: 4 },
  { id: "f13", es: "no uses impulso", en: "don't use momentum", tags: ["form"], day: 4 },
  { id: "f14", es: "siente el músculo", en: "feel the muscle", tags: ["form"], day: 4 },
  { id: "f15", es: "no arquees la espalda", en: "don't arch your back", tags: ["form"], day: 4 },
  { id: "f16", es: "pies firmes", en: "feet planted", tags: ["form"], day: 4 },
  { id: "f17", es: "mira al frente", en: "look forward", tags: ["form"], day: 4 },
  { id: "f18", es: "hombros atrás", en: "shoulders back", tags: ["form"], day: 4 },
  { id: "f19", es: "escápulas hacia atrás", en: "scapulas retracted", tags: ["form"], day: 4 },

  // ---- clarification (Day 4) ----
  { id: "q01", es: "¿Cómo?", en: "Sorry? / what?", tags: ["clarification"], day: 4 },
  { id: "q02", es: "¿Me lo puedes enseñar?", en: "Can you show me?", tags: ["clarification"], day: 4 },
  { id: "q03", es: "¿Así está bien?", en: "Like this, is it right?", tags: ["clarification"], day: 4 },
  { id: "q04", es: "Más despacio, por favor.", en: "Slower please.", tags: ["clarification"], day: 4 },
  { id: "q05", es: "No te entendí.", en: "I didn't catch that.", tags: ["clarification"], day: 4 },
  { id: "q06", es: "¿Qué significa ___?", en: "What does ___ mean?", tags: ["clarification"], day: 4 },
  { id: "q07", es: "¿Cómo se dice ___ en español?", en: "How do you say ___ in Spanish?", tags: ["clarification"], day: 4 },
  { id: "q08", es: "¿Voy bien?", en: "Am I doing it right?", tags: ["clarification"], day: 4 },
  { id: "q09", es: "Ayúdame, no te entendí. ¿Otra vez, más despacio?", en: "Help me out — again, slower? (UNIVERSAL FALLBACK)", tags: ["clarification", "fallback"], day: 4, notes: "memorize cold" },

  // ---- pain/fatigue (Day 5) ----
  { id: "p01", es: "Me duele el hombro.", en: "My shoulder hurts. (singular subject)", tags: ["pain", "grammar"], day: 5, notes: "doler like gustar — verb matches body part" },
  { id: "p02", es: "Me duelen las rodillas.", en: "My knees hurt. (plural — verb agrees with body part)", tags: ["pain", "grammar"], day: 5 },
  { id: "p03", es: "Tengo dolor en la espalda.", en: 'I have pain in my back. (use "en", not "de")', tags: ["pain", "error-trap"], day: 5, notes: "preposition trap" },
  { id: "p04", es: "Tengo agujetas.", en: "I'm sore / DOMS.", tags: ["pain"], day: 5 },
  { id: "p05", es: "Tengo agujetas de ayer.", en: "I'm sore from yesterday.", tags: ["pain"], day: 5 },
  { id: "p06", es: "un tirón", en: "a muscle tweak / pull", tags: ["pain"], day: 5 },
  { id: "p07", es: "Me dio un tirón.", en: "I tweaked something.", tags: ["pain"], day: 5 },
  { id: "p08", es: "Me jalé la espalda.", en: "I tweaked my back.", tags: ["pain"], day: 5 },
  { id: "p09", es: "una lesión", en: "an injury", tags: ["pain"], day: 5 },
  { id: "p10", es: "una molestia", en: "discomfort (less than pain)", tags: ["pain"], day: 5 },
  { id: "p11", es: "Estoy agotado.", en: "I'm wiped out.", tags: ["fatigue"], day: 5 },
  { id: "p12", es: "Estoy muerto.", en: "I'm dead (MX — tired).", tags: ["fatigue"], day: 5 },
  { id: "p13", es: "No puedo más.", en: "I can't do any more.", tags: ["fatigue"], day: 5 },
  { id: "p14", es: "Me falta aire.", en: "I'm out of breath.", tags: ["fatigue"], day: 5 },
  { id: "p15", es: "Estoy mareado.", en: "I'm dizzy.", tags: ["fatigue"], day: 5 },
  { id: "p16", es: "Me late fuerte el corazón.", en: "My heart is pounding.", tags: ["fatigue"], day: 5 },
  { id: "p17", es: "Necesito un minuto.", en: "I need a minute.", tags: ["fatigue"], day: 5 },
  { id: "p18", es: "¿Podemos bajar el peso?", en: "Can we lower the weight?", tags: ["fatigue"], day: 5 },
  { id: "p19", es: "¿Podemos saltarnos esta?", en: "Can we skip this one?", tags: ["fatigue"], day: 5 },
  { id: "p20", es: "Ayer entrené fuerte.", en: "I trained hard yesterday.", tags: ["context"], day: 5 },
  { id: "p21", es: "No desayuné.", en: "I didn't eat breakfast.", tags: ["context"], day: 5 },
  { id: "p22", es: "Tomé mi pre-workout fuerte.", en: "I took a strong pre-workout.", tags: ["context"], day: 5 },
  { id: "p23", es: "Me cuesta respirar con este calor.", en: "It's hard to breathe in this heat.", tags: ["context"], day: 5 },
  { id: "p24", es: "No dormí bien.", en: "I didn't sleep well.", tags: ["context"], day: 5 },

  // ---- small talk (Day 6) ----
  { id: "s01", es: "¿Qué tal el fin?", en: "How was your weekend?", tags: ["smalltalk"], day: 6 },
  { id: "s02", es: "¿Cómo estuvo tu fin de semana?", en: "How was your weekend?", tags: ["smalltalk"], day: 6 },
  { id: "s03", es: "¿Saliste anoche?", en: "Did you go out last night?", tags: ["smalltalk"], day: 6 },
  { id: "s04", es: "Estuve tranquilo, en casa.", en: "I was chill, at home.", tags: ["smalltalk"], day: 6 },
  { id: "s05", es: "Estuve con Jacob.", en: "I was with Jacob.", tags: ["smalltalk"], day: 6 },
  { id: "s06", es: "Qué calor, ¿no?", en: "So hot, right?", tags: ["smalltalk"], day: 6 },
  { id: "s07", es: "Hoy está pesado.", en: "It's heavy (humid) today.", tags: ["smalltalk"], day: 6 },
  { id: "s08", es: "Se siente la humedad.", en: "You can feel the humidity.", tags: ["smalltalk"], day: 6 },
  { id: "s09", es: "Está más fresco hoy.", en: "It's cooler today.", tags: ["smalltalk"], day: 6 },
  { id: "s10", es: "Soy de Minneapolis.", en: "I'm from Minneapolis.", tags: ["smalltalk"], day: 6 },
  { id: "s11", es: "Vivo aquí parte del año con mi pareja.", en: "I live here part of the year with my partner.", tags: ["smalltalk"], day: 6 },
  { id: "s12", es: "Después del gym voy a desayunar.", en: "After the gym I'm having breakfast.", tags: ["smalltalk"], day: 6 },
  { id: "s13", es: "Hoy me siento fuerte.", en: "I feel strong today.", tags: ["smalltalk", "feeling"], day: 6 },
  { id: "s14", es: "Hoy me siento débil.", en: "I feel weak today.", tags: ["smalltalk", "feeling"], day: 6 },
  { id: "s15", es: "Ando un poco crudo.", en: "I'm a bit rough today (MX — wrecked).", tags: ["smalltalk", "feeling"], day: 6 },
  { id: "s16", es: "Ayer fue día pesado.", en: "Yesterday was a heavy day.", tags: ["smalltalk", "feeling"], day: 6 },

  // ---- address (Day 6) ----
  { id: "a01", es: "maestro", en: "coach/teacher — classic respectful address", tags: ["address"], day: 6 },
  { id: "a02", es: "coach", en: "coach — modern gym address", tags: ["address"], day: 6 },
  { id: "a03", es: "profe", en: "coach — friendly MX (short for profesor)", tags: ["address"], day: 6 },
  { id: "a04", es: "Oye, ¿cómo te llamas?", en: "Hey, what's your name?", tags: ["address"], day: 6 },

  // ---- closing (Day 6) ----
  { id: "z01", es: "Gracias, maestro.", en: "Thanks, coach.", tags: ["closing"], day: 6 },
  { id: "z02", es: "Buena sesión.", en: "Good session.", tags: ["closing"], day: 6 },
  { id: "z03", es: "Hoy me mataste.", en: "You killed me today (joking).", tags: ["closing"], day: 6 },
  { id: "z04", es: "Nos vemos mañana.", en: "See you tomorrow.", tags: ["closing"], day: 6 },
  { id: "z05", es: "Que tengas buen día.", en: "Have a good day.", tags: ["closing"], day: 6 },
  { id: "z06", es: "Cuídate.", en: "Take care.", tags: ["closing"], day: 6 },

  // ---- grammar / subjunctive anchors (Day 7 reinforcement) ----
  { id: "gr01", es: "Quiero que bajes el peso.", en: 'I want you to lower the weight. (que + subjunctive — NOT "bajas")', tags: ["grammar", "subjunctive"], day: 7 },
  { id: "gr02", es: "Necesito que respires.", en: "I need you to breathe.", tags: ["grammar", "subjunctive"], day: 7 },
  { id: "gr03", es: "Es importante que controles.", en: "It's important that you control.", tags: ["grammar", "subjunctive"], day: 7 },
  { id: "gr04", es: "Cuando termines, descansa.", en: "When you finish, rest. (cuando + subj. for future)", tags: ["grammar", "subjunctive"], day: 7 },
];

// ---------------------------------------------------------------------------
// 7-DAY LESSON PLAN
// ---------------------------------------------------------------------------

export const DAYS = [
  {
    id: 1,
    title: "Gym arrival, greetings, body-part fluency",
    goal: "Walk in, greet the trainer warmly, name every muscle group you train.",
    warmup: 'Say out loud: <em>Buenos días. Listo para entrenar.</em>',
    cardTags: ["greetings", "body"],
    application: [
      'Say out loud: <strong>Hoy toca pecho y tríceps.</strong> (Today is chest and triceps day.)',
      '<strong>Me duele la espalda baja.</strong> (My lower back hurts.)',
      '<strong>Tengo agujetas en los glúteos.</strong> (I\'m sore in the glutes.)',
      '<strong>¿Qué vamos a entrenar hoy?</strong> (What are we training today?)',
      'Trainer might say: <em>Hoy le pegamos fuerte a espalda.</em> (Today we hit back hard.)',
    ],
  },
  {
    id: 2,
    title: "Equipment + your actual exercises",
    goal: "Recognize every exercise name in your push/pull/leg split.",
    warmup: "Recall from yesterday: chest, back, shoulders, glutes, quads. Out loud.",
    cardTags: ["equipment", "exercises", "legs"],
    application: [
      'Walk through yesterday\'s workout: <strong>Hice press inclinado con 14 kilos, 15 repeticiones, 3 series.</strong>',
      '<strong>¿Qué máquina sigue?</strong> (What machine is next?)',
      '<strong>¿Puedo usar la polea cuando termines?</strong> (Can I use the cable when you finish?) — subjunctive after <em>cuando</em>.',
    ],
  },
  {
    id: 3,
    title: "Counting, reps, sets, commands",
    goal: "Follow rep counts, rest timers, and command verbs in real time.",
    warmup: "Count 1–15 aloud in Spanish, twice.",
    cardTags: ["numbers", "reps", "commands"],
    application: [
      'Run silently, then aloud:',
      '<em>Trainer:</em> <strong>Vamos con press inclinado. Tres series de quince. Empezamos con diez kilos.</strong>',
      '<em>You:</em> <strong>Va.</strong> <strong>¿Hago las quince seguidas?</strong>',
      '<em>Trainer:</em> <strong>Sí, controladas. Baja despacio, sube y aprieta arriba.</strong>',
      '<em>You (after):</em> <strong>Esa última estuvo pesada.</strong>',
    ],
  },
  {
    id: 4,
    title: "Form cues & corrections",
    goal: "Understand mid-rep when he corrects your form.",
    warmup: "Run Day 3's mini-dialogue aloud from memory.",
    cardTags: ["form", "clarification"],
    application: [
      '<strong>Scenario A — Being corrected mid-set</strong>',
      '<em>Trainer:</em> <strong>Baja más. Rango completo. No uses impulso.</strong>',
      '<em>You:</em> <strong>¿Así está bien ahora?</strong>',
      '<em>Trainer:</em> <strong>Eso es. Aprieta arriba.</strong>',
      '<strong>Scenario B — You don\'t understand the cue</strong>',
      '<em>Trainer:</em> <strong>Las escápulas hacia atrás, retráelas.</strong>',
      '<em>You:</em> <strong>¿Cómo? ¿Me lo puedes enseñar?</strong>',
      '<strong>Scenario C — Confirming</strong>',
      '<em>Trainer:</em> <strong>Pies firmes, espalda recta, baja controlado.</strong>',
      '<em>You (after rep):</em> <strong>¿Voy bien?</strong>',
    ],
  },
  {
    id: 5,
    title: "Pain, fatigue, limitations (safety-critical)",
    goal: "Communicate when something is wrong — so you don't push through an injury.",
    warmup: "Reread Day 4 cues. Visualize him saying them.",
    cardTags: ["pain", "fatigue", "context"],
    application: [
      'Say out loud two things you\'d actually report tomorrow:',
      '<strong>Me duele un poco el hombro derecho, nada grave, pero quería avisarte.</strong>',
      '<strong>Hoy no desayuné y tomé Woke AF, entonces me va a dar más aire corto en el cardio.</strong>',
    ],
  },
  {
    id: 6,
    title: "Small talk, rapport, closing the session",
    goal: "Be a human, not a client. Spanish-speaking trainers remember warm clients.",
    warmup: "Recall Day 5 pain phrases. Run me duele / me duelen with 3 body parts.",
    cardTags: ["smalltalk", "address", "closing", "feeling"],
    application: [
      'Draft 3 sentences about your life in MX you could drop when he asks <em>¿Y tú qué haces aquí?</em>',
      'One about where you\'re from',
      'One about what you do (or don\'t, keep it light)',
      'One about Jacob, PXM, why you come down',
    ],
  },
  {
    id: 7,
    title: "Integration & dress rehearsal",
    goal: "Run a full session in your head, in Spanish, start to finish.",
    warmup: "Read the cheat sheet top to bottom. Anything you stumble on, circle it.",
    cardTags: [], // Day 7 reinforces; see dialogue
    application: [
      'See the <strong>full dress rehearsal</strong> dialogue in the Drills tab (Drill 9 — Stress-test combo).',
      'After running it, self-rate each section 1–5. Anything ≤ 3 → next week\'s focus.',
    ],
  },
];

// ---------------------------------------------------------------------------
// CHEAT SHEET — groups for the quick-reference page
// ---------------------------------------------------------------------------

export const CHEAT_SHEET = [
  {
    title: "🚨 Universal fallback (memorize cold)",
    highlight: true,
    entries: [
      { es: "Ayúdame, no te entendí. ¿Otra vez, más despacio?", en: "Help me out, I didn't catch that. Again, slower?" },
    ],
  },
  {
    title: "Arrival & close",
    entries: [
      { es: "Buenos días, ¿cómo amaneciste?", en: "Good morning, how did you wake up?" },
      { es: "Listo para darle.", en: "Ready to get to it." },
      { es: "Gracias, maestro. Buena sesión.", en: "Thanks, coach. Good session." },
      { es: "Nos vemos mañana. Que tengas buen día.", en: "See you tomorrow. Have a good day." },
    ],
  },
  {
    title: "How to address him",
    entries: [
      { es: "maestro / coach / profe", en: "pick one; all are tú-form. He'll tú you back — don't usted him." },
    ],
  },
  {
    title: "How I feel today (open with one)",
    entries: [
      { es: "Hoy me siento fuerte.", en: "I feel strong today." },
      { es: "Hoy me siento débil, dormí mal.", en: "I feel weak today, slept badly." },
      { es: "Ando un poco crudo, pero le entramos.", en: "I'm a little rough, but let's do it." },
      { es: "Ayer fue día pesado, estoy con agujetas.", en: "Yesterday was heavy, I'm sore." },
    ],
  },
  {
    title: "Reps, sets, rest",
    entries: [
      { es: "tres series de quince", en: '3 sets of 15 (always "de", never "para")' },
      { es: "tres por quince", en: "3 by 15 (MX shorthand)" },
      { es: "una más / la última", en: "one more / the last one" },
      { es: "descansa un minuto", en: "rest a minute" },
      { es: "al fallo", en: "to failure" },
    ],
  },
  {
    title: "Commands (mid-set)",
    entries: [
      { es: "sube / baja / aprieta / controla", en: "up / down / squeeze / control" },
      { es: "despacio / más rápido / respira", en: "slow / faster / breathe" },
      { es: "aguanta / mantén", en: "hold / maintain" },
      { es: "no uses impulso", en: "no momentum" },
      { es: "otra vez / eso es / una más, tú puedes", en: "again / nailed it / one more, you got this" },
    ],
  },
  {
    title: "Your exercises",
    entries: [
      { es: "press con mancuernas en banco inclinado", en: "incline DB bench press" },
      { es: "press con mancuernas en banco plano", en: "flat DB bench press" },
      { es: "patada de tríceps", en: "triceps kickback" },
      { es: "extensión de tríceps en polea con cuerda", en: "rope triceps pushdown" },
      { es: "press de hombros sentado", en: "seated DB shoulder press" },
      { es: "jalón al pecho", en: "lat pulldown" },
      { es: "remo sentado en polea", en: "seated cable row" },
      { es: "curl de bíceps con mancuernas", en: "DB bicep curl" },
      { es: "jalón a la cara", en: "face pull" },
      { es: "curl martillo", en: "hammer curl" },
    ],
  },
  {
    title: "Leg day",
    entries: [
      { es: "sentadilla", en: "squat" },
      { es: "prensa de piernas", en: "leg press" },
      { es: "extensión de cuádriceps", en: "leg extension" },
      { es: "curl femoral", en: "leg curl" },
      { es: "peso muerto rumano", en: "RDL" },
      { es: "elevación de pantorrillas", en: "calf raise" },
      { es: "empuje de cadera", en: "hip thrust" },
      { es: "desplante / zancada", en: "lunge" },
    ],
  },
  {
    title: "Equipment",
    entries: [
      { es: "la mancuerna / la barra / el disco", en: "dumbbell / barbell / plate" },
      { es: "la polea / la cuerda", en: "cable / rope" },
      { es: "el banco plano / inclinado", en: "flat / incline bench" },
      { es: "el rack / la máquina / el kilo", en: "rack / machine / kg" },
    ],
  },
  {
    title: "Form cues — understand these",
    entries: [
      { es: "espalda recta / saca el pecho / mete el abdomen", en: "straight back / chest up / brace" },
      { es: "codos pegados / no bloquees los codos", en: "elbows tucked / don't lock" },
      { es: "baja más / sube más / rango completo", en: "lower / higher / full ROM" },
      { es: "controla la bajada / aprieta arriba", en: "control descent / squeeze top" },
      { es: "no arquees / siente el músculo", en: "don't arch / feel the muscle" },
      { es: "mira al frente / pies firmes", en: "look forward / feet planted" },
    ],
  },
  {
    title: "Pain / fatigue / STOP (safety)",
    highlight: true,
    entries: [
      { es: "Me duele el hombro.", en: "My shoulder hurts." },
      { es: "Me duelen las rodillas.", en: "My knees hurt. (plural!)" },
      { es: 'Tengo dolor en la espalda.', en: 'I have pain IN my back. ("en", not "de")' },
      { es: "Tengo agujetas de ayer.", en: "I'm sore from yesterday." },
      { es: "Me dio un tirón.", en: "I tweaked something." },
      { es: "Me falta aire.", en: "I'm out of breath." },
      { es: "Estoy mareado.", en: "I'm dizzy." },
      { es: "No puedo más.", en: "I can't do any more." },
      { es: "¿Podemos bajar el peso?", en: "Can we lower the weight?" },
      { es: "Necesito un minuto.", en: "I need a minute." },
    ],
  },
  {
    title: "Clarification (use when lost)",
    entries: [
      { es: "¿Cómo?", en: "Sorry?" },
      { es: "¿Me lo puedes enseñar?", en: "Can you show me?" },
      { es: "¿Así está bien?", en: "Like this, is it right?" },
      { es: "Más despacio, por favor.", en: "Slower, please." },
      { es: "No te entendí.", en: "I didn't catch that." },
    ],
  },
  {
    title: "Small talk",
    entries: [
      { es: "¿Qué tal el fin?", en: "How was your weekend?" },
      { es: "Tranquilo, en casa.", en: "Chill, at home." },
      { es: "Qué calor, ¿no?", en: "Hot, right?" },
      { es: "Hoy está pesado.", en: "Heavy (humid) today." },
      { es: "Estuve con Jacob.", en: "I was with Jacob." },
      { es: "Después del gym voy a desayunar.", en: "Breakfast after the gym." },
    ],
  },
];

// ---------------------------------------------------------------------------
// ERROR TRAPS — inline grammar/preposition/gender reminders
// ---------------------------------------------------------------------------

export const ERROR_TRAPS = [
  {
    title: 'de vs. para',
    rule: 'Use "de" for quantities and purposes of objects. Jonathan over-reaches for "para".',
    examples: [
      { wrong: "3 series para 15", right: "3 series de 15" },
      { wrong: "dolor de la espalda", right: "dolor en la espalda" },
      { wrong: "banco para press", right: "banco de press" },
    ],
  },
  {
    title: 'Gender on a-initial feminines',
    rule: 'Feminine nouns keep feminine adjectives — even when "el" is used for sound.',
    examples: [
      { wrong: "agua frío", right: "agua fría" },
      { wrong: "la espalda bajo", right: "la espalda baja" },
    ],
  },
  {
    title: 'doler works like gustar',
    rule: 'Verb agrees with the body part (subject), not with "you".',
    examples: [
      { wrong: "me duelo el hombro", right: "me duele el hombro" },
      { wrong: "me duele las rodillas", right: "me duelen las rodillas" },
    ],
  },
  {
    title: 'Subjunctive after "quiere que / necesito que"',
    rule: '"que" + subjunctive — the verb is different from what you\'d expect.',
    examples: [
      { wrong: "Quiero que bajas el peso", right: "Quiero que bajes el peso" },
      { wrong: "Necesito que respiras", right: "Necesito que respires" },
    ],
  },
];

// ---------------------------------------------------------------------------
// AUDIO DRILLS — sequential playback scripts
// ---------------------------------------------------------------------------

export const DRILLS = [
  {
    id: 1,
    title: "Arrival",
    subtitle: "Warm, awake, connected. Eye contact, smile.",
    lines: [
      "Buenos días.",
      "¿Cómo amaneciste?",
      "Listo para darle.",
      "¿Qué toca hoy?",
      "Vamos a entrenar.",
    ],
  },
  {
    id: 2,
    title: "Numbers 1–15 (the critical set)",
    subtitle: "Rhythm matches a rep cadence.",
    lines: [
      "uno, dos, tres, cuatro, cinco",
      "seis, siete, ocho, nueve, diez",
      "once, doce, trece, catorce, quince",
      "tres series de quince, con descanso de un minuto",
    ],
  },
  {
    id: 3,
    title: "Commands (input-only)",
    subtitle: "Recognize, don't produce. Translate in your head.",
    lines: [
      "Sube. Baja. Controla.",
      "Aprieta. Mantén. Aguanta.",
      "Despacio. Más rápido. Respira.",
      "Concentrado. No pares. Una más.",
      "Eso es. Muy bien. Ahí la llevas.",
      "No uses impulso. Siente el músculo.",
      "Espalda recta. Saca el pecho. Mete el abdomen.",
      "Codos pegados. No bloquees los codos.",
      "Baja más. Controla la bajada.",
      "Aprieta arriba. Mantén la tensión.",
    ],
  },
  {
    id: 4,
    title: "Exercise names (production)",
    subtitle: "As if telling someone what you did yesterday.",
    lines: [
      "Hice press con mancuernas en banco inclinado, tres por quince.",
      "Hice press con mancuernas en banco plano, tres por quince.",
      "Hice patada de tríceps, tres por diez.",
      "Hice extensión de tríceps en polea con cuerda, tres por diez.",
      "Hice press de hombros sentado, cuatro por quince.",
      "Hice jalón al pecho, tres por doce.",
      "Hice remo sentado en polea, tres por doce.",
      "Hice curl de bíceps con mancuernas, tres por quince.",
      "Hice jalón a la cara, tres por quince.",
      "Hice curl martillo, tres por doce.",
    ],
  },
  {
    id: 5,
    title: "Pain and fatigue (safety-critical, reflexive)",
    subtitle: "These must be automatic.",
    lines: [
      "Me duele el hombro.",
      "Me duelen las rodillas.",
      "Tengo dolor en la espalda baja.",
      "Tengo agujetas de ayer.",
      "Me dio un tirón.",
      "Me falta aire.",
      "Estoy mareado.",
      "No puedo más.",
      "¿Podemos bajar el peso?",
      "Necesito un minuto.",
    ],
  },
  {
    id: 6,
    title: "Clarification (underrated skill)",
    subtitle: "Without these automatic, you'll nod when you shouldn't.",
    lines: [
      "¿Cómo?",
      "¿Me lo puedes enseñar?",
      "¿Así está bien?",
      "Más despacio, por favor.",
      "No te entendí, ¿otra vez?",
      "¿Qué significa eso?",
      "¿Cómo se dice eso en español?",
    ],
  },
  {
    id: 7,
    title: "Small talk (Saturday rapport)",
    subtitle: "As if mid-rest between sets.",
    lines: [
      "¿Qué tal el fin de semana?",
      "¿Saliste anoche?",
      "Estuve tranquilo, en casa con Jacob.",
      "Qué calor, ¿no?",
      "Hoy está pesado el calor.",
      "Después del gym voy a desayunar.",
      "¿Tú tienes muchos clientes hoy?",
    ],
  },
  {
    id: 8,
    title: "The closer",
    subtitle: "Every session ends with one of these.",
    lines: [
      "Gracias, maestro. Buena sesión.",
      "Hoy me mataste.",
      "Nos vemos mañana.",
      "Que tengas buen día. Cuídate.",
    ],
  },
  {
    id: 9,
    title: "🔥 Stress-test combo (Sunday dress rehearsal)",
    subtitle: "One pass, no stopping. Goal: under 90 seconds, fluid.",
    lines: [
      "Buenos días, ¿cómo amaneciste? Listo para darle.",
      "Hoy me siento un poco cansado, dormí mal, pero le entramos.",
      "Ayer entrené pecho y tengo agujetas en los tríceps.",
      "¿Qué toca hoy?",
      "Va, empezamos con jalón al pecho, tres por doce, veinticinco kilos.",
      "¿La primera de calentamiento?",
      "Eso es. Baja controlado, aprieta abajo, no uses impulso.",
      "Me falta aire, dame treinta segundos.",
      "¿Subimos a veintisiete y medio?",
      "Oye, me dio una molestia en el hombro derecho, nada grave, pero quería avisarte.",
      "Bien que me avisaste. Bajamos el peso.",
      "Gracias, maestro. Hoy me mataste. Nos vemos mañana.",
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Return all cards matching any of the given tags. */
export function cardsByTags(tags) {
  if (!tags || tags.length === 0) return [];
  const set = new Set(tags);
  return CARDS.filter((c) => c.tags.some((t) => set.has(t)));
}

/** Return all cards introduced by day N or earlier. */
export function cardsByDayUpTo(day) {
  return CARDS.filter((c) => c.day <= day);
}

/** Return the card with the given id (or undefined). */
export function cardById(id) {
  return CARDS.find((c) => c.id === id);
}

/** Unique list of all tags present in the deck. */
export function allTags() {
  const s = new Set();
  CARDS.forEach((c) => c.tags.forEach((t) => s.add(t)));
  return [...s].sort();
}
