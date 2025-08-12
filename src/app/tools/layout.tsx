"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/footer";
import { getToolsForNavigation } from "@/lib/tools-config";

const tools = getToolsForNavigation();

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Handle keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleToolSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Title with Home Link */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Image 
                  src="/icon.png" 
                  alt="Dev Tools" 
                  width={32} 
                  height={32}
                  className="rounded-md"
                />
                <h1 className="text-xl font-bold">Developer Tools</h1>
              </Link>
            </div>

            {/* Tools Dropdown and Theme Toggle */}
            <nav className="flex items-center space-x-2">
              {/* Search Input */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center justify-between w-10 px-3 py-2 text-sm text-muted-foreground md:w-64 sm:w-48"
                  onClick={() => setOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span className="hidden md:inline">Search tools...</span>
                  </div>
                  <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hidden sm:inline-flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              </div>
              
              <NavigationMenu viewport={false} className="hidden md:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                    <NavigationMenuContent className="right-0 left-auto">
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {tools.map((tool) => (
                          <NavigationMenuLink key={tool.title} asChild>
                            <Link
                              href={tool.url}
                              className="flex items-start gap-3 rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <tool.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium leading-none">{tool.title}</span>
                                <span className="text-xs text-muted-foreground line-clamp-2">{tool.description}</span>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for tools..." />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          <CommandGroup heading="Available Tools">
            {tools.map((tool) => (
              <CommandItem
                key={tool.url}
                onSelect={() => handleToolSelect(tool.url)}
                className="cursor-pointer"
              >
                <tool.icon className="h-4 w-4" />
                <span>{tool.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container items-center mx-auto px-2 md:px-4 py-6">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
