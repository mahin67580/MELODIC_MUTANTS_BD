"use client";

import { useState } from "react";
import { FaGuitar, FaAward, FaUserTie } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Link from "next/link";

export default function InstructorsPage({ instructors }) {
  const [search, setSearch] = useState("");
  const [instrument, setInstrument] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");

  // ✅ Filtering logic
  const filtered = instructors.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase()) ||
      inst.bio.toLowerCase().includes(search.toLowerCase());

    const matchesInstrument =
      instrument === "" ||
      inst.instrument.toLowerCase() === instrument.toLowerCase();

    const matchesExperience =
      (!minExp || inst.experienceYears >= Number(minExp)) &&
      (!maxExp || inst.experienceYears <= Number(maxExp));

    return matchesSearch && matchesInstrument && matchesExperience;
  });

  // ✅ Unique instruments
  const instruments = [...new Set(instructors.map((i) => i.instrument))];

  // ✅ Reset filters
  const clearFilters = () => {
    setSearch("");
    setInstrument("");
    setMinExp("");
    setMaxExp("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Meet Our Instructors
      </h1>

      {/* 🔹 Filters */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Search by name, email or bio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />

        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">All Instruments</option>
          {instruments.map((inst) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
{/* 
        <input
          type="number"
          placeholder="Min Experience"
          value={minExp}
          onChange={(e) => setMinExp(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />

        <input
          type="number"
          placeholder="Max Experience"
          value={maxExp}
          onChange={(e) => setMaxExp(e.target.value)}
          className="border rounded-lg p-2 w-full"
        /> */}

        <button
          onClick={clearFilters}
          className=" bg-blue-500 hover:bg-gray-300  hover:translate-0.5  rounded-lg p-2 w-full"
        >
          Clear Filters
        </button>
      </div>

      {/* 🔹 Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No instructors found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((inst) => (
            <Link key={inst._id} href={`/instructors/${inst._id}`}>
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <img
                  src={inst.image || "/default-avatar.png"}
                  alt={inst.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaUserTie className="text-green-600" /> {inst.name}
                  </h2>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <MdOutlineEmail className="text-gray-500" /> {inst.email}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {inst.bio}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <span className="flex items-center gap-1">
                      <FaGuitar className="text-green-600" />
                      {inst.instrument}
                    </span>
                    <span className="flex items-center gap-1">
                      🎵 {inst.experienceYears} yrs
                    </span>
                  </div>
                  {inst.achievements && (
                    <p className="text-sm flex items-center gap-2 text-gray-600">
                      <FaAward className="text-yellow-500" />{" "}
                      {inst.achievements}
                    </p>
                  )}
                  <span className="text-green-600 text-sm hover:underline block">
                    View Profile →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
