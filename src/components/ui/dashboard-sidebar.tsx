"use client"
import React, { useState } from "react";
import {
  Briefcase,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  ChevronsRight,
  Settings,
  HelpCircle,
  FileText,
  DollarSign,
  MessageSquare,
  Bell,
  Shield,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userType?: string;
  userName?: string;
  userPlan?: string;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  userType = "CLIENT",
  userName = "User",
  userPlan = "Free Plan"
}) => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const getMenuItems = () => {
    const commonItems = [
      { icon: ShoppingBag, title: "Shop", href: "/dashboard" },
      { icon: MessageSquare, title: "Messages", href: "/messages" },
      { icon: Bell, title: "Notifications", href: "/notifications" },
    ];

    if (userType === "ADMIN") {
      return [
        ...commonItems,
        { icon: Users, title: "Users", href: "/admin/users" },
        { icon: Briefcase, title: "Gigs", href: "/admin" },
        { icon: ShoppingCart, title: "Orders", href: "/admin" },
        { icon: Package, title: "Products", href: "/admin/products" },
        { icon: BarChart3, title: "Analytics", href: "/admin/analytics" },
        { icon: Shield, title: "Security", href: "/admin/security" },
      ];
    }

    if (userType === "FREELANCER") {
      return [
        ...commonItems,
        { icon: Briefcase, title: "My Gigs", href: "/seller-dashboard" },
        { icon: FileText, title: "Orders", href: "/orders" },
        { icon: DollarSign, title: "Earnings", href: "/dashboard" },
        { icon: BarChart3, title: "Analytics", href: "/dashboard" },
      ];
    }

    return [
      ...commonItems,
      { icon: Briefcase, title: "Browse Gigs", href: "/browse-gigs" },
      { icon: ShoppingCart, title: "My Orders", href: "/orders" },
      { icon: Users, title: "Find Talent", href: "/all-talent" },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out z-40 ${
        open ? 'w-64' : 'w-20'
      } border-slate-200 dark:border-slate-700/50 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-4 flex flex-col`}
    >
      <TitleSection open={open} userName={userName} userPlan={userPlan} />

      <div className="flex-1 space-y-2 mt-4 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <Option
            key={item.title}
            Icon={item.icon}
            title={item.title}
            href={item.href}
            selected={pathname === item.href}
            open={open}
          />
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
        {open && (
          <div className="mb-4">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
              Account
            </div>
            <Option
              Icon={Settings}
              title="Settings"
              href="/settings"
              selected={pathname === "/settings"}
              open={open}
            />
            <Option
              Icon={HelpCircle}
              title="Help & Support"
              href="/help"
              selected={false}
              open={open}
            />
          </div>
        )}
        <ToggleClose open={open} setOpen={setOpen} />
      </div>
    </nav>
  );
};

const Option = ({ Icon, title, href, selected, open }: any) => {
  return (
    <Link href={href}>
      <button
        className={`group relative flex h-12 w-full items-center rounded-xl transition-all duration-300 ${
          selected 
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30" 
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <div className="grid h-full w-12 place-content-center shrink-0">
          <Icon className={`h-5 w-5 transition-transform duration-300 ${selected ? 'scale-110' : 'group-hover:scale-110'}`} />
        </div>
        
        <span
          className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden ${
            open ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0'
          }`}
        >
          {title}
        </span>

        {selected && open && (
          <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse"></div>
        )}
      </button>
    </Link>
  );
};

const TitleSection = ({ open, userName, userPlan }: any) => {
  return (
    <div className="mb-8 px-2">
      <div className="flex items-center gap-4">
        <Logo />
        <div className={`transition-all duration-300 flex flex-col justify-center overflow-hidden ${open ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <span className="block text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
            {userName}
          </span>
          <span className="block text-[10px] font-medium text-orange-500 dark:text-orange-400 uppercase tracking-wider">
            {userPlan}
          </span>
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="relative grid size-12 shrink-0 place-content-center rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20 group">
      <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"></div>
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current stroke-2">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="4" cy="20" r="2" />
        <circle cx="20" cy="20" r="2" />
        <path d="M12 6v3M5.5 18.5l2.5-2.5M18.5 18.5l-2.5-2.5" />
      </svg>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex items-center h-12 rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
    >
      <div className="grid size-12 place-content-center shrink-0">
        <ChevronsRight
          className={`h-5 w-5 transition-transform duration-500 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      <span
        className={`text-sm font-bold transition-all duration-300 overflow-hidden ${
          open ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0'
        }`}
      >
        Collapse
      </span>
    </button>
  );
};
