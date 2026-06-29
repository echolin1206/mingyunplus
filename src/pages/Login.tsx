import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, User, Lock, LogIn, UserPlus } from 'lucide-react';

interface UserData {
  username: string;
  email: string;
  memberType: 'none' | 'single' | 'lifetime';
  registerDate: number;
}

function getUsers(): Record<string, UserData> {
  try {
    return JSON.parse(localStorage.getItem('myusers') || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, UserData>) {
  localStorage.setItem('myusers', JSON.stringify(users));
}

export function getCurrentUser(): UserData | null {
  try {
    const u = localStorage.getItem('mycurrentuser');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('mycurrentuser');
  window.location.reload();
}

export function setUserMember(memberType: 'single' | 'lifetime') {
  const user = getCurrentUser();
  if (user) {
    user.memberType = memberType;
    localStorage.setItem('mycurrentuser', JSON.stringify(user));
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].memberType = memberType;
      saveUsers(users);
    }
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !username.trim() || !password.trim()) {
      setError('请填写所有字段');
      return;
    }
    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }

    const users = getUsers();
    if (users[email]) {
      setError('该邮箱已注册，请直接登录');
      return;
    }

    const newUser: UserData = {
      username: username.trim(),
      email: email.trim(),
      memberType: 'none',
      registerDate: Date.now(),
    };

    users[email] = newUser;
    saveUsers(users);
    localStorage.setItem('mycurrentuser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    window.location.href = '/';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码');
      return;
    }

    const users = getUsers();
    const user = users[email];
    if (!user) {
      setError('该邮箱未注册');
      return;
    }

    // 简化处理：密码直接用 localStorage 存，实际应该用 hash
    const storedPassword = localStorage.getItem(`mypwd_${email}`);
    // 兼容旧用户（注册时同时存密码）
    if (!storedPassword) {
      // 首次登录兼容：设置密码
      localStorage.setItem(`mypwd_${email}`, password);
    } else if (storedPassword !== password) {
      setError('密码错误');
      return;
    }

    localStorage.setItem('mycurrentuser', JSON.stringify(user));
    setCurrentUser(user);
    window.location.href = '/';
  };

  // 注册时同时存储密码
  const handleRegisterWithPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !username.trim() || !password.trim()) {
      setError('请填写所有字段');
      return;
    }
    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }

    const users = getUsers();
    if (users[email]) {
      setError('该邮箱已注册，请直接登录');
      return;
    }

    const newUser: UserData = {
      username: username.trim(),
      email: email.trim(),
      memberType: 'none',
      registerDate: Date.now(),
    };

    users[email] = newUser;
    saveUsers(users);
    localStorage.setItem(`mypwd_${email}`, password);
    localStorage.setItem('mycurrentuser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    window.location.href = '/';
  };

  if (currentUser) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-6 flex items-center justify-center" style={{ background: '#051d1f' }}>
        <div className="liquid-glass rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#00c896]" />
          </div>
          <h2 className="text-2xl font-bold text-[#f6f9ff] mb-2">{currentUser.username}</h2>
          <p className="text-sm text-[rgba(246,249,255,0.5)] mb-2">{currentUser.email}</p>
          <div className="mb-6">
            {currentUser.memberType === 'lifetime' ? (
              <span className="px-3 py-1 rounded-full text-xs bg-[rgba(239,182,255,0.15)] text-[#efb6ff]">终身会员</span>
            ) : currentUser.memberType === 'single' ? (
              <span className="px-3 py-1 rounded-full text-xs bg-[rgba(0,200,150,0.15)] text-[#00c896]">单次测算可用</span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs bg-[rgba(246,249,255,0.08)] text-[rgba(246,249,255,0.5)]">普通用户</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/premium')}
              className="flex-1 liquid-glass py-3 rounded-xl text-sm text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
            >
              升级会员
            </button>
            <button
              onClick={logout}
              className="flex-1 py-3 rounded-xl text-sm text-[#ff6464] border border-[rgba(255,100,100,0.2)] interactive hover:bg-[rgba(255,100,100,0.1)] transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 flex items-center justify-center" style={{ background: '#051d1f' }}>
      <div className="liquid-glass rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Sparkles className="w-8 h-8 text-[#efb6ff] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#f6f9ff] mb-1">
            {mode === 'login' ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-sm text-[rgba(246,249,255,0.5)]">
            {mode === 'login' ? '登录你的命运加法账号' : '注册开启命运之旅'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[rgba(255,100,100,0.1)] border border-[rgba(255,100,100,0.15)] text-sm text-[#ff6464]">
            {error}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegisterWithPassword} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-sm text-[rgba(246,249,255,0.6)] mb-1.5 block">用户名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(246,249,255,0.3)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="你的昵称"
                  className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl pl-10 pr-4 py-3 text-[#f6f9ff] placeholder:text-[rgba(246,249,255,0.3)] focus:outline-none focus:border-[#efb6ff] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-[rgba(246,249,255,0.6)] mb-1.5 block">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(246,249,255,0.3)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl pl-10 pr-4 py-3 text-[#f6f9ff] placeholder:text-[rgba(246,249,255,0.3)] focus:outline-none focus:border-[#efb6ff] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[rgba(246,249,255,0.6)] mb-1.5 block">密码</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(246,249,255,0.3)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位"
                className="w-full bg-[rgba(246,249,255,0.05)] border border-[rgba(246,249,255,0.1)] rounded-xl pl-10 pr-4 py-3 text-[#f6f9ff] placeholder:text-[rgba(246,249,255,0.3)] focus:outline-none focus:border-[#efb6ff] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-medium bg-[#efb6ff] text-[#051d1f] interactive hover:bg-[#f0c4ff] transition-colors flex items-center justify-center gap-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                登录
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                注册
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <p className="text-sm text-[rgba(246,249,255,0.5)]">
              还没有账号？
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className="text-[#efb6ff] ml-1 interactive hover:underline"
              >
                立即注册
              </button>
            </p>
          ) : (
            <p className="text-sm text-[rgba(246,249,255,0.5)]">
              已有账号？
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="text-[#efb6ff] ml-1 interactive hover:underline"
              >
                直接登录
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
