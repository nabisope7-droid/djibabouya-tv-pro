const KEY = 'diafar-tv-state';
const API_URL = '/api/state';
const ADMIN_TOKEN_KEY = 'diafar-tv-admin-token';
let writeQueue = Promise.resolve();
let initialServerLoad = true;
const ADMIN_AUTH_KEY = 'diafar-tv-admin-auth';

const el = id => document.getElementById(id);
const home = el('home'), away = el('away');
const scoreHome = el('scoreHome'), scoreAway = el('scoreAway');
const status = el('status'), clock = el('clock'), extra = el('extra'), message = el('message');
const adminBtn = el('adminBtn'), login = el('login'), loginForm = el('loginForm');
const storageStatusLabel = el('storageStatusLabel'), storageBarFill = el('storageBarFill'), storageUsed = el('storageUsed'), storagePercent = el('storagePercent'), storageDetails = el('storageDetails'), storageWarning = el('storageWarning'), refreshStorage = el('refreshStorage');

const password = el('password'), error = el('error'), panel = el('panel'), closeBtn = el('close'), cancelLogin = el('cancelLogin');
const homeIn = el('homeIn'), awayIn = el('awayIn');
const homeColor = el('homeColor'), homeOutline = el('homeOutline'), homeBg = el('homeBg');
const awayColor = el('awayColor'), awayOutline = el('awayOutline'), awayBg = el('awayBg');
const saveTeams = el('saveTeams'), homePlus = el('homePlus'), homeMinus = el('homeMinus');
const awayPlus = el('awayPlus'), awayMinus = el('awayMinus');
const startBtn = el('start'), stopBtn = el('stop'), resetBtn = el('reset');
const extraIn = el('extraIn'), saveExtra = el('saveExtra');
const scoreColor = el('scoreColor'), scoreBg = el('scoreBg'), clockColor = el('clockColor'), extraColor = el('extraColor');
const messageIn = el('messageIn'), saveMessage = el('saveMessage');
const removeScore = el('removeScore'), showScore = el('showScore');
const scoreSize = el('scoreSize'), scoreSizeValue = el('scoreSizeValue');
const scoreSmaller = el('scoreSmaller'), scoreLarger = el('scoreLarger'), scoreSizeReset = el('scoreSizeReset');
const scoreWidth = el('scoreWidth'), scoreWidthValue = el('scoreWidthValue');
const scoreHeight = el('scoreHeight'), scoreHeightValue = el('scoreHeightValue');
const moveScore = el('moveScore');
const fixScore = el('fixScore');
const scorePanel = el('score');
const liveStage = el('live-stage');
const adOverlay = el('adOverlay'), adImageView = el('adImageView'), adVideoView = el('adVideoView'), adTitleView = el('adTitleView'), adTextView = el('adTextView');
const adImageIn = el('adImageIn'), adVideoIn = el('adVideoIn'), adTitleIn = el('adTitleIn'), adTextIn = el('adTextIn'), adTextColorIn = el('adTextColorIn'), adBgColorIn = el('adBgColorIn'), adDurationIn = el('adDurationIn'), publishStatus = el('publishStatus');
const adPreview = el('adPreview'), adPreviewImage = el('adPreviewImage'), adPreviewTitle = el('adPreviewTitle'), adPreviewText = el('adPreviewText');
const previewAd = el('previewAd'), publishAd = el('publishAd'), stopAd = el('stopAd');
const subOverlay = el('subOverlay'), subOutPhotoView = el('subOutPhotoView'), subOutNameView = el('subOutNameView'), subOutNumberView = el('subOutNumberView'), subOutTeamView = el('subOutTeamView'), subInPhotoView = el('subInPhotoView'), subInNameView = el('subInNameView'), subInNumberView = el('subInNumberView'), subInTeamView = el('subInTeamView');
const subOutPhotoIn = el('subOutPhotoIn'), subOutNameIn = el('subOutNameIn'), subOutNumberIn = el('subOutNumberIn'), subOutTeamIn = el('subOutTeamIn');
const subInPhotoIn = el('subInPhotoIn'), subInNameIn = el('subInNameIn'), subInNumberIn = el('subInNumberIn'), subInTeamIn = el('subInTeamIn');
const subDurationIn = el('subDurationIn'), subPreview = el('subPreview'), previewSub = el('previewSub'), publishSub = el('publishSub'), stopSub = el('stopSub'), subStatus = el('subStatus');
const replayOverlay = el('replayOverlay'), replayVideoView = el('replayVideoView');
const record30 = el('record30'), stopRecord = el('stopRecord'), recordPreview = el('recordPreview'), recordStatus = el('recordStatus');
const replayVideoIn = el('replayVideoIn'), replaySpeed = el('replaySpeed'), replayStart = el('replayStart'), replayEnd = el('replayEnd'), previewReplay = el('previewReplay'), publishReplay = el('publishReplay'), stopReplay = el('stopReplay'), replayStatus = el('replayStatus');
const goalOverlay = el('goalOverlay'), goalRows = el('goalRows'), goalScoreLine = el('goalScoreLine');
const goalPlayerIn = el('goalPlayerIn'), goalMinuteIn = el('goalMinuteIn'), goalTeamIn = el('goalTeamIn'), goalBallIn = el('goalBallIn');
const goalPlayerColorIn = el('goalPlayerColorIn'), goalBallColorIn = el('goalBallColorIn'), goalTeamColorIn = el('goalTeamColorIn'), goalBgColorIn = el('goalBgColorIn');
const publishGoal = el('publishGoal'), clearGoals = el('clearGoals');
const formationSelect = el('formationSelect'), compositionTeamIn = el('compositionTeamIn'), compositionPlayers = el('compositionPlayers');
const compositionPreview = el('compositionPreview'), previewComposition = el('previewComposition'), publishComposition = el('publishComposition'), stopComposition = el('stopComposition'), compositionStatus = el('compositionStatus');
const compositionOverlay = el('compositionOverlay'), compositionTitleView = el('compositionTitleView'), compositionBoardView = el('compositionBoardView');
const posterOverlay = el('posterOverlay'), posterImageView = el('posterImageView');

let state = {
  home: 'DJIBABOUYA',
  away: 'KANSIDI',
  sh: 0,
  sa: 0,
  status: 'DIRECT',
  extra: 0,
  message: '',
  running: false,
  elapsed: 0,
  startedAt: 0,
  extraMode: false,
  extraElapsed: 0,
  extraStartedAt: 0,
  homeColor: '#ffffff',
  homeOutline: '#000000',
  homeBg: '#0964e8',
  awayColor: '#ffffff',
  awayOutline: '#000000',
  awayBg: '#f4c400',
  scoreColor: '#111111',
  scoreBg: '#ffffff',
  clockColor: '#ffffff',
  extraColor: '#ffffff',
  scoreVisible: true,
  scoreScale: 100,
  scoreWidth: 100,
  scoreHeight: 100,
  scoreX: 0,
  scoreY: 108,
  scoreAttached: true,
  adImage: '',
  adVideo: '',
  adVideoDuration: 0,
  adPublicationId: '',
  replayVideo: '',
  replayStartedAt: 0,
  replayDuration: 0,
  replayClipStart: 0,
  replayClipEnd: 0,
  replaySpeed: 0.5,
  replayPublicationId: '',
  adTitle: '',
  adText: '',
  adTextColor: '#ffffff',
  adBgColor: '#1a1a1a',
  adStartedAt: 0,
  adDuration: 0,
  posterImage: '',
  posterStartedAt: 0,
  posterPublicationId: '',
  subOutPhoto: '',
  subOutName: '',
  subOutNumber: '',
  subOutTeam: '',
  subInPhoto: '',
  subInName: '',
  subInNumber: '',
  subInTeam: '',
  subStartedAt: 0,
  subDuration: 0,
  goalEvents: [], goalReminderVisible: true, goalReminderDuration: 12,
  compositionVisible: false, compositionFormation: '4-4-2', compositionTeam: 'home', compositionPlayers: [], compositionPublicationId: ''
};

