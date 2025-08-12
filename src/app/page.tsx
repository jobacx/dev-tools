"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Footer from "@/components/footer";
import StructuredData from "@/components/structured-data";
import { toolsConfig } from "@/lib/tools-config";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = toolsConfig.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <StructuredData type="homepage" />
      <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image 
                  src="/icon.png" 
                  alt="Dev Tools" 
                  width={48} 
                  height={48}
                  className="rounded-lg"
                />
                <h1 className="text-4xl font-bold">Developer Tools</h1>
              </div>
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

      <Footer />
      </div>
    </>
  );
}
