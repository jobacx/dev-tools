"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Hash, FileText, AlertCircle } from "lucide-react";
import crypto from "crypto";

type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512" | "sha3-256" | "sha3-512";

interface HashResult {
  algorithm: string;
  hash: string;
  inputType: string;
  length: number;
}

export default function HashClient() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState<"text" | "hex">("text");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("sha256");
  const [results, setResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const algorithms: { value: HashAlgorithm; label: string; description: string }[] = [
    { value: "md5", label: "MD5", description: "128-bit (32 hex chars) - Fast but not secure" },
    { value: "sha1", label: "SHA-1", description: "160-bit (40 hex chars) - Legacy, avoid for security" },
    { value: "sha256", label: "SHA-256", description: "256-bit (64 hex chars) - Secure and widely used" },
    { value: "sha512", label: "SHA-512", description: "512-bit (128 hex chars) - Very secure" },
    { value: "sha3-256", label: "SHA3-256", description: "256-bit (64 hex chars) - Latest SHA-3 standard" },
    { value: "sha3-512", label: "SHA3-512", description: "512-bit (128 hex chars) - Latest SHA-3 standard" },
  ];

  const generateHash = () => {
    if (!input.trim()) {
      toast.error("Please enter some text or data to hash");
      return;
    }

    setIsGenerating(true);
    
    try {
      let inputBuffer: Buffer;
      
      // Convert input based on type
      if (inputType === "hex") {
        // Validate hex input
        if (!/^[0-9a-fA-F]*$/.test(input.replace(/\s/g, ""))) {
          toast.error("Invalid hexadecimal input. Only 0-9 and A-F characters are allowed.");
          setIsGenerating(false);
          return;
        }
        const cleanHex = input.replace(/\s/g, "");
        if (cleanHex.length % 2 !== 0) {
          toast.error("Hexadecimal input must have an even number of characters.");
          setIsGenerating(false);
          return;
        }
        inputBuffer = Buffer.from(cleanHex, "hex");
      } else {
        inputBuffer = Buffer.from(input, "utf8");
      }

      // Generate hash
      const hash = crypto.createHash(algorithm).update(inputBuffer).digest("hex");
      
      const result: HashResult = {
        algorithm: algorithm.toUpperCase(),
        hash,
        inputType,
        length: hash.length,
      };

      // Add to results (keep last 5 results)
      setResults(prev => [result, ...prev.slice(0, 4)]);
      toast.success(`${algorithm.toUpperCase()} hash generated successfully`);
    } catch (error) {
      toast.error("Failed to generate hash");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllHashes = () => {
    if (!input.trim()) {
      toast.error("Please enter some text or data to hash");
      return;
    }

    setIsGenerating(true);
    
    try {
      let inputBuffer: Buffer;
      
      if (inputType === "hex") {
        if (!/^[0-9a-fA-F]*$/.test(input.replace(/\s/g, ""))) {
          toast.error("Invalid hexadecimal input");
          setIsGenerating(false);
          return;
        }
        const cleanHex = input.replace(/\s/g, "");
        if (cleanHex.length % 2 !== 0) {
          toast.error("Hexadecimal input must have an even number of characters");
          setIsGenerating(false);
          return;
        }
        inputBuffer = Buffer.from(cleanHex, "hex");
      } else {
        inputBuffer = Buffer.from(input, "utf8");
      }

      // Generate all hashes
      const newResults: HashResult[] = algorithms.map(algo => {
        const hash = crypto.createHash(algo.value).update(inputBuffer).digest("hex");
        return {
          algorithm: algo.value.toUpperCase(),
          hash,
          inputType,
          length: hash.length,
        };
      });

      setResults(newResults);
      toast.success("All hashes generated successfully");
    } catch (error) {
      toast.error("Failed to generate hashes");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const clearResults = () => {
    setResults([]);
    toast.success("Results cleared");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Hash className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Hash Generator</h1>
          <p className="text-muted-foreground">Generate cryptographic hashes using various algorithms</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Input Data
              </CardTitle>
              <CardDescription>
                Enter text or hexadecimal data to generate hashes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-type">Input Type</Label>
                <Select value={inputType} onValueChange={(value: "text" | "hex") => setInputType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text (UTF-8)</SelectItem>
                    <SelectItem value="hex">Hexadecimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="input">
                  {inputType === "text" ? "Text Input" : "Hexadecimal Input"}
                </Label>
                <Textarea
                  id="input"
                  placeholder={
                    inputType === "text" 
                      ? "Enter text to hash..." 
                      : "Enter hexadecimal data (e.g., 48656c6c6f20576f726c64)"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono min-h-[100px]"
                />
                {inputType === "hex" && (
                  <p className="text-xs text-muted-foreground">
                    Enter hexadecimal characters only (0-9, A-F). Spaces will be ignored.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Hash Algorithm</Label>
                <Select value={algorithm} onValueChange={(value: HashAlgorithm) => setAlgorithm(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        <div>
                          <div className="font-medium">{algo.label}</div>
                          <div className="text-xs text-muted-foreground">{algo.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateHash} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? "Generating..." : `Generate ${algorithm.toUpperCase()}`}
                </Button>
                <Button 
                  variant="outline"
                  onClick={generateAllHashes} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? "Generating..." : "Generate All"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Algorithm Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {algorithms.map((algo) => (
                  <div 
                    key={algo.value}
                    className={`p-3 rounded-lg border transition-colors ${
                      algorithm === algo.value 
                        ? "bg-primary/5 border-primary" 
                        : "bg-muted/30"
                    }`}
                  >
                    <div className="font-medium text-sm">{algo.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {algo.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Generated Hashes
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
            <CardDescription>
              Recent hash generation results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.algorithm}</span>
                      <span className="text-sm text-muted-foreground">
                        ({result.length} chars, {result.inputType} input)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(result.hash, result.algorithm)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      value={result.hash}
                      readOnly
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            About Hash Functions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Hash functions are one-way mathematical functions that convert input data of any size 
              into a fixed-size string of characters, typically a hexadecimal number.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Deterministic:</strong> The same input always produces the same hash</li>
              <li><strong>Fixed Output:</strong> Hash length is constant regardless of input size</li>
              <li><strong>Avalanche Effect:</strong> Small input changes cause large hash changes</li>
              <li><strong>One-way:</strong> Computationally infeasible to reverse</li>
              <li><strong>Collision Resistant:</strong> Hard to find two inputs with the same hash</li>
            </ul>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Security Note:</strong> MD5 and SHA-1 are cryptographically broken and should not be used for security purposes. 
                Use SHA-256, SHA-512, or SHA-3 for secure applications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