function saveLocal() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

async function uploadMedia(data, label='média') {
  if (!data) return '';
  if (String(data).length > 17 * 1024 * 1024) throw new Error(label + ' trop volumineux pour l’envoi.');
  if (!String(data).startsWith('data:')) return data;
  const token = getAdminToken();
  if (!token) throw new Error('Session Admin absente. Reconnectez-vous.');
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Cache-Control':'no-store','Pragma':'no-cache'},
    cache: 'no-store',
    body: JSON.stringify({action:'upload', token, data})
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.url) throw new Error(result.error || ('Envoi de '+label+' impossible'));
  return result.url;
}

async function uploadStateMedia(fields) {
  for (const field of fields) {
    if (state[field] && String(state[field]).startsWith('data:')) {
      state[field] = await uploadMedia(state[field], field);
    }
  }
  if (Array.isArray(state.compositionPlayers)) {
    for (const player of state.compositionPlayers) {
      if (player?.photo && String(player.photo).startsWith('data:')) player.photo = await uploadMedia(player.photo, 'photo joueur');
    }
  }
}

async function saveAndSync() {
  const snapshot = JSON.parse(JSON.stringify(state));
  saveLocal();
  writeQueue = writeQueue.then(async () => {
    const token = getAdminToken();
    if (!token) throw new Error('Session Admin absente. Reconnectez-vous.');
    let lastError = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {'Content-Type':'application/json','Cache-Control':'no-store','Pragma':'no-cache'},
          cache:'no-store',
          body: JSON.stringify({action:'save', token, state:snapshot}),
          signal: controller.signal
        });
        clearTimeout(timer);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem(ADMIN_TOKEN_KEY);
            sessionStorage.removeItem(ADMIN_AUTH_KEY);
            throw new Error('Session Admin expirée. Reconnectez-vous.');
          }
          throw new Error(data.error || 'Publication impossible');
        }
        if (data.state && typeof data.state === 'object') {
          state = {...state, ...data.state};
          saveLocal();
          render();
        }
        return data.state || snapshot;
      } catch (err) {
        lastError = err;
        await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
      }
    }
    throw lastError || new Error('Connexion serveur impossible.');
  });
  return writeQueue;
}

