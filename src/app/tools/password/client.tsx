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

export default function PasswordClient() {
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
  // const similarChars = "il1Lo0O";
  // const ambiguousChars = "{}[]()/\\'\"`~,;<>.?";

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
        numberSet = numberSet.replace(/[10O]/g, "");
      }
      charset += numberSet;

      // Add guaranteed numbers
      for (let i = 0; i < minNumbers; i++) {
        const randomChar = numberSet[Math.floor(Math.random() * numberSet.length)];
        guaranteedChars += randomChar;
      }
    }

    if (includeSymbols) {
      let symbolSet = symbols;
      if (excludeAmbiguous) {
        symbolSet = symbolSet.replace(/[{}[\]()\/\\'"`~,;<>.?]/g, "");
      }
      charset += symbolSet;

      // Add guaranteed symbols
      for (let i = 0; i < minSymbols; i++) {
        const randomChar = symbolSet[Math.floor(Math.random() * symbolSet.length)];
        guaranteedChars += randomChar;
      }
    }

    // Check if we have any character set selected
    if (charset.length === 0) {
      toast.error("Please select at least one character type");
      return;
    }

    // Generate random password
    let generatedPassword = guaranteedChars;
    const remainingLength = length[0] - guaranteedChars.length;

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    // Shuffle the password to mix guaranteed characters
    const passwordArray = generatedPassword.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    setPassword(passwordArray.join(''));
    toast.success("Password generated successfully");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard");
  };

  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: "No password", color: "text-gray-500" };

    let score = 0;
    const feedback = [];

    // Length scoring
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else feedback.push("Use at least 8 characters");

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Add lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Add uppercase letters");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("Add numbers");

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push("Add symbols");

    // Bonus points
    if (password.length >= 16) score += 1;
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password)) score += 1;

    if (score >= 7) return { level: 4, text: "Very Strong", color: "text-green-600" };
    if (score >= 5) return { level: 3, text: "Strong", color: "text-green-500" };
    if (score >= 3) return { level: 2, text: "Medium", color: "text-yellow-500" };
    if (score >= 1) return { level: 1, text: "Weak", color: "text-red-500" };
    return { level: 0, text: "Very Weak", color: "text-red-600" };
  };

  const strengthInfo = getPasswordStrength();

  // Generate initial password
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Password Generator</h1>
          <p className="text-muted-foreground">Generate secure, customizable passwords with advanced options</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Generated Password */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Generated Password
              </CardTitle>
              <CardDescription>
                Your secure password with strength indicator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center gap-2">
                    <div className={`text-sm font-medium ${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= strengthInfo.level
                              ? strengthInfo.level >= 3
                                ? "bg-green-500"
                                : strengthInfo.level >= 2
                                ? "bg-yellow-500"
                                : "bg-red-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    value={password}
                    readOnly
                    className="font-mono text-lg pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyToClipboard}
                      disabled={!password}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={generatePassword}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generatePassword} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Password
                </Button>
                <Button variant="outline" onClick={copyToClipboard} disabled={!password}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Customize your password generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Length</Label>
                  <span className="text-sm font-medium">{length[0]}</span>
                </div>
                <Slider
                  value={length}
                  onValueChange={setLength}
                  max={128}
                  min={4}
                  step={1}
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
                <div className="space-y-3">
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
                      Symbols (!@#$%^&*)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-3">
                <Label>Advanced Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-similar"
                      checked={excludeSimilar}
                      onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                    />
                    <Label htmlFor="exclude-similar" className="text-sm">
                      Exclude similar (i, l, 1, L, o, 0, O)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-ambiguous"
                      checked={excludeAmbiguous}
                      onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
                    />
                    <Label htmlFor="exclude-ambiguous" className="text-sm">
                      Exclude ambiguous symbols
                    </Label>
                  </div>
                </div>
              </div>

              {/* Minimum Requirements */}
              {(includeNumbers || includeSymbols) && (
                <div className="space-y-3">
                  <Label>Minimum Requirements</Label>
                  <div className="space-y-3">
                    {includeNumbers && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="min-numbers" className="text-sm">
                            Min Numbers
                          </Label>
                          <span className="text-sm font-medium">{minNumbers}</span>
                        </div>
                        <Input
                          id="min-numbers"
                          type="number"
                          min="0"
                          max="10"
                          value={minNumbers}
                          onChange={(e) => setMinNumbers(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                          className="h-8"
                        />
                      </div>
                    )}
                    {includeSymbols && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="min-symbols" className="text-sm">
                            Min Symbols
                          </Label>
                          <span className="text-sm font-medium">{minSymbols}</span>
                        </div>
                        <Input
                          id="min-symbols"
                          type="number"
                          min="0"
                          max="10"
                          value={minSymbols}
                          onChange={(e) => setMinSymbols(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                          className="h-8"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
              <li><strong>Length Matters:</strong> Longer passwords are exponentially harder to crack. Aim for at least 12 characters.</li>
              <li><strong>Use Variety:</strong> Include uppercase, lowercase, numbers, and symbols for maximum security.</li>
              <li><strong>Avoid Personal Info:</strong> Don&apos;t use names, birthdays, or other personal information.</li>
              <li><strong>Unique Passwords:</strong> Use a different password for each account or service.</li>
              <li><strong>Password Manager:</strong> Consider using a password manager to store and generate secure passwords.</li>
              <li><strong>Two-Factor Authentication:</strong> Enable 2FA when available for additional security.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
