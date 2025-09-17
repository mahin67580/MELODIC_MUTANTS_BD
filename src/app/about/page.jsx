'use client';

import { useState, useEffect } from 'react';
import { 
  FaMusic, 
  FaUsers, 
  FaGraduationCap, 
  FaAward, 
  FaHeart,
  FaGuitar,
  FaDrum
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const AboutUs = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Data for student growth chart
  const studentData = [
    { year: '2019', students: 500 },
    { year: '2020', students: 1200 },
    { year: '2021', students: 2500 },
    { year: '2022', students: 4500 },
    { year: '2023', students: 8000 },
  ];

  // Data for instrument distribution
  const instrumentData = [
    { name: 'Guitar', value: 45 },
    { name: 'Piano', value: 30 },
    { name: 'Drums', value: 15 },
    { name: 'Bass', value: 7 },
    { name: 'Violin', value: 3 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former concert pianist with 15+ years of teaching experience',
      icon: <FaMusic className="text-purple-500" /> // Replaced FaPiano with FaMusic
    },
    {
      name: 'Michael Chen',
      role: 'Head of Guitar Instruction',
      bio: 'Recording artist and Berklee College of Music graduate',
      icon: <FaGuitar className="text-red-500" />
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Percussion Director',
      bio: 'Session drummer with Broadway and studio recording credits',
      icon: <FaDrum className="text-blue-500" />
    },
    {
      name: 'David Kim',
      role: 'CTO',
      bio: 'Tech enthusiast and amateur jazz guitarist',
      icon: <FaMusic className="text-green-500" />
    }
  ];

  // Stats data
  const stats = [
    { icon: <FaUsers className="text-3xl" />, value: '10,000+', label: 'Happy Students' },
    { icon: <FaGraduationCap className="text-3xl" />, value: '50+', label: 'Professional Instructors' },
    { icon: <FaAward className="text-3xl" />, value: '15', label: 'Years Experience' },
    { icon: <FaHeart className="text-3xl" />, value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About Melodic Mutant Music Academy</h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto">
            Transforming music education through innovative technology and world-class instruction
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-4">
                At Melodic Mutant Music Academy, we believe that everyone deserves access to quality music education. 
                Our mission is to break down barriers to learning music by providing affordable, accessible, 
                and engaging lessons for students of all ages and skill levels.
              </p>
              <p className="text-lg">
                Through our innovative platform, we connect students with expert instructors, provide 
                personalized learning paths, and create a supportive community where musical dreams become reality.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-100 p-6 rounded-lg shadow-md">
                  <FaMusic className="text-4xl text-indigo-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Learn Anywhere</h3>
                  <p>Access lessons from any device, anytime</p>
                </div>
                <div className="bg-purple-100 p-6 rounded-lg shadow-md">
                  <FaUsers className="text-4xl text-purple-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Expert Teachers</h3>
                  <p>Learn from industry professionals</p>
                </div>
                <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                  <FaGraduationCap className="text-4xl text-blue-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Structured Curriculum</h3>
                  <p>Progress through carefully designed courses</p>
                </div>
                <div className="bg-pink-100 p-6 rounded-lg shadow-md">
                  <FaAward className="text-4xl text-pink-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Certification</h3>
                  <p>Earn recognized credentials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">By The Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4 text-indigo-600">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Growth & Impact</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-center">Student Growth Over Time</h3>
              <div className="h-80">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#8884d8" name="Total Students" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-center">Instrument Popularity</h3>
              <div className="h-80">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={instrumentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {instrumentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      {member.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                  <p className="text-indigo-600 text-center mb-3">{member.role}</p>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have discovered the joy of making music with our platform.
          </p>
          <button className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;