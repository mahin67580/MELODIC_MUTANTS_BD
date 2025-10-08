// components/ChordFinder.js
"use client";
import { useState, useRef, useEffect } from 'react';

const ChordFinder = () => {
  // State for chord selection and display
  const [rootNote, setRootNote] = useState('C');
  const [chordType, setChordType] = useState('major');
  const [instrument, setInstrument] = useState('piano');
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio references
  const audioRefs = useRef(null);

  // Notes and chord types
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const chordTypes = [
    { value: 'major', name: 'Major' },
    { value: 'minor', name: 'Minor' }
    // You can add others if you have sound files for them
  ];

  // Get chord notes for display only (based on intervals)
  const chordFormulas = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
  };
  const getChordNotes = () => {
    const rootIndex = notes.indexOf(rootNote);
    const formula = chordFormulas[chordType];
    if (!formula) return [];
    return formula.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });
  };

  // Play chord audio file from public/sounds folder
  const playChord = () => {
    if (isPlaying) return;

    setIsPlaying(true);

    // Stop previous audio if playing
    if (audioRefs.current) {
      audioRefs.current.pause();
      audioRefs.current.currentTime = 0;
    }

    // Construct audio file path, lowercase and replace # with 'sharp'
    const rootForFile = rootNote.replace('#', 'sharp').toLowerCase();
    const chordForFile = chordType.toLowerCase();
    const soundFilePath = `/sounds/${instrument}/${rootForFile}-${chordForFile}.mp3`;

    const audio = new Audio(soundFilePath);
    audioRefs.current = audio;

    audio.play().catch(() => {
      setIsPlaying(false);
      // optionally handle error in audio playback or file not found
    });

    // When audio ends
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  // Get guitar chord image path
  const getGuitarChordImage = () => {
    // Format the chord name for the image file
    // Replace # with 'sharp' and convert to lowercase
    const formattedRoot = rootNote.replace('#', 'sharp').toLowerCase();
    const formattedType = chordType.toLowerCase();

    // Construct image path
    const imagePath = `/guitarchords/${formattedRoot}-${formattedType}.jpg`;

    return imagePath;
  };

  // Render full-width piano keys with accurate layout
  const renderPianoKeys = () => {
    const chordNotes = getChordNotes(); // যেমন ["C", "E", "G"]

    const octaveKeys = [
      { note: "C", type: "white" },
      { note: "C#", type: "black" },
      { note: "D", type: "white" },
      { note: "D#", type: "black" },
      { note: "E", type: "white" },
      { note: "F", type: "white" },
      { note: "F#", type: "black" },
      { note: "G", type: "white" },
      { note: "G#", type: "black" },
      { note: "A", type: "white" },
      { note: "A#", type: "black" },
      { note: "B", type: "white" },
    ];

    // octave generator
    const generateKeys = (octaves = 1) => {
      let keys = [];
      for (let i = 0; i < octaves; i++) {
        keys.push(
          ...octaveKeys.map((k) => ({
            ...k,
            note: k.note + (4 + i), // যেমন C4, C5
            index: i * octaveKeys.length + octaveKeys.indexOf(k), // absolute index
          }))
        );
      }
      return keys;
    };

    const renderKeys = (pianoKeys) => {
      const whiteKeys = pianoKeys.filter((k) => k.type === "white");

      return (
        <div className="flex relative w-full h-40">
          {/* White keys */}
          {whiteKeys.map((key, i) => {
            const baseNote = key.note.replace(/[0-9]/g, "");
            const isActive = chordNotes.includes(baseNote);

            return (
              <div
                key={key.note}
                className="relative border border-gray-400"
                style={{
                  flex: "1 1 0", // equally distributed
                  backgroundColor: isActive ? "#facc15" : "white",
                  borderBottomLeftRadius: "6px",
                  borderBottomRightRadius: "6px",
                  transition: "0.2s ease",
                }}
              >
                <span className="absolute bottom-1 w-full text-center text-xs sm:text-sm font-bold text-black select-none">
                  {key.note}
                </span>
              </div>
            );
          })}

          {/* Black keys */}
          {pianoKeys
            .filter((k) => k.type === "black")
            .map((key) => {
              const baseNote = key.note.replace(/[0-9]/g, "");
              const isActive = chordNotes.includes(baseNote);

              // কোন white key এর পরে বসবে সেটা বের করা
              const whiteIndexBefore = whiteKeys.findIndex(
                (w, idx) =>
                  w.index > key.index && idx > 0
              ) - 1;

              const percentPerWhite = 100 / whiteKeys.length;

              return (
                <div
                  key={key.note}
                  className="absolute"
                  style={{
                    left: `${(whiteIndexBefore + 1) * percentPerWhite - percentPerWhite / 3}%`,
                    width: `${percentPerWhite / 1.5}%`,
                    height: "60%",
                    backgroundColor: isActive ? "#ea580c" : "black",
                    borderRadius: "0 0 6px 6px",
                    zIndex: 10,
                    transition: "0.2s ease",
                  }}
                  title={key.note}
                >
                  <span className="absolute bottom-1 w-full text-center text-[10px] font-bold text-white select-none">
                    {key.note}
                  </span>
                </div>
              );
            })}
        </div>
      );
    };

    return (
      <div className="w-full">
        {/* Mobile → ১ octave */}
        <div className="flex md:hidden">{renderKeys(generateKeys(1))}</div>

        {/* Desktop → ২ octave */}
        <div className="hidden md:flex">{renderKeys(generateKeys(2))}</div>
      </div>
    );
  };

  // Render guitar chord image
  const renderGuitarChord = () => {
    const chordImagePath = getGuitarChordImage();

    return (
      <div className="w-full flex flex-col items-center justify-center p-6 bg-white rounded-lg">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {rootNote} {chordType.charAt(0).toUpperCase() + chordType.slice(1)} Chord
          </h3>
          <p className="text-gray-600">Guitar Fingering Diagram</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-inner max-w-sm w-full">
          <img
            src={chordImagePath}
            alt={`${rootNote} ${chordType} guitar chord`}
            className="w-full h-auto max-w-xs mx-auto rounded-lg shadow-md"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.target.style.display = 'none';
              const fallbackDiv = document.getElementById('chord-fallback');
              if (fallbackDiv) fallbackDiv.style.display = 'block';
            }}
          />

          {/* Fallback message if image not found */}
          <div
            id="chord-fallback"
            className="hidden text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <p className="text-yellow-700 font-semibold mb-2">Chord diagram not available</p>
            <p className="text-yellow-600 text-sm">
              The {rootNote} {chordType} chord image is not available in the library.
            </p>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Chord: <span className="font-mono font-bold">{rootNote} {chordType}</span></p>
          <p className="mt-1">Notes: <span className="font-semibold">{getChordNotes().join(' - ')}</span></p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className=" mx-auto p-4 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <div className="w-full max-w-screen-lg text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Chord Finder</h1>
          <p className="text-lg text-gray-700">Visualize and play piano and guitar chords</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 place-items-center gap-3 max-w-screen-lg w-full mb-8">
          <div className="flex flex-col min-w-[160px]">
            <label htmlFor="root-note" className="mb-1 font-semibold text-gray-700">Root Note:</label>
            <select
              id="root-note"
              value={rootNote}
              onChange={e => setRootNote(e.target.value)}
              className="p-3 border border-gray-300 rounded-md bg-white cursor-pointer"
            >
              {notes.map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col min-w-[160px]">
            <label htmlFor="chord-type" className="mb-1 font-semibold text-gray-700">Chord Type:</label>
            <select
              id="chord-type"
              value={chordType}
              onChange={e => setChordType(e.target.value)}
              className="p-3 border border-gray-300 rounded-md bg-white cursor-pointer"
            >
              {chordTypes.map(type => (
                <option key={type.value} value={type.value}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col min-w-[160px]">
            <label htmlFor="instrument" className="mb-1 font-semibold text-gray-700">Instrument:</label>
            <select
              id="instrument"
              value={instrument}
              onChange={e => setInstrument(e.target.value)}
              className="p-3 border border-gray-300 rounded-md bg-white cursor-pointer"
            >
              <option value="piano">Piano</option>
              <option value="guitar">Guitar</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className={`px-8 py-3 w-40 rounded-md font-semibold transition-colors ${isPlaying ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              onClick={playChord}
              disabled={isPlaying}
            >
              {isPlaying ? 'Playing... ' : 'Play Chord'}
            </button>
          </div>
        </div>

        <div className="w-full max-w-screen-lg bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{rootNote} {chordTypes.find(t => t.value === chordType)?.name}</h2>
            <p className="text-xl text-gray-600 select-none">
              Notes: {getChordNotes().join(' - ')}
            </p>
          </div>

          <div className="w-full border-2 rounded-lg overflow-hidden">
            {instrument === 'piano' ? renderPianoKeys() : renderGuitarChord()}
          </div>
        </div>
      </div>
      <div className="mt-12 bg-gray-50 rounded-lg p-6 shadow-md">
  <h3 className="text-2xl font-bold text-gray-800 mb-4">
    What is the chord finder tool?
  </h3>

  <div className="space-y-4 text-gray-700">
    <p>
      The chord finder tool helps musicians visualize and play chords on different instruments such as piano and guitar.
      It displays the notes that make up the chord and shows how to finger the chord on a guitar or which keys to press on a piano.
    </p>

    <p>
      Users can select the root note and chord type (such as major or minor) along with the instrument.
      The tool then highlights the notes of that chord on an accurate instrument diagram.
    </p>

    <p className="font-semibold text-gray-800">
      The chord finder tool can assist you in:
    </p>

    <ul className="list-disc list-inside space-y-2 ml-4">
      <li>
        <strong>Learning new chords.</strong> Discover how chords are formed and where to play them on a guitar or piano.
      </li>
      <li>
        <strong>Visualizing chords.</strong> See the individual notes and finger positions that create each chord.
      </li>
      <li>
        <strong>Playing chords.</strong> Listen to the chord sounds for piano or guitar directly from the tool to better understand their tone.
      </li>
      <li>
        <strong>Enhancing composition.</strong> Quickly experiment with different chords and hear how they sound to inspire songwriting.
      </li>
    </ul>

    <p>
      The tool provides an interactive and educational way to explore music theory concepts with practical applications on real instruments.
    </p>

    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-bold text-blue-800 mb-2">Using the chord finder</h4>
      <p className="text-blue-700">
        Select the root note and chord type to display the chord diagram for piano or guitar.
        The chord notes will be highlighted on the instrument visual.
      </p>
      <p className="text-blue-700 mt-2">
        Click the "Play Chord" button to hear how the chord sounds. Change the instrument option to switch between piano and guitar sounds.
      </p>
      <p className="text-blue-700 mt-2">
        Use the chord diagrams to practice finger placement and improve your playing skills.
      </p>
    </div>
  </div>
</div>

    </div>
  );
};

export default ChordFinder;