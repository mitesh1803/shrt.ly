const DEFAULT_API_BASE_URL = "http://localhost:3000";

const apiBaseUrlInput = document.getElementById("apiBaseUrlInput");
const settingsForm = document.getElementById("settingsForm");
const statusMessage = document.getElementById("statusMessage");

function normalizeBaseUrl(value) {
  return (value || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");
}

function setStatus(message, tone = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status";

  if (tone) {
    statusMessage.classList.add(`is-${tone}`);
  }
}

async function loadSettings() {
  const { apiBaseUrl } = await chrome.storage.sync.get({
    apiBaseUrl: DEFAULT_API_BASE_URL,
  });

  apiBaseUrlInput.value = normalizeBaseUrl(apiBaseUrl);
}

async function saveSettings(event) {
  event.preventDefault();

  try {
    const normalizedBaseUrl = normalizeBaseUrl(apiBaseUrlInput.value);

    new URL(normalizedBaseUrl);
    await chrome.storage.sync.set({ apiBaseUrl: normalizedBaseUrl });

    setStatus("Settings saved. The popup will use the new backend immediately.", "success");
  } catch {
    setStatus("Enter a valid base URL such as http://localhost:3000.", "error");
  }
}

settingsForm.addEventListener("submit", saveSettings);
loadSettings().catch(() => {
  setStatus("Unable to load extension settings.", "error");
});
