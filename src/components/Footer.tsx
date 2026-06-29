import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#020f10] pt-24 pb-12 px-6" style={{ minHeight: '40vh' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-[#efb6ff]" />
              <span className="text-5xl md:text-6xl font-bold tracking-tight text-[#f6f9ff]">
                命运加法
              </span>
            </div>
            <p className="text-[rgba(246,249,255,0.5)] text-lg leading-relaxed max-w-md">
              在星辰的指引下，发现属于你的命运轨迹。每一次测算，都是与宇宙对话的契机。
            </p>
          </div>
        </div>

        <div className="border-t border-[rgba(246,249,255,0.08)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[rgba(246,249,255,0.4)] text-xs">
            &copy; 2025 命运加法 mingyunplus.com. All rights reserved.
          </p>
          <p className="text-[rgba(246,249,255,0.3)] text-xs italic">
            命运无常，但算法永恒
          </p>
        </div>
      </div>
    </footer>
  );
}
