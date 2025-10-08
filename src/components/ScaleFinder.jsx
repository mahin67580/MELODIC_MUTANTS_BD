// components/ScaleFinder.jsx
"use client";
import { useState, useRef, useEffect } from 'react';

const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const degreeNames = [
  "Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"
];

const scaleTypes = [
  {value:'major',name:'Major (Ionian)',formula:[0,2,4,5,7,9,11],steps:['T','T','S','T','T','T','S']},
  {value:'natural-minor',name:'Natural Minor (Aeolian)',formula:[0,2,3,5,7,8,10],steps:['T','S','T','T','S','T','T']},
  {value:'harmonic-minor',name:'Harmonic Minor',formula:[0,2,3,5,7,8,11],steps:['T','S','T','T','S','T+S','S']},
  {value:'melodic-minor',name:'Melodic Minor',formula:[0,2,3,5,7,9,11],steps:['T','S','T','T','T','T','S']},
  {value:'major-pentatonic',name:'Major Pentatonic',formula:[0,2,4,7,9],steps:['T','T','T+S','T','T+S']},
  {value:'minor-pentatonic',name:'Minor Pentatonic',formula:[0,3,5,7,10],steps:['T+S','T','T','T+S','T']},
  {value:'blues',name:'Blues Scale',formula:[0,3,5,6,7,10],steps:['T+S','T','S','S','T+S','T']},
  {value:'dorian',name:'Dorian Mode',formula:[0,2,3,5,7,9,10],steps:['T','S','T','T','T','S','T']},
  {value:'phrygian',name:'Phrygian Mode',formula:[0,1,3,5,7,8,10],steps:['S','T','T','T','S','T','T']},
  {value:'lydian',name:'Lydian Mode',formula:[0,2,4,6,7,9,11],steps:['T','T','T','S','T','T','S']},
  {value:'mixolydian',name:'Mixolydian Mode',formula:[0,2,4,5,7,9,10],steps:['T','T','S','T','T','S','T']},
  {value:'locrian',name:'Locrian Mode',formula:[0,1,3,5,6,8,10],steps:['S','T','T','S','T','T','T']},
  {value:'chromatic',name:'Chromatic',formula:[0,1,2,3,4,5,6,7,8,9,10,11],steps:['S','S','S','S','S','S','S','S','S','S','S']}
];

