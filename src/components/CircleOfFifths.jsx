// components/CircleOfFifths.jsx
"use client";
import { useState, useRef, useEffect } from 'react';

const CircleOfFifths = () => {
  const [selectedKey, setSelectedKey] = useState('C');
  const [showKeySignatures, setShowKeySignatures] = useState(true);
  const [clef, setClef] = useState('treble');
  const audioContextRef = useRef(null);

  // Circle of fifths data
  const circleData = [
    { key: 'C', major: 'C', minor: 'Am', sharps: 0, flats: 0, position: 0 },
    { key: 'G', major: 'G', minor: 'Em', sharps: 1, flats: 0, position: 1 },
    { key: 'D', major: 'D', minor: 'Bm', sharps: 2, flats: 0, position: 2 },
    { key: 'A', major: 'A', minor: 'F#m', sharps: 3, flats: 0, position: 3 },
    { key: 'E', major: 'E', minor: 'C#m', sharps: 4, flats: 0, position: 4 },
    { key: 'B', major: 'B', minor: 'G#m', sharps: 5, flats: 0, position: 5 },
    { key: 'F#', major: 'F#', minor: 'D#m', sharps: 6, flats: 0, position: 6 },
    { key: 'C#', major: 'C#', minor: 'A#m', sharps: 7, flats: 0, position: 7 },
    { key: 'F', major: 'F', minor: 'Dm', sharps: 0, flats: 1, position: 11 },
    { key: 'Bb', major: 'Bb', minor: 'Gm', sharps: 0, flats: 2, position: 10 },
    { key: 'Eb', major: 'Eb', minor: 'Cm', sharps: 0, flats: 3, position: 9 },
    { key: 'Ab', major: 'Ab', minor: 'Fm', sharps: 0, flats: 4, position: 8 },
    { key: 'Db', major: 'Db', minor: 'Bbm', sharps: 0, flats: 5, position: 7 },
    { key: 'Gb', major: 'Gb', minor: 'Ebm', sharps: 0, flats: 6, position: 6 },
    { key: 'Cb', major: 'Cb', minor: 'Abm', sharps: 0, flats: 7, position: 5 }
  ];

  // Chords for each key - using 'dim' instead of '°' character
  const keyChords = {
    'C': { I: 'C', ii: 'Dm', iii: 'Em', IV: 'F', V: 'G', vi: 'Am', vii: 'Bdim' },
    'G': { I: 'G', ii: 'Am', iii: 'Bm', IV: 'C', V: 'D', vi: 'Em', vii: 'F#dim' },
    'D': { I: 'D', ii: 'Em', iii: 'F#m', IV: 'G', V: 'A', vi: 'Bm', vii: 'C#dim' },
    'A': { I: 'A', ii: 'Bm', iii: 'C#m', IV: 'D', V: 'E', vi: 'F#m', vii: 'G#dim' },
    'E': { I: 'E', ii: 'F#m', iii: 'G#m', IV: 'A', V: 'B', vi: 'C#m', vii: 'D#dim' },
    'B': { I: 'B', ii: 'C#m', iii: 'D#m', IV: 'E', V: 'F#', vi: 'G#m', vii: 'A#dim' },
    'F': { I: 'F', ii: 'Gm', iii: 'Am', IV: 'Bb', V: 'C', vi: 'Dm', vii: 'Edim' },
    'Bb': { I: 'Bb', ii: 'Cm', iii: 'Dm', IV: 'Eb', V: 'F', vi: 'Gm', vii: 'Adim' },
    'Eb': { I: 'Eb', ii: 'Fm', iii: 'Gm', IV: 'Ab', V: 'Bb', vi: 'Cm', vii: 'Ddim' },
    'Ab': { I: 'Ab', ii: 'Bbm', iii: 'Cm', IV: 'Db', V: 'Eb', vi: 'Fm', vii: 'Gdim' },
    'Db': { I: 'Db', ii: 'Ebm', iii: 'Fm', IV: 'Gb', V: 'Ab', vi: 'Bbm', vii: 'Cdim' }
  };

  // Key signature information
  const keyInfo = {
    'C': { relative: 'Am', parallel: 'Cm', signature: 'No sharps or flats' },
    'G': { relative: 'Em', parallel: 'Gm', signature: 'F♯' },
    'D': { relative: 'Bm', parallel: 'Dm', signature: 'F♯, C♯' },
    'A': { relative: 'F#m', parallel: 'Am', signature: 'F♯, C♯, G♯' },
    'E': { relative: 'C#m', parallel: 'Em', signature: 'F♯, C♯, G♯, D♯' },
    'B': { relative: 'G#m', parallel: 'Bm', signature: 'F♯, C♯, G♯, D♯, A♯' },
    'F': { relative: 'Dm', parallel: 'Fm', signature: 'B♭' },
    'Bb': { relative: 'Gm', parallel: 'Bbm', signature: 'B♭, E♭' },
    'Eb': { relative: 'Cm', parallel: 'Ebm', signature: 'B♭, E♭, A♭' },
    'Ab': { relative: 'Fm', parallel: 'Abm', signature: 'B♭, E♭, A♭, D♭' },
    'Db': { relative: 'Bbm', parallel: 'Dbm', signature: 'B♭, E♭, A♭, D♭, G♭' }
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
  }, []);

  // Play chord function
  const playChord = async (chord) => {
    if (!audioContextRef.current) return;

    const frequencies = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
      'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
      'A#': 466.16, 'B': 493.88,
      'Db': 277.18, 'Eb': 311.13, 'Gb': 369.99, 'Ab': 415.30, 'Bb': 466.16
    };

    // Simple chord detection (for demo purposes)
    const rootNote = chord.replace('m', '').replace('dim', '');
    const frequency = frequencies[rootNote] || 440;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const now = audioContextRef.current.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    oscillator.start(now);
    oscillator.stop(now + 1.5);
  };

  // Calculate position on circle
  const getPosition = (index, total, radius) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
  };

  // Render key signatures
  const renderKeySignature = (keyData) => {
    if (!showKeySignatures) return null;

    return (
      <div className="text-xs text-gray-600 mt-1">
        {keyData.sharps > 0 && `${keyData.sharps}♯`}
        {keyData.flats > 0 && `${keyData.flats}♭`}
        {keyData.sharps === 0 && keyData.flats === 0 && '0'}
      </div>
    );
  };

  // Get display label for chord degrees
  const getDegreeLabel = (degree) => {
    const degreeLabels = {
      'I': 'I',
      'ii': 'ii',
      'iii': 'iii',
      'IV': 'IV',
      'V': 'V',
      'vi': 'vi',
      'vii': 'vii°' // Only use the degree symbol in display, not in object key
    };
    return degreeLabels[degree] || degree;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          onClick={() => setClef(clef === 'treble' ? 'bass' : 'treble')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clef: {clef === 'treble' ? 'Treble' : 'Bass'}
        </button>
        
        <button
          onClick={() => setShowKeySignatures(!showKeySignatures)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showKeySignatures ? 'Hide Key Signatures' : 'Show Key Signatures'}
        </button>
        
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save as PDF
        </button>
      </div>

      {/* Circle of Fifths */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Circle Visualization */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
            {/* Outer Circle */}
            <div className="absolute inset-0 border-4 border-blue-300 rounded-full"></div>
            
            {/* Inner Circle */}
            <div className="absolute inset-12 border-2 border-blue-200 rounded-full"></div>
            
            {/* Center */}
            <div className="absolute inset-24 bg-blue-50 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">C / Am</span>
            </div>

            {/* Major Keys (Outer Ring) */}
            {circleData.map((item, index) => {
              const position = getPosition(item.position, 12, 120);
              return (
                <div
                  key={`major-${item.key}`}
                  className={`absolute w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all transform -translate-x-6 -translate-y-6 ${
                    selectedKey === item.key
                      ? 'bg-yellow-400 scale-110 shadow-lg'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  style={{
                    left: `calc(50% + ${position.x.toFixed()}px)`,
                    top: `calc(50% + ${position.y.toFixed()}px)`
                  }}
                  onClick={() => setSelectedKey(item.key)}
                >
                  <div className="text-center">
                    <div className="font-bold text-sm">{item.major}</div>
                    {renderKeySignature(item)}
                  </div>
                </div>
              );
            })}

            {/* Minor Keys (Inner Ring) */}
            {circleData.map((item, index) => {
              const position = getPosition(item.position, 12, 80);
              return (
                <div
                  key={`minor-${item.key}`}
                  className={`absolute w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all transform -translate-x-5 -translate-y-5 ${
                    selectedKey === item.minor.replace('m', '')
                      ? 'bg-green-400 scale-110 shadow-lg'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  style={{
                    left: `calc(50% + ${position.x.toFixed()}px)`,
                    top: `calc(50% + ${position.y.toFixed()}px)`
                  }}
                  onClick={() => setSelectedKey(item.minor.replace('m', ''))}
                >
                  <div className="text-center">
                    <div className="font-bold text-xs">{item.minor}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Information */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-50 rounded-lg p-6 shadow-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Key: {selectedKey} major
              </h2>
              <div className="text-gray-600">
                <p>Relative key: {keyInfo[selectedKey]?.relative || 'N/A'}</p>
                <p>Parallel key: {keyInfo[selectedKey]?.parallel || 'N/A'}</p>
                <p>Key signature: {keyInfo[selectedKey]?.signature || 'N/A'}</p>
              </div>
            </div>

            {/* Chords Table */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-4">
              {Object.entries(keyChords[selectedKey] || {}).map(([degree, chord]) => (
                <div
                  key={degree}
                  className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playChord(chord)}
                >
                  <div className="text-sm text-gray-600 font-medium">
                    {getDegreeLabel(degree)}
                  </div>
                  <div className="text-lg font-bold text-gray-800">{chord}</div>
                </div>
              ))}
            </div>

            {/* Scale Degrees */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-center text-sm text-gray-600">
              <div>Tonic</div>
              <div>Supertonic</div>
              <div>Mediant</div>
              <div>Subdominant</div>
              <div>Dominant</div>
              <div>Submediant</div>
              <div>Leading tone</div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6 shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          What is the circle of fifths?
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            The circle of fifths is a visualization of all major keys and minor keys. 
            The major keys are in the outer circle and their relative minor keys are in the inner circle. 
            Each letter on the circle of fifths can also represent a chord or a note.
          </p>

          <p>
            The key signatures for each key are on the outside of the circle. Major keys and relative minor keys share the same key signature. 
            For example, the key of F major and D minor both have one flat in their key signature.
          </p>

          <p className="font-semibold text-gray-800">
            The circle of fifths helps you to visually understand the relationship between keys and chords. You can use the circle of fifths to:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Remember key signatures.</strong> The top of the circle shows the key of C major with no sharps or flats. 
              For each clockwise step, a sharp (♯) is added to the key signature. With each counterclockwise step, a flat (♭) is added to the key signature.
            </li>
            <li>
              <strong>Compose music.</strong> An idea for a song can start with a few chords that sound good together. 
              The three major chords and three minor chords within any quarter of the circle belong to the same key and thus sound good together.
            </li>
            <li>
              <strong>Transpose chords.</strong> The chords of a song can be placed on the circle of fifths and subsequently transposed by moving the pattern of chords around the circle. 
              For example, place the chords C, F, and G on the circle of fifths. C is at the center, F is one step counterclockwise and G is one step clockwise. 
              Transposed to A major, the chords are A, D, and E.
            </li>
          </ul>

          <p>
            Going clockwise on the circle of fifths, there is an ascending perfect fifth between each key. 
            Going counterclockwise there is a descending perfect fifth between each key. 
            If you start on any key and go up a perfect fifth 12 times, you'll arrive at the same key.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Using the interactive circle of fifths</h4>
            <p className="text-blue-700">
              You can change the clef by clicking the "Clef" button. Click "Hide key signatures" to hide all key signatures. 
              Click "Save as PDF" to save the circle of fifths as a printable PDF file. The circle of fifths version that you select will be saved in the PDF file.
            </p>
            <p className="text-blue-700 mt-2">
              Click any key on the circle of fifths to see the key's chords. Each chord is marked with a roman numeral representing the chord's scale degree. 
              Specifically, an uppercase roman numeral indicates a major chord while a lowercase roman numeral indicates a minor chord, and a small circle after the roman numeral indicates a diminished chord.
            </p>
            <p className="text-blue-700 mt-2">
              A table below the circle of fifths shows the chords of the selected key and the name of each scale degree. 
              Click any chord in the table to play it. Above the table of chords is the name of the key, the relative key, and the parallel key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleOfFifths;