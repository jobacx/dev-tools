"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Link, ArrowUpDown, Upload, Download } from "lucide-react";

export default function URLClient() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encodeURL = () => {
    if (!inputText) {
      toast.error("Please enter text to encode");
      return;
    }

    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
      toast.success("Text encoded successfully");
    } catch (error) {
      toast.error("Failed to encode text");
      console.error(error);
    }
  };

  const decodeURL = () => {
    if (!inputText) {
      toast.error("Please enter URL-encoded text to decode");
      return;
    }

    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
      toast.success("Text decoded successfully");
    } catch (error) {
      toast.error("Invalid URL-encoded input");
      console.error(error);
    }
  };

  const handleProcess = () => {
    if (mode === "encode") {
      encodeURL();
    } else {
      decodeURL();
    }
  };

  const switchMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInputText(outputText);
    setOutputText("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputText(content);
    };
    reader.readAsText(file);
  };

  // Example URLs for demonstration
  const examples = {
    encode: [
      "Hello World!",
      "user@example.com",
      "https://example.com/path?param=value&other=test",
      "Special chars: !@#$%^&*()",
      "Spaces and symbols: [bracket] {curly} (parentheses)"
    ],
    decode: [
      "Hello%20World%21",
      "user%40example.com",
      "https%3A//example.com/path%3Fparam%3Dvalue%26other%3Dtest",
      "Special%20chars%3A%20%21%40%23%24%25%5E%26*%28%29",
      "Spaces%20and%20symbols%3A%20%5Bbracket%5D%20%7Bcurly%7D%20%28parentheses%29"
    ]
  };

  const loadExample = (example: string) => {
    setInputText(example);
    setOutputText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">URL Encoder/Decoder</h1>
          <p className="text-muted-foreground">Encode text to URL-safe format or decode URL-encoded strings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {mode === "encode" ? <Upload className="h-5 w-5" /> : <Download className="h-5 w-5" />}
              {mode === "encode" ? "Encode to URL" : "Decode from URL"}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={switchMode}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Switch to {mode === "encode" ? "Decode" : "Encode"}
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            {mode === "encode" 
              ? "Enter plain text to convert to URL-encoded format (percent encoding)"
              : "Enter URL-encoded text to decode back to plain text"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {mode === "encode" ? "Plain Text Input" : "URL-Encoded Input"}
                </label>
                {mode === "encode" && (
                  <div>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Upload File
                    </Button>
                  </div>
                )}
              </div>
              <Textarea
                placeholder={mode === "encode" 
                  ? "Enter text to encode..." 
                  : "Enter URL-encoded text..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={mode === "decode" ? "font-mono text-sm" : ""}
                rows={8}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Characters: {inputText.length}</span>
                <span>Bytes: {new Blob([inputText]).size}</span>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {mode === "encode" ? "URL-Encoded Output" : "Decoded Output"}
                </label>
                {outputText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(outputText)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
              <Textarea
                placeholder={mode === "encode" 
                  ? "URL-encoded result will appear here..." 
                  : "Decoded text will appear here..."
                }
                value={outputText}
                readOnly
                className={mode === "encode" ? "font-mono text-sm" : ""}
                rows={8}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Characters: {outputText.length}</span>
                {outputText && (
                  <span>Bytes: {new Blob([outputText]).size}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleProcess} size="lg" className="min-w-32">
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Examples Card */}
      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
          <CardDescription>
            Click on any example to load it into the {mode === "encode" ? "encoder" : "decoder"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {examples[mode].map((example, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => loadExample(example)}
              >
                <code className="text-sm font-mono">{example}</code>
                <Button variant="ghost" size="sm">
                  Use Example
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About URL Encoding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              URL encoding (also known as percent encoding) is a mechanism to encode information in a 
              Uniform Resource Identifier (URI) under certain circumstances.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Percent Encoding:</strong> Uses % followed by two hexadecimal digits to represent unsafe characters.</li>
              <li><strong>Reserved Characters:</strong> Characters like ?, &, =, # have special meaning in URLs and need encoding.</li>
              <li><strong>Space Character:</strong> Spaces are encoded as %20 (or + in some contexts).</li>
              <li><strong>Non-ASCII Characters:</strong> Unicode characters are UTF-8 encoded then percent-encoded.</li>
              <li><strong>Web Development:</strong> Essential for properly handling URLs, query parameters, and form data.</li>
            </ul>
            <div className="mt-4 p-3 bg-muted/30 rounded">
              <p className="font-medium mb-2">Common Encodings:</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>Space → %20</div>
                <div>@ → %40</div>
                <div>! → %21</div>
                <div># → %23</div>
                <div>$ → %24</div>
                <div>% → %25</div>
                <div>& → %26</div>
                <div>+ → %2B</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
