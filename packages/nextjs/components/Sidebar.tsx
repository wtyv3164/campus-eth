// packages/nextjs/components/shared/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BugAntIcon, HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

// packages/nextjs/components/shared/Sidebar.tsx

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-secondary shadow-md" : ""
      } hover:bg-secondary hover:shadow-md focus:bg-secondary py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
    >
      {children}
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-base-100 p-4 fixed flex flex-col shadow-xl">
      <div className="text-2xl font-bold mb-8">校园共享平台</div>
      <nav className="flex flex-col gap-4">
        <NavLink href="/">
          <HomeIcon className="h-6 w-6" />
          <span>首页</span>
        </NavLink>
        <NavLink href="/debug">
          <BugAntIcon className="h-6 w-6" />
          <span>调试合约</span>
        </NavLink>
        <NavLink href="/blockexplorer">
          <MagnifyingGlassIcon className="h-6 w-6" />
          <span>区块浏览器</span>
        </NavLink>
      </nav>
      <div className="mt-auto">{/* Can add footer content here, e.g., social links */}</div>
    </div>
  );
};