async function loadServerState(showErrors = false) {
  try {
    const response = await fetch(API_URL + '?t=' + Date.now(), {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('GET state failed');
    const incoming = await response.json();
    if (incoming && typeof incoming === 'object') {
      const oldMessage = state.message;
      state = { ...state, ...incoming };
      if (incoming.scoreAttached !== true) { state.scoreAttached = true; state.scoreY = 12; }
      saveLocal();
      render();

      if (!initialServerLoad && state.message && state.message !== oldMessage) {
        showPublicationToast(state.message);
      }
    }
  } catch (err) {
    console.error(err);
    if (showErrors) message.textContent = '⚠️ Le serveur de synchronisation n’est pas encore disponible.';
  } finally {
    initialServerLoad = false;
  }
}

window.addEventListener('storage', event => {
  if (event.key !== KEY || !event.newValue) return;
  try {
    const incoming = JSON.parse(event.newValue);
    if (incoming && typeof incoming === 'object') { state = { ...state, ...incoming }; render(); }
  } catch (_) {}
});

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  if (saved && typeof saved === 'object') state = { ...state, ...saved };
} catch (_) {}

// Nouvelle fixation : le bandeau reste toujours dans l'écran principal de la TV.
if (state.scoreAttached !== true) { state.scoreAttached = true; state.scoreY = 12; }

function currentSeconds() {
  if (state.extraMode) {
    let seconds = Number(state.extraElapsed) || 0;
    if (state.running && state.extraStartedAt) seconds += Math.floor((Date.now() - state.extraStartedAt) / 1000);
    return seconds;
  }
  let seconds = Number(state.elapsed) || 0;
  if (state.running && state.startedAt) seconds += Math.floor((Date.now() - state.startedAt) / 1000);
  return seconds;
}

function formatTime(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
}

function showPublicationToast(text) {
  let toast = document.getElementById('publicationToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'publicationToast';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showPublicationToast.timer);
  showPublicationToast.timer = setTimeout(() => toast.classList.remove('show'), 6000);
}


function updateFixationUI() {
  // L'affichage est toujours contenu dans l'écran principal : il défile avec la TV.
  state.scoreAttached = true;
  scorePanel.classList.add('attached-to-main');
  if (fixScore) {
    fixScore.classList.add('is-active');
    fixScore.textContent = 'AFFICHAGE COLLÉ À L’ÉCRAN PRINCIPAL';
  }
}

function getMainRelativePosition() {
  const mainRect = document.querySelector('main')?.getBoundingClientRect();
  if (!mainRect) return { x: Number(state.scoreX) || 0, y: Number(state.scoreY) || 0 };
  return {
    x: (Number(state.scoreX) || 0),
    y: (Number(state.scoreY) || 0) + window.scrollY
  };
}

function render() {
  home.textContent = state.home;
  away.textContent = state.away;
  scoreHome.textContent = state.sh;
  scoreAway.textContent = state.sa;
  status.textContent = state.status || 'DIRECT';
  const publishedExtra = Number(state.extra) || 0;
  extra.hidden = publishedExtra <= 0;
  extra.textContent = publishedExtra > 0 ? '+' + publishedExtra : '';
  message.textContent = state.message || '';

  home.style.color = state.homeColor;
  home.style.webkitTextStroke = `1px ${state.homeOutline}`;
  home.style.textShadow = `0 0 0 ${state.homeOutline}`;
  home.style.backgroundColor = state.homeBg || '#0964e8';
  away.style.color = state.awayColor;
  away.style.webkitTextStroke = `1px ${state.awayOutline}`;
  away.style.textShadow = `0 0 0 ${state.awayOutline}`;
  away.style.backgroundColor = state.awayBg || '#f4c400';
  scoreHome.style.color = state.scoreColor;
  scoreAway.style.color = state.scoreColor;
  document.querySelector('.score-box').style.backgroundColor = state.scoreBg || '#ffffff';
  clock.style.color = state.clockColor;
  extra.style.color = state.extraColor;
  scorePanel.classList.toggle('is-hidden', state.scoreVisible === false);
  const scale = Math.max(50, Math.min(150, Number(state.scoreScale) || 100));
  const width = Math.max(50, Math.min(150, Number(state.scoreWidth) || 100));
  const height = Math.max(50, Math.min(150, Number(state.scoreHeight) || 100));

  // Les trois réglages sont indépendants :
  // - Taille générale : réduit/agrandit tout l'affichage.
  // - Largeur : étire/réduit horizontalement.
  // - Hauteur : étire/réduit verticalement.
  scorePanel.style.setProperty('--score-scale-x', (scale * width) / 10000);
  scorePanel.style.setProperty('--score-scale-y', (scale * height) / 10000);

  // Coordonnées relatives à l'écran TV : aucun décalage lors du défilement.
  scorePanel.style.left = (Number(state.scoreX) || 0) + 'px';
  scorePanel.style.top = (Number(state.scoreY) || 12) + 'px';
  updateFixationUI();
  renderBroadcastOverlays();
  renderGoalOverlay();
  renderCompositionOverlay();
  renderPosterOverlay();
  if (scoreSize) scoreSize.value = scale;
  if (scoreSizeValue) scoreSizeValue.textContent = scale + '%';
  if (scoreWidth) scoreWidth.value = width;
  if (scoreWidthValue) scoreWidthValue.textContent = width + '%';
  if (scoreHeight) scoreHeight.value = height;
  if (scoreHeightValue) scoreHeightValue.textContent = height + '%';

  clock.textContent = formatTime(currentSeconds());

  // Quand le temps additionnel est publié, le chrono repart automatiquement de 00:00.
  if (state.extraMode && state.extra > 0) {
    const limit = Number(state.extra) * 60;
    if (currentSeconds() >= limit && state.running) {
      state.extraElapsed = limit;
      state.running = false;
      state.extraStartedAt = 0;
      saveAndSync();
      clock.textContent = formatTime(limit);
    }
  }
}

function formatStorageBytes(bytes){
  const n=Number(bytes)||0;
  if(n<1024*1024)return `${Math.round(n/1024)} Ko`;
  return `${(n/(1024*1024)).toFixed(1)} Mo`;
}
async function refreshStorageUsage(){
  if(!isAdminAuthenticated())return;
  try{
    const token=getAdminToken();
    const r=await fetch('/api/storage',{headers:{'x-admin-token':token},cache:'no-store'});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Impossible de lire le stockage');
    const pct=Math.max(0,Math.min(100,Number(d.percent)||0));
    storageUsed.textContent=formatStorageBytes(d.usedBytes);
    storagePercent.textContent=`${pct.toFixed(0)} %`;
    storageBarFill.style.width=`${pct}%`;
    storageStatusLabel.textContent=d.warning==='full'?'PLEIN':d.warning==='critical'?'CRITIQUE':d.warning==='warning'?'ATTENTION':'OK';
    storageDetails.textContent=`Médias : ${formatStorageBytes(d.mediaBytes)} · État de l’application : ${formatStorageBytes(d.stateBytes)} · ${d.mediaCount||0} média(s).`;
    storageWarning.hidden=false;
    if(d.warning==='full')storageWarning.textContent='⛔ Le stockage surveillé a atteint 100 %. Les nouveaux médias ne pourront plus être enregistrés.';
    else if(d.warning==='critical')storageWarning.textContent='🔴 Attention : plus de 90 % du quota de 500 Mo est utilisé. Supprimez/évitez les anciens médias avant de publier de nouvelles vidéos.';
    else if(d.warning==='warning')storageWarning.textContent='🟠 Attention : plus de 80 % du quota de 500 Mo est utilisé.';
    else {storageWarning.hidden=true;storageWarning.textContent='';}
  }catch(e){
    storageStatusLabel.textContent='INDISPONIBLE';
    storageDetails.textContent='Impossible de vérifier le stockage pour le moment.';
  }
}

function openAdminPanel() {
  if (panel.open) return;
  homeIn.value = state.home;
  awayIn.value = state.away;
  homeColor.value = state.homeColor || '#ffffff';
  homeOutline.value = state.homeOutline || '#000000';
  homeBg.value = state.homeBg || '#0964e8';
  awayColor.value = state.awayColor || '#ffffff';
  awayOutline.value = state.awayOutline || '#000000';
  awayBg.value = state.awayBg || '#f4c400';
  scoreColor.value = state.scoreColor || '#111111';
  scoreBg.value = state.scoreBg || '#ffffff';
  clockColor.value = state.clockColor || '#ffffff';
  extraColor.value = state.extraColor || '#ffffff';
  extraIn.value = state.extra || '';
  messageIn.value = state.message || '';
  adTitleIn.value = state.adTitle || '';
  adTextIn.value = state.adText || '';
  adTextColorIn.value = state.adTextColor || '#ffffff';
  adBgColorIn.value = state.adBgColor || '#1a1a1a';
  adDurationIn.value = state.adDuration || 30;
  subOutNameIn.value = state.subOutName || '';
  subOutNumberIn.value = state.subOutNumber || '';
  subOutTeamIn.value = state.subOutTeam || '';
  subInNameIn.value = state.subInName || '';
  subInNumberIn.value = state.subInNumber || '';
  subInTeamIn.value = state.subInTeam || '';
  subDurationIn.value = state.subDuration || 20;
  updateAdPreview();
  updateSubPreview();
  formationSelect.value=state.compositionFormation||'4-4-2'; compositionTeamIn.value=state.compositionTeam||'home'; renderCompositionInputs();
  panel.show();
  refreshStorageUsage();
}
function closeAdminPanel() { if (panel.open) panel.close(); }
function isAdminAuthenticated() { return sessionStorage.getItem(ADMIN_AUTH_KEY) === '1' && Boolean(getAdminToken()); }
function openAdminLogin() {
  if (panel.open || login.open) return;
  if (isAdminAuthenticated()) { openAdminPanel(); return; }
  login.showModal();
  password.focus();
}

adminBtn.addEventListener('click', openAdminLogin);
closeBtn.addEventListener('click', closeAdminPanel);
refreshStorage?.addEventListener('click',refreshStorageUsage);
setInterval(()=>{if(panel.open)refreshStorageUsage();},15000);

// Bouton ANNULER : ferme la connexion Admin et laisse l'utilisateur sur la page d'accueil.
cancelLogin.addEventListener('click', () => {
  if (login.open) login.close();
  password.value = '';
  error.textContent = '';
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  error.textContent = 'Connexion…';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ action: 'auth', password: password.value })
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.token) {
      error.textContent = data.error || 'Mot de passe incorrect';
      return;
    }

    error.textContent = '';
    password.value = '';
    sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
    login.close();
    openAdminPanel();
  } catch (err) {
    console.error(err);
    error.textContent = 'Impossible de contacter le serveur.';
  }
});

saveTeams.addEventListener('click', () => {
  state.home = homeIn.value.trim() || state.home;
  state.away = awayIn.value.trim() || state.away;
  state.homeColor = homeColor.value;
  state.homeOutline = homeOutline.value;
  state.homeBg = homeBg.value;
  state.awayColor = awayColor.value;
  state.awayOutline = awayOutline.value;
  state.awayBg = awayBg.value;
  state.scoreColor = scoreColor.value;
  state.scoreBg = scoreBg.value;
  state.clockColor = clockColor.value;
  state.extraColor = extraColor.value;
  saveAndSync();
  render();
});

homePlus.addEventListener('click', () => { state.sh++; saveAndSync(); render(); });
homeMinus.addEventListener('click', () => { state.sh = Math.max(0, state.sh - 1); saveAndSync(); render(); });
awayPlus.addEventListener('click', () => { state.sa++; saveAndSync(); render(); });
awayMinus.addEventListener('click', () => { state.sa = Math.max(0, state.sa - 1); saveAndSync(); render(); });

startBtn.addEventListener('click', () => {
  if (state.running) return;
  state.running = true;
  if (state.extraMode) state.extraStartedAt = Date.now();
  else state.startedAt = Date.now();
  saveAndSync(); render();
});

stopBtn.addEventListener('click', () => {
  if (!state.running) return;
  if (state.extraMode) {
    state.extraElapsed += Math.floor((Date.now() - state.extraStartedAt) / 1000);
    state.extraStartedAt = 0;
  } else {
    state.elapsed += Math.floor((Date.now() - state.startedAt) / 1000);
    state.startedAt = 0;
  }
  state.running = false;
  saveAndSync(); render();
});

resetBtn.addEventListener('click', () => {
  state.running = false;
  state.elapsed = 0;
  state.startedAt = 0;
  state.extraMode = false;
  state.extraElapsed = 0;
  state.extraStartedAt = 0;
  saveAndSync(); render();
});

