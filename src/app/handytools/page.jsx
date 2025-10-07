import ChordFinder from '@/components/ChordFinder/ChordFinder'
import CircleOfFifths from '@/components/CircleOfFifths'
import Metronome from '@/components/metronome'
import ScaleFinder from '@/components/ScaleFinder'
import React from 'react'

export default function tools() {
    return (
        <div className='min-h-screen'>tools

            <Metronome />
            {/* <ChordFinder /> */}
            {/* <CircleOfFifths /> */}
            {/* <ScaleFinder /> */}
        </div>
    )
}
