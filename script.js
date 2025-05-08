const colors = {
    'C':  '#FF6B6B',    // Rojo
    'G':  '#4ECDC4',    // Verde-azulado
    'D':  '#45B7D1',    // Azul claro
    'A':  '#1A535C',    // Azul oscuro
    'E':  '#FF9FF3',    // Rosa
    'B/Cb':  '#FFC75F', // Naranja
    'F#/Gb': '#F9F871', // Amarillo
    'Db/C#': '#00B8A9', // Turquesa
    'Ab': '#9B5DE5',    // Púrpura
    'Eb': '#F8A488',    // Salmón
    'Bb': '#F786AA',    // Rosa oscuro
    'F':  '#7A89C2'     // Azul grisáceo
};

const majorKeys = ['C', 'G', 'D', 'A', 'E', 'B/Cb', 'F#/Gb', 'Db/C#', 'Ab', 'Eb', 'Bb', 'F'];
const minorKeys = ['A', 'E', 'B', 'F#', 'C#', 'G#/Ab', 'D#/Eb', 'Bb/A#', 'F', 'C', 'G', 'D'];

const scalePatterns = {
    // Escalas Mayores
    'C':  ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'G':  ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    'D':  ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'A':  ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'E':  ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    'B':  ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
    'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
    'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    'F':  ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],

    // Escalas Menores
    'A_m': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    'E_m': ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
    'B_m': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
    'F#_m': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
    'C#_m': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
    'G#_m': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
    'D#_m': ['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C#'],
    'Eb_m': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
    'Bb_m': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
    'F_m': ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
    'C_m': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
    'G_m': ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
    'D_m': ['D', 'E', 'F', 'G', 'A', 'Bb', 'C']
};

let selectedNote = null;

function calculateDimensions() {
    const clockElement = document.querySelector('.clock');
    const clockWidth = parseInt(getComputedStyle(clockElement).width);
    return {
        outerRadius: clockWidth * 0.44,
        innerRadius: clockWidth * 0.3,
        center: clockWidth * 0.45
    };
}

function createClock() {
    const clockFace = document.getElementById('clockFace');
    clockFace.innerHTML = '';
    const dims = calculateDimensions();

    majorKeys.forEach((note, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180);
        const x = dims.outerRadius * Math.cos(angle);
        const y = dims.outerRadius * Math.sin(angle);

        const noteElement = document.createElement('div');
        noteElement.className = 'note major';
        noteElement.textContent = note;
        noteElement.style.left = `${x + dims.center}px`;
        noteElement.style.top = `${y + dims.center}px`;
        noteElement.style.backgroundColor = colors[note];
        
        noteElement.addEventListener('click', () => updateInfo(note, 'major', noteElement));
        noteElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            updateInfo(note, 'major', noteElement);
        });

        clockFace.appendChild(noteElement);
    });

    minorKeys.forEach((note, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180);
        const x = dims.innerRadius * Math.cos(angle);
        const y = dims.innerRadius * Math.sin(angle);

        const noteElement = document.createElement('div');
        noteElement.className = 'note minor';
        noteElement.textContent = note;
        noteElement.style.left = `${x + dims.center}px`;
        noteElement.style.top = `${y + dims.center}px`;
        const relativeMajor = majorKeys[index];
        noteElement.style.backgroundColor = colors[relativeMajor] + '80';
        
        noteElement.addEventListener('click', () => updateInfo(note, 'minor', noteElement));
        noteElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            updateInfo(note, 'minor', noteElement);
        });

        clockFace.appendChild(noteElement);
    });
}

function updateInfo(note, type, element) {
    if (selectedNote) {
        selectedNote.classList.remove('selected');
    }
    element.classList.add('selected');
    selectedNote = element;

    document.getElementById('selectedKey').textContent = note + (type === 'major' ? ' Major' : ' minor');
    document.getElementById('keySignature').innerHTML = getKeySignature(note, type);
    document.getElementById('relatedKeys').innerHTML = getRelatedKeys(note, type);
    document.getElementById('chords').innerHTML = getChordProgression(note, type);
    document.getElementById('scale').textContent = getScale(note, type).join(' - ');
}

