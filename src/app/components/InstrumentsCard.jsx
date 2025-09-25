"use client";

import { Card } from '@/components/ui/card';
import { Guitar, Piano, Drum } from 'lucide-react';

const Text = ({ children, className = '', ...props }) => {
    return (
        <p className={`text-base ${className}`} {...props}>
            {children}
        </p>
    );
};

const InstrumentsCard = ({ isVisible = true }) => {
    const instruments = [
        { icon: <Guitar className="h-8 w-8" />, label: 'Guitar' },
        { icon: <Piano className="h-8 w-8" />, label: 'Piano' },
        { icon: <Drum className="h-8 w-8" />, label: 'Drums' },
    ];

    return (
        <div className={`transition-all p-6   duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>

            <Card className="  backdrop-blur-lg border-black/20   rounded-3xl p-4  pb-8 flex-col">

                {/* <Text className="text-black text-center text-xl  mb-6">
                      𝕻𝖔𝖕𝖚𝖑𝖆𝖗 𝕴𝖓𝖘𝖙𝖗𝖚𝖒𝖊𝖓𝖙𝖘
                </Text> */}
                <h1 className="text-black text-center lg:text-5xl text-2xl  mb-6">  𝕻𝖔𝖕𝖚𝖑𝖆𝖗 𝕴𝖓𝖘𝖙𝖗𝖚𝖒𝖊𝖓𝖙𝖘 </h1>


                <div className="grid grid-cols-3 gap-4 ">
                    {instruments.map((instrument, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer "
                            aria-label={`Learn ${instrument.label}`}
                        >
                            <div className="bg-gradient-to-br from-black/10 to-black/5 p-6 rounded-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:from-black/20 group-hover:to-black/10 border border-black/10 group-hover:border-black/30">
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="  group-hover:text-black-200 transition-colors duration-300">
                                        {instrument.icon}
                                    </div>
                                    <Text className="  group-hover:text-black-200 font-medium transition-colors duration-300">
                                        {instrument.label}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Featured Course Card */}
                <div className="  lg:mt-8  bg-gradient-to-r from-black/10 to-black/5 p-6 rounded-2xl border border-black/20">
                    <Text className="  font-semibold text-center">
                        🎼 Beginner-friendly courses starting at $19.99
                    </Text>
                    <Text className="text-black-300 text-sm text-center mt-2  ">
                        No prior experience required. Start from scratch!
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default InstrumentsCard;