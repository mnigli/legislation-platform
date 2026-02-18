interface PortalHeroProps {
  title: string;
  subtitle: string;
  gradient: string;
  icon: React.ReactNode;
}

export default function PortalHero({ title, subtitle, gradient, icon }: PortalHeroProps) {
  return (
    <div className={`bg-gradient-to-bl ${gradient} rounded-3xl p-8 md:p-12 mb-8 shadow-lg`}>
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white">
          {icon}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">{title}</h1>
          <span className="bg-white/15 text-white/70 text-[10px] font-bold px-2 py-0.5 rounded-full">📋 דמו</span>
        </div>
      </div>
      <p className="text-white/70 text-lg max-w-2xl mr-[4.5rem]">{subtitle}</p>
    </div>
  );
}
