"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Scale,
  Code,
  Menu,
  Activity,
  Wallet,
  PieChart,
  Handshake,
  Zap,
  PlusCircle
} from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import Logo from "./logo";
import { ButtonConnectWallet } from "../web3/button-connect-wallet";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  styling: {
    shadow: string;
    text: string;
    hover: string;
    border: string;
    bg: string;
    hoverShadow: string;
  };
}

const NAV_LINKS: NavLink[] = [
  {
    href: "/overview",
    label: "Overview",
    color: "primary",
    icon: <Activity className="mr-2" size={15} />,
    styling: {
      shadow: "shadow-main-1",
      text: "text-main-1",
      hover: "hover:border-main-1",
      border: "border-main-1",
      bg: "hover:bg-main-1/10",
      hoverShadow: "hover:shadow-main-1"
    }
  },
  {
    href: "/earn",
    label: "Earn",
    color: "success",
    icon: <Zap className="mr-2" size={15} />,
    styling: {
      shadow: "shadow-main-2",
      text: "text-main-2",
      hover: "hover:border-main-2",
      border: "border-main-2",
      bg: "hover:bg-main-2/10",
      hoverShadow: "hover:shadow-main-2"
    }
  },
  {
    href: "/borrow",
    label: "Borrow",
    color: "warning",
    icon: <Wallet className="mr-2" size={15} />,
    styling: {
      shadow: "shadow-main-3",
      text: "text-main-3",
      hover: "hover:border-main-3",
      border: "border-main-3",
      bg: "hover:bg-main-3/10",
      hoverShadow: "hover:shadow-main-3"
    }
  },
  {
    href: "/pools",
    label: "Pools",
    color: "secondary",
    icon: <PieChart className="mr-2" size={15} />,
    styling: {
      shadow: "shadow-main-4",
      text: "text-main-4",
      hover: "hover:border-main-4",
      border: "border-main-4",
      bg: "hover:bg-main-4/10",
      hoverShadow: "hover:shadow-main-4"
    }
  },
  {
    href: "/auctions",
    label: "Auctions",
    color: "danger",
    icon: <Handshake className="mr-2" size={15} />,
    styling: {
      shadow: "shadow-main-5",
      text: "text-main-5",
      hover: "hover:border-main-5",
      border: "border-main-5",
      bg: "hover:bg-main-5/10",
      hoverShadow: "hover:shadow-main-5"
    }
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    color: "primary",
    icon: <Code className="mr-2" size={15} />,
    styling: {
      shadow: "shadow-main-1",
      text: "text-main-1",
      hover: "hover:border-main-1",
      border: "border-main-1",
      bg: "hover:bg-main-1/10",
      hoverShadow: "hover:shadow-main-1"
    }
  }
];

const DesktopNavLinks: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link href={link.href} key={link.href}>
            <Button
              variant="outline"
              className={cn(
                "p-0 rounded-xl shadow-sm group justify-start xl:justify-center",
                "px-3 transition-all duration-300 text-xs font-bold",
                "border-none xl:border hover:shadow-sm w-full",
                isActive && `${link.styling.shadow} shadow-[0_0_2px_1.5px_rgba(0,0,0,0.3)]`,
                link.styling.hover,
                isActive && link.styling.bg,
                link.styling.hoverShadow
              )}
            >
              {link.icon}
              {link.label}
            </Button>
          </Link>
        );
      })}
    </>
  );
};

const CreateDropdownMenu: React.FC = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const createIcons = {
    createPool: <Scale className={`mr-2 ${pathname.startsWith("/create-pool") ? "text-main-2 text-sm" : "default"}`} size={20} />,
    createCurator: <Code className={`mr-2 ${pathname.startsWith("/create-curator") ? "text-main-2 text-sm" : "default"}`} size={20} />,
  };

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "p-0 rounded-xl shadow-sm group justify-start xl:justify-center",
            "px-3 transition-all duration-300 text-xs font-bold",
            "border-none xl:border hover:shadow-main-2",
            (pathname.startsWith("/create-pool") || pathname.startsWith("/create-curator")) && "shadow-main-2 shadow-[0_0_2px_1.5px_rgba(0,0,0,0.3)]",
            isDropdownOpen && "scale-105 shadow-lg"
          )}
        >
          <PlusCircle width={15} className="mr-1" />
          Create
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <Link href="/create-pool">
          <DropdownMenuItem className="flex items-center py-3 cursor-pointer">
            {createIcons.createPool}
            Create Pool
          </DropdownMenuItem>
        </Link>
        <Link href="/create-curator">
          <DropdownMenuItem className="flex items-center py-3 cursor-pointer">
            {createIcons.createCurator}
            Create Curator
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MobileNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block 3/2xl:hidden xl:max-w-screen-xl lg:max-w-screen-lg mx-auto overflow-hidden">
      <nav className="flex items-center justify-between">
        <Sheet
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open navigation menu"
              className="w-12 bg-background rounded-xl"
            >
              <Menu className="w-8 h-8 shrink-0" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-3/4 sm:w-[500px]"
            side="left"
          >
            <SheetTitle>
              <VisuallyHidden>Navigation Menu</VisuallyHidden>
            </SheetTitle>
            <Logo />
            <nav aria-label="Main navigation" className="flex flex-col gap-1 pt-4">
              <DesktopNavLinks />
              <CreateDropdownMenu />
            </nav>
            <div className="pt-5">
              <ButtonConnectWallet />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex px-5 sm:px-10 lg:px-20 justify-between pt-7">
      <div className="xl:max-w-screen-xl lg:max-w-screen-lg container flex justify-between items-center gap-3 w-full mx-auto">
        <div className="bg-foreground/10 h-16 px-3 flex items-center rounded-2xl w-fit">
          <Link href="/" className="flex justify-start items-center gap-1 w-fit">
            <Logo />
          </Link>
        </div>

        <div className="hidden 3/2xl:flex items-center gap-4">
          <div className="flex gap-2 items-center bg-foreground/10 py-3 px-3 rounded-2xl">
            <DesktopNavLinks />
            <CreateDropdownMenu />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-foreground/10 py-3 px-3 rounded-2xl w-auto">
          <ThemeToggle />
          <ButtonConnectWallet />
          <MobileNavbar />
        </div>

        <div className="sm:hidden flex items-center gap-2 bg-foreground/10 py-3 px-3 rounded-2xl">
          <ThemeToggle />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
};