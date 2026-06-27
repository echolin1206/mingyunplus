import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#020f10] pt-24 pb-12 px-6" style={{ minHeight: '50vh' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
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

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-[#efb6ff] uppercase tracking-wider mb-4">
                服务
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="/zodiac" className="text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] transition-colors text-sm interactive">
                    星座运势
                  </a>
                </li>
                <li>
                  <a href="/destiny" className="text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] transition-colors text-sm interactive">
                    紫微命盘
                  </a>
                </li>
                <li>
                  <a href="/daily" className="text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] transition-colors text-sm interactive">
                    每日宜忌
                  </a>
                </li>
                <li>
                  <a href="/premium" className="text-[rgba(246,249,255,0.6)] hover:text-[#f6f9ff] transition-colors text-sm interactive">
                    会员中心
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#efb6ff] uppercase tracking-wider mb-4">
                关于
              </h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-[rgba(246,249,255,0.6)] text-sm">联系我们</span>
                </li>
                <li>
                  <span className="text-[rgba(246,249,255,0.6)] text-sm">隐私政策</span>
                </li>
                <li>
                  <span className="text-[rgba(246,249,255,0.6)] text-sm">服务条款</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(246,249,255,0.08)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[rgba(246,249,255,0.4)] text-xs">
            &copy; 2025 命运加法 mingyunpluse.com. All rights reserved.
          </p>
          <p className="text-[rgba(246,249,255,0.3)] text-xs italic">
            命运无常，但算法永恒
          </p>
        </div>
      </div>
    </footer>
  );
}
