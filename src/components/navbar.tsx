import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-[#E0BBE4]/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Navigation items */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FFB4A2]" />
              <span className="text-sm font-medium text-[#6B5B4F]">
                AI-Powered
              </span>
            </div>
            <div className="hidden md:block text-sm text-[#8B7E74]">
              Transform Text with AI
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <Image
                src="/images/DeWallify-Logo.png"
                alt="DeWallify Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
          </div>

          {/* Right side - Additional items */}
          <div className="flex items-center space-x-8">
            <div className="hidden md:block text-sm text-[#8B7E74]">
              Free • No Login
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#B5EAD7] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#6B5B4F]">Online</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
