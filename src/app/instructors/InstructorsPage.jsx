"use client";

import { useState } from "react";
import { FaGuitar, FaAward, FaUserTie } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { useRouter } from "next/navigation"; // <-- added
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function InstructorsPage({ instructors }) {
  const router = useRouter(); // <-- added
  const [search, setSearch] = useState("");
  const [instrument, setInstrument] = useState("all");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [loadingId, setLoadingId] = useState(null); // <-- track which profile button is loading

  const instrumentOptions = [
    "Acoustic Guitar",
    "Electric Guitar",
    "Classical Guitar",
    "Bass Guitar",
    "Piano / Keyboard",
    "Drums / Percussion",
    "Violin",
    "Cello",
    "Flute",
    "Saxophone",
    "Clarinet",
    "Trumpet",
    "Trombone",
    "Vocals (Singing)",
    "Ukulele",
    "Harmonica",
    "Banjo",
    "Tabla / Hand Drums",
    "Digital Music Production"
  ];

  const filtered = instructors.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase()) ||
      inst.bio.toLowerCase().includes(search.toLowerCase());

    const matchesInstrument =
      instrument === "all" || inst.instrument === instrument;

    return matchesSearch && matchesInstrument;
  });

  const clearFilters = () => {
    setSearch("");
    setInstrument("all");
    setMinExp("");
    setMaxExp("");
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // small inline spinner (SVG) — you can replace with your UI lib spinner if available
  const Spinner = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" />
      </path>
    </svg>
  );

  return (
    <div className="px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl lg:text-6xl font-bold mb-3">
          𝕸𝖊𝖊𝖙 𝕺𝖚𝖗 𝕴𝖓𝖘𝖙𝖗𝖚𝖈𝖙𝖔𝖗𝖘
        </h1>
        <p className="text-muted-foreground">
          Discover talented music instructors ready to guide your musical journey
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaGuitar className="text-primary" />
            Filter Instructors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              type="text"
              placeholder="Search by name, email or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={instrument} onValueChange={setInstrument}>
              <SelectTrigger>
                <SelectValue placeholder="All Instruments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                {instrumentOptions.map((inst) => (
                  <SelectItem key={inst} value={inst}>
                    {inst}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={clearFilters}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center justify-between">
        <Badge variant="secondary">
          {filtered.length} {filtered.length === 1 ? 'instructor' : 'instructors'} found
        </Badge>

        {filtered.length !== instructors.length && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Show all instructors
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No instructors found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((inst) => (
            // NOTE: removed <Link> wrapper. We will handle navigation manually to control spinner.
            <Card
              key={inst._id}
              className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300"
              onClick={() => {
                // navigate if user clicks anywhere on the card (no spinner)
                router.push(`/instructors/${inst._id}`);
              }}
              role="button"
            >
              <CardHeader className="text-center">
                <div className="flex items-center gap-7">
                  <Avatar className="h-30 w-30 border-4 border-background shadow-lg">
                    <AvatarImage className={"object-cover"} src={inst.image || ""} alt={inst.name} />
                    <AvatarFallback className="text-2xl font-bold ">
                      {getInitials(inst.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors ">
                      {inst.name}
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-1">
                      <MdOutlineEmail className="flex-shrink-0" />
                      {inst.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground text-justify line-clamp-3">
                  {inst.bio}
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FaGuitar className="w-3 h-3" />
                    {inst.instrument}
                  </Badge>

                  <Badge variant="outline">
                    🎵 {inst.experienceYears} years
                  </Badge>
                </div>

                <div className="pt-4 border-t">
                  {/* Important: stop propagation to prevent card's onClick also running */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent the card's onClick
                      if (loadingId) return; // prevent multiple clicks when another is loading
                      setLoadingId(inst._id);
                      // navigate
                      router.push(`/instructors/${inst._id}`);
                    }}
                    disabled={!!loadingId} // disable when any profile is loading
                  >
                    {loadingId === inst._id ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner className="inline-block" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "View Profile →"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
