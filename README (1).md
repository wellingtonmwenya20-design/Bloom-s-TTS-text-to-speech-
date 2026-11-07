# Bloom TTS

Bloom TTS is a Render-ready JavaScript web application that converts typed text into speech using the browser's Web Speech API.

## Features

- Text-to-speech playback
- Available device voice selection
- Language selection and lightweight keyword-based language suggestion
- Speaking speed and pitch controls
- Pause, resume, stop and clear controls
- Responsive interface for phones and computers
- Node.js / Express server and health endpoint

## Important language-support note

This version uses `window.speechSynthesis` and voices supplied by the user's browser or operating system. The language list includes English, French, Bemba, Nyanja/Chichewa, Tonga, Lozi, Tumbuka, Lamba, Swahili and Zulu, but listing a language does **not** mean a matching voice is available.

The small language detector is only a keyword-based suggestion helper. It does not translate text or provide reliable automatic language identification. For languages without a matching installed voice, speech may fall back to another voice or have poor pronunciation.

Dedicated, consistent Zambian-language voices will require a separate TTS provider or custom-trained speech models in a future version.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

For development:

```bash
npm run dev
```

## Deploy using GitHub and Render

1. Create a GitHub repository, for example `bloom-tts`.
2. Upload the contents of this project to the repository root. Do not upload the ZIP file as the only repository file; extract it first.
3. In Render, choose **New + → Web Service** and connect the GitHub repository.
4. Use:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/health`
5. Deploy. No AI-provider API key is required for this browser-based TTS version.

You can also use the included `render.yaml` as a Render Blueprint.

## Endpoints

- `GET /health` — health check
- `GET /api/info` — application and engine information

## Browser compatibility

Speech synthesis availability and voice lists vary by browser, device, operating system, and installed voice packs. Test on the target Android browser and desktop browsers. A hosted Render server does not itself supply the speech voices; speech is generated on the user's device.
