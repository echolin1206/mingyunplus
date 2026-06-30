import { useState, useEffect } from 'react';
import { KeyRound, Check, X, Sparkles, Crown, Zap, Loader2 } from 'lucide-react';
import { getCurrentUser, setUserMember } from './Login';

interface CodeConfig {
  type: 'single' | 'lifetime';
  used: boolean;
}

let activationCodes: Record<string, CodeConfig> = {};
let codesLoaded = false;

function getUsedCodes(): string[] {
  try {
    return JSON.parse(localStorage.getItem('used_codes') || '[]');
  } catch {
    return [];
  }
}

function markCodeUsed(code: string) {
  const used = getUsedCodes();
  if (!used.includes(code)) {
    used.push(code);
    localStorage.setItem('used_codes', JSON.stringify(used));
  }
}

function isCodeUsed(code: string): boolean {
  return getUsedCodes().includes(code);
}

export default function Activate() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<'idle' | 'success' | 'error' | 'used' | 'loading'>('idle');
  const [resultMsg, setResultMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [codesLoading, setCodesLoading] = useState(true);

  // 加载激活码
  useEffect(() => {
    if (codesLoaded) {
      setCodesLoading(false);
      return;
    }
    fetch('/codes.json')
      .then((res) => res.json())
      .then((data) => {
        activationCodes = data;
        codesLoaded = true;
        setCodesLoading(false);
      })
      .catch(() => {
        setResult('error');
        setResultMsg('激活码数据加载失败，请刷新页面重试');
        setCodesLoading(false);
      });
  }, []);

  const handleActivate = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setResult('error');
      setResultMsg('请输入激活码');
      return;
    }

    const config = activationCodes[trimmed];
    if (!config) {
      setResult('error');
      setResultMsg('激活码无效，请联系客服获取');
      return;
    }

    if (isCodeUsed(trimmed)) {
      setResult('used');
      setResultMsg('该激活码已被使用');
      return;
    }

    markCodeUsed(trimmed);
    setUserMember(config.type);
    setResult('success');
    setResultMsg(
      config.type === 'lifetime'
        ? '终身会员激活成功！你已解锁全部测算功能'
        : '单次测算已激活！你可以进行一次完整测算'
    );
    setCurrentUser(getCurrentUser());
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 flex items-center justify-center" style={{ background: '#051d1f' }}>
      <div className="liquid-glass rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <KeyRound className="w-8 h-8 text-[#efb6ff] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#f6f9ff] mb-1">激活会员</h1>
          <p className="text-sm text-[rgba(246,249,255,0.5)]">输入客服提供的激活码</p>
        </div>

        {codesLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-[#efb6ff] animate-spin mx-auto mb-3" />
            <p className="text-sm text-[rgba(246,249,255,0.5)]">加载激活码数据...</p>
          </div>
        ) : result === 'success' ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#00c896]" />
            </div>
            <h3 className="text-lg font-bold text-[#f6f9ff] mb-2">{resultMsg}</h3>
            <button
              onClick={() => window.location.href = '/premium'}
              className="w-full py-3 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors mt-4"
            >
              去使用
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setResult('idle');
                }}
                placeholder="输入激活码（如：MY-VIP-001）"
                className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl px-4 py-3 text-[#f6f9ff] placeholder:text-[rgba(246,249,255,0.3)] focus:outline-none focus:border-[#efb6ff] transition-colors text-center tracking-wider uppercase"
              />
            </div>

            {(result === 'error' || result === 'used') && (
              <div className="mb-4 p-3 rounded-xl bg-[rgba(255,100,100,0.1)] border border-[rgba(255,100,100,0.15)] flex items-center gap-2">
                <X className="w-4 h-4 text-[#ff6464] flex-shrink-0" />
                <p className="text-sm text-[#ff6464]">{resultMsg}</p>
              </div>
            )}

            <button
              onClick={handleActivate}
              disabled={codesLoading}
              className="w-full py-4 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors disabled:opacity-50"
            >
              立即激活
            </button>

            <div className="mt-6 p-4 rounded-xl bg-[rgba(239,182,255,0.05)] border border-[rgba(239,182,255,0.1)]">
              <h4 className="text-sm font-semibold text-[#efb6ff] mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                如何获取激活码
              </h4>
              <ol className="text-xs text-[rgba(246,249,255,0.6)] space-y-2 list-decimal list-inside">
                <li>扫码付款 ¥9.9 或 ¥39</li>
                <li>添加客服微信 <span className="text-[#efb6ff]">kaiyunbao888</span></li>
                <li>发送付款截图给客服</li>
                <li>客服发送激活码给你</li>
                <li>在此页面输入激活码即可</li>
              </ol>
            </div>

            {currentUser && (
              <div className="mt-4 text-center">
                <p className="text-xs text-[rgba(246,249,255,0.4)]">
                  当前用户：{currentUser.username}
                  {currentUser.memberType === 'lifetime' ? (
                    <span className="text-[#efb6ff] ml-1">（终身会员）</span>
                  ) : currentUser.memberType === 'single' ? (
                    <span className="text-[#00c896] ml-1">（单次可用）</span>
                  ) : (
                    <span className="text-[rgba(246,249,255,0.4)] ml-1">（普通用户）</span>
                  )}
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[rgba(246,249,255,0.03)] text-center">
            <Zap className="w-5 h-5 text-[#efb6ff] mx-auto mb-1" />
            <p className="text-xs text-[rgba(246,249,255,0.5)]">单次测算</p>
            <p className="text-lg font-bold text-[#f6f9ff]">¥9.9</p>
          </div>
          <div className="p-3 rounded-xl bg-[rgba(246,249,255,0.03)] text-center">
            <Crown className="w-5 h-5 text-[#efb6ff] mx-auto mb-1" />
            <p className="text-xs text-[rgba(246,249,255,0.5)]">终身会员</p>
            <p className="text-lg font-bold text-[#f6f9ff]">¥39</p>
          </div>
        </div>
      </div>
    </div>
  );
}
