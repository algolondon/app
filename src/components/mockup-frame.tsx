import { Settings } from "lucide-react";

interface MockupFrameProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function MockupFrame({ children, title = "16LONDON TREND ALGO V1 · RULES & SETTINGS", className = "" }: MockupFrameProps) {
  return (
    <div className={`bg-[#030914] border border-[#00D4FF]/30 rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.15)] overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#00D4FF]/20 bg-[#061123]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <div className="text-[10px] sm:text-xs font-bold text-[#00D4FF] tracking-[0.15em] uppercase">
          {title}
        </div>
        <div>
          <Settings className="w-4 h-4 text-muted-foreground hover:text-[#00D4FF] transition-colors cursor-pointer" />
        </div>
      </div>
      {/* Content */}
      <div className="relative w-full h-full p-0">
        {children}
      </div>
    </div>
  );
}