saveExtra.addEventListener('click', () => {
  const minutes = Math.max(0, Math.min(99, Number(extraIn.value || 0)));
  state.extra = minutes;
  if (minutes > 0) {
    // Passage immédiat en temps additionnel : le temps réglementaire revient à 00:00.
    state.extraMode = true;
    state.extraElapsed = 0;
    state.extraStartedAt = Date.now();
    state.elapsed = 0;
    state.startedAt = 0;
    state.running = true;
  } else {
    state.extraMode = false;
    state.extraElapsed = 0;
    state.extraStartedAt = 0;
    state.elapsed = 0;
    state.startedAt = 0;
    state.running = false;
  }
  saveAndSync();
  render();
});

saveMessage.addEventListener('click', () => { state.message = messageIn.value; saveAndSync(); render(); });

removeScore.addEventListener('click', () => {
  state.scoreVisible = false;
  saveAndSync();
  render();
});

showScore.addEventListener('click', () => {
  state.scoreVisible = true;
  saveAndSync();
  render();
});

function clampDisplayPercent(value) {
  return Math.max(50, Math.min(150, Number(value) || 100));
}

function publishDisplaySize() {
  saveAndSync();
  render();
}

scoreSize.addEventListener('input', () => {
  state.scoreScale = clampDisplayPercent(scoreSize.value);
  render();
});
scoreSize.addEventListener('change', publishDisplaySize);

scoreWidth.addEventListener('input', () => {
  state.scoreWidth = clampDisplayPercent(scoreWidth.value);
  render();
});
scoreWidth.addEventListener('change', publishDisplaySize);

scoreHeight.addEventListener('input', () => {
  state.scoreHeight = clampDisplayPercent(scoreHeight.value);
  render();
});
scoreHeight.addEventListener('change', publishDisplaySize);

// Boutons directs : la valeur est immédiatement modifiée, affichée et synchronisée.
scoreSmaller.addEventListener('click', () => {
  state.scoreScale = clampDisplayPercent((Number(state.scoreScale) || 100) - 5);
  publishDisplaySize();
});

scoreLarger.addEventListener('click', () => {
  state.scoreScale = clampDisplayPercent((Number(state.scoreScale) || 100) + 5);
  publishDisplaySize();
});

scoreSizeReset.addEventListener('click', () => {
  state.scoreScale = 100;
  state.scoreWidth = 100;
  state.scoreHeight = 100;
  publishDisplaySize();
});


panel.addEventListener('click', e => { if (e.target === panel) closeAdminPanel(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.open) closeAdminPanel(); });

if (window.Twitch && el('twitch')) {
  new Twitch.Embed('twitch', {
    width: '100%', height: '100%', channel: 'navetanelive', layout: 'video', parent: [location.hostname]
  });
}

loadServerState(true);
setInterval(() => loadServerState(false), 500);
setInterval(render, 1000);
render();


// Déplacement libre de l'affichage TV par l'administrateur.
let movingScore = false;
let dragPointerId = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function clampScorePosition(x, y) {
  const rect = scorePanel.getBoundingClientRect();
  const stageRect = liveStage.getBoundingClientRect();
  const width = rect.width || scorePanel.offsetWidth || 200;
  const height = rect.height || scorePanel.offsetHeight || 73;
  return {
    x: Math.max(0, Math.min(stageRect.width - Math.min(width, stageRect.width), x)),
    y: Math.max(0, Math.min(stageRect.height - Math.min(height, stageRect.height), y))
  };
}

function setMoveMode(enabled) {
  movingScore = enabled;
  scorePanel.classList.toggle('move-mode', enabled);
  moveScore.textContent = enabled ? 'TERMINER LE DÉPLACEMENT' : 'DÉPLACER L’AFFICHAGE';
  moveScore.style.background = enabled ? '#c62828' : '#2452e8';
}

moveScore.addEventListener('click', () => {
  setMoveMode(!movingScore);
});

fixScore.addEventListener('click', () => {
  if (movingScore) setMoveMode(false);
  state.scoreAttached = true;
  saveAndSync();
  render();
});

function pointerStart(e) {
  if (!movingScore) return;
  dragPointerId = e.pointerId;
  const currentX = Number(state.scoreX) || 0;
  const currentY = Number(state.scoreY) || 0;
  dragOffsetX = e.clientX - currentX;
  const stageRect = liveStage.getBoundingClientRect();
  dragOffsetY = e.clientY - stageRect.top - currentY;
  scorePanel.setPointerCapture?.(e.pointerId);
  e.preventDefault();
}
function pointerMove(e) {
  if (!movingScore || dragPointerId !== e.pointerId) return;
  const pos = clampScorePosition(
    e.clientX - dragOffsetX,
    e.clientY - liveStage.getBoundingClientRect().top - dragOffsetY
  );
  state.scoreX = pos.x;
  state.scoreY = pos.y;
  render();
  e.preventDefault();
}
function pointerEnd(e) {
  if (dragPointerId !== e.pointerId) return;
  dragPointerId = null;
  saveAndSync();
  render();
}
scorePanel.addEventListener('pointerdown', pointerStart);
scorePanel.addEventListener('pointermove', pointerMove);
scorePanel.addEventListener('pointerup', pointerEnd);
scorePanel.addEventListener('pointercancel', pointerEnd);
window.addEventListener('resize', () => {
  if (!movingScore) return;
  const pos = clampScorePosition(Number(state.scoreX) || 0, Number(state.scoreY) || 0);
  state.scoreX = pos.x;
  state.scoreY = pos.y;
  saveAndSync();
  render();
});


function renderPosterOverlay(){
  const active = Boolean(state.posterImage && state.posterStartedAt);
  posterOverlay.hidden = !active;
  if (active) posterImageView.src = state.posterImage;
}

