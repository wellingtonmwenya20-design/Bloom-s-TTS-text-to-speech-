// Bloom TTS - language registry and language detection.
// This file is shared: the browser imports it for the UI and Node imports it
// for the /api endpoints. It must NEVER touch browser-only APIs (window, document).
//
// "engine" describes what is honestly possible today:
//   "browser" - mainstream browsers/devices commonly ship voices for this language.
//   "planned" - language selection is supported, but speech only works if the
//               user's device happens to have a matching voice installed.
//               A dedicated Bloom voice is on the roadmap.

export const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechTag: 'en-US',
    voicePrefixes: ['en'],
    engine: 'browser',
    sample: 'Hello! Welcome to Bloom TTS. This text is being read aloud by your device.'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    speechTag: 'fr-FR',
    voicePrefixes: ['fr'],
    engine: 'browser',
    sample: "Bonjour ! Bienvenue sur Bloom TTS. Ce texte est lu à voix haute par votre appareil."
  },
  {
    code: 'bem',
    name: 'Bemba',
    nativeName: 'Ichibemba',
    speechTag: 'bem',
