"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Hash, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BcryptClient() {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [saltRounds, setSaltRounds] = useState("10");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyHashInput, setVerifyHashInput] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const generateHash = async () => {
    if (!password) {
      toast.error("Please enter a password to hash");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/bcrypt/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          saltRounds: parseInt(saltRounds),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to generate hash");
        return;
      }

      setHash(data.hash);
      toast.success("Hash generated successfully");
    } catch (error) {
      toast.error("Failed to generate hash");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyHashFunction = async () => {
    if (!verifyPassword || !verifyHashInput) {
      toast.error("Please enter both password and hash to verify");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/bcrypt/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: verifyPassword,
          hash: verifyHashInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to verify hash");
        setVerificationResult(null);
        return;
      }

      setVerificationResult(data.isValid);
      toast.success(data.isValid ? "Password matches!" : "Password does not match");
    } catch (error) {
      toast.error("Failed to verify hash");
      console.error(error);
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Hash className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Bcrypt Hash Generator</h1>
          <p className="text-muted-foreground">Generate and verify secure bcrypt hashes for password protection</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Generate Hash */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Generate Hash
            </CardTitle>
            <CardDescription>
              Enter a password to generate a secure bcrypt hash
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter password to hash"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Salt Rounds</label>
              <Select value={saltRounds} onValueChange={setSaltRounds}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 (Fast)</SelectItem>
                  <SelectItem value="10">10 (Default)</SelectItem>
                  <SelectItem value="12">12 (Secure)</SelectItem>
                  <SelectItem value="14">14 (Very Secure)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Higher rounds = more secure but slower
              </p>
            </div>

            <Button 
              onClick={generateHash} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Hash"
              )}
            </Button>

            {hash && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Generated Hash</label>
                <div className="relative">
                  <Textarea
                    value={hash}
                    readOnly
                    className="pr-10 font-mono text-sm"
                    rows={3}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(hash)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verify Hash */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Verify Hash
            </CardTitle>
            <CardDescription>
              Verify if a password matches a bcrypt hash
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter password to verify"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hash</label>
              <Textarea
                placeholder="Enter bcrypt hash to verify against"
                value={verifyHashInput}
                onChange={(e) => setVerifyHashInput(e.target.value)}
                className="font-mono text-sm"
                rows={3}
              />
            </div>

            <Button 
              onClick={verifyHashFunction} 
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Password"
              )}
            </Button>

            {verificationResult !== null && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                verificationResult 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {verificationResult ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {verificationResult ? "Password matches!" : "Password does not match"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Bcrypt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Bcrypt is a password hashing function designed to be slow and computationally expensive, 
              making it resistant to brute-force attacks.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Salt Rounds:</strong> Controls the cost of hashing. Each increment doubles the time.</li>
              <li><strong>Built-in Salt:</strong> Each hash includes a unique salt, preventing rainbow table attacks.</li>
              <li><strong>Future-proof:</strong> The cost can be increased as hardware becomes more powerful.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
