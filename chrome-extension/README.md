# shrt.ly Chrome Extension

This folder contains a loadable Chrome extension for your URL shortener.

## What it does

- Shortens the active tab or any pasted URL
- Supports guest shortening
- Lets users log in so new links are attached to their account
- Stores the backend base URL in extension settings

## Load it in Chrome

1. Start your backend server.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the [`chrome-extension`](/home/mitesh/CodeWithMeetesh/webdev/url_shortner/chrome-extension) folder.

## Default backend

The extension starts with `http://localhost:3000` as the default base URL. If your backend is deployed somewhere else, open the extension options and update the API base URL there.

## Notes

- The popup uses `/api/shorten` and `/api/auth/login`.
- Logged-in sessions are stored in Chrome extension storage, not the website localStorage.
