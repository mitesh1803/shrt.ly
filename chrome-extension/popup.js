const DEFAULT_API_BASE_URL = "http://localhost:3000";

const elements = {
  apiBaseLabel: document.getElementById("apiBaseLabel"),
  copyButton: document.getElementById("copyButton"),
  emailInput: document.getElementById("emailInput"),
  loginButton: document.getElementById("loginButton"),
  loginForm: document.getElementById("loginForm"),
  logoutButton: document.getElementById("logoutButton"),
  openButton: document.getElementById("openButton"),
  openOptionsButton: document.getElementById("openOptionsButton"),
  passwordInput: document.getElementById("passwordInput"),
  resultInput: document.getElementById("resultInput"),
  resultPanel: document.getElementById("resultPanel"),
  sessionEmail: document.getElementById("sessionEmail"),
  sessionPanel: document.getElementById("sessionPanel"),
  shortenButton: document.getElementById("shortenButton"),
  statusMessage: document.getElementById("statusMessage"),
  urlInput: document.getElementById("urlInput"),
  useCurrentTabButton: document.getElementById("useCurrentTabButton"),
};

let state = {
  apiBaseUrl: DEFAULT_API_BASE_URL,
  authEmail: "",
  authToken: "",
  isBusy: false,
  shortUrl: "",
};

function normalizeBaseUrl(value) {
  return (value || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");
}

function setStatus(message, tone = "") {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = "status";

  if (tone) {
    elements.statusMessage.classList.add(`is-${tone}`);
  }
}

function setBusy(isBusy) {
  state.isBusy = isBusy;

  elements.shortenButton.disabled = isBusy;
  elements.loginButton.disabled = isBusy;
  elements.useCurrentTabButton.disabled = isBusy;
  elements.copyButton.disabled = isBusy;
  elements.openButton.disabled = isBusy;
  elements.logoutButton.disabled = isBusy;
}

function renderSession() {
  const isLoggedIn = Boolean(state.authToken);

  elements.sessionPanel.hidden = !isLoggedIn;
  elements.loginForm.hidden = isLoggedIn;
  elements.logoutButton.hidden = !isLoggedIn;
  elements.sessionEmail.textContent = state.authEmail;
}

function renderResult() {
  const hasShortUrl = Boolean(state.shortUrl);

  elements.resultPanel.hidden = !hasShortUrl;
  elements.resultInput.value = state.shortUrl;
}

function renderApiBase() {
  elements.apiBaseLabel.textContent = state.apiBaseUrl;
}

async function loadSettings() {
  const syncData = await chrome.storage.sync.get({
    apiBaseUrl: DEFAULT_API_BASE_URL,
  });
  const localData = await chrome.storage.local.get({
    authEmail: "",
    authToken: "",
  });

  state.apiBaseUrl = normalizeBaseUrl(syncData.apiBaseUrl);
  state.authEmail = localData.authEmail;
  state.authToken = localData.authToken;

  renderApiBase();
  renderSession();
}

async function saveSession(authToken, authEmail) {
  state.authToken = authToken;
  state.authEmail = authEmail;

  await chrome.storage.local.set({ authToken, authEmail });
  renderSession();
}

async function clearSession() {
  state.authToken = "";
  state.authEmail = "";

  await chrome.storage.local.remove(["authToken", "authEmail"]);
  renderSession();
}

function normalizeInputUrl(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error("Enter a URL to shorten.");
  }

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  return new URL(candidate).toString();
}

async function useCurrentTabUrl() {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const activeUrl = activeTab?.url || "";

  if (!activeUrl || activeUrl.startsWith("chrome://") || activeUrl.startsWith("edge://")) {
    setStatus("Open a regular webpage to capture its URL.", "error");
    return;
  }

  elements.urlInput.value = activeUrl;
  setStatus("Current tab URL loaded.", "success");
}

async function shortenUrl() {
  let normalizedUrl = "";

  try {
    normalizedUrl = normalizeInputUrl(elements.urlInput.value);
  } catch (error) {
    setStatus(error.message, "error");
    return;
  }

  setBusy(true);
  setStatus("Creating short link...");

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (state.authToken) {
      headers.Authorization = `Bearer ${state.authToken}`;
    }

    const response = await fetch(`${state.apiBaseUrl}/api/shorten`, {
      method: "POST",
      headers,
      body: JSON.stringify({ url: normalizedUrl }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Unable to shorten this URL.");
    }

    state.shortUrl = data.shortUrl || "";
    renderResult();
    setStatus("Short link ready to copy.", "success");
  } catch (error) {
    state.shortUrl = "";
    renderResult();
    setStatus(error.message || "Unable to reach the API.", "error");
  } finally {
    setBusy(false);
  }
}

async function login(event) {
  event.preventDefault();

  const email = elements.emailInput.value.trim();
  const password = elements.passwordInput.value;

  if (!email || !password) {
    setStatus("Enter both email and password to log in.", "error");
    return;
  }

  setBusy(true);
  setStatus("Signing you in...");

  try {
    const response = await fetch(`${state.apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.token) {
      throw new Error(data.message || "Login failed.");
    }

    await saveSession(data.token, data.email || email);
    elements.passwordInput.value = "";
    setStatus("You are logged in. Future links will be saved to your account.", "success");
  } catch (error) {
    setStatus(error.message || "Login failed.", "error");
  } finally {
    setBusy(false);
  }
}

async function copyShortUrl() {
  if (!state.shortUrl) {
    return;
  }

  try {
    await navigator.clipboard.writeText(state.shortUrl);
    setStatus("Short link copied to your clipboard.", "success");
  } catch {
    setStatus("Copy failed. Chrome blocked clipboard access.", "error");
  }
}

function openShortUrl() {
  if (!state.shortUrl) {
    return;
  }

  chrome.tabs.create({ url: state.shortUrl });
}

async function logout() {
  await clearSession();
  setStatus("Logged out. You can still shorten links as a guest.", "success");
}

function openOptions() {
  chrome.runtime.openOptionsPage();
}

async function bootstrap() {
  await loadSettings();
  renderResult();
  await useCurrentTabUrl();

  elements.useCurrentTabButton.addEventListener("click", useCurrentTabUrl);
  elements.shortenButton.addEventListener("click", shortenUrl);
  elements.loginForm.addEventListener("submit", login);
  elements.copyButton.addEventListener("click", copyShortUrl);
  elements.openButton.addEventListener("click", openShortUrl);
  elements.logoutButton.addEventListener("click", logout);
  elements.openOptionsButton.addEventListener("click", openOptions);
}

bootstrap().catch(() => {
  setStatus("The extension could not start correctly.", "error");
});