// --- RAPPEL DES BUTS / COMPOSITION ---
function renderGoalOverlay(){const events=Array.isArray(state.goalEvents)?state.goalEvents.slice(-6):[]; const active=state.goalReminderVisible!==false&&events.length>0; goalOverlay.hidden=!active; if(!active)return; goalRows.innerHTML=events.map(ev=>`<div class="goal-row"><span style="color:${ev.playerColor||'#fff'}">${escapeHtml(ev.player||'Joueur')} ${escapeHtml(ev.minute||0)}’</span>${ev.ball?`<span style="color:${ev.ballColor||'#fff'}">⚽</span>`:''}<span class="goal-team" style="color:${ev.teamColor||'#fff'}">${escapeHtml(ev.team==='away'?state.away:state.home)}</span></div>`).join(''); goalScoreLine.textContent=`${state.home} ${state.sh} - ${state.sa} ${state.away}`; goalOverlay.querySelector('.goal-banner').style.setProperty('--goal-bg',events.at(-1).bgColor||'#111');}
function renderCompositionOverlay(){const active=Boolean(state.compositionVisible&&Array.isArray(state.compositionPlayers)&&state.compositionPlayers.length); compositionOverlay.hidden=!active; if(!active)return; compositionTitleView.textContent=`COMPOSITION ${state.compositionTeam==='away'?state.away:state.home} — ${state.compositionFormation}`; compositionBoardView.innerHTML=buildCompositionHTML(state.compositionPlayers,state.compositionFormation||'4-4-2');}
const FORMATION_ROWS={'4-4-2':[1,4,4,2],'4-3-3':[1,4,3,3],'3-4-3':[1,3,4,3],'3-5-2':[1,3,5,2],'4-2-3-1':[1,4,2,3,1],'4-1-4-1':[1,4,1,4,1],'5-3-2':[1,5,3,2],'5-4-1':[1,5,4,1]};
function renderCompositionInputs(){const rows=FORMATION_ROWS[formationSelect.value]||FORMATION_ROWS['4-4-2']; const old=Array.isArray(state.compositionPlayers)?state.compositionPlayers:[]; let n=0; compositionPlayers.innerHTML=rows.flatMap((count,row)=>Array.from({length:count},()=>{const idx=n++,p=old[idx]||{};return `<div class="player-input-card"><b>${row===0?'Gardien':`Joueur ${idx+1}`}</b><input data-player-name="${idx}" placeholder="Nom du joueur" value="${escapeAttr(p.name||'')}"><input data-player-photo="${idx}" type="file" accept="image/*"></div>`;})).join(''); updateCompositionPreview();}
function escapeAttr(v){return String(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
async function collectCompositionPlayers(){const cards=[...compositionPlayers.querySelectorAll('.player-input-card')],out=[]; for(let i=0;i<cards.length;i++){const name=cards[i].querySelector(`[data-player-name="${i}"]`)?.value.trim()||''; const file=cards[i].querySelector(`[data-player-photo="${i}"]`)?.files?.[0]; const old=(state.compositionPlayers||[])[i]||{}; const photo=file ? await readImage(file, 260) : (old.photo||''); out.push({name:name||`Joueur ${i+1}`,photo});} return out;}
function buildCompositionHTML(players,formation){const rows=FORMATION_ROWS[formation]||FORMATION_ROWS['4-4-2'];let idx=0;return rows.map(count=>`<div class="composition-row">${Array.from({length:count},()=>{const p=players[idx++]||{};return `<div class="composition-player"><img src="${p.photo||''}" ${p.photo?'':'hidden'}><strong>${escapeHtml(p.name||'Joueur')}</strong></div>`;}).join('')}</div>`).join('');}
async function updateCompositionPreview(){try{compositionPreview.innerHTML=buildCompositionHTML(await collectCompositionPlayers(),formationSelect.value);}catch(e){}}
publishGoal.addEventListener('click',async()=>{try{const player=goalPlayerIn.value.trim();if(!player){alert('Entrez le nom du joueur.');return;}const ev={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),player,minute:Math.max(0,Math.min(130,Number(goalMinuteIn.value||0))),team:goalTeamIn.value==='away'?'away':'home',ball:goalBallIn.checked,playerColor:goalPlayerColorIn.value,ballColor:goalBallColorIn.value,teamColor:goalTeamColorIn.value,bgColor:goalBgColorIn.value,createdAt:Date.now()};state.goalEvents=[...(state.goalEvents||[]),ev].slice(-6);await saveAndSync();render();showPublicationToast('✓ Rappel du but publié sur tous les écrans.');}catch(e){alert('Publication impossible : '+e.message);}});
clearGoals.addEventListener('click',async()=>{try{state.goalEvents=[];await saveAndSync();render();}catch(e){alert('Impossible d’effacer les rappels : '+e.message);}});
formationSelect.addEventListener('change',renderCompositionInputs); compositionTeamIn.addEventListener('change',updateCompositionPreview); compositionPlayers.addEventListener('input',updateCompositionPreview); compositionPlayers.addEventListener('change',updateCompositionPreview); previewComposition.addEventListener('click',updateCompositionPreview);
publishComposition.addEventListener('click',async()=>{try{setPublishStatus(compositionStatus,'Validation de la composition…');const players=await collectCompositionPlayers();if(players.length!==11)throw new Error('Une composition doit contenir 11 joueurs.');state.compositionPlayers=players;state.compositionFormation=formationSelect.value;state.compositionTeam=compositionTeamIn.value;state.compositionVisible=true;state.compositionPublicationId=crypto.randomUUID?crypto.randomUUID():String(Date.now());await uploadStateMedia([]);await saveAndSync();render();setPublishStatus(compositionStatus,'✓ Composition validée et publiée sur tous les écrans.');}catch(e){setPublishStatus(compositionStatus,'✕ '+e.message,false);}});
stopComposition.addEventListener('click',async()=>{try{state.compositionVisible=false;await saveAndSync();render();}catch(e){setPublishStatus(compositionStatus,'✕ Retrait impossible : '+e.message,false);}});

// --- PUBLICITÉ ET PANNEAU DE REMPLACEMENT ---
function clampDuration(value) { return Math.max(0, Math.min(180, Math.floor(Number(value) || 0))); }
function clampSubDuration(value) { return Math.max(0, Math.min(30, Math.floor(Number(value) || 0))); }
function activeFor(startedAt, duration) {
  const start = Number(startedAt) || 0, durationMs = (Number(duration) || 0) * 1000;
  return start > 0 && durationMs > 0 && Date.now() < start + durationMs;
}
function clearExpiredBroadcasts() {
  let changed = false;
  if (state.adStartedAt && !activeFor(state.adStartedAt, state.adDuration)) { state.adStartedAt = 0; changed = true; }
  if (state.subStartedAt && !activeFor(state.subStartedAt, state.subDuration)) { state.subStartedAt = 0; changed = true; }
  if (changed && isAdminAuthenticated()) saveAndSync();
}
function setPublishStatus(target, text, ok = true) {
  if (!target) return;
  target.textContent = text;
  target.className = 'publish-status ' + (ok ? 'ok' : 'error');
}
function videoIsActive() { return Boolean(state.adVideo); }
function readVideo(file, maxSeconds = 120, maxBytes = 4.5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    if (!file.type.startsWith('video/')) return reject(new Error('Choisissez une vidéo.'));
    if (file.size > maxBytes) return reject(new Error('Cette vidéo est trop volumineuse pour la publication directe. Utilisez une vidéo de 2 minutes optimisée (4,5 Mo maximum) pour garantir une diffusion fiable.'));
    const url = URL.createObjectURL(file), v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (!Number.isFinite(v.duration) || v.duration <= 0) return reject(new Error('Durée de vidéo invalide.'));
      if (v.duration > maxSeconds + .5) return reject(new Error('La vidéo publicitaire ne doit pas dépasser 2 minutes.'));
      const r = new FileReader(); r.onerror = () => reject(new Error('Lecture vidéo impossible.')); r.onload = () => resolve(r.result); r.readAsDataURL(file);
    };
    v.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Vidéo invalide.')); };
    v.src = url;
  });
}
function activeReplay() { return activeFor(state.replayStartedAt, state.replayDuration); }

