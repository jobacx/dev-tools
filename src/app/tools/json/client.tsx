"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, FileCode, CheckCircle, XCircle, AlertCircle, Minimize, Code } from "lucide-react";

type JsonAction = "format" | "validate" | "minify";
type IndentType = "2" | "4" | "tab";

interface JsonResult {
  isValid: boolean;
  formatted?: string;
  minified?: string;
  error?: string;
  size: {
    original: number;
    processed?: number;
  };
}

export default function JsonClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [action, setAction] = useState<JsonAction>("format");
  const [indentType, setIndentType] = useState<IndentType>("2");
  const [result, setResult] = useState<JsonResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getIndentString = (type: IndentType): string => {
    switch (type) {
      case "2":
        return "  ";
      case "4":
        return "    ";
      case "tab":
        return "\t";
      default:
        return "  ";
    }
  };

  const processJson = () => {
    if (!input.trim()) {
      toast.error("Please enter some JSON to process");
      return;
    }

    setIsProcessing(true);
    
    try {
      // First, try to parse the JSON to validate it
      const parsed = JSON.parse(input);
      const originalSize = new Blob([input]).size;
      
      let processedJson = "";
      let processedSize = originalSize;
      
      switch (action) {
        case "format":
          processedJson = JSON.stringify(parsed, null, getIndentString(indentType));
          processedSize = new Blob([processedJson]).size;
          break;
        case "minify":
          processedJson = JSON.stringify(parsed);
          processedSize = new Blob([processedJson]).size;
          break;
        case "validate":
          processedJson = "✅ Valid JSON";
          break;
      }

      setOutput(processedJson);
      setResult({
        isValid: true,
        formatted: action === "format" ? processedJson : undefined,
        minified: action === "minify" ? processedJson : undefined,
        size: {
          original: originalSize,
          processed: action !== "validate" ? processedSize : undefined,
        },
      });

      const actionText = action === "format" ? "formatted" : action === "minify" ? "minified" : "validated";
      toast.success(`JSON ${actionText} successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setOutput("");
      setResult({
        isValid: false,
        error: errorMessage,
        size: {
          original: new Blob([input]).size,
        },
      });
      toast.error("Invalid JSON");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setResult(null);
    toast.success("Cleared all data");
  };

  const loadSampleJson = () => {
    const sampleJson = {
      "name": "John Doe",
      "age": 30,
      "email": "john.doe@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001",
        "country": "USA"
      },
      "hobbies": ["reading", "swimming", "photography"],
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00Z",
      "preferences": {
        "theme": "dark",
        "notifications": {
          "email": true,
          "push": false,
          "sms": true
        }
      }
    };
    
    setInput(JSON.stringify(sampleJson, null, 2));
    toast.success("Sample JSON loaded");
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSavingsPercentage = (): number => {
    if (!result?.size.processed || !result?.size.original) return 0;
    return Math.round(((result.size.original - result.size.processed) / result.size.original) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileCode className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">JSON Formatter/Validator</h1>
          <p className="text-muted-foreground">Format, validate, and minify JSON data with ease</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                JSON Input
              </CardTitle>
              <CardDescription>
                Paste your JSON data below to format, validate, or minify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={action} onValueChange={(value: JsonAction) => setAction(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="format">Format</SelectItem>
                    <SelectItem value="validate">Validate</SelectItem>
                    <SelectItem value="minify">Minify</SelectItem>
                  </SelectContent>
                </Select>
                
                {action === "format" && (
                  <Select value={indentType} onValueChange={(value: IndentType) => setIndentType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Spaces</SelectItem>
                      <SelectItem value="4">4 Spaces</SelectItem>
                      <SelectItem value="tab">Tab</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                
                <Button variant="outline" onClick={loadSampleJson} className="ml-auto">
                  Load Sample
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="json-input">JSON Data</Label>
                <Textarea
                  id="json-input"
                  placeholder="Paste your JSON here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono min-h-[300px] text-sm"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Size: {formatBytes(new Blob([input]).size)}</span>
                  <span>Lines: {input.split('\n').length}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={processJson} 
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? "Processing..." : action === "format" ? "Format JSON" : action === "validate" ? "Validate JSON" : "Minify JSON"}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Action Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className={`p-3 rounded-lg border transition-colors ${
                    action === "format" 
                      ? "bg-primary/5 border-primary" 
                      : "bg-muted/30"
                  }`}
                >
                  <div className="font-medium text-sm">Format</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Pretty-print JSON with proper indentation
                  </div>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border transition-colors ${
                    action === "validate" 
                      ? "bg-primary/5 border-primary" 
                      : "bg-muted/30"
                  }`}
                >
                  <div className="font-medium text-sm">Validate</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Check if JSON syntax is valid
                  </div>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border transition-colors ${
                    action === "minify" 
                      ? "bg-primary/5 border-primary" 
                      : "bg-muted/30"
                  }`}
                >
                  <div className="font-medium text-sm">Minify</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Remove whitespace to reduce file size
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {result.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {result.isValid ? "Processing Result" : "Validation Error"}
              </CardTitle>
              {output && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(output, "Result")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result.isValid ? (
              <div className="space-y-4">
                {/* Size Information */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Original:</span>
                    <span className="font-mono">{formatBytes(result.size.original)}</span>
                  </div>
                  {result.size.processed && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Processed:</span>
                        <span className="font-mono">{formatBytes(result.size.processed)}</span>
                      </div>
                      {action === "minify" && (
                        <div className="flex items-center gap-2">
                          <Minimize className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {getSavingsPercentage()}% smaller
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Output */}
                {output && action !== "validate" && (
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <Textarea
                      value={output}
                      readOnly
                      className="font-mono text-sm min-h-[200px]"
                    />
                  </div>
                )}

                {action === "validate" && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-800 font-medium">Valid JSON</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-800 font-medium">Invalid JSON</span>
                </div>
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <Label className="text-sm font-medium">Error Details:</Label>
                  <p className="text-sm text-red-600 font-mono mt-1">{result.error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            About JSON
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format 
              that is easy for humans to read and write.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Format:</strong> Pretty-print JSON with proper indentation for readability</li>
              <li><strong>Validate:</strong> Check if your JSON syntax is correct and follows standards</li>
              <li><strong>Minify:</strong> Remove unnecessary whitespace to reduce file size</li>
              <li><strong>Data Types:</strong> Supports strings, numbers, booleans, arrays, objects, and null</li>
              <li><strong>Use Cases:</strong> APIs, configuration files, data storage, and web development</li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> Use formatting for development and debugging, then minify for production 
                to reduce bandwidth and improve loading times.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
