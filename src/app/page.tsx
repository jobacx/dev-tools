"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Hash, FileText, Key } from "lucide-react";

const tools = [
  {
    id: "bcrypt",
    title: "Bcrypt Hash Generator",
    description: "Generate and verify bcrypt hashes for password security",
    icon: Hash,
    href: "/tools/bcrypt"
  },
  {
    id: "base64",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode text or data using Base64 encoding",
    icon: FileText,
    href: "/tools/base64"
  },
  {
    id: "jwt",
    title: "JWT Encoder/Decoder",
    description: "Encode, decode, and verify JSON Web Tokens",
    icon: Key,
    href: "/tools/jwt"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
              <p className="text-muted-foreground text-lg">
                Essential utilities for developers - Hash, Encode, Decode, and more
              </p>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={tool.href}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <tool.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tools found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
