// ─── DATA ───────────────────────────────────────────────────────────────────

const colors = {
    'C':     '#FF6B6B',
    'G':     '#4ECDC4',
    'D':     '#45B7D1',
    'A':     '#1A9E8F',
    'E':     '#FF9FF3',
    'B/Cb':  '#FFC75F',
    'F#/Gb': '#F9F871',
    'Db/C#': '#00C9B1',
    'Ab':    '#9B5DE5',
    'Eb':    '#F8A488',
    'Bb':    '#F786AA',
    'F':     '#7A89C2'
};

const majorKeys = ['C','G','D','A','E','B/Cb','F#/Gb','Db/C#','Ab','Eb','Bb','F'];
const minorKeys = ['A','E','B','F#','C#','G#/Ab','D#/Eb','Bb/A#','F','C','G','D'];

const keyData = {
    // Major
    'C':     { sig: 0,  type: 'major', scale: ['C','D','E','F','G','A','B'] },
    'G':     { sig: 1,  type: 'major', scale: ['G','A','B','C','D','E','F#'] },
    'D':     { sig: 2,  type: 'major', scale: ['D','E','F#','G','A','B','C#'] },
    'A':     { sig: 3,  type: 'major', scale: ['A','B','C#','D','E','F#','G#'] },
    'E':     { sig: 4,  type: 'major', scale: ['E','F#','G#','A','B','C#','D#'] },
    'B':     { sig: 5,  type: 'major', scale: ['B','C#','D#','E','F#','G#','A#'] },
    'F#':    { sig: 6,  type: 'major', scale: ['F#','G#','A#','B','C#','D#','E#'] },
    'Gb':    { sig: -6, type: 'major', scale: ['Gb','Ab','Bb','Cb','Db','Eb','F'] },
    'Db':    { sig: -5, type: 'major', scale: ['Db','Eb','F','Gb','Ab','Bb','C'] },
    'Ab':    { sig: -4, type: 'major', scale: ['Ab','Bb','C','Db','Eb','F','G'] },
    'Eb':    { sig: -3, type: 'major', scale: ['Eb','F','G','Ab','Bb','C','D'] },
    'Bb':    { sig: -2, type: 'major', scale: ['Bb','C','D','Eb','F','G','A'] },
    'F':     { sig: -1, type: 'major', scale: ['F','G','A','Bb','C','D','E'] },
    // Minor
    'A_m':   { sig: 0,  type: 'minor', scale: ['A','B','C','D','E','F','G'] },
    'E_m':   { sig: 1,  type: 'minor', scale: ['E','F#','G','A','B','C','D'] },
    'B_m':   { sig: 2,  type: 'minor', scale: ['B','C#','D','E','F#','G','A'] },
    'F#_m':  { sig: 3,  type: 'minor', scale: ['F#','G#','A','B','C#','D','E'] },
    'C#_m':  { sig: 4,  type: 'minor', scale: ['C#','D#','E','F#','G#','A','B'] },
    'G#_m':  { sig: 5,  type: 'minor', scale: ['G#','A#','B','C#','D#','E','F#'] },
    'D#_m':  { sig: 6,  type: 'minor', scale: ['D#','E#','F#','G#','A#','B','C#'] },
    'Eb_m':  { sig: -6, type: 'minor', scale: ['Eb','F','Gb','Ab','Bb','Cb','Db'] },
    'Bb_m':  { sig: -5, type: 'minor', scale: ['Bb','C','Db','Eb','F','Gb','Ab'] },
    'F_m':   { sig: -4, type: 'minor', scale: ['F','G','Ab','Bb','C','Db','Eb'] },
    'C_m':   { sig: -3, type: 'minor', scale: ['C','D','Eb','F','G','Ab','Bb'] },
    'G_m':   { sig: -2, type: 'minor', scale: ['G','A','Bb','C','D','Eb','F'] },
    'D_m':   { sig: -1, type: 'minor', scale: ['D','E','F','G','A','Bb','C'] },
};

const sharpOrder = ['F#','C#','G#','D#','A#','E#','B#'];
const flatOrder  = ['Bb','Eb','Ab','Db','Gb','Cb','Fb'];