function getKeySignature(note, type) {
    const sharpOrder = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];
    const flatOrder = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'];
    
    // Tonalidades menores, key signature de su relativa mayor
    let mainNote;
    if (type === 'minor') {
        mainNote = majorKeys[minorKeys.indexOf(note)];
    } else {
        mainNote = note;
    }
    
    let noteName = mainNote.split('/')[0];
    
    // Mapeo simplificado de tonalidades a número de alteraciones
    const keySignatures = {
        'C': 0,
        'G': 1, // sharps
        'D': 2, // sharps
        'A': 3, // sharps
        'E': 4, // sharps
        'B': 5, // sharps
        'F#': 6, // sharps
        'Gb': 6, // flats
        'Db': 5, // flats
        'Ab': 4, // flats
        'Eb': 3, // flats
        'Bb': 2, // flats
        'F': 1  // flat
    };

    // Casos especiales para tonalidades enarmónicas
    if (mainNote === 'F#/Gb' || (type === 'minor' && note === 'D#/Eb')) {
        return `Enharmonic equivalent<br>` +
               `6 sharps (${sharpOrder.slice(0, 6).join(', ')})<br>` +
               `6 flats (${flatOrder.slice(0, 6).join(', ')})`;
    }

    const count = keySignatures[noteName];
    if (count === undefined) return 'Invalid key';
    if (count === 0) return 'No sharps or flats';

    const usesSharps = ['G', 'D', 'A', 'E', 'B', 'F#'].includes(noteName);
    if (usesSharps) {
        return `${count} sharp${count > 1 ? 's' : ''} (${sharpOrder.slice(0, count).join(', ')})`;
    } else {
        return `${count} flat${count > 1 ? 's' : ''} (${flatOrder.slice(0, count).join(', ')})`;
    }
}

function getRelatedKeys(note, type) {
    const circleOrder = ['C', 'G', 'D', 'A', 'E', 'B', 'F#/Gb', 'Db/C#', 'Ab', 'Eb', 'Bb', 'F'];
    let index = type === 'major' ? circleOrder.indexOf(note) : circleOrder.indexOf(majorKeys[minorKeys.indexOf(note)]);
    
    if (type === 'major') {
        const relativeMinor = minorKeys[majorKeys.indexOf(note)];
        const dominant = circleOrder[(index + 1) % 12];
        const subdominant = circleOrder[(index - 1 + 12) % 12];
        return `Relative minor: ${relativeMinor}<br>Dominant: ${dominant}<br>Subdominant: ${subdominant}`;
    } else {
        const relativeMajor = majorKeys[minorKeys.indexOf(note)];
        return `Relative major: ${relativeMajor}`;
    }
}

function getChordProgression(note, type) {
    const romanNumerals = type === 'major' 
        ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
        : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

    const scale = getScale(note, type);
    let chords;

    if (type === 'major') {
        chords = [
            scale[0],
            scale[1] + 'm',
            scale[2] + 'm',
            scale[3],
            scale[4],
            scale[5] + 'm',
            scale[6] + '°'
        ];
    } else {
        chords = [
            scale[0] + 'm',
            scale[1] + '°',
            scale[2],
            scale[3] + 'm',
            scale[4] + 'm',
            scale[5],
            scale[6]
        ];
    }

    let result = '';
    for (let i = 0; i < 7; i++) {
        result += `<div><span class="degree">${romanNumerals[i]}</span><br>${chords[i]}</div>`;
    }
    return result;
}

function getScale(note, type) {
    if (type === 'major') {
        // Para tonalidades mayores, usar el primer nombre si hay una notación doble
        const noteName = note.split('/')[0];
        return scalePatterns[noteName];
    } else {
        // Para tonalidades menores
        const noteName = note.split('/')[0] + '_m';
        return scalePatterns[noteName];
    }
}

window.addEventListener('resize', createClock);
window.onload = createClock;