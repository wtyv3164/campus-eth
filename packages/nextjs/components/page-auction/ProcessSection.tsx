"use client";

import { Card } from "@/components/ui/page-test/card";

const processSteps = [
  {
    step: "1",
    title: "创建拍卖",
    description: "发布您自己的盲拍拍卖，设置拍卖物品、起拍价格、竞拍时间，让其他用户参与竞拍。",
    icon: "https://ext.same-assets.com/2118883842/112237653.svg",
  },
  {
    step: "2",
    title: "浏览所有拍卖",
    description: "查看平台上所有拍卖行中的拍卖，按状态筛选和搜索，找到您感兴趣的拍卖项目并参与竞拍。",
    icon: "https://ext.same-assets.com/2118883842/2391870503.svg",
  },
  {
    step: "3",
    title: "我的拍卖",
    description: "管理您创建的拍卖和参与竞拍的项目，查看拍卖状态、竞拍记录和收益情况。",
    icon: "https://ext.same-assets.com/2118883842/796593809.svg",
  },
  {
    step: "4",
    title: "数据分析",
    description: "查看平台的统计数据和分析报告，了解拍卖趋势、用户收藏和市场表现等关键指标。",
    icon: "https://ext.same-assets.com/2118883842/2517823553.svg",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">盲拍流程 — 简单四步完成</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <Card key={index} className="glass-effect p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <img src={step.icon} alt={step.title} className="w-8 h-8 invert" />
              </div>
              <div className="w-8 h-8 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {step.step}
              </div>
              <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