let selectedNote = null;
let currentNoteData = null; // { note, type }
let audioCtx = null;

// ─── CLOCK CREATION ─────────────────────────────────────────────────────────

function calculateDimensions() {
    const clock = document.getElementById('clock');
    const w = clock.offsetWidth;
    return {
        outerRadius: w * 0.42,
        innerRadius: w * 0.28,
        center: w * 0.5
    };
}

function createClock() {
    const clockFace = document.getElementById('clockFace');
    clockFace.innerHTML = '';
    const d = calculateDimensions();

    majorKeys.forEach((note, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = d.outerRadius * Math.cos(angle) + d.center;
        const y = d.outerRadius * Math.sin(angle) + d.center;
        const el = document.createElement('div');
        el.className = 'note major';
        el.textContent = note;
        el.style.left = `${x}px`;
        el.style.top  = `${y}px`;
        el.style.backgroundColor = colors[note];
        el.style.boxShadow = `0 0 12px ${colors[note]}60`;
        el.addEventListener('click', () => updateInfo(note, 'major', el));
        el.addEventListener('touchstart', e => { e.preventDefault(); updateInfo(note, 'major', el); });
        clockFace.appendChild(el);
    });

    minorKeys.forEach((note, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = d.innerRadius * Math.cos(angle) + d.center;
        const y = d.innerRadius * Math.sin(angle) + d.center;
        const el = document.createElement('div');
        el.className = 'note minor';
        el.textContent = note;
        el.style.left = `${x}px`;
        el.style.top  = `${y}px`;
        const baseColor = colors[majorKeys[i]];
        el.style.backgroundColor = baseColor + 'aa';
        el.style.boxShadow = `0 0 8px ${baseColor}40`;
        el.addEventListener('click', () => updateInfo(note, 'minor', el));
        el.addEventListener('touchstart', e => { e.preventDefault(); updateInfo(note, 'minor', el); });
        clockFace.appendChild(el);
    });
}

// ─── INFO UPDATE ────────────────────────────────────────────────────────────

function updateInfo(note, type, element) {
    if (selectedNote) selectedNote.classList.remove('selected');
    element.classList.add('selected');
    selectedNote = element;
    currentNoteData = { note, type };

    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('infoContent').style.display = 'block';

    const displayName = note + (type === 'major' ? ' Major' : ' minor');
    document.getElementById('selectedKey').textContent = displayName;
    document.getElementById('keyTypeBadge').textContent = type.toUpperCase();
    document.getElementById('keyTypeBadge').style.color = type === 'major' ? 'var(--accent-secondary)' : '#F786AA';
    document.getElementById('keySignature').innerHTML = getKeySignature(note, type);
    document.getElementById('relatedKeys').innerHTML = getRelatedKeys(note, type);
    document.getElementById('chords').innerHTML = getChordProgression(note, type);
    renderScale(note, type);
}

function getKeyData(note, type) {
    if (type === 'major') {
        const n = note.split('/')[0];
        return keyData[n];
    } else {
        const n = note.split('/')[0] + '_m';
        return keyData[n];
    }
}

function getScale(note, type) {
    const d = getKeyData(note, type);
    return d ? d.scale : [];
}

function getKeySignature(note, type) {
    // For minor, use relative major's signature
    let lookupNote = note;
    if (type === 'minor') {
        const idx = minorKeys.indexOf(note);
        if (idx !== -1) lookupNote = majorKeys[idx];
    }

    // Handle enharmonics
    const firstName = lookupNote.split('/')[0];
    const secondName = lookupNote.split('/')[1];

    if (lookupNote.includes('/')) {
        const d1 = keyData[firstName];
        const d2 = keyData[secondName];
        const sig1 = d1 ? d1.sig : null;
        const sig2 = d2 ? d2.sig : null;
        let result = 'Enharmonic equivalent:<br>';
        if (sig1 !== null) result += formatSig(sig1) + ' (' + firstName + ')<br>';
        if (sig2 !== null) result += formatSig(sig2) + ' (' + secondName + ')';
        return result;
    }

    const d = keyData[firstName];
    if (!d) return 'Unknown key';
    return formatSig(d.sig);
}

