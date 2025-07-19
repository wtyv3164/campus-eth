"use client";

export default function Footer() {
  const footerLinks = [
    { label: "首页", href: "#" },
    { label: "竞拍", href: "#" },
    { label: "我的竞拍", href: "#" },
    { label: "揭示", href: "#" },
    { label: "结果", href: "#" },
  ];

  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and branding */}
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-white font-bold text-xl">BlockAuction</span>
            <span className="text-white/60">© 2023</span>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap items-center gap-6 mb-6 md:mb-0">
            {footerLinks.map((link, index) => (
              <a key={index} href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-white/40">
          <div className="mb-4 md:mb-0">
            <span>区块链盲拍系统</span>
            <span className="mx-2">•</span>
            <span>基于 Chain ID: 887766</span>
          </div>
          <div>
            <span>© 2023 保留所有权利</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
