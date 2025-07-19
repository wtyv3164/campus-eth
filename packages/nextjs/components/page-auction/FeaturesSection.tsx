"use client";

import { Card } from "@/components/ui/page-test/card";

const features = [
  {
    title: "匿名出价",
    description: "所有出价都经过加密处理，只有在揭示阶段才能看到真实出价，确保公平竞争，避免竞拍者之间的策略性风险。",
    icon: "https://ext.same-assets.com/2118883842/2829871061.svg",
  },
  {
    title: "区块链保障",
    description: "基于以太坊智能合约，所有交易都存储在区块链上，不可篡改，完全透明，可被任何人验证。",
    icon: "https://ext.same-assets.com/2118883842/397754665.svg",
  },
  {
    title: "自动退款",
    description: "未中标出价者可以自动获得全额退款，最高出价者赢得拍卖有线转给拍卖人，简化了存款和提款的结算流程。",
    icon: "https://ext.same-assets.com/2118883842/836140709.svg",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">盲拍平台优势</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-effect p-8 text-center hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                <img src={feature.icon} alt={feature.title} className="w-10 h-10 invert" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300">
            立即参与拍卖
          </button>
        </div>
      </div>
    </section>
  );
}
