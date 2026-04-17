/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import NeonBackground from './components/NeonBackground';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg font-sans text-text-main">
      <NeonBackground />
      
      {/* Top Bar */}
      <motion.header 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-[60px] flex items-center justify-between px-10 border-b panel-border-cyan bg-gradient-to-r from-panel to-bg z-50"
      >
        <div className="font-mono font-black text-xl tracking-[2px] text-neon-cyan neon-text-cyan uppercase">
          SYNTH.SNAKE_v1.0
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-[11px] font-sans uppercase tracking-[1.5px] text-text-muted">
            CPU LOAD: 14% // SYS_READY
          </div>
        </div>
      </motion.header>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-[320px_1fr] overflow-hidden bg-neon-magenta/5">
        {/* Music Sidebar */}
        <motion.aside 
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          className="bg-panel p-8 border-r panel-border-cyan flex flex-col overflow-hidden z-20 shadow-xl"
        >
          <MusicPlayer />
        </motion.aside>

        {/* Game Stage */}
        <main className="relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#151520_0%,_#08080B_100%)] overflow-hidden">
          <SnakeGame />
        </main>
      </div>
    </div>
  );
}
