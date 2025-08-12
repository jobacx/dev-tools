"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { toast } from "sonner";
import { Copy, Key, RefreshCw, Shield, AlertCircle } from "lucide-react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [minNumbers, setMinNumbers] = useState(1);
  const [minSymbols, setMinSymbols] = useState(1);

  // Character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const similarChars = "il1Lo0O";
  const ambiguousChars = "{}[]()/\\'\"`~,;<>.?";

  const generatePassword = () => {
    let charset = "";
    let guaranteedChars = "";

    // Build character set based on options
    if (includeUppercase) {
      let upperSet = uppercase;
      if (excludeSimilar) {
        upperSet = upperSet.replace(/[IL0O]/g, "");
      }
      charset += upperSet;
    }

    if (includeLowercase) {
      let lowerSet = lowercase;
      if (excludeSimilar) {
        lowerSet = lowerSet.replace(/[il]/g, "");
      }
      charset += lowerSet;
    }

    if (includeNumbers) {
      let numberSet = numbers;
      if (excludeSimilar) {
        numberSet = numberSet.replace(/[10]/g, "");
      }
      charset += numberSet;
    }

    if (includeSymbols) {
      let symbolSet = symbols;
      if (excludeAmbiguous) {
        symbolSet = symbolSet.replace(/[{}[\]()/\\'\"`~,;<>.?]/g, "");
      }
      charset += symbolSet;
    }

    if (!charset) {
      toast.error("Please select at least one character type");
      return;
    }

    // Ensure minimum requirements are met
    if (includeNumbers && minNumbers > 0) {
      let numberSet = numbers;
      if (excludeSimilar) {
        numberSet = numberSet.replace(/[10]/g, "");
      }
      for (let i = 0; i < minNumbers; i++) {
        guaranteedChars += numberSet[Math.floor(Math.random() * numberSet.length)];
      }
    }

    if (includeSymbols && minSymbols > 0) {
      let symbolSet = symbols;
      if (excludeAmbiguous) {
        symbolSet = symbolSet.replace(/[{}[\]()/\\'\"`~,;<>.?]/g, "");
      }
      for (let i = 0; i < minSymbols; i++) {
        guaranteedChars += symbolSet[Math.floor(Math.random() * symbolSet.length)];
      }
    }

    // Generate remaining characters
    let result = guaranteedChars;
    const remainingLength = length[0] - guaranteedChars.length;

    for (let i = 0; i < remainingLength; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password to avoid predictable patterns
    result = result.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(result);
  };

  // Generate password on component mount and when settings change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous, minNumbers, minSymbols]);

  const copyToClipboard = () => {
    if (!password) {
      toast.error("No password to copy");
      return;
    }
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard");
  };

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "No Password", color: "text-gray-500" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length >= 16) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "text-red-500" };
    if (score <= 4) return { score, label: "Fair", color: "text-yellow-500" };
    if (score <= 5) return { score, label: "Good", color: "text-blue-500" };
    return { score, label: "Strong", color: "text-green-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Key className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Password Generator</h1>
          <p className="text-muted-foreground">Generate secure, customizable passwords with advanced options</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Generated Password */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Generated Password
              </CardTitle>
              <CardDescription>
                Your secure password is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    value={password}
                    readOnly
                    className="font-mono text-lg pr-20 text-center tracking-wide"
                    style={{ fontSize: "16px" }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={generatePassword}
                      title="Generate new password"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyToClipboard}
                      title="Copy password"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>Strength:</span>
                    <span className={`font-medium ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {password.length} characters
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      strength.score <= 2 ? "bg-red-500" :
                      strength.score <= 4 ? "bg-yellow-500" :
                      strength.score <= 5 ? "bg-blue-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(strength.score / 7) * 100}%` }}
                  />
                </div>
              </div>

              <Button onClick={copyToClipboard} className="w-full" size="lg">
                <Copy className="h-4 w-4 mr-2" />
                Copy Password
              </Button>
            </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Customize Password</CardTitle>
            <CardDescription>
              Adjust settings to meet your requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="length">Length</Label>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {length[0]}
                </span>
              </div>
              <Slider
                id="length"
                min={4}
                max={128}
                step={1}
                value={length}
                onValueChange={setLength}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Types */}
            <div className="space-y-3">
              <Label>Character Types</Label>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                  />
                  <Label htmlFor="uppercase" className="text-sm">
                    Uppercase (A-Z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                  />
                  <Label htmlFor="lowercase" className="text-sm">
                    Lowercase (a-z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                  />
                  <Label htmlFor="numbers" className="text-sm">
                    Numbers (0-9)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                  />
                  <Label htmlFor="symbols" className="text-sm">
                    Symbols (!@#$...)
                  </Label>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-3">
              <Label>Advanced Options</Label>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeSimilar"
                    checked={excludeSimilar}
                    onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                  />
                  <Label htmlFor="excludeSimilar" className="text-sm">
                    Exclude similar (i, l, 1, L, o, 0, O)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeAmbiguous"
                    checked={excludeAmbiguous}
                    onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
                  />
                  <Label htmlFor="excludeAmbiguous" className="text-sm">
                    Exclude ambiguous symbols
                  </Label>
                </div>
              </div>
            </div>

            {/* Minimum Requirements */}
            {(includeNumbers || includeSymbols) && (
              <div className="space-y-3">
                <Label>Minimum Requirements</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {includeNumbers && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="minNumbers" className="text-sm">
                          Min Numbers
                        </Label>
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {minNumbers}
                        </span>
                      </div>
                      <Slider
                        id="minNumbers"
                        min={0}
                        max={Math.min(10, length[0])}
                        step={1}
                        value={[minNumbers]}
                        onValueChange={(value) => setMinNumbers(value[0])}
                        className="w-full"
                      />
                    </div>
                  )}
                  {includeSymbols && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="minSymbols" className="text-sm">
                          Min Symbols
                        </Label>
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {minSymbols}
                        </span>
                      </div>
                      <Slider
                        id="minSymbols"
                        min={0}
                        max={Math.min(10, length[0])}
                        step={1}
                        value={[minSymbols]}
                        onValueChange={(value) => setMinSymbols(value[0])}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Password Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Length matters:</strong> Longer passwords are exponentially harder to crack</li>
              <li><strong>Use unique passwords:</strong> Never reuse passwords across different accounts</li>
              <li><strong>Enable 2FA:</strong> Two-factor authentication adds an extra layer of security</li>
              <li><strong>Use a password manager:</strong> Store passwords securely and generate unique ones automatically</li>
              <li><strong>Regular updates:</strong> Change passwords periodically, especially for critical accounts</li>
              <li><strong>Avoid personal info:</strong> Don't use names, dates, or other personal information</li>
            </ul>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-xs">
                <strong>Tip:</strong> A 12+ character password with mixed character types is recommended for most accounts. 
                For high-security accounts, consider 16+ characters.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
