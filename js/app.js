// Theme toggle
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  btn.addEventListener('click', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// Multi-niche booking/quote agent demo — same engine, one config per métier
(function () {
  const chatBody = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const bizNameEl = document.getElementById('chatBizName');
  const notesListEl = document.getElementById('demoNotesList');
  const tabs = document.querySelectorAll('.niche-tab');

  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const NUMBER_WORDS = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10 };

  function detectDay(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes("aujourd'hui") || lower.includes('aujourdhui')) return "aujourd'hui";
    if (lower.includes('demain')) return 'demain';
    for (const d of DAYS) if (lower.includes(d)) return d.charAt(0).toUpperCase() + d.slice(1);
    return null;
  }

  function detectFromMap(msg, map) {
    const lower = msg.toLowerCase();
    for (const key in map) if (lower.includes(key)) return map[key];
    return null;
  }

  function detectSlot(msg, slots) {
    const lower = msg.toLowerCase().replace(/\s/g, '');
    return slots.find(s => lower.includes(s.toLowerCase().replace('h', 'h')) || lower.includes(s.replace('h', ''))) || null;
  }

  function detectPartySize(msg) {
    const lower = msg.toLowerCase();
    const digitMatch = lower.match(/(\d{1,2})\s*(personnes?|couverts?|convives?)?/);
    if (digitMatch) return parseInt(digitMatch[1], 10);
    for (const w in NUMBER_WORDS) if (lower.includes(w)) return NUMBER_WORDS[w];
    return null;
  }

  function detectUrgency(msg) {
    const lower = msg.toLowerCase();
    if (/urgent|urgence|vite|rapide|tout de suite|asap/.test(lower)) return 'urgente';
    if (/pas urgent|quand vous pouvez|cette semaine|pas press/.test(lower)) return 'non urgente';
    return null;
  }

  function detectPhone(msg) {
    const digits = msg.replace(/\D/g, '');
    return digits.length >= 8 ? digits : null;
  }

  function detectName(msg) {
    const cleaned = msg.trim().replace(/^(je m'appelle|c'est|moi c'est)\s+/i, '');
    if (cleaned.length > 1 && cleaned.length < 30 && !/\d{3,}/.test(cleaned)) return cleaned;
    return null;
  }

  const NICHES = {
    salon: {
      label: 'Salon de coiffure',
      bizName: 'Salon Belle Étoile',
      greeting: "Bonjour, bienvenue au Salon Belle Étoile ! Je peux vous prendre un rendez-vous. Quel service souhaitez-vous, et pour quel jour ?",
      type: 'item-booking',
      items: { coupe: 'Coupe', coiffure: 'Coupe', cheveux: 'Coupe', coloration: 'Coloration', couleur: 'Coloration', meche: 'Coloration', 'mèches': 'Coloration', brushing: 'Brushing', balayage: 'Balayage', barbe: 'Taille de barbe' },
      itemPrompt: 'Je peux vous aider à prendre rendez-vous. Quel service souhaitez-vous : coupe, coloration, brushing ou balayage ?',
      itemAskAgain: 'Je propose coupe, coloration, brushing, balayage ou taille de barbe. Lequel vous intéresse ?',
      slots: ['10h00', '11h30', '14h00', '16h30', '17h45'],
      confirm: (s) => `C'est confirmé, ${s.name} : ${s.item.toLowerCase()} le ${s.day.toLowerCase()} à ${s.slot}. Un SMS de rappel vous sera envoyé la veille. À bientôt !`,
      notes: [
        'Comprend la demande en langage naturel (jour, service, créneau)',
        'Propose des créneaux disponibles et confirme le rendez-vous',
        'Récupère le nom pour la fiche client',
        'En production : connecté à l\'agenda réel du salon et à WhatsApp / SMS / site web'
      ]
    },
    cabinet: {
      label: 'Cabinet médical',
      bizName: 'Cabinet Dr. Lambert',
      greeting: "Bonjour, cabinet du Dr. Lambert. Je peux vous fixer un rendez-vous. Pour quel motif, et quel jour vous conviendrait ?",
      type: 'item-booking',
      items: { controle: 'Contrôle', 'contrôle': 'Contrôle', detartrage: 'Détartrage', 'détartrage': 'Détartrage', urgence: 'Urgence', douleur: 'Urgence', consultation: 'Consultation', soin: 'Soin', suivi: 'Consultation de suivi' },
      itemPrompt: 'Pour quel motif souhaitez-vous consulter : contrôle, urgence, détartrage ou consultation de suivi ?',
      itemAskAgain: 'Je peux noter : contrôle, urgence, détartrage ou consultation de suivi. Lequel s\'applique ?',
      slots: ['9h00', '10h15', '11h30', '15h00', '16h15'],
      confirm: (s) => `C'est confirmé, ${s.name} : ${s.item.toLowerCase()} le ${s.day.toLowerCase()} à ${s.slot}. Vous recevrez un rappel par SMS la veille.`,
      notes: [
        'Distingue les motifs (urgence traitée en priorité)',
        'Propose des créneaux disponibles et confirme le rendez-vous',
        'Récupère le nom pour le dossier patient',
        'En production : connecté à l\'agenda du cabinet et aux rappels SMS automatiques'
      ]
    },
    restaurant: {
      label: 'Restaurant',
      bizName: 'La Table Ronde',
      greeting: "Bonjour, bienvenue à La Table Ronde ! Pour combien de personnes, et pour quel jour souhaitez-vous réserver ?",
      type: 'party-booking',
      slots: ['12h00', '12h30', '19h30', '20h00', '20h30'],
      confirm: (s) => `C'est noté, ${s.name} : table pour ${s.party} personne${s.party > 1 ? 's' : ''} le ${s.day.toLowerCase()} à ${s.slot}. À bientôt à La Table Ronde !`,
      notes: [
        'Comprend le nombre de couverts et la date en langage naturel',
        'Propose des créneaux disponibles selon le service (midi/soir)',
        'Récupère le nom pour la réservation',
        'En production : connecté au système de réservation du restaurant et à WhatsApp'
      ]
    },
    auto: {
      label: 'Entretien / réparation auto',
      bizName: 'Garage Bamako Auto',
      greeting: "Bonjour, Garage Bamako Auto à votre écoute. Décrivez-moi le problème ou l'entretien souhaité pour votre véhicule, je vous mets en relation avec un technicien.",
      type: 'quote-callback',
      notes: [
        'Qualifie la demande (type de panne ou d\'entretien, urgence) avant de déranger un technicien',
        'Priorise automatiquement les urgences (panne immobilisante) pour un rappel plus rapide',
        'Récupère nom et téléphone pour le rappel',
        'En production : connecté à l\'agenda du garage et au SMS de confirmation'
      ]
    }
  };

  let current = 'salon';
  let state = {};

  function addMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'bot' ? 'msg-bot' : 'msg-user');
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botReply(text, delay = 550) {
    const typing = document.createElement('div');
    typing.className = 'msg-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    return new Promise((resolve) => {
      setTimeout(() => {
        typing.remove();
        addMessage(text, 'bot');
        resolve();
      }, delay);
    });
  }

  function resetChat(nicheKey) {
    current = nicheKey;
    const niche = NICHES[nicheKey];
    state = { step: 'greet', niche: nicheKey };
    chatBody.innerHTML = '';
    bizNameEl.textContent = niche.bizName;
    notesListEl.innerHTML = niche.notes.map(n => `<li>${n}</li>`).join('');
    input.disabled = false;
    botReply(niche.greeting, 400);
  }

  async function handleItemBooking(raw, niche) {
    if (state.step === 'greet' || state.step === 'item') {
      const item = detectFromMap(raw, niche.items);
      const day = state.step === 'greet' ? detectDay(raw) : state.day;
      if (item) state.item = item;
      if (day) state.day = day;

      if (state.item && state.day) {
        state.step = 'slot';
        await botReply(`Parfait, ${state.item.toLowerCase()} le ${state.day.toLowerCase()}. Créneaux libres : ${niche.slots.join(', ')}. Lequel préférez-vous ?`);
      } else if (state.item && !state.day) {
        state.step = 'day';
        await botReply(`Noté : ${state.item.toLowerCase()}. Quel jour vous conviendrait ?`);
      } else if (!state.item) {
        state.step = 'item';
        await botReply(state.step === 'item' && chatBody.children.length > 2 ? niche.itemAskAgain : niche.itemPrompt);
      }
    } else if (state.step === 'day') {
      const day = detectDay(raw);
      if (!day) {
        await botReply("Quel jour de la semaine préférez-vous ? (ex : jeudi, demain, samedi...)");
      } else {
        state.day = day;
        state.step = 'slot';
        await botReply(`Très bien, ${day.toLowerCase()}. Créneaux libres : ${niche.slots.join(', ')}. Lequel préférez-vous ?`);
      }
    } else if (state.step === 'slot') {
      const slot = detectSlot(raw, niche.slots);
      if (!slot) {
        await botReply(`Choisissez parmi : ${niche.slots.join(', ')}.`);
      } else {
        state.slot = slot;
        state.step = 'name';
        await botReply('Parfait. À quel nom je note le rendez-vous ?');
      }
    } else if (state.step === 'name') {
      state.name = detectName(raw) || raw.trim();
      state.step = 'done';
      await botReply(niche.confirm(state), 700);
      await botReply('— Fin de la démo. En vrai, ce rendez-vous serait déjà dans l\'agenda et le client aurait reçu une confirmation par SMS/WhatsApp.', 900);
    }
  }

  async function handlePartyBooking(raw, niche) {
    if (state.step === 'greet') {
      const party = detectPartySize(raw);
      const day = detectDay(raw);
      if (party) state.party = party;
      if (day) state.day = day;

      if (state.party && state.day) {
        state.step = 'slot';
        await botReply(`Parfait, une table pour ${state.party} le ${state.day.toLowerCase()}. Créneaux libres : ${niche.slots.join(', ')}. Lequel préférez-vous ?`);
      } else if (state.party && !state.day) {
        state.step = 'day';
        await botReply(`Noté, ${state.party} personnes. Quel jour souhaitez-vous réserver ?`);
      } else if (!state.party && state.day) {
        state.step = 'party';
        await botReply(`Très bien pour ${state.day.toLowerCase()}. Pour combien de personnes ?`);
      } else {
        state.step = 'party';
        await botReply('Pour combien de personnes souhaitez-vous réserver ?');
      }
    } else if (state.step === 'party') {
      const party = detectPartySize(raw);
      if (!party) {
        await botReply('Pour combien de personnes, exactement ? (ex : deux, 4 personnes...)');
      } else {
        state.party = party;
        state.step = state.day ? 'slot' : 'day';
        if (state.day) {
          await botReply(`Parfait, une table pour ${party} le ${state.day.toLowerCase()}. Créneaux libres : ${niche.slots.join(', ')}. Lequel préférez-vous ?`);
        } else {
          await botReply('Quel jour souhaitez-vous réserver ?');
        }
      }
    } else if (state.step === 'day') {
      const day = detectDay(raw);
      if (!day) {
        await botReply('Quel jour souhaitez-vous réserver ? (ex : vendredi, demain...)');
      } else {
        state.day = day;
        state.step = 'slot';
        await botReply(`Très bien, ${day.toLowerCase()}. Créneaux libres : ${niche.slots.join(', ')}. Lequel préférez-vous ?`);
      }
    } else if (state.step === 'slot') {
      const slot = detectSlot(raw, niche.slots);
      if (!slot) {
        await botReply(`Choisissez parmi : ${niche.slots.join(', ')}.`);
      } else {
        state.slot = slot;
        state.step = 'name';
        await botReply('Parfait. À quel nom je note la réservation ?');
      }
    } else if (state.step === 'name') {
      state.name = detectName(raw) || raw.trim();
      state.step = 'done';
      await botReply(niche.confirm(state), 700);
      await botReply('— Fin de la démo. En vrai, cette réservation serait déjà dans le système du restaurant.', 900);
    }
  }

  async function handleQuoteCallback(raw, niche) {
    if (state.step === 'greet') {
      state.problem = raw.trim();
      state.step = 'urgency';
      await botReply("Je note. C'est urgent (véhicule immobilisé, panne totale...) ou ça peut attendre quelques jours ?");
    } else if (state.step === 'urgency') {
      const urgency = detectUrgency(raw) || (raw.toLowerCase().includes('non') ? 'non urgente' : 'non urgente');
      state.urgency = urgency;
      state.step = 'contact';
      await botReply('Compris. Pour vous mettre en relation avec un technicien, quel est votre nom et votre numéro de téléphone ?');
    } else if (state.step === 'contact') {
      const phone = detectPhone(raw);
      const cleanedRaw = raw.replace(/\d[\d\s.-]*/g, '').replace(/[,;]+\s*$/, '').trim();
      const name = detectName(cleanedRaw) || 'vous';
      state.name = name;
      state.phone = phone || 'numéro non détecté dans la démo';
      state.step = 'done';
      const delay = state.urgency === 'urgente' ? 'dans les 30 minutes' : 'dans la journée';
      await botReply(`Merci ${name}. Un technicien vous rappelle ${delay} au ${state.phone} au sujet de : "${state.problem}".`, 700);
      await botReply('— Fin de la démo. En vrai, cette demande serait déjà envoyée au planning des techniciens avec priorité selon l\'urgence.', 900);
    }
  }

  async function handleUserMessage(raw) {
    addMessage(raw, 'user');
    input.value = '';
    input.disabled = true;

    const niche = NICHES[current];
    if (state.step === 'done') {
      await botReply('La démo est terminée — changez de secteur ou rafraîchissez la page pour recommencer.');
    } else if (niche.type === 'item-booking') {
      await handleItemBooking(raw, niche);
    } else if (niche.type === 'party-booking') {
      await handlePartyBooking(raw, niche);
    } else if (niche.type === 'quote-callback') {
      await handleQuoteCallback(raw, niche);
    }

    input.disabled = false;
    input.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    handleUserMessage(val);
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      resetChat(tab.dataset.niche);
    });
  });

  resetChat('salon');
})();
