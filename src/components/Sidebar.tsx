import {
  Home,
  PlayCircle,
  BarChart2,
  Settings,
  ShieldCheck,
  Box,
} from "lucide-react";
import { useNavigationStore } from "../store/useNavigationStore";

export const Sidebar = ({ onNavClick }: { onNavClick?: () => void } = {}) => {
  const { currentView, setView } = useNavigationStore();
  const nav = (view: string) => {
    setView(view as any);
    onNavClick?.();
  };

  return (
    <aside className="w-64 bg-slate-950 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 shadow-xl z-50">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-none">
              ABMEL
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
              Enterprise AI
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Core Platform
          </p>
          <NavItem
            icon={<Home size={18} />}
            label="Dashboard"
            active={currentView === "dashboard"}
            onClick={() => nav("dashboard")}
          />
          <NavItem
            icon={<PlayCircle size={18} />}
            label="Active Campaigns"
            active={currentView === "campaigns"}
            onClick={() => nav("campaigns")}
          />
          <NavItem
            icon={<BarChart2 size={18} />}
            label="Analytics"
            active={currentView === "performance"}
            onClick={() => nav("performance")}
          />
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Governance
          </p>
          <NavItem
            icon={<ShieldCheck size={18} />}
            label="Guardrails & Safety"
            active={currentView === "guardrails"}
            onClick={() => nav("guardrails")}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="System Settings"
            active={currentView === "settings"}
            onClick={() => nav("settings")}
          />
        </div>
      </nav>
    </aside>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
    {active && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></div>
    )}
  </button>
);
