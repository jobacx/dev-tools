"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Key, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JWTTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  
  // Encode state
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [algorithm, setAlgorithm] = useState("HS256");
  const [expiresIn, setExpiresIn] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Decode state
  const [tokenInput, setTokenInput] = useState("");
  const [decodeSecret, setDecodeSecret] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  const generateJWT = async () => {
    if (!payload || !secret) {
      toast.error("Please provide both payload and secret");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/jwt/encode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload,
          secret,
          algorithm,
          expiresIn: expiresIn || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to generate JWT");
        return;
      }

      setGeneratedToken(data.token);
      toast.success("JWT generated successfully");
    } catch (error) {
      toast.error("Failed to generate JWT");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const decodeJWT = async () => {
    if (!tokenInput) {
      toast.error("Please provide a JWT token");
      return;
    }

    setIsDecoding(true);
    try {
      const response = await fetch('/api/jwt/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: tokenInput,
          secret: decodeSecret || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to decode JWT");
        return;
      }

      setDecodedHeader(JSON.stringify(data.header, null, 2));
      setDecodedPayload(JSON.stringify(data.payload, null, 2));

      // Set verification result
      if (decodeSecret) {
        setVerificationResult(data.verified ? "valid" : "invalid");
        toast.success(data.verified ? "JWT decoded and verified successfully" : "JWT decoded but verification failed");
      } else {
        setVerificationResult(null);
        toast.success("JWT decoded (not verified - no secret provided)");
      }
    } catch (error) {
      toast.error("Failed to decode JWT");
      console.error(error);
    } finally {
      setIsDecoding(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const clearAll = () => {
    if (mode === "encode") {
      setPayload('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
      setSecret("your-256-bit-secret");
      setExpiresIn("");
      setGeneratedToken("");
      setIsGenerating(false);
    } else {
      setTokenInput("");
      setDecodeSecret("");
      setDecodedHeader("");
      setDecodedPayload("");
      setVerificationResult(null);
      setIsDecoding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Key className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">JWT Encoder/Decoder</h1>
          <p className="text-muted-foreground">Create, decode, and verify JSON Web Tokens</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>JWT Tool</span>
            <div className="flex gap-2">
              <Select value={mode} onValueChange={(value: "encode" | "decode") => setMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encode">Encode</SelectItem>
                  <SelectItem value="decode">Decode</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "encode" ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payload (JSON)</label>
                    <Textarea
                      placeholder="Enter JWT payload as JSON"
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      className="font-mono text-sm"
                      rows={8}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Algorithm</label>
                      <Select value={algorithm} onValueChange={setAlgorithm}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HS256">HS256</SelectItem>
                          <SelectItem value="HS384">HS384</SelectItem>
                          <SelectItem value="HS512">HS512</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expires In (optional)</label>
                      <Input
                        placeholder="e.g., 1h, 30m, 7d"
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret</label>
                    <div className="relative">
                      <Input
                        type={showSecret ? "text" : "password"}
                        placeholder="Enter your secret key"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={generateJWT} className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate JWT"
                    )}
                  </Button>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Generated JWT</label>
                      {generatedToken && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedToken)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                    <Textarea
                      placeholder="Generated JWT will appear here..."
                      value={generatedToken}
                      readOnly
                      className="font-mono text-sm"
                      rows={8}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">JWT Token</label>
                  <Textarea
                    placeholder="Paste your JWT token here"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Secret (for verification - optional)</label>
                  <div className="relative">
                    <Input
                      type={showSecret ? "text" : "password"}
                      placeholder="Enter secret to verify signature"
                      value={decodeSecret}
                      onChange={(e) => setDecodeSecret(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button onClick={decodeJWT} className="w-full" disabled={isDecoding}>
                  {isDecoding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Decoding...
                    </>
                  ) : (
                    "Decode JWT"
                  )}
                </Button>

                {verificationResult && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    verificationResult === "valid"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {verificationResult === "valid" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {verificationResult === "valid" ? "Signature Verified" : "Invalid Signature"}
                    </span>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Header</label>
                    <Textarea
                      placeholder="Decoded header will appear here..."
                      value={decodedHeader}
                      readOnly
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payload</label>
                    <Textarea
                      placeholder="Decoded payload will appear here..."
                      value={decodedPayload}
                      readOnly
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            About JWT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims between two parties.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Structure:</strong> Header.Payload.Signature (three Base64-encoded parts)</li>
              <li><strong>Stateless:</strong> All information is contained within the token</li>
              <li><strong>Secure:</strong> Cryptographically signed to verify authenticity</li>
              <li><strong>Expiration:</strong> Can include expiration time for automatic invalidation</li>
            </ul>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-xs">
                <strong>Security Note:</strong> Never put sensitive information in JWT payload as it can be decoded without the secret.
                Always use HTTPS in production and keep your secret keys secure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