const ScaleFinder = () => {
  const [rootNote, setRootNote] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef();

  useEffect(() => { setIsClient(true); }, []);

  const getScaleNotes = () => {
    const rIdx = notes.indexOf(rootNote);
    const type = scaleTypes.find(t => t.value===scaleType);
    return type.formula.map(semi => notes[(rIdx+semi)%12]);
  };

  // Play /scales/c_major_scale.mp3, /scales/d_minor_scale.mp3, etc.
  const playScale = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Construct file name
    const noteFile = rootNote.replace('#','sharp').toLowerCase();
    const scaleFile = scaleType.replace('natural-','').replace('harmonic-','harmonic_').replace('melodic-','melodic_').replace('-','_');
    const audioPath = `/notes/${noteFile}_${scaleFile}_scale.mp3`;
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    audio.play();
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
  };

  // Returns one octave keys (C-B) for 1x, 2 octaves for 2x
  const getPianoKeys = octaveCount => {
    const octave = [
      { note: 'C', type: 'white' },{ note: 'C#', type: 'black' },{ note: 'D', type: 'white' },
      { note: 'D#', type: 'black' },{ note: 'E', type: 'white' },{ note: 'F', type: 'white' },
      { note: 'F#', type: 'black' },{ note: 'G', type: 'white' },{ note: 'G#', type: 'black' },
      { note: 'A', type: 'white' },{ note: 'A#', type: 'black' },{ note: 'B', type: 'white' }
    ];
    if (octaveCount === 1) return octave;
    if (octaveCount === 2) return octave.concat(octave.map((k,i) => ({...k,note:(k.note.match(/([A-G]#?)/)[0] + '2'),orig:k.note, type:k.type})));
  };

  const renderPianoKeyboard = () => {
    const scaleNotes = getScaleNotes();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const keyLayout = getPianoKeys(isMobile ? 1 : 2);
    const baseNote = n => n.replace(/[0-9]/g,'').replace('2','');

    return (
      <div className="w-full max-w-screen-lg mx-auto px-2" style={{ minHeight: 160 }}>
        <style>
          {`
            @media (max-width: 640px) {
              .octave-2 { display: none !important; }
              .white-key, .black-key { width: 8.3333% !important; }
              .white-key { height: 134px !important; }
              .black-key { height: 80px !important; }
            }
          `}
        </style>
        <div className="relative w-full" style={{ height: '134px' }}>
          {/* White keys */}
          {keyLayout.map((key, idx) => ({
              ...key,
              left: isMobile ? (idx * 100)/12 + '%' : (idx * 100) / keyLayout.length + '%',
              octaveClass: idx>=12 ? "octave-2" : ""
            })).filter(k=>k.type==='white').map((key, idx) => (
            <div
              key={key.note}
              className={`white-key absolute rounded-b z-10 cursor-pointer ${key.octaveClass}`}
              style={{
                left: key.left,
                width: isMobile ? '8.3333%' : `${100 / keyLayout.filter(kk => kk.type==='white').length}%`,
                height: '134px',
                backgroundColor: scaleNotes.map(baseNote).includes(baseNote(key.note))
                  ? baseNote(key.note)===baseNote(rootNote) ? '#f87171' : '#60a5fa'
                  : 'white',
                border: '1px solid #9ca3af',
                borderBottomLeftRadius: '6px',
                borderBottomRightRadius: '6px',
                boxSizing: 'border-box'
              }}
              title={key.orig || key.note}
            >
              <span style={{
                position: 'absolute',
                bottom: 4,
                width: '100%',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '13px',
                userSelect: 'none',
                color: scaleNotes.map(baseNote).includes(baseNote(key.note)) ? '#fff':'#222'
              }}>
                {(key.orig||key.note).replace(/[0-9]/g,'')}
              </span>
            </div>
          ))}
          {/* Black keys */}
          {keyLayout.map((key, idx) => ({
            ...key,
            left: isMobile ? (idx * 100)/12 + 5 + '%' : (idx * 100) / keyLayout.length + 4 + '%',
            octaveClass: idx>=12 ? 'octave-2':''
          })).filter(k=>k.type==="black").map((key,idx) => (
            <div
              key={key.note}
              className={`black-key absolute z-20 cursor-pointer ${key.octaveClass}`}
              style={{
                left: key.left,
                width: isMobile ? '4.5%' : `${100 / keyLayout.filter(kk=>kk.type==='black').length/2}%`,
                height: '80px',
                backgroundColor: scaleNotes.map(baseNote).includes(baseNote(key.note))
                  ? baseNote(key.note)===baseNote(rootNote) ? '#f87171' : '#60a5fa'
                  : 'black',
                borderRadius: '0 0 6px 6px'
              }}
              title={key.orig || key.note}
            >
              <span style={{
                position: 'absolute',
                bottom: 8,
                width: '100%',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '12px',
                userSelect: 'none',
                color: '#fff'
              }}>
                {(key.orig||key.note).replace(/[0-9]/g,'')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getScaleFormula = () => {
    const selectedScale = scaleTypes.find(scale => scale.value === scaleType);
    return {
      steps: selectedScale?.steps.join(' - '),
      intervals: (selectedScale?.formula||[]).map(i => `${i} st`).join(' - '),
      noteCount: (selectedScale?.formula||[]).length
    };
  };

  if (!isClient) {
    return (
      <div className="mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading Scale Finder...</div>
        </div>
      </div>
    );
  }

  const scaleFormula = getScaleFormula();
  const scaleNotes = getScaleNotes();

  return (
    <div className="mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Scale Finder</h1>
        <p className="text-gray-600">Discover and visualize piano scales</p>
      </div>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="flex flex-col min-w-[150px]">
          <label htmlFor="root-note" className="mb-1 font-semibold text-gray-700">
            Root Note:
          </label>
          <select id="root-note" value={rootNote}
            onChange={e=>setRootNote(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white">
            {notes.map(note=><option key={note} value={note}>{note}</option>)}
          </select>
        </div>
        <div className="flex flex-col min-w-[200px]">
          <label htmlFor="scale-type" className="mb-1 font-semibold text-gray-700">
            Scale Type:
          </label>
          <select id="scale-type" value={scaleType}
            onChange={e=>setScaleType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white">
            {scaleTypes.map(type => <option key={type.value} value={type.value}>{type.name}</option>)}
          </select>
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium self-end transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={playScale}
          disabled={isPlaying}
        >
          {isPlaying ? "Playing..." : "Play Scale"}
        </button>
      </div>
      {/* Scale Info */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {rootNote} {scaleTypes.find(t => t.value === scaleType)?.name}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Notes: {scaleNotes.join(" - ")}
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
        {/* Piano Visualizer */}
        <div className="mt-6 w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Piano Keyboard</h3>
          {renderPianoKeyboard()}
        </div>
      </div>
      {/* Scale Degrees */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Scale Degrees</h3>
        <div className="flex flex-wrap justify-around items-center gap-2">
          {scaleNotes.map((note, idx) => (
            <div key={idx} className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 w-28 font-medium">
                {degreeNames[idx] || `Degree ${idx + 1}`}
              </div>
              <div className={`text-lg font-bold ${idx === 0 ? "text-red-600" : "text-gray-800"}`}>
                {note}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {["I","II","III","IV","V","VI","VII"][idx] || idx+1}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* About Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-4">About Piano Scales</h3>
        <div className="space-y-3 text-blue-700">
          <p>
            A <strong>musical scale</strong> is a set of musical notes ordered by frequency or pitch. Scales are the foundation of most melodies and harmonies.
          </p>
          <p>
            <strong>Scale degrees</strong> represent each position in the scale. The first degree is the <strong>tonic</strong>, which gives the scale its name.
          </p>
          <p>
            Use this tool to explore scales, visualize them on a piano, and hear each note using realistic piano sounds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScaleFinder;
