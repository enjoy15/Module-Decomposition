const messageForm = document.querySelector('#message-form');
const nameInput = document.querySelector('#name-input');
const textInput = document.querySelector('#text-input');
const statusEl = document.querySelector('#status');
const messagesEl = document.querySelector('#messages');
const refreshButton = document.querySelector('#refresh-button');

const API_BASE_URL = (window.API_BASE_URL || '').replace(/\/$/, '');

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

let lastMessageCount = 0;

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderMessages(messages) {
  messagesEl.innerHTML = '';

  for (const message of [...messages].reverse()) {
    const item = document.createElement('li');
    item.className = 'message';

    item.innerHTML = `
      <div class="message-meta">
        <span class="message-name">${escapeHtml(message.name)}</span>
        <span>${formatTime(message.createdAt)}</span>
      </div>
      <p class="message-text">${escapeHtml(message.text)}</p>
    `;

    messagesEl.appendChild(item);
  }

  lastMessageCount = messages.length;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function loadMessages() {
  const response = await fetch(apiUrl('/api/messages'));

  if (!response.ok) {
    throw new Error('Could not load messages');
  }

  const data = await response.json();
  renderMessages(data.messages);
}

async function sendMessage(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!text) {
    setStatus('Please type a message.', 'error');
    return;
  }

  setStatus('Sending message...');

  try {
    const response = await fetch(apiUrl('/api/messages'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, text }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    textInput.value = '';
    setStatus('Message sent.', 'success');
    await loadMessages();
  } catch (error) {
    setStatus(error.message || 'Could not send message.', 'error');
  }
}

messageForm.addEventListener('submit', sendMessage);
refreshButton.addEventListener('click', async () => {
  try {
    await loadMessages();
    setStatus('Messages refreshed.', 'success');
  } catch {
    setStatus('Could not refresh messages.', 'error');
  }
});

loadMessages().catch(() => {
  setStatus('Could not load messages. Is the backend running?', 'error');
});

setInterval(() => {
  loadMessages().catch(() => {
    setStatus('Waiting for the backend...', 'error');
  });
}, 3000);
