import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Heart, Sun, Moon, ChevronRight, Compass, Sparkles, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Hero Section ─── */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const layers = container.querySelectorAll<HTMLDivElement>('.parallax-layer');

    const depthConfig: Record<string, { depth: number; direction: number }> = {
      '.img-bg': { depth: 5, direction: -1 },
      '.img-md': { depth: 10, direction: -1 },
      '.img-sm': { depth: 20, direction: 1 },
      '.img-xsm': { depth: 35, direction: 1 },
    };

    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = x;
      targetY = y;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      layers.forEach((layer) => {
        let config;
        for (const cls in depthConfig) {
          if (layer.matches(cls)) config = depthConfig[cls];
        }
        if (config) {
          const moveX = currentX * config.depth * config.direction;
          const moveY = currentY * config.depth * config.direction;
          layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px) scale(1.15)`;
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-parallax-container relative w-full"
      style={{ height: '100vh', minHeight: 600 }}
    >
      {/* Parallax Layers */}
      <div
        className="parallax-layer img-bg"
        style={{
          backgroundImage: 'url(/images/parallax-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
        }}
      />
      <div
        className="parallax-layer img-md"
        style={{
          backgroundImage: 'url(/images/nebula-md.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="parallax-layer img-sm"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(239, 182, 255, 0.15) 0%, transparent 50%)',
        }}
      />
      <div
        className="parallax-layer img-xsm"
        style={{
          background: 'radial-gradient(ellipse at 30% 70%, rgba(0, 70, 67, 0.4) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="mb-6">
          <Star className="w-8 h-8 text-[#efb6ff] mx-auto mb-4 float-animation" />
        </div>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#f6f9ff] mb-6 glow-text"
          style={{ lineHeight: 1.0, fontFamily: 'Oswald, sans-serif' }}
        >
          探寻命运的算法
        </h1>
        <p className="text-lg md:text-xl text-[rgba(246,249,255,0.7)] max-w-2xl mb-10 leading-relaxed">
          融合东西方古老智慧，以星辰为引，解读属于你的命运密码
        </p>
        <Link
          to="/premium"
          className="liquid-glass px-8 py-4 rounded-full text-base font-medium text-[#f6f9ff] interactive transition-all hover:text-[#efb6ff] pulse-glow"
        >
          开启你的星轨之旅
        </Link>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-10"
        style={{ background: 'linear-gradient(to top, #051d1f, transparent)' }}
      />
    </section>
  );
}

/* ─── Daily Oracle Section ─── */
function DailyOracle() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const oracleTexts = [
    '今日，水星逆行结束',
    '你的正缘正在靠近',
    '机遇之门即将开启',
    '信任你内心的声音',
    '金星带来爱的能量',
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const textEls = section.querySelectorAll<HTMLDivElement>('.oracle-item');
    const triggers: ScrollTrigger[] = [];

    textEls.forEach((el) => {
      const charsInner = el.querySelectorAll<HTMLSpanElement>('.char-inner');

      gsap.set(charsInner, {
        xPercent: 100,
        yPercent: -20,
        opacity: 0,
        skewX: 20,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=10%',
          end: 'bottom center+=10%',
          scrub: true,
        },
      });

      tl.to(charsInner, {
        xPercent: 0,
        yPercent: 0,
        opacity: 1,
        skewX: 0,
        stagger: 0.03,
        ease: 'power1.inOut',
      });

      tl.to(
        charsInner,
        {
          textShadow: '0 0 20px rgba(239, 182, 255, 0.6)',
          stagger: 0.05,
          ease: 'power1.inOut',
        },
        '<'
      );

      tl.to(charsInner, {
        xPercent: -100,
        yPercent: 40,
        opacity: 0,
        textShadow: 'none',
        stagger: 0.03,
        ease: 'power1.inOut',
      });

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden vignette"
      style={{ background: '#051d1f' }}
    >
      <div className="max-w-5xl mx-auto px-6 space-y-32 md:space-y-48">
        {oracleTexts.map((text, i) => (
          <div key={i} className="oracle-item text-center">
            <div className="kinetic-text text-3xl md:text-5xl lg:text-6xl font-bold text-[#f6f9ff] tracking-tight">
              {text.split('').map((char, ci) => (
                <span key={ci} className="char">
                  <span className="char-inner">{char === ' ' ? '\u00A0' : char}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Service Matrix ─── */
function ServiceMatrix() {
  const cards = [
    {
      title: '紫微命盘',
      desc: '9.9元解锁，洞见你的人生蓝图',
      icon: <Compass className="w-8 h-8" />,
      image: '/images/astro-chart.jpg',
      href: '/destiny',
      tall: true,
    },
    {
      title: '星座配对',
      desc: '寻找与你灵魂共鸣的星座伴侣',
      icon: <Heart className="w-8 h-8" />,
      image: '/images/zodiac-pair.jpg',
      href: '/zodiac',
      tall: false,
    },
    {
      title: '每日宜忌',
      desc: '顺应天时，把握每一个当下的能量',
      icon: <Sun className="w-8 h-8" />,
      image: '/images/sun-moon.jpg',
      href: '/daily',
      tall: true,
    },
  ];

  return (
    <section className="py-24 md:py-32 px-6" style={{ background: '#051d1f' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#f6f9ff] mb-4"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            三大核心服务
          </h2>
          <p className="text-[rgba(246,249,255,0.6)] text-lg">
            探索属于你的命运维度
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {cards.map((card, i) => (
            <Link
              key={i}
              to={card.href}
              className={`liquid-glass rounded-3xl p-6 interactive group transition-all duration-500 hover:scale-[1.02] ${
                card.tall ? 'md:min-h-[480px]' : 'md:min-h-[420px] md:mt-12'
              }`}
            >
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051d1f] to-transparent opacity-60" />
              </div>
              <div className="text-[#efb6ff] mb-3">{card.icon}</div>
              <h3 className="text-2xl font-bold text-[#f6f9ff] mb-2">{card.title}</h3>
              <p className="text-[rgba(246,249,255,0.7)] leading-relaxed">{card.desc}</p>
              <div className="flex items-center gap-2 mt-4 text-[#efb6ff] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>立即体验</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Premium Features (Holographic Grid) ─── */
function PremiumFeatures() {
  const gridRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = grid.querySelectorAll<HTMLDivElement>('.holo-item');

    const onMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);

      items.forEach((item, index) => {
        const rowIndex = Math.floor(index / 3);
        const direction = rowIndex % 2 === 0 ? 1 : -1;
        const shift = deltaX * 20 * direction;
        item.style.transform = `translate3d(${shift}px, 0, 0)`;
      });
    };

    const onMouseLeave = () => {
      items.forEach((item) => {
        item.style.transform = 'translate3d(0, 0, 0)';
      });
    };

    grid.addEventListener('mousemove', onMouseMove);
    grid.addEventListener('mouseleave', onMouseLeave);

    return () => {
      grid.removeEventListener('mousemove', onMouseMove);
      grid.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const features = [
    { icon: <Star className="w-6 h-6" />, title: '完整星盘', desc: '12宫位深度解析' },
    { icon: <Moon className="w-6 h-6" />, title: '塔罗占卜', desc: '78张牌阵推演' },
    { icon: <Sun className="w-6 h-6" />, title: '生命灵数', desc: '核心数字解读' },
    { icon: <Sparkles className="w-6 h-6" />, title: '流年运势', desc: '年度运势预测' },
    { icon: <Zap className="w-6 h-6" />, title: '每日推送', desc: '专属运势提醒' },
    { icon: <Heart className="w-6 h-6" />, title: '缘分匹配', desc: '灵魂伴侣分析' },
  ];

  return (
    <section className="py-24 md:py-32 px-6 overflow-hidden" style={{ background: '#020f10' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#f6f9ff] mb-4"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            专属星盘
          </h2>
          <p className="text-[rgba(246,249,255,0.6)] text-lg max-w-xl mx-auto">
            39元解锁终身会员，无限制使用全部测算功能
          </p>
        </div>

        <div
          ref={gridRef}
          className="holo-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
          style={{
            transform: 'rotate3d(1, 0, 0, 15deg) rotate3d(0, 0, 1, -5deg)',
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="holo-item liquid-glass rounded-2xl p-6 interactive group hover:scale-105 transition-all duration-300"
            >
              <div className="text-[#efb6ff] mb-3 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-lg font-semibold text-[#f6f9ff] mb-1">{f.title}</h4>
              <p className="text-sm text-[rgba(246,249,255,0.6)]">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 liquid-glass px-8 py-4 rounded-full text-[#f6f9ff] font-medium interactive hover:text-[#efb6ff] transition-colors pulse-glow"
          >
            <Sparkles className="w-5 h-5" />
            升级终身会员
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection />
      <DailyOracle />
      <ServiceMatrix />
      <PremiumFeatures />
    </div>
  );
}
