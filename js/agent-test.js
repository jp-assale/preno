(function () {
  const chatBody = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const clientIdInput = document.getElementById('clientIdInput');
  const statusLine = document.getElementById('statusLine');

  let history = [];

  function addMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'bot' ? 'msg-bot' : 'msg-user');
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function setStatus(text, isError) {
    statusLine.textContent = text;
    statusLine.style.color = isError ? '#dc2626' : 'var(--text-muted)';
  }

  async function sendMessage(text) {
    addMessage(text, 'user');
    history.push({ role: 'user', content: text });
    input.value = '';
    input.disabled = true;
    setStatus('L\'agent réfléchit…');

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: clientIdInput.value.trim() || '_template', messages: history })
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || `Erreur ${res.status}`, true);
        input.disabled = false;
        return;
      }

      addMessage(data.reply, 'bot');
      history.push({ role: 'assistant', content: data.reply });

      if (data.bookingComplete) {
        setStatus('✅ Réservation détectée : ' + JSON.stringify(data.booking));
      } else {
        setStatus('');
      }
    } catch (err) {
      setStatus('Erreur réseau : ' + err.message, true);
    }

    input.disabled = false;
    input.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    sendMessage(val);
  });

  addMessage('Tapez un message pour démarrer le test avec le client sélectionné ci-dessus.', 'bot');
})();