function formatSig(sig) {
    if (sig === 0) return 'No sharps or flats';
    if (sig > 0) return `${sig} sharp${sig > 1 ? 's' : ''}: ${sharpOrder.slice(0, sig).join(', ')}`;
    const n = Math.abs(sig);
    return `${n} flat${n > 1 ? 's' : ''}: ${flatOrder.slice(0, n).join(', ')}`;
}

function getRelatedKeys(note, type) {
    const idx = type === 'major'
        ? majorKeys.indexOf(note)
        : majorKeys.indexOf(majorKeys[minorKeys.indexOf(note)]);

    if (type === 'major') {
        const relMinor = minorKeys[majorKeys.indexOf(note)];
        const dominant = majorKeys[(idx + 1) % 12];
        const subdominant = majorKeys[(idx - 1 + 12) % 12];
        return `<strong>Relative minor:</strong> ${relMinor}m<br><strong>Dominant (V):</strong> ${dominant}<br><strong>Subdominant (IV):</strong> ${subdominant}`;
    } else {
        const relMajor = majorKeys[minorKeys.indexOf(note)];
        const dominant = majorKeys[(idx + 1) % 12];
        const subdominant = majorKeys[(idx - 1 + 12) % 12];
        return `<strong>Relative major:</strong> ${relMajor}<br><strong>Dominant (v):</strong> ${dominant}m<br><strong>Subdominant (iv):</strong> ${subdominant}m`;
    }
}

function getChordProgression(note, type) {
    const romanMajor = ['I','ii','iii','IV','V','vi','vii°'];
    const romanMinor = ['i','ii°','III','iv','v','VI','VII'];
    const roman = type === 'major' ? romanMajor : romanMinor;
    const scale = getScale(note, type);
    if (!scale || scale.length < 7) return '';

    let chords;
    if (type === 'major') {
        chords = [scale[0], scale[1]+'m', scale[2]+'m', scale[3], scale[4], scale[5]+'m', scale[6]+'°'];
    } else {
        chords = [scale[0]+'m', scale[1]+'°', scale[2], scale[3]+'m', scale[4]+'m', scale[5], scale[6]];
    }

    return chords.map((c, i) =>
        `<div class="chord-item">
            <span class="degree">${roman[i]}</span>
            <span class="chord-name">${c}</span>
        </div>`
    ).join('');
}

function renderScale(note, type) {
    const scale = getScale(note, type);
    const container = document.getElementById('scale');
    if (!scale || scale.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = scale.map((n, i) =>
        `<span class="scale-note-pill ${i === 0 ? 'root' : ''}">${n}</span>`
    ).join('');
}

// ─── AUDIO ──────────────────────────────────────────────────────────────────

const noteFreqs = {
    'C': 261.63, 'C#': 277.18, 'Db': 277.18,
    'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
    'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
    'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
    'B': 493.88, 'Cb': 493.88, 'B#': 261.63
};

function getFreq(noteName) {
    const n = noteName.replace('m','').replace('°','').trim();
    return noteFreqs[n] || 440;
}

function playTone(ctx, freq, startTime, duration, gain = 0.3) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
}

function playChord() {
    if (!currentNoteData) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const scale = getScale(currentNoteData.note, currentNoteData.type);
    if (!scale || scale.length < 5) return;

    // Play root triad: 1, 3, 5
    const now = audioCtx.currentTime;
    const root = getFreq(scale[0]);
    const third = getFreq(scale[2]);
    const fifth = getFreq(scale[4]);

    playTone(audioCtx, root, now, 1.5, 0.25);
    playTone(audioCtx, third, now + 0.05, 1.5, 0.2);
    playTone(audioCtx, fifth, now + 0.1, 1.5, 0.2);
    playTone(audioCtx, root * 2, now + 0.15, 1.2, 0.1);

    showToast('🎵 Playing ' + currentNoteData.note + (currentNoteData.type === 'major' ? ' Major' : ' minor') + ' chord');
}

// ─── TOAST ──────────────────────────────────────────────────────────────────

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── INIT ────────────────────────────────────────────────────────────────────

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createClock, 100);
});

window.onload = createClock;