function renderBroadcastOverlays() {
  clearExpiredBroadcasts();
  const adActive = activeFor(state.adStartedAt, state.adDuration);
  adOverlay.hidden = !adActive;
  if (adActive) {
    const hasVideo = Boolean(state.adVideo);
    const hasImage = Boolean(state.adImage) && !hasVideo;
    adImageView.hidden = !hasImage;
    if (hasImage) adImageView.src = state.adImage;
    adVideoView.hidden = !hasVideo;
    if (hasVideo && adVideoView.src !== state.adVideo) { adVideoView.src = state.adVideo; adVideoView.load(); }
    if (hasVideo) { const p = adVideoView.play(); if (p) p.catch(() => {}); }
    adTitleView.textContent = state.adTitle || '';
    adTextView.textContent = state.adText || '';
    adOverlay.style.setProperty('--ad-text', state.adTextColor || '#ffffff');
    adOverlay.style.setProperty('--ad-bg', state.adBgColor || '#1a1a1a');
  } else if (adVideoView) { adVideoView.pause(); }
  const replayActive = activeReplay();
replayOverlay.hidden = !replayActive;

if (replayActive && state.replayVideo) {
  const publicationId = String(state.replayPublicationId || '');
  const newReplay =
    replayVideoView.dataset.publicationId !== publicationId ||
    replayVideoView.src !== state.replayVideo;

  replayVideoView.muted = true;
  replayVideoView.playsInline = true;
  replayVideoView.autoplay = true;
  replayVideoView.preload = 'auto';
  replayVideoView.playbackRate =
    Math.max(.25, Math.min(1, Number(state.replaySpeed) || .5));

  const start = Math.max(0, Number(state.replayClipStart) || 0);
  const end = Math.max(start + .1, Number(state.replayClipEnd) || 0);

  if (newReplay) {
    replayVideoView.dataset.publicationId = publicationId;
    replayVideoView.dataset.replayStart = String(start);
    replayVideoView.dataset.replayEnd = String(end);

    replayVideoView.src = state.replayVideo;

    replayVideoView.onloadedmetadata = async () => {
      replayVideoView.currentTime = start;
      try {
        await replayVideoView.play();
      } catch (_) {}
    };

    replayVideoView.ontimeupdate = () => {
      const s = Number(replayVideoView.dataset.replayStart) || 0;
      const e = Number(replayVideoView.dataset.replayEnd) || s + .1;

      if (replayVideoView.currentTime >= e) {
        replayVideoView.currentTime = s;
      }
    };

    replayVideoView.load();
  } else if (
    replayVideoView.readyState >= 1 &&
    Math.abs(replayVideoView.currentTime - start) > 1
  ) {
    replayVideoView.currentTime = start;
  }
} else if (replayVideoView) {
  replayVideoView.pause();
  replayVideoView.onloadedmetadata = null;
  replayVideoView.ontimeupdate = null;
  replayVideoView.dataset.publicationId = '';
}
}
  const subActive = activeFor(state.subStartedAt, state.subDuration);
  subOverlay.hidden = !subActive;
  if (subActive) {
    subOutPhotoView.src = state.subOutPhoto || '';
    subOutPhotoView.hidden = !state.subOutPhoto;
    subOutNameView.textContent = state.subOutName || '';
    subOutNumberView.textContent = state.subOutNumber ? '#' + state.subOutNumber : '';
    subOutTeamView.textContent = state.subOutTeam || '';
    subInPhotoView.src = state.subInPhoto || '';
    subInPhotoView.hidden = !state.subInPhoto;
    subInNameView.textContent = state.subInName || '';
    subInNumberView.textContent = state.subInNumber ? '#' + state.subInNumber : '';
    subInTeamView.textContent = state.subInTeam || '';
  }
}
function readImage(file, max=1200) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    if (!file.type.startsWith('image/')) return reject(new Error('Choisissez une image.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture de l’image impossible.'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * ratio)), h = Math.max(1, Math.round(img.naturalHeight * ratio));
        const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', .68));
      };
      img.onerror = () => reject(new Error('Image invalide.'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
async function selectedImage(input, current) {
  if (!input.files || !input.files[0]) return current || '';
  return readImage(input.files[0], 900);
}
function updateAdPreview() {
  const bg = adBgColorIn.value || '#1a1a1a', color = adTextColorIn.value || '#fff';
  adPreview.style.background = bg; adPreview.style.color = color;
  adPreviewTitle.textContent = adTitleIn.value || 'Votre publicité';
  adPreviewText.textContent = adTextIn.value || 'Votre texte publicitaire apparaîtra ici.';
}
async function refreshAdImagePreview() {
  try { const img = await selectedImage(adImageIn, state.adImage); adPreviewImage.hidden = !img; if (img) adPreviewImage.src = img; }
  catch (err) { alert(err.message); }
}
async function updateSubPreview() {
  const outImg = await selectedImage(subOutPhotoIn, state.subOutPhoto).catch(() => state.subOutPhoto || '');
  const inImg = await selectedImage(subInPhotoIn, state.subInPhoto).catch(() => state.subInPhoto || '');
  subPreview.innerHTML = `<div class="mini out">${outImg ? `<img src="${outImg}" alt="Sortant">` : ''}<br><b>⬅ SORTANT</b><br>${escapeHtml(subOutNameIn.value || 'Nom')}<br>#${escapeHtml(subOutNumberIn.value || 'N°')}<br>${escapeHtml(subOutTeamIn.value === 'away' ? 'Équipe B' : 'Équipe A')}</div><div class="mini in">${inImg ? `<img src="${inImg}" alt="Entrant">` : ''}<br><b>ENTRANT ➡</b><br>${escapeHtml(subInNameIn.value || 'Nom')}<br>#${escapeHtml(subInNumberIn.value || 'N°')}<br>${escapeHtml(subInTeamIn.value === 'away' ? 'Équipe B' : 'Équipe A')}</div>`;
}
function escapeHtml(v) { return String(v || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
[adTitleIn, adTextIn, adTextColorIn, adBgColorIn].forEach(i => i.addEventListener('input', updateAdPreview));
adImageIn.addEventListener('change', refreshAdImagePreview);
[subOutNameIn, subOutNumberIn, subOutTeamIn, subInNameIn, subInNumberIn, subInTeamIn, subOutPhotoIn, subInPhotoIn].forEach(i => i.addEventListener(i.type === 'file' ? 'change' : 'input', updateSubPreview));
previewAd.addEventListener('click', async () => { updateAdPreview(); await refreshAdImagePreview(); });
publishAd.addEventListener('click', async () => {
  try {
    setPublishStatus(publishStatus, 'Validation de la publicité…');
    if (adVideoIn.files && adVideoIn.files[0]) {
      state.adVideo = await readVideo(adVideoIn.files[0]);
      state.adImage = '';
      const videoDuration = await new Promise((resolve, reject) => { const v=document.createElement('video'); const u=URL.createObjectURL(adVideoIn.files[0]); v.onloadedmetadata=()=>{URL.revokeObjectURL(u); resolve(v.duration);}; v.onerror=()=>reject(new Error('Vidéo invalide')); v.src=u; }); state.adVideoDuration = Math.max(1, Math.ceil(videoDuration)); state.adDuration = state.adVideoDuration;
    } else {
      state.adImage = await selectedImage(adImageIn, state.adImage);
      state.adVideo = '';
      state.adDuration = clampDuration(adDurationIn.value);
    }
    state.adTitle = adTitleIn.value.trim(); state.adText = adTextIn.value.trim();
    if (!state.adImage && !state.adVideo && !state.adTitle && !state.adText) throw new Error('Ajoutez une image, une vidéo ou un texte avant de publier.');
    if (!state.adVideo && state.adDuration === 0) state.adDuration = 180;
    state.adTextColor = adTextColorIn.value; state.adBgColor = adBgColorIn.value;
    await uploadStateMedia(['adImage','adVideo']);
    state.adStartedAt = state.adDuration > 0 ? Date.now() : 0;
    state.adPublicationId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    await saveAndSync(); render();
    setPublishStatus(publishStatus, '✓ Publication validée et envoyée avec succès à tous les spectateurs.');
  } catch (err) { console.error(err); setPublishStatus(publishStatus, '✕ Publication refusée : ' + err.message, false); }
});
stopAd.addEventListener('click', async () => { try { state.adStartedAt = 0; state.adVideo = ''; await saveAndSync(); render(); setPublishStatus(publishStatus, 'Publicité retirée.'); } catch (e) { setPublishStatus(publishStatus, '✕ Retrait impossible : '+e.message, false); } });
previewSub.addEventListener('click', updateSubPreview);
publishSub.addEventListener('click', async () => {
  try {
    const duration = clampSubDuration(subDurationIn.value);
    if (duration <= 0) throw new Error('Choisissez une durée entre 1 et 30 secondes.');
    state.subOutPhoto = await selectedImage(subOutPhotoIn, state.subOutPhoto);
    state.subInPhoto = await selectedImage(subInPhotoIn, state.subInPhoto);
    state.subOutName = subOutNameIn.value.trim(); state.subOutNumber = subOutNumberIn.value.trim(); state.subOutTeam = subOutTeamIn.value === 'away' ? 'Équipe B' : 'Équipe A';
    state.subInName = subInNameIn.value.trim(); state.subInNumber = subInNumberIn.value.trim(); state.subInTeam = subInTeamIn.value === 'away' ? 'Équipe B' : 'Équipe A';
    if (!state.subOutPhoto || !state.subInPhoto) throw new Error('Choisissez la photo du sortant et celle de l’entrant.');
    state.subDuration = duration; state.subStartedAt = Date.now();
    await uploadStateMedia(['subOutPhoto','subInPhoto']);
    await saveAndSync(); render(); setPublishStatus(subStatus, '✓ Substitution publiée sur tous les écrans.');
  } catch (err) { alert(err.message); }
});
stopSub.addEventListener('click', async () => { try { state.subStartedAt = 0; await saveAndSync(); render(); setPublishStatus(subStatus, '✓ Substitution retirée de tous les écrans.'); } catch(e) { setPublishStatus(subStatus, '✕ Retrait impossible : '+e.message, false); } });


// --- REPLAY 30 SECONDES ---
let recordingStream = null, recorder = null, recordedBlob = null, recordedUrl = '', replayLocalUrl = '';
function setReplaySource(file) {
  if (replayLocalUrl) URL.revokeObjectURL(replayLocalUrl);
  replayLocalUrl = file ? URL.createObjectURL(file) : '';
  if (replayLocalUrl) { recordPreview.src = replayLocalUrl; recordPreview.hidden = false; }
}
record30.addEventListener('click', async () => {
  try {
    if (!navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) throw new Error('Votre navigateur ne prend pas en charge l’enregistrement de l’écran.');
    setPublishStatus(recordStatus, 'Choisissez l’onglet ou l’écran où DJIBABOUYA TV est visible. L’enregistrement s’arrêtera après 30 secondes.');
    recordingStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true });
    const chunks = [];
    recorder = new MediaRecorder(recordingStream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm' });
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      recordedBlob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      setReplaySource(recordedBlob);
      recordingStream?.getTracks().forEach(t => t.stop()); recordingStream = null;
      stopRecord.disabled = true; record30.disabled = false;
      setPublishStatus(recordStatus, '✓ Enregistrement terminé. Vous pouvez maintenant choisir la vitesse et l’extrait à publier.');
    };
    recorder.start(1000); record30.disabled = true; stopRecord.disabled = false;
    setTimeout(() => { if (recorder?.state === 'recording') recorder.stop(); }, 30000);
  } catch (err) { setPublishStatus(recordStatus, '✕ Enregistrement impossible : ' + err.message, false); record30.disabled = false; stopRecord.disabled = true; }
});
stopRecord.addEventListener('click', () => { if (recorder?.state === 'recording') recorder.stop(); });
replayVideoIn.addEventListener('change', () => { if (replayVideoIn.files?.[0]) { recordedBlob = replayVideoIn.files[0]; setReplaySource(recordedBlob); setPublishStatus(replayStatus, 'Vidéo sélectionnée depuis la galerie.'); } });
function getReplayFile() { return (replayVideoIn.files && replayVideoIn.files[0]) || recordedBlob || null; }
async function validateReplayFile(file) {
  if (!file) throw new Error('Enregistrez ou choisissez d’abord une vidéo.');
  return readVideo(file, 120, 8 * 1024 * 1024);
}
previewReplay.addEventListener('click', async () => {
  try {
    const file = getReplayFile(); if (!file) throw new Error('Choisissez une vidéo.');
    setReplaySource(file);
    recordPreview.playbackRate = Math.max(.25, Math.min(1, Number(replaySpeed.value) || .5));
    recordPreview.currentTime = Math.max(0, Number(replayStart.value) || 0); await recordPreview.play();
    setPublishStatus(replayStatus, 'Aperçu du replay ralenti prêt.');
  } catch (err) { setPublishStatus(replayStatus, '✕ ' + err.message, false); }
});
publishReplay.addEventListener('click', async () => {
  try {
    const file = getReplayFile();
    setPublishStatus(replayStatus, 'Validation et publication du replay…');
    const data = await validateReplayFile(file);
    const meta = await new Promise((resolve, reject) => { const v=document.createElement('video'), u=URL.createObjectURL(file); v.onloadedmetadata=()=>{URL.revokeObjectURL(u);resolve(v.duration)};v.onerror=()=>reject(new Error('Vidéo invalide'));v.src=u; });
    const start = Math.max(0, Math.min(meta - .1, Number(replayStart.value) || 0));
    const end = Math.max(start + .1, Math.min(meta, Number(replayEnd.value) || meta));
    state.replayVideo = data; state.replayClipStart = start; state.replayClipEnd = end;
    state.replaySpeed = Math.max(.25, Math.min(1, Number(replaySpeed.value) || .5));
    state.replayDuration = Math.max(1, Math.ceil((end - start) / state.replaySpeed));
    state.replayPublicationId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    await uploadStateMedia(['replayVideo']);
    state.replayStartedAt = Date.now();
    await saveAndSync(); render();
    setPublishStatus(replayStatus, '✓ Replay validé et publié avec succès sur l’écran des spectateurs.');
  } catch (err) { console.error(err); setPublishStatus(replayStatus, '✕ Publication impossible : ' + err.message, false); }
});
stopReplay.addEventListener('click', () => { state.replayStartedAt = 0; state.replayVideo = ''; saveAndSync(); render(); setPublishStatus(replayStatus, 'Replay retiré.'); });

// === CRÉATEUR D'AFFICHE DE MATCH ===
const openPosterBuilder = el('openPosterBuilder');
const posterBuilder = el('posterBuilder');
const closePosterBuilder = el('closePosterBuilder');
const previewPoster = el('previewPoster');
const downloadPoster = el('downloadPoster');
const publishPoster = el('publishPoster');
const stopPoster = el('stopPoster');
const posterCanvas = el('posterCanvas');
const posterStatus = el('posterStatus');
const posterCompetition = el('posterCompetition');
const posterHome = el('posterHome');
const posterAway = el('posterAway');
const posterDate = el('posterDate');
const posterTime = el('posterTime');
const posterVenue = el('posterVenue');
const posterHomeLogo = el('posterHomeLogo');
const posterAwayLogo = el('posterAwayLogo');
const posterBackground = el('posterBackground');
const posterAccent = el('posterAccent');
const posterStyle = el('posterStyle');

function posterSetStatus(text, ok=true){ if(!posterStatus)return; posterStatus.textContent=text; posterStatus.className='publish-status '+(ok?'ok':'error'); }
function posterReadFile(file){return new Promise((resolve,reject)=>{if(!file){resolve(null);return;}const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=r.result;};r.onerror=reject;r.readAsDataURL(file);});}
function posterFitImage(ctx,img,x,y,w,h,cover=false){if(!img)return;if(!cover){const s=Math.min(w/img.width,h/img.height);const dw=img.width*s,dh=img.height*s;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return;}const s=Math.max(w/img.width,h/img.height),dw=img.width*s,dh=img.height*s;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);}
function posterRoundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function posterText(ctx,text,x,y,maxWidth,font,fill='#fff',align='center'){ctx.font=font;ctx.fillStyle=fill;ctx.textAlign=align;ctx.textBaseline='middle';let t=String(text||'');while(ctx.measureText(t).width>maxWidth&&t.length>3)t=t.slice(0,-2)+'…';ctx.fillText(t,x,y);}
function posterDateLabel(v){if(!v)return 'DATE À VENIR';try{return new Date(v+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}).toUpperCase();}catch{return v;}}
async function renderPoster(){
  if(!posterCanvas)return;
  const ctx=posterCanvas.getContext('2d'); const W=posterCanvas.width,H=posterCanvas.height;
  ctx.clearRect(0,0,W,H); ctx.save();
  const bg=await posterReadFile(posterBackground?.files?.[0]);
  const homeLogo=await posterReadFile(posterHomeLogo?.files?.[0]); const awayLogo=await posterReadFile(posterAwayLogo?.files?.[0]);
  const accent=posterAccent?.value||'#00c853'; const style=posterStyle?.value||'broadcast';
  const home=(posterHome?.value||'ÉQUIPE 1').toUpperCase(), away=(posterAway?.value||'ÉQUIPE 2').toUpperCase();
  const comp=(posterCompetition?.value||'CHAMPIONNAT').toUpperCase();
  const date=posterDateLabel(posterDate?.value), time=(posterTime?.value||'20:00');
  const venue=(posterVenue?.value||'STADE À PRÉCISER').toUpperCase();
  const dark=style==='night'||style==='broadcast'||style==='derby';
  const c2=style==='derby'?'#ff5b2e':(style==='classic'?'#2d5cff':'#00a84f');
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0, style==='classic'?'#121b3a':style==='night'?'#030916':'#02170d');
  g.addColorStop(.5, dark?'#06120e':'#0a351e'); g.addColorStop(1,style==='derby'?'#260b05':'#020504');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(bg){ctx.save();ctx.globalAlpha=.42;posterFitImage(ctx,bg,0,0,W,H,true);ctx.restore();}
  const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'rgba(0,0,0,.28)');shade.addColorStop(.45,'rgba(0,0,0,.48)');shade.addColorStop(1,'rgba(0,0,0,.9)');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=.14;ctx.strokeStyle=accent;ctx.lineWidth=8;for(let x=-500;x<W+500;x+=85){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-430,H);ctx.stroke();}ctx.restore();
  ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(0,0,W,104);ctx.fillStyle=accent;ctx.fillRect(0,0,250,10);
  posterText(ctx,'DJIBABOUYA TV',58,55,220,'900 38px Arial','#fff','left');posterText(ctx,'MATCH CENTER',W-58,55,300,'900 25px Arial',accent,'right');
  ctx.fillStyle=accent;posterRoundRect(ctx,90,142,W-180,78,20);ctx.fill();posterText(ctx,comp,W/2,181,W-240,'900 31px Arial','#041108');
  posterText(ctx,'GRAND MATCH',W/2,285,W-180,'900 78px Arial','#fff');posterText(ctx,'LIVE FOOTBALL',W/2,345,W-240,'900 25px Arial',accent);
  const leftX=62,rightX=608, top=430, cardW=410, cardH=470;
  const card=ctx.createLinearGradient(0,top,0,top+cardH);card.addColorStop(0,'rgba(255,255,255,.10)');card.addColorStop(1,'rgba(0,0,0,.48)');
  ctx.fillStyle=card;posterRoundRect(ctx,leftX,top,cardW,cardH,28);ctx.fill();posterRoundRect(ctx,rightX,top,cardW,cardH,28);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=2;posterRoundRect(ctx,leftX,top,cardW,cardH,28);ctx.stroke();posterRoundRect(ctx,rightX,top,cardW,cardH,28);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(267,585,145,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(813,585,145,0,Math.PI*2);ctx.fill();
  if(homeLogo)posterFitImage(ctx,homeLogo,142,460,250,250,false);else {ctx.fillStyle=accent;ctx.beginPath();ctx.arc(267,585,105,0,Math.PI*2);ctx.fill();posterText(ctx,'1',267,585,170,'900 100px Arial','#06140c');}
  if(awayLogo)posterFitImage(ctx,awayLogo,688,460,250,250,false);else {ctx.fillStyle=c2;ctx.beginPath();ctx.arc(813,585,105,0,Math.PI*2);ctx.fill();posterText(ctx,'2',813,585,170,'900 100px Arial','#fff');}
  posterText(ctx,home,267,775,350,'900 42px Arial','#fff');posterText(ctx,away,813,775,350,'900 42px Arial','#fff');
  ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=24;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(W/2,590,72,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;posterText(ctx,'VS',W/2,590,110,'900 42px Arial','#07100b');
  ctx.fillStyle='rgba(0,0,0,.72)';posterRoundRect(ctx,80,935,W-160,240,28);ctx.fill();ctx.strokeStyle=accent;ctx.lineWidth=3;posterRoundRect(ctx,80,935,W-160,240,28);ctx.stroke();
  posterText(ctx,date,W/2,985,W-260,'900 30px Arial','#fff');posterText(ctx,time,W/2,1060,W-300,'900 65px Arial',accent);posterText(ctx,'📍 '+venue,W/2,1128,W-260,'800 27px Arial','#fff');
  ctx.fillStyle='rgba(0,0,0,.78)';ctx.fillRect(0,1245,W,105);posterText(ctx,'DJIBABOUYA TV • LE FOOTBALL EN DIRECT',W/2,1297,W-100,'900 25px Arial','#fff');
  ctx.fillStyle=style==='derby'?'#ff3b30':accent;posterRoundRect(ctx,W-230,125,145,48,16);ctx.fill();posterText(ctx,'LIVE',W-157,149,100,'900 25px Arial','#fff');
  ctx.restore();
}

openPosterBuilder?.addEventListener('click',()=>{posterBuilder.showModal();renderPoster().catch(()=>{});});
closePosterBuilder?.addEventListener('click',()=>posterBuilder.close());
previewPoster?.addEventListener('click',async()=>{try{await renderPoster();posterSetStatus('✓ Affiche mise à jour.');}catch(e){posterSetStatus('✕ Impossible de générer l’aperçu.',false);}});
publishPoster?.addEventListener('click',async()=>{try{await renderPoster();const image=posterCanvas.toDataURL('image/jpeg',0.82);if(image.length>3_500_000)throw new Error('Affiche trop lourde. Réduisez la taille des logos ou de la photo de fond.');state.posterImage=image;state.posterStartedAt=Date.now();state.posterPublicationId=crypto.randomUUID?crypto.randomUUID():String(Date.now());await uploadStateMedia(['posterImage']);await saveAndSync();render();posterSetStatus('✓ Affiche publiée automatiquement sur tous les écrans.');}catch(e){posterSetStatus('✕ Publication impossible : '+e.message,false);}});
stopPoster?.addEventListener('click',async()=>{try{state.posterImage='';state.posterStartedAt=0;state.posterPublicationId='';await saveAndSync();render();posterSetStatus('✓ Affiche retirée de tous les écrans.');}catch(e){posterSetStatus('✕ Retrait impossible : '+e.message,false);}});
downloadPoster?.addEventListener('click',async()=>{try{await renderPoster();const a=document.createElement('a');a.download='DJIBABOUYA-TV-affiche-match.png';a.href=posterCanvas.toDataURL('image/png');a.click();posterSetStatus('✓ Affiche téléchargée en PNG.');}catch(e){posterSetStatus('✕ Téléchargement impossible.',false);}});
[posterCompetition,posterHome,posterAway,posterDate,posterTime,posterVenue,posterAccent,posterStyle,posterHomeLogo,posterAwayLogo,posterBackground].forEach(x=>x?.addEventListener('input',()=>renderPoster().catch(()=>{})));
[posterHomeLogo,posterAwayLogo,posterBackground].forEach(x=>x?.addEventListener('change',()=>renderPoster().catch(()=>{})));
