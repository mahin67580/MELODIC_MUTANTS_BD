"use client";

import { useState, useEffect, useRef } from "react";

const Metronome = () => {
    // UI state
    const [isPlaying, setIsPlaying] = useState(false);
    const [tempo, setTempo] = useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [currentBeat, setCurrentBeat] = useState(0);

    // Audio and timing refs
    const audioCtxRef = useRef(null);
    const accentBufferRef = useRef(null);
    const regularBufferRef = useRef(null);
    const schedulerTimerRef = useRef(null);
    const nextNoteTimeRef = useRef(0);
    const currentBeatRef = useRef(0);

    const lookahead = 0.1; // seconds to schedule ahead
    const scheduleIntervalMs = 25; // ms

    // Initialize and load audio buffers
    const initAudio = async () => {
        if (!audioCtxRef.current) {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            audioCtxRef.current = ctx;

            const loadBuffer = async (url) => {
                const res = await fetch(url);
                const arr = await res.arrayBuffer();
                return await ctx.decodeAudioData(arr);
            };

            try {
                regularBufferRef.current = await loadBuffer("/sounds/accent.wav");
                accentBufferRef.current = await loadBuffer("/sounds/regular.wav");
            } catch (err) {
                console.error("Error loading sound files", err);
            }
        }
    };

    // Play a scheduled click
    const playClick = (time, isAccent) => {
        const ctx = audioCtxRef.current;
        const buffer = isAccent ? accentBufferRef.current : regularBufferRef.current;
        if (!ctx || !buffer) return;
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.value = isAccent ? 1 : 0.9;
        src.connect(gain);
        gain.connect(ctx.destination);
        src.start(time);
    };

    // Advance to next note
    const nextNote = () => {
        const secondsPerBeat = 60.0 / tempo;
        nextNoteTimeRef.current += secondsPerBeat;
        currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
    };

    // Scheduler
    const scheduler = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
            const isAccent = currentBeatRef.current === 0;
            const beat = currentBeatRef.current;

            // Schedule audio
            playClick(nextNoteTimeRef.current, isAccent);

            // Schedule visual update
            setTimeout(() => setCurrentBeat(beat), (nextNoteTimeRef.current - ctx.currentTime) * 1000);

            nextNote();
        }

        schedulerTimerRef.current = setTimeout(scheduler, scheduleIntervalMs);
    };

    // Start/stop logic
    const start = async () => {
        await initAudio();

        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") await ctx.resume();

        currentBeatRef.current = 0;
        nextNoteTimeRef.current = ctx.currentTime + 0.05;
        setIsPlaying(true);
        scheduler();
    };

    const stop = () => {
        if (schedulerTimerRef.current) clearTimeout(schedulerTimerRef.current);
        setIsPlaying(false);
        setCurrentBeat(0);
    };

    const toggle = () => {
        if (isPlaying) stop();
        else start();
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (schedulerTimerRef.current) clearTimeout(schedulerTimerRef.current);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    // Tempo and time-signature change
    const handleTempoChange = (val) => setTempo(Math.max(20, Math.min(300, val)));
    const handleBeatsChange = (val) => {
        const clamped = Math.max(1, Math.min(12, val));
        setBeatsPerMeasure(clamped);
        if (currentBeat >= clamped) setCurrentBeat(0);
    };

    // Beat indicators
    const renderBeatIndicators = () =>
        Array.from({ length: beatsPerMeasure }, (_, i) => (
            <div
                key={i}
                className={`beat-indicator ${i === currentBeat ? "active" : ""} ${i === 0 ? "accent" : ""
                    }`}
            >
                <span className="beat-number">{i + 1}</span>
            </div>
        ));

    return (
        <div className="grid grid-cols-1 gap-4 p-4">
        
            <div className="   ">
                <div className="metronome-header">
                    <h2>Metronome</h2>
                </div>

                <div className="beat-indicators">{renderBeatIndicators()}</div>

                {/* Tempo Control */}
                <div className="tempo-control">
                    <label htmlFor="tempo-slider">Tempo: {tempo} BPM</label>
                    <div className="tempo-slider-container">
                        <button
                            onClick={() => handleTempoChange(tempo - 5)}
                            disabled={tempo <= 20}
                            className="tempo-btn"
                        >
                            -5
                        </button>
                        <input
                            id="tempo-slider"
                            type="range"
                            min="20"
                            max="300"
                            value={tempo}
                            onChange={(e) => handleTempoChange(Number(e.target.value))}
                            className="tempo-slider"
                        />
                        <button
                            onClick={() => handleTempoChange(tempo + 5)}
                            disabled={tempo >= 300}
                            className="tempo-btn"
                        >
                            +5
                        </button>
                    </div>
                    <div className="tempo-display">
                        <button onClick={() => handleTempoChange(tempo - 1)} disabled={tempo <= 20}>
                            -
                        </button>
                        <span>{tempo} BPM</span>
                        <button onClick={() => handleTempoChange(tempo + 1)} disabled={tempo >= 300}>
                            +
                        </button>
                    </div>
                </div>

                {/* Time Signature */}
                <div className="time-signature-control">
                    <label>Time Signature:</label>
                    <div className="time-signature-buttons">
                        {[2, 3, 4, 5, 6, 7].map((beats) => (
                            <button
                                key={beats}
                                onClick={() => handleBeatsChange(beats)}
                                className={beatsPerMeasure === beats ? "active" : ""}
                            >
                                {beats}/4
                            </button>
                        ))}
                    </div>
                </div>

                {/* Play Button */}
                <div className="play-control">
                    <button onClick={toggle} className={`play-button ${isPlaying ? "playing" : ""}`}>
                        {isPlaying ? "Stop" : "Start"}
                    </button>
                </div>

                {/* Same CSS as your version */}
                <style jsx>{`
        .metronome-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
        }
        .metronome-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .metronome-header h2 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }
        .beat-indicators {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin: 30px 0;
          flex-wrap: wrap;
        }
        .beat-indicator {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
          border: 3px solid transparent;
        }
        .beat-indicator.active {
          transform: scale(1.2);
        }
        .beat-indicator.accent {
          border-color: #ff6b6b;
        }
        .beat-indicator.accent.active {
          background: #ff4757;
          box-shadow: 0 0 15px rgba(255, 71, 87, 0.7);
        }
        .beat-indicator:not(.accent).active {
          background: #4ecdc4;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.7);
        }
        .beat-number {
          font-weight: bold;
          color: #333;
          font-size: 16px;
        }
        .beat-indicator.active .beat-number {
          color: white;
        }
        .tempo-control {
          text-align: center;
          margin: 20px 0;
        }
        .tempo-control label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
          color: #333;
          font-size: 18px;
        }
        .tempo-slider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 15px 0;
        }
        .tempo-slider {
          flex: 1;
          max-width: 300px;
        }
        .tempo-btn {
          padding: 8px 12px;
          background: #4ecdc4;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .tempo-btn:hover:not(:disabled) {
          background: #45b7af;
        }
        .tempo-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-top: 10px;
        }
        .tempo-display span {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        .time-signature-control {
          text-align: center;
          margin: 20px 0;
        }
        .time-signature-control label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
          color: #333;
          font-size: 18px;
        }
        .time-signature-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .time-signature-buttons button {
          padding: 10px 16px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: bold;
        }
        .time-signature-buttons button.active {
          background: #4ecdc4;
          color: white;
          border-color: #4ecdc4;
        }
        .play-control {
          text-align: center;
          margin-top: 30px;
        }
        .play-button {
          padding: 15px 50px;
          font-size: 20px;
          font-weight: bold;
          border: none;
          border-radius: 30px;
          background: #4ecdc4;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .play-button.playing {
          background: #ff6b6b;
        }
        .play-button:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
      `}</style>


            </div>

             <div className=" ">
                {/* About Metronome Section */}
                <div className="mt-8 border-t pt-4 text-gray-800 leading-relaxed">
                    <h3 className="text-xl font-semibold mb-2">About the Metronome</h3>
                    <p className="mb-3">
                        <strong>What is a metronome?</strong><br />
                        A metronome is a device that produces a steady pulse to help musicians play in time. The pulse is measured in
                        BPM (beats-per-minute). A tempo marking of 60 BPM equals one beat per second, while 120 BPM equals two beats
                        per second.
                    </p>
                    <p className="mb-3">
                        A metronome is commonly used as a practice tool to help maintain a steady tempo while learning difficult
                        passages. It is also used in live performances and recording studios to ensure an accurate tempo throughout
                        the performance or session.
                    </p>
                    <p className="mb-3">
                        <strong>Using the metronome</strong><br />
                        Start by selecting a tempo using the slider or, the left and right arrow keys on your keyboard. Alternately,
                        you can tap the tempo by clicking the "Tap tempo" button at the desired tempo or by using the "t" key on your
                        keyboard.
                    </p>
                    <p className="mb-3">
                        Select the number of beats per measure at the bottom. Most music has 4, 3 or 2 beats per measure, in music
                        notation denoted by time signatures such as 4/4, 3/4, 2/4 and 2/2. You can always select 1 if you don't know
                        the number of beats per measure.
                    </p>
                    <div className="mb-3">
                        You can use the metronome to:
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>
                                <strong>Find the tempo indicated in the score:</strong> Set the metronome to the indicated tempo,
                                establish the tempo, and stop the metronome before you start playing.
                            </li>
                            <li>
                                <strong>Learn to play in time:</strong> Activate the mute function at the bottom, and set the metronome to
                                play 3 bars and mute 1 bar. Play a piece you know well and keep the tempo in the muted bar.
                            </li>
                            <li>
                                <strong>Improve your playing technique:</strong> Start at a slow practice tempo and gradually increase the
                                tempo when you can play the piece without any mistakes.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Metronome;
