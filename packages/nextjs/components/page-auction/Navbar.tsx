"use client";

import { Badge } from "@/components/ui/page-test/badge";
import { Button } from "@/components/ui/page-test/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-white font-bold text-xl">BlockAuction</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              首页
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              竞拍
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              我的竞拍
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              揭示
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              结果
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* NFT Count Badge */}
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <span className="mr-1">NFT:</span>
              <span>0</span>
            </Badge>

            {/* Wallet Connect Button */}
            <Button className="btn-gradient text-white border-0 hover:bg-none">连接钱包</Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
