// components/ScaleFinder.jsx
"use client";
import { useState, useRef, useEffect } from 'react';

const ScaleFinder = () => {
  const [rootNote, setRootNote] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [instrument, setInstrument] = useState('piano');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Audio references
  const audioRefs = useRef([]);
  
  // Notes
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Scale types with formulas (intervals in semitones from root)
  const scaleTypes = [
    { 
      value: 'major', 
      name: 'Major (Ionian)', 
      formula: [0, 2, 4, 5, 7, 9, 11],
      steps: ['T', 'T', 'S', 'T', 'T', 'T', 'S']
    },
    { 
      value: 'natural-minor', 
      name: 'Natural Minor (Aeolian)', 
      formula: [0, 2, 3, 5, 7, 8, 10],
      steps: ['T', 'S', 'T', 'T', 'S', 'T', 'T']
    },
    { 
      value: 'harmonic-minor', 
      name: 'Harmonic Minor', 
      formula: [0, 2, 3, 5, 7, 8, 11],
      steps: ['T', 'S', 'T', 'T', 'S', 'T+S', 'S']
    },
    { 
      value: 'melodic-minor', 
      name: 'Melodic Minor', 
      formula: [0, 2, 3, 5, 7, 9, 11],
      steps: ['T', 'S', 'T', 'T', 'T', 'T', 'S']
    },
    { 
      value: 'major-pentatonic', 
      name: 'Major Pentatonic', 
      formula: [0, 2, 4, 7, 9],
      steps: ['T', 'T', 'T+S', 'T', 'T+S']
    },
    { 
      value: 'minor-pentatonic', 
      name: 'Minor Pentatonic', 
      formula: [0, 3, 5, 7, 10],
      steps: ['T+S', 'T', 'T', 'T+S', 'T']
    },
    { 
      value: 'blues', 
      name: 'Blues Scale', 
      formula: [0, 3, 5, 6, 7, 10],
      steps: ['T+S', 'T', 'S', 'S', 'T+S', 'T']
    },
    { 
      value: 'dorian', 
      name: 'Dorian Mode', 
      formula: [0, 2, 3, 5, 7, 9, 10],
      steps: ['T', 'S', 'T', 'T', 'T', 'S', 'T']
    },
    { 
      value: 'phrygian', 
      name: 'Phrygian Mode', 
      formula: [0, 1, 3, 5, 7, 8, 10],
      steps: ['S', 'T', 'T', 'T', 'S', 'T', 'T']
    },
    { 
      value: 'lydian', 
      name: 'Lydian Mode', 
      formula: [0, 2, 4, 6, 7, 9, 11],
      steps: ['T', 'T', 'T', 'S', 'T', 'T', 'S']
    },
    { 
      value: 'mixolydian', 
      name: 'Mixolydian Mode', 
      formula: [0, 2, 4, 5, 7, 9, 10],
      steps: ['T', 'T', 'S', 'T', 'T', 'S', 'T']
    },
    { 
      value: 'locrian', 
      name: 'Locrian Mode', 
      formula: [0, 1, 3, 5, 6, 8, 10],
      steps: ['S', 'T', 'T', 'S', 'T', 'T', 'T']
    },
    { 
      value: 'chromatic', 
      name: 'Chromatic', 
      formula: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      steps: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S']
    }
  ];

  // Set client flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      setAudioContext(new AudioContext());
    }
  }, [isClient]);

  // Get notes in the current scale
  const getScaleNotes = () => {
    const rootIndex = notes.indexOf(rootNote);
    const selectedScale = scaleTypes.find(scale => scale.value === scaleType);
    const formula = selectedScale?.formula || [];
    
    return formula.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });
  };

  // Get scale steps
  const getScaleSteps = () => {
    const selectedScale = scaleTypes.find(scale => scale.value === scaleType);
    return selectedScale?.steps || [];
  };

  // Play scale function
  const playScale = async () => {
    if (!audioContext) return;
    
    setIsPlaying(true);
    
    // Stop any currently playing sounds
    audioRefs.current.forEach(source => {
      if (source) source.stop();
    });
    audioRefs.current = [];
    
    const scaleNotes = getScaleNotes();
    
    // Play each note in sequence
    const playNote = (index) => {
      if (index >= scaleNotes.length) {
        setIsPlaying(false);
        return;
      }
      
      const note = scaleNotes[index];
      
      // Calculate frequency based on note (A4 = 440Hz)
      const frequencies = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
      };
      
      const frequency = frequencies[note];
      
      // Create oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (instrument === 'guitar') {
        oscillator.type = 'sawtooth';
      } else {
        oscillator.type = 'sine';
      }
      
      oscillator.frequency.value = frequency;
      
      // Apply envelope
      const now = audioContext.currentTime;
      const noteStart = now + (index * 0.5);
      gainNode.gain.setValueAtTime(0, noteStart);
      gainNode.gain.linearRampToValueAtTime(0.3, noteStart + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.8);
      
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 0.8);
      
      // Store reference
      audioRefs.current.push(oscillator);
      
      // Schedule next note
      setTimeout(() => playNote(index + 1), 500);
    };
    
    playNote(0);
  };

  // Render piano keyboard
  const renderPianoKeyboard = () => {
    const scaleNotes = getScaleNotes();
    
    const pianoKeys = [
      { note: 'C', type: 'white', left: 0 },
      { note: 'C#', type: 'black', left: 25 },
      { note: 'D', type: 'white', left: 35 },
      { note: 'D#', type: 'black', left: 60 },
      { note: 'E', type: 'white', left: 70 },
      { note: 'F', type: 'white', left: 105 },
      { note: 'F#', type: 'black', left: 130 },
      { note: 'G', type: 'white', left: 140 },
      { note: 'G#', type: 'black', left: 165 },
      { note: 'A', type: 'white', left: 175 },
      { note: 'A#', type: 'black', left: 200 },
      { note: 'B', type: 'white', left: 210 }
    ];
    
    // Create two octaves
    const twoOctaves = [...pianoKeys, ...pianoKeys.map(key => ({
      ...key,
      note: key.note,
      left: key.left + 245
    }))];
    
    return (
      <div className="overflow-x-auto py-4">
        <div className="relative h-32 min-w-[490px] bg-gray-300 rounded-lg shadow-lg mx-auto p-2">
          {twoOctaves.map((key, index) => (
            <div 
              key={`${key.note}-${index}`}
              className={`absolute rounded-b cursor-pointer transition-all duration-200 ${
                key.type === 'white' 
                  ? `w-10 h-28 bg-white border border-gray-300 z-10 ${
                      scaleNotes.includes(key.note) 
                        ? key.note === rootNote ? 'bg-red-400 shadow-lg' : 'bg-blue-300'
                        : ''
                    }`
                  : `w-6 h-18 bg-gray-800 z-20 ${
                      scaleNotes.includes(key.note)
                        ? key.note === rootNote ? 'bg-red-500 shadow-lg' : 'bg-blue-400'
                        : ''
                    }`
              }`}
              style={{ left: `${key.left}px` }}
            >
              <span className={`absolute bottom-1 w-full text-center text-xs font-bold ${
                key.type === 'black' ? 'text-white' : 'text-gray-800'
              } ${scaleNotes.includes(key.note) ? 'font-extrabold' : ''}`}>
                {key.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render guitar fretboard
  const renderGuitarFretboard = () => {
    const scaleNotes = getScaleNotes();
    const strings = ['E', 'A', 'D', 'G', 'B', 'E']; // Standard tuning
    
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl bg-amber-800 rounded-lg p-4 shadow-lg">
          {/* Nut */}
          <div className="flex h-8 mb-2 relative border-b-4 border-amber-900">
            {strings.map((string, stringIndex) => (
              <div key={stringIndex} className="flex-1 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 transform -translate-y-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Frets */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((fret) => (
            <div key={fret} className="flex h-6 mb-1 relative">
              {/* Fret wire */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-900"></div>
              
              {strings.map((string, stringIndex) => {
                // Calculate note at this position
                const rootIndex = notes.indexOf(string);
                const noteIndex = (rootIndex + fret) % 12;
                const note = notes[noteIndex];
                const isScaleNote = scaleNotes.includes(note);
                const isRootNote = note === rootNote;
                
                return (
                  <div 
                    key={stringIndex}
                    className="flex-1 relative border-r-2 border-amber-700 last:border-r-0"
                  >
                    {/* String */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 transform -translate-y-1/2"></div>
                    
                    {isScaleNote && (
                      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10 flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                        isRootNote ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        {isRootNote ? 'R' : ''}
                      </div>
                    )}
                    
                    {/* Fret markers */}
                    {fret === 3 || fret === 5 || fret === 7 || fret === 9 || fret === 12 ? (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-600 rounded-full opacity-50"></div>
                    ) : null}
                    
                    {/* Double dot for 12th fret */}
                    {fret === 12 && (stringIndex === 0 || stringIndex === 5) && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-600 rounded-full opacity-50"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Fret numbers */}
        <div className="flex w-full max-w-2xl justify-between mt-2 px-4 text-xs">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((fret) => (
            <span key={fret} className="font-bold text-gray-700 w-8 text-center">
              {fret === 0 ? 'Open' : fret}
            </span>
          ))}
        </div>
        
        {/* String names */}
        <div className="flex w-full max-w-2xl justify-between mt-2 px-4">
          {strings.map((string, index) => (
            <span key={index} className="font-bold text-gray-700 text-sm w-8 text-center">
              {string}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Get scale formula description
  const getScaleFormula = () => {
    const selectedScale = scaleTypes.find(scale => scale.value === scaleType);
    const steps = selectedScale?.steps || [];
    const formula = selectedScale?.formula || [];
    
    return {
      steps: steps.join(' - '),
      intervals: formula.map(interval => `${interval} st`).join(' - '),
      noteCount: formula.length
    };
  };

  if (!isClient) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading Scale Finder...</div>
        </div>
      </div>
    );
  }

  const scaleFormula = getScaleFormula();
  const scaleNotes = getScaleNotes();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Scale Finder</h1>
        <p className="text-gray-600">Discover and visualize musical scales</p>
      </div>
      
      {/* Controls */}
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
        
        <div className="flex flex-col min-w-[200px]">
          <label htmlFor="scale-type" className="mb-1 font-semibold text-gray-700">
            Scale Type:
          </label>
          <select 
            id="scale-type"
            value={scaleType} 
            onChange={(e) => setScaleType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white"
          >
            {scaleTypes.map(type => (
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
          onClick={playScale}
          disabled={isPlaying}
        >
          {isPlaying ? 'Playing...' : 'Play Scale'}
        </button>
      </div>
      
      {/* Scale Information */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {rootNote} {scaleTypes.find(t => t.value === scaleType)?.name}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Notes: {scaleNotes.join(' - ')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="bg-gray-50 p-3 rounded-lg">
              <strong>Scale Steps:</strong> {scaleFormula.steps}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <strong>Intervals:</strong> {scaleFormula.intervals}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <strong>Number of Notes:</strong> {scaleFormula.noteCount}
            </div>
          </div>
        </div>
        
        {/* Visualizer */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            {instrument === 'piano' ? 'Piano Keyboard' : 'Guitar Fretboard'}
          </h3>
          {instrument === 'piano' ? renderPianoKeyboard() : renderGuitarFretboard()}
        </div>
      </div>

      {/* Scale Degrees */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Scale Degrees</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          {scaleNotes.map((note, index) => (
            <div key={index} className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 font-medium">
                {index === 0 ? 'Tonic' : 
                 index === 1 ? 'Supertonic' :
                 index === 2 ? 'Mediant' :
                 index === 3 ? 'Subdominant' :
                 index === 4 ? 'Dominant' :
                 index === 5 ? 'Submediant' :
                 index === 6 ? 'Leading Tone' : `Degree ${index + 1}`}
              </div>
              <div className={`text-lg font-bold ${
                index === 0 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {note}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][index] || index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-4">About Musical Scales</h3>
        <div className="space-y-3 text-blue-700">
          <p>
            A <strong>musical scale</strong> is a set of musical notes ordered by fundamental frequency or pitch. 
            Scales are the foundation of melodies and harmonies in most musical traditions.
          </p>
          
          <p>
            <strong>Scale degrees</strong> are numbered according to their position in the scale. 
            The first degree is the <strong>tonic</strong>, which gives the scale its name and serves as the home note.
          </p>
          
          <p>
            <strong>Intervals</strong> between notes are measured in semitones (st). 
            <strong>T</strong> represents a whole tone (2 semitones) and <strong>S</strong> represents a semitone (1 semitone).
          </p>
          
          <p className="font-semibold">
            Use this tool to explore different scales, visualize them on piano and guitar, 
            and hear how they sound to develop your musical understanding and improvisation skills.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScaleFinder;