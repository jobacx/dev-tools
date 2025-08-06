"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, FileText, ArrowUpDown, Download, Upload } from "lucide-react";

export default function Base64Tool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encodeBase64 = () => {
    if (!inputText) {
      toast.error("Please enter text to encode");
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
      toast.success("Text encoded successfully");
    } catch (error) {
      toast.error("Failed to encode text");
      console.error(error);
    }
  };

  const decodeBase64 = () => {
    if (!inputText) {
      toast.error("Please enter Base64 text to decode");
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
      toast.success("Text decoded successfully");
    } catch (error) {
      toast.error("Invalid Base64 input");
      console.error(error);
    }
  };

  const handleProcess = () => {
    if (mode === "encode") {
      encodeBase64();
    } else {
      decodeBase64();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Base64 Encoder/Decoder</h1>
          <p className="text-muted-foreground">Encode text to Base64 or decode Base64 back to text</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {mode === "encode" ? <Upload className="h-5 w-5" /> : <Download className="h-5 w-5" />}
              {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
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
              ? "Enter plain text to convert to Base64 encoding"
              : "Enter Base64 encoded text to decode back to plain text"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {mode === "encode" ? "Plain Text Input" : "Base64 Input"}
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
                  : "Enter Base64 encoded text..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={mode === "decode" ? "font-mono text-sm" : ""}
                rows={8}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Characters: {inputText.length}</span>
                {mode === "encode" && (
                  <span>Bytes: {new Blob([inputText]).size}</span>
                )}
              </div>
            </div>

            {/* Output */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {mode === "encode" ? "Base64 Output" : "Decoded Output"}
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
                  ? "Base64 encoded result will appear here..." 
                  : "Decoded text will appear here..."
                }
                value={outputText}
                readOnly
                className={mode === "encode" ? "font-mono text-sm" : ""}
                rows={8}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Characters: {outputText.length}</span>
                {mode === "decode" && outputText && (
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

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Base64</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format 
              by translating it into a radix-64 representation.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>URL Safe:</strong> Base64 encoded data can be safely transmitted over media designed for textual data.</li>
              <li><strong>Email Compatible:</strong> Commonly used for encoding binary attachments in email.</li>
              <li><strong>Size Increase:</strong> Base64 encoding increases the size of data by approximately 33%.</li>
              <li><strong>Character Set:</strong> Uses A-Z, a-z, 0-9, +, /, and = for padding.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
