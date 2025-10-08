'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  Guitar, 
  Circle, 
  Music,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  {
    name: 'Metronome',
    component: 'metronome',
    icon: Clock,
  },
  {
    name: 'Chord Finder',
    component: 'chordFinder',
    icon: Guitar,
  },
  {
    name: 'Circle of Fifths',
    component: 'circleOfFifths',
    icon: Circle,
  },
  {
    name: 'Scale Finder',
    component: 'scaleFinder',
    icon: Music,
  },
];

export default function ToolsLayout({ children }) {
  const [activeComponent, setActiveComponent] = useState('metronome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, sidebar is open by default
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (component) => {
    setActiveComponent(component);
    // Close sidebar on mobile after selecting an item
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-20  border-2 shadow-2xl right-0 z-50 bg-card border-b h-14 flex items-center justify-end px-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-card-foreground hover:bg-accent hover:text-accent-foreground  "
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {/* <h1 className="ml-3 text-xl font-bold text-card-foreground  ">Music Tools</h1> */}
        </div>
      )}

      {/* Sidebar Navigation */}
      <div
        className={cn(
          'bg-card border-r transition-all duration-300 ease-in-out z-40 flex flex-col',
          isMobile
            ? 'fixed inset-y-0 left-0 w-64 transform'
            : 'relative w-64',
          isMobile && !isSidebarOpen && '-translate-x-full',
          isMobile && isSidebarOpen && 'translate-x-0',
          !isMobile && !isSidebarOpen && 'w-0 -ml-64',
          !isMobile && isSidebarOpen && 'w-64 ml-0'
        )}
        style={
          isMobile
            ? { top: '56px', height: 'calc(100vh - 56px)' }
            : { height: '100vh' }
        }
      >
        {/* Desktop Toggle Button */}
      

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header - only show when sidebar is open or on desktop */}
          {(isSidebarOpen || !isMobile) && (
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-card-foreground">Music Tools</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Essential tools for musicians
              </p>
            </div>
          )}
          
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.component)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors',
                    activeComponent === item.component
                      ? 'bg-primary text-primary-foreground'
                      : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-2xl  bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 transition-all duration-300 min-h-screen',
          isMobile ? 'pt-14' : '',
          !isMobile && !isSidebarOpen ? 'ml-0' : 'ml-0'
        )}
      >
        <div className={isMobile ? 'p-4' : 'p-8'}>
          <ToolsContent activeComponent={activeComponent} />
        </div>
      </div>
    </div>
  );
}

// Component to render the active tool
function ToolsContent({ activeComponent }) {
  const [components] = useState({
    metronome: React.lazy(() => import('@/components/metronome')),
    chordFinder: React.lazy(() => import('@/components/ChordFinder/ChordFinder')),
    circleOfFifths: React.lazy(() => import('@/components/CircleOfFifths')),
    scaleFinder: React.lazy(() => import('@/components/ScaleFinder')),
  });

  const ActiveComponent = components[activeComponent];

  return (
    <div className=" ">
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <ActiveComponent />
      </React.Suspense>
    </div>
  );
}