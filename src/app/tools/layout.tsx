import { Hash, FileText, Key, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tools = [
  {
    title: "Bcrypt Hash Generator",
    url: "/tools/bcrypt",
    icon: Hash
  },
  {
    title: "Base64 Encoder/Decoder",
    url: "/tools/base64",
    icon: FileText
  },
  {
    title: "JWT Encoder/Decoder",
    url: "/tools/jwt",
    icon: Key
  }
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

            {/* Tools Dropdown */}
            <nav className="flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    Tools
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {tools.map((tool) => (
                    <DropdownMenuItem key={tool.title} asChild>
                      <Link href={tool.url} className="flex items-center gap-2">
                        <tool.icon className="h-4 w-4" />
                        {tool.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Created with ❤️ by{" "}
              <a 
                href="https://github.com/jobacx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                Developer
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
