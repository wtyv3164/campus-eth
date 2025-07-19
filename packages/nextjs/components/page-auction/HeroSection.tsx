"use client";

import { Badge } from "@/components/ui/page-test/badge";
import { Button } from "@/components/ui/page-test/button";
import { Card } from "@/components/ui/page-test/card";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="geometric-pattern"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient">区块链盲拍平台</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto lg:mx-0 mb-6"></div>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
              基于区块链技术的匿名竞价系统，确保拍卖的公平性和透明度。您的出价将被加密保护，避免传统拍卖中的跟风出价问题。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-gradient text-white px-8 py-6 text-lg">浏览更多拍卖</Button>
              <Button
                variant="outline"
                className="glass-effect text-white border-white/20 hover:bg-white/10 px-8 py-6 text-lg"
              >
                创建新拍卖
              </Button>
            </div>
          </div>

          {/* Right side - NFT Display */}
          <div className="relative">
            <Card className="glass-effect p-6 floating-animation">
              <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/30 to-white/10"></div>
                    </div>
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
                  <span className="mr-1">💎</span>
                  3532.42
                </Badge>
                <Button size="sm" className="absolute bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  区块链浏览器
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-white text-xl font-bold">热门拍卖项目</h3>
                <div className="flex items-center justify-center py-8">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-white/60 text-center">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  暂无中...
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1 btn-gradient text-white">浏览更多拍卖</Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">创建新拍卖</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
