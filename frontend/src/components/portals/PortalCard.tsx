interface PortalCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
}

export default function PortalCard({ icon, title, subtitle, gradient, children, headerExtra }: PortalCardProps) {
  return (
    <div className="mb-8">
      {/* Section header */}
      <div className={`bg-gradient-to-l ${gradient} rounded-t-2xl px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{title}</h2>
              <p className="text-white/60 text-sm">{subtitle}</p>
            </div>
          </div>
          {headerExtra}
        </div>
      </div>
      {/* Content */}
      <div className="bg-white border border-t-0 border-gray-100 rounded-b-2xl p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
