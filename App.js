import { LANGUAGES, getLanguage, detectLanguage } from './languages.js';

const MAX_CHARS = 5000;
const CHUNK_SIZE = 200;

const $ = (id) => document.getElementById(id);
const ui = {
  text: $('text'),
  count: $('charCount'),
  sample: $('sample'),
  language: $('language'),
  detected: $('detected'),
  voice: $('voice'),
  voiceStatus: $('voiceStatus'),
  langNote: $('langNote'),
  fallbackWrap: $('fallbackWrap'),
  fallback: $('fallback'),
  rate: $('rate'),
  rateOut: $('rateOut'),
  pitch: $('pitch'),
  pitchOut: $('pitchOut'),
  volume: $('volume'),
  volumeOut: $('volumeOut'),
  speak: $('speak'),
  pause: $('pause'),
  resume: $('resume'),
  stop: $('stop'),
  progress: $('progress'),
  status: $('status'),
  server: $('serverStatus'),
  version: $('version'),
  unsupported: $('unsupported')
};
