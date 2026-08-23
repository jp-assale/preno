import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function loadClientConfig(clientId) {
  const safeId = (clientId || '_template').replace(/[^a-zA-Z0-9_-]/g, '');
  const filePath = path.join(moduleDir, '..', '..', 'clients', `${safeId}.json`);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function buildSystemPrompt(config) {
  const hoursLines = Object.entries(config.hours || {})
    .map(([day, hours]) => `- ${day} : ${hours}`)
    .join('\n');

  const faqLines = (config.faq || [])
    .map((item) => `Q : ${item.q}\nR : ${item.a}`)
    .join('\n\n');

  const base = `Tu es l'agent de prise de contact automatique de "${config.businessName}".
Tu réponds en français, ton chaleureux mais efficace, phrases courtes.

Horaires d'ouverture :
${hoursLines || 'non renseignés'}

Questions fréquentes à connaître :
${faqLines || 'aucune renseignée'}

${config.notes ? `Notes supplémentaires : ${config.notes}` : ''}`;

  if (config.niche === 'party-booking') {
    return `${base}

Ton rôle : prendre une réservation. Tu dois obtenir, dans l'ordre ou en une seule fois si le client donne
tout d'un coup : le nombre de personnes, le jour souhaité, un créneau parmi les disponibilités que tu
proposes en te basant sur les horaires d'ouverture, puis le nom pour la réservation.

Services / infos disponibles :
${JSON.stringify(config.services || [], null, 2)}

Quand tu as recueilli TOUTES les informations (nombre de personnes, jour, créneau, nom), termine ta
réponse par un bloc exact sur sa propre ligne :
<<BOOKING_COMPLETE>>{"party": <nombre>, "day": "<jour>", "slot": "<créneau>", "name": "<nom>"}<<END>>
Ne montre jamais ce bloc avant d'avoir vraiment toutes les infos. N'explique pas le bloc au client.`;
  }

  if (config.niche === 'quote-callback') {
    return `${base}

Ton rôle : qualifier une demande avant de la transmettre à un technicien. Tu dois obtenir : la description
du problème/besoin, si c'est urgent ou non (critère d'urgence : ${config.urgencyCriteria || 'à ton appréciation selon la gravité décrite'}), puis le nom et le numéro de téléphone du client pour le rappel.

Quand tu as recueilli TOUTES les informations (problème, urgence, nom, téléphone), termine ta réponse par
un bloc exact sur sa propre ligne :
<<BOOKING_COMPLETE>>{"problem": "<description>", "urgency": "<urgente|non urgente>", "name": "<nom>", "phone": "<téléphone>"}<<END>>
Ne montre jamais ce bloc avant d'avoir vraiment toutes les infos. N'explique pas le bloc au client.`;
  }

  // default: item-booking
  return `${base}

Ton rôle : prendre un rendez-vous. Tu dois obtenir, dans l'ordre ou en une seule fois si le client donne
tout d'un coup : le service souhaité, le jour, un créneau parmi les disponibilités que tu proposes en te
basant sur les horaires d'ouverture, puis le nom du client.

Services disponibles :
${JSON.stringify(config.services || [], null, 2)}

Quand tu as recueilli TOUTES les informations (service, jour, créneau, nom), termine ta réponse par un
bloc exact sur sa propre ligne :
<<BOOKING_COMPLETE>>{"service": "<service>", "day": "<jour>", "slot": "<créneau>", "name": "<nom>"}<<END>>
Ne montre jamais ce bloc avant d'avoir vraiment toutes les infos. N'explique pas le bloc au client.`;
}

function extractBooking(text) {
  const match = text.match(/<<BOOKING_COMPLETE>>([\s\S]*?)<<END>>/);
  if (!match) return { cleanText: text, booking: null };
  const cleanText = text.replace(match[0], '').trim();
  try {
    return { cleanText, booking: JSON.parse(match[1]) };
  } catch {
    return { cleanText, booking: null };
  }
}

async function notifyBooking(config, booking) {
  // TODO : brancher une vraie notification une fois le client réel connu :
  // webhook WhatsApp, email transactionnel, ou écriture dans Google Calendar/Sheet.
  // Pour l'instant, ça sort juste dans les logs de la fonction Netlify (onglet Functions du dashboard).
  console.log(`[BOOKING] ${config.businessName} :`, JSON.stringify(booking));
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "ANTHROPIC_API_KEY n'est pas configurée. Ajoute-la dans Netlify → Site configuration → Environment variables."
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Corps de requête JSON invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { clientId, messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: '"messages" doit être un tableau non vide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let config;
  try {
    config = loadClientConfig(clientId);
  } catch {
    return new Response(JSON.stringify({ error: `Config client introuvable pour clientId="${clientId}"` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const systemPrompt = buildSystemPrompt(config);

  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content }))
    })
  });

  if (!anthropicResponse.ok) {
    const errText = await anthropicResponse.text();
    return new Response(JSON.stringify({ error: `Erreur API Claude : ${errText}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await anthropicResponse.json();
  const rawText = data.content?.[0]?.text || '';
  const { cleanText, booking } = extractBooking(rawText);

  if (booking) {
    await notifyBooking(config, booking);
  }

  return new Response(
    JSON.stringify({ reply: cleanText, bookingComplete: Boolean(booking), booking }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
