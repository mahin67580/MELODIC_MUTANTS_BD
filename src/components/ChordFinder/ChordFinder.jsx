// components/ChordFinder.js
"use client";
import { useState, useRef, useEffect } from 'react';

const ChordFinder = () => {
  // State for chord selection and display
  const [rootNote, setRootNote] = useState('C');
  const [chordType, setChordType] = useState('major');
  const [instrument, setInstrument] = useState('piano');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  
  // Audio references
  const audioRefs = useRef([]);
  
  // Notes and chord types
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const chordTypes = [
    { value: 'major', name: 'Major' },
    { value: 'minor', name: 'Minor' },
    { value: 'diminished', name: 'Diminished' },
    { value: 'augmented', name: 'Augmented' },
    { value: 'major7', name: 'Major 7th' },
    { value: 'minor7', name: 'Minor 7th' },
    { value: 'dominant7', name: 'Dominant 7th' },
    { value: 'sus2', name: 'Suspended 2nd' },
    { value: 'sus4', name: 'Suspended 4th' }
  ];

  // Chord formulas (intervals in semitones from root)
  const chordFormulas = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],
    major7: [0, 4, 7, 11],
    minor7: [0, 3, 7, 10],
    dominant7: [0, 4, 7, 10],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7]
  };

  // Guitar chord fingerings database
  const guitarChords = {
    'C': {
      'major': { frets: [0, 3, 2, 0, 1, 0], fingers: ['x', '3', '2', 'x', '1', 'x'] },
      'minor': { frets: [0, 3, 3, 0, 1, 0], fingers: ['x', '3', '4', 'x', '1', 'x'] },
      'major7': { frets: [0, 3, 2, 4, 1, 0], fingers: ['x', '3', '2', '4', '1', 'x'] }
    },
    'C#': {
      'major': { frets: [1, 4, 3, 1, 2, 1], fingers: ['1', '4', '3', '1', '2', '1'] },
      'minor': { frets: [1, 4, 4, 1, 2, 1], fingers: ['1', '4', '4', '1', '2', '1'] }
    },
    'D': {
      'major': { frets: [2, 0, 0, 2, 3, 2], fingers: ['2', 'x', 'x', '1', '3', '2'] },
      'minor': { frets: [2, 0, 0, 2, 3, 1], fingers: ['2', 'x', 'x', '1', '3', '1'] },
      'major7': { frets: [2, 0, 0, 2, 2, 2], fingers: ['2', 'x', 'x', '1', '1', '1'] }
    },
    'D#': {
      'major': { frets: [3, 1, 1, 3, 4, 3], fingers: ['3', '1', '1', '2', '4', '3'] },
      'minor': { frets: [3, 1, 1, 3, 4, 2], fingers: ['3', '1', '1', '2', '4', '1'] }
    },
    'E': {
      'major': { frets: [0, 2, 2, 1, 0, 0], fingers: ['x', '2', '3', '1', 'x', 'x'] },
      'minor': { frets: [0, 2, 2, 0, 0, 0], fingers: ['x', '2', '3', 'x', 'x', 'x'] },
      'major7': { frets: [0, 2, 1, 1, 0, 0], fingers: ['x', '2', '1', '1', 'x', 'x'] }
    },
    'F': {
      'major': { frets: [1, 3, 3, 2, 1, 1], fingers: ['1', '3', '4', '2', '1', '1'] },
      'minor': { frets: [1, 3, 3, 1, 1, 1], fingers: ['1', '3', '4', '1', '1', '1'] }
    },
    'F#': {
      'major': { frets: [2, 4, 4, 3, 2, 2], fingers: ['1', '3', '4', '2', '1', '1'] },
      'minor': { frets: [2, 4, 4, 2, 2, 2], fingers: ['1', '3', '4', '1', '1', '1'] }
    },
    'G': {
      'major': { frets: [3, 2, 0, 0, 3, 3], fingers: ['2', '1', 'x', 'x', '3', '4'] },
      'minor': { frets: [3, 5, 5, 3, 3, 3], fingers: ['1', '3', '4', '1', '1', '1'] },
      'major7': { frets: [3, 2, 0, 0, 2, 2], fingers: ['2', '1', 'x', 'x', '3', '4'] }
    },
    'G#': {
      'major': { frets: [4, 3, 1, 1, 4, 4], fingers: ['2', '1', '1', '1', '3', '4'] },
      'minor': { frets: [4, 6, 6, 4, 4, 4], fingers: ['1', '3', '4', '1', '1', '1'] }
    },
    'A': {
      'major': { frets: [0, 0, 2, 2, 2, 0], fingers: ['x', 'x', '1', '2', '3', 'x'] },
      'minor': { frets: [0, 0, 2, 2, 1, 0], fingers: ['x', 'x', '2', '3', '1', 'x'] },
      'major7': { frets: [0, 0, 2, 1, 2, 0], fingers: ['x', 'x', '2', '1', '3', 'x'] }
    },
    'A#': {
      'major': { frets: [1, 1, 3, 3, 3, 1], fingers: ['1', '1', '2', '3', '4', '1'] },
      'minor': { frets: [1, 1, 3, 3, 2, 1], fingers: ['1', '1', '3', '4', '2', '1'] }
    },
    'B': {
      'major': { frets: [2, 2, 4, 4, 4, 2], fingers: ['1', '1', '2', '3', '4', '1'] },
      'minor': { frets: [2, 2, 4, 4, 3, 2], fingers: ['1', '1', '3', '4', '2', '1'] }
    }
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      setAudioContext(new AudioContext());
    }
  }, []);

  // Get notes in the current chord
  const getChordNotes = () => {
    const rootIndex = notes.indexOf(rootNote);
    const formula = chordFormulas[chordType];
    
    return formula.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });
  };

  // Get guitar chord fingering
  const getGuitarChordFingering = () => {
    const chordData = guitarChords[rootNote]?.[chordType];
    if (chordData) {
      return chordData;
    }
    
    // Fallback: show basic barre chord pattern
    const rootIndex = notes.indexOf(rootNote);
    const baseFret = rootIndex >= 1 && rootIndex <= 4 ? rootIndex : 1;
    return {
      frets: [baseFret, baseFret + 3, baseFret + 3, baseFret + 2, baseFret + 1, baseFret],
      fingers: ['1', '4', '4', '3', '2', '1']
    };
  };

  // Play chord function with different sounds for each instrument
  const playChord = async () => {
    if (!audioContext) return;
    
    setIsPlaying(true);
    
    // Stop any currently playing sounds
    audioRefs.current.forEach(source => {
      if (source) source.stop();
    });
    audioRefs.current = [];
    
    const chordNotes = getChordNotes();
    
    // Play each note in the chord
    chordNotes.forEach((note, index) => {
      // Calculate frequency based on note (A4 = 440Hz)
      const frequencies = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
      };
      
      const baseFrequency = frequencies[note];
      
      // Create oscillator with different settings for each instrument
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(audioContext.destination);
      
      if (instrument === 'guitar') {
        // Guitar-like sound
        oscillator.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        
        // Add some detuning for richer guitar sound
        oscillator.detune.value = (index - 1) * 5;
        
        // Guitar envelope - sharper attack, longer decay
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
        
        oscillator.start(now);
        oscillator.stop(now + 2.0);
      } else {
        // Piano-like sound
        oscillator.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        
        // Piano envelope
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        oscillator.start(now);
        oscillator.stop(now + 1.5);
      }
      
      oscillator.frequency.value = baseFrequency;
      
      // Store reference to stop if needed
      audioRefs.current.push(oscillator);
    });
    
    // Reset playing state after chord finishes
    setTimeout(() => setIsPlaying(false), instrument === 'guitar' ? 2000 : 1500);
  };

  // Render piano keys
  const renderPianoKeys = () => {
    const chordNotes = getChordNotes();
    
    // Define piano keys (white and black)
    const pianoKeys = [
      { note: 'C', type: 'white', left: 0 },
      { note: 'C#', type: 'black', left: 30 },
      { note: 'D', type: 'white', left: 40 },
      { note: 'D#', type: 'black', left: 70 },
      { note: 'E', type: 'white', left: 80 },
      { note: 'F', type: 'white', left: 120 },
      { note: 'F#', type: 'black', left: 150 },
      { note: 'G', type: 'white', left: 160 },
      { note: 'G#', type: 'black', left: 190 },
      { note: 'A', type: 'white', left: 200 },
      { note: 'A#', type: 'black', left: 230 },
      { note: 'B', type: 'white', left: 240 }
    ];
    
    return (
      <div className="overflow-x-auto py-2">
        <div className="relative h-36 w-72 bg-gray-200 rounded-lg shadow-lg mx-auto">
          {pianoKeys.map((key) => (
            <div 
              key={key.note}
              className={`absolute rounded-b cursor-pointer transition-colors duration-100 ${
                key.type === 'white' 
                  ? `w-10 h-32 bg-white border border-gray-300 z-10 ${
                      chordNotes.includes(key.note) ? 'bg-yellow-400' : ''
                    }`
                  : `w-6 h-20 bg-gray-800 z-20 ${
                      chordNotes.includes(key.note) ? 'bg-orange-500' : ''
                    }`
              }`}
              style={{ left: `${key.left}px` }}
            >
              <span className={`absolute bottom-1 w-full text-center text-xs font-bold ${
                key.type === 'black' ? 'text-white' : ''
              }`}>
                {key.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render guitar fretboard with accurate chord fingerings
  const renderGuitarFretboard = () => {
    const chordFingering = getGuitarChordFingering();
    const strings = ['E', 'A', 'D', 'G', 'B', 'E']; // Standard tuning
    
    return (
      <div className="flex flex-col items-center">
        <div className="w-80 bg-amber-800 rounded-lg p-4 shadow-lg">
          {/* Nut */}
          <div className="flex h-8 mb-2 relative border-b-4 border-amber-900">
            {strings.map((string, stringIndex) => (
              <div key={stringIndex} className="flex-1 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-700 rounded-full z-10 flex items-center justify-center text-white text-xs">
                  {chordFingering.fingers[stringIndex]}
                </div>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 transform -translate-y-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Frets */}
          {[1, 2, 3, 4].map((fret) => (
            <div key={fret} className="flex h-8 mb-1 relative">
              {/* Fret wire */}
              <div className="absolute top-0 left-0 right-0 h-1  "></div>
              
              {strings.map((string, stringIndex) => {
                const fretPosition = chordFingering.frets[stringIndex];
                const isOpenString = fretPosition === 0;
                const isFingered = fretPosition === fret;
                const isMuted = fretPosition === 'x';
                
                return (
                  <div 
                    key={stringIndex}
                    className="flex-1 relative border-r-2  last:border-r-0"
                  >
                    {/* String */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 transform -translate-y-1/2"></div>
                    
                    {isFingered && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full z-10 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {chordFingering.fingers[stringIndex]}
                      </div>
                    )}
                    
                    {isOpenString && fret === 1 && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-green-600 font-bold z-10">
                        ○
                      </div>
                    )}
                    
                    {isMuted && fret === 1 && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-red-600 font-bold z-10">
                        ×
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Fret numbers */}
        <div className="flex w-80 justify-between mt-2 px-4">
          <span className="font-bold text-gray-700 text-sm">Open</span>
          <span className="font-bold text-gray-700 text-sm">1</span>
          <span className="font-bold text-gray-700 text-sm">2</span>
          <span className="font-bold text-gray-700 text-sm">3</span>
          <span className="font-bold text-gray-700 text-sm">4</span>
        </div>
        
        {/* String names */}
        <div className="flex w-80 justify-between mt-2 px-4">
          {strings.map((string, index) => (
            <span key={index} className="font-bold text-gray-700 text-sm">
              {string}
            </span>
          ))}
        </div>
        
        {/* Chord diagram info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {chordFingering.frets.map((fret, idx) => 
              fret === 'x' ? 'X' : fret
            ).join(' ')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Chord Finder</h1>
        <p className="text-gray-600">Visualize and play piano and guitar chords</p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="flex flex-col min-w-[150px]">
          <label htmlFor="root-note" className="mb-1 font-semibold text-gray-700">
            Root Note:
          </label>
          <select 
            id="root-note"
            value={rootNote} 
            onChange={(e) => setRootNote(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white"
          >
            {notes.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col min-w-[150px]">
          <label htmlFor="chord-type" className="mb-1 font-semibold text-gray-700">
            Chord Type:
          </label>
          <select 
            id="chord-type"
            value={chordType} 
            onChange={(e) => setChordType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white"
          >
            {chordTypes.map(type => (
              <option key={type.value} value={type.value}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col min-w-[150px]">
          <label htmlFor="instrument" className="mb-1 font-semibold text-gray-700">
            Instrument:
          </label>
          <select 
            id="instrument"
            value={instrument} 
            onChange={(e) => setInstrument(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="piano">Piano</option>
            <option value="guitar">Guitar</option>
          </select>
        </div>
        
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium self-end transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={playChord}
          disabled={isPlaying}
        >
          {isPlaying ? 'Playing...' : 'Play Chord'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {rootNote} {chordTypes.find(t => t.value === chordType)?.name}
          </h2>
          <p className="text-lg text-gray-600">
            Notes: {getChordNotes().join(' - ')}
          </p>
        </div>
        
        <div className="flex justify-center">
          {instrument === 'piano' ? renderPianoKeys() : renderGuitarFretboard()}
        </div>
      </div>
    </div>
  );
};

export default ChordFinder;