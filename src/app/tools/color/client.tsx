"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Copy, Palette, Eye, RefreshCw } from "lucide-react";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorClient() {
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 }
  });

  // Helper functions for color conversions
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (diff !== 0) {
      switch (max) {
        case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const updateAllFormats = (rgb: { r: number; g: number; b: number }) => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorValues({ hex, rgb, hsl, hsv, cmyk });
  };

  const handleHexChange = (hex: string) => {
    if (hex.startsWith('#') && hex.length === 7) {
      const rgb = hexToRgb(hex);
      if (rgb) {
        updateAllFormats(rgb);
      }
    }
  };

  const handleRgbChange = (field: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...colorValues.rgb, [field]: Math.max(0, Math.min(255, value)) };
    updateAllFormats(newRgb);
  };

  const handleHslChange = (field: 'h' | 's' | 'l', value: number) => {
    const newHsl = { 
      ...colorValues.hsl, 
      [field]: field === 'h' ? Math.max(0, Math.min(360, value)) : Math.max(0, Math.min(100, value))
    };
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    updateAllFormats(rgb);
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${format} color copied to clipboard`);
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    updateAllFormats({ r, g, b });
    toast.success("Random color generated");
  };

  // Common color presets
  const colorPresets = [
    { name: "Red", hex: "#ef4444" },
    { name: "Orange", hex: "#f97316" },
    { name: "Yellow", hex: "#eab308" },
    { name: "Green", hex: "#22c55e" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Indigo", hex: "#6366f1" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Gray", hex: "#6b7280" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#ffffff" },
    { name: "Cyan", hex: "#06b6d4" }
  ];

  const loadPreset = (hex: string) => {
    handleHexChange(hex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Color Converter</h1>
          <p className="text-muted-foreground">Convert between different color formats (HEX, RGB, HSL, HSV, CMYK)</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Color Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Color Preview
              </CardTitle>
              <CardDescription>
                Current color with preview and quick actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="w-full h-32 rounded-lg border-2 border-border"
                style={{ backgroundColor: colorValues.hex }}
              ></div>
              
              <div className="text-center">
                <p className="text-lg font-mono">{colorValues.hex.toUpperCase()}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateRandomColor} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Random
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(colorValues.hex, "HEX")}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HEX
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Color Presets */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Color Presets</CardTitle>
              <CardDescription>
                Quick access to common colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    className="w-full aspect-square rounded-md border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: preset.hex }}
                    onClick={() => loadPreset(preset.hex)}
                    title={preset.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Format Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* HEX Input */}
          <Card>
            <CardHeader>
              <CardTitle>HEX Color</CardTitle>
              <CardDescription>Hexadecimal color representation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={colorValues.hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                />
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(colorValues.hex, "HEX")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RGB Input */}
          <Card>
            <CardHeader>
              <CardTitle>RGB Color</CardTitle>
              <CardDescription>Red, Green, Blue (0-255)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Red</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                  />
                  <Slider
                    value={[colorValues.rgb.r]}
                    onValueChange={([value]) => handleRgbChange('r', value)}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Green</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                  />
                  <Slider
                    value={[colorValues.rgb.g]}
                    onValueChange={([value]) => handleRgbChange('g', value)}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blue</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={colorValues.rgb.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                  />
                  <Slider
                    value={[colorValues.rgb.b]}
                    onValueChange={([value]) => handleRgbChange('b', value)}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`}
                  readOnly
                  className="font-mono"
                />
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`, "RGB")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* HSL Input */}
          <Card>
            <CardHeader>
              <CardTitle>HSL Color</CardTitle>
              <CardDescription>Hue (0-360°), Saturation (0-100%), Lightness (0-100%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Hue</Label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    value={colorValues.hsl.h}
                    onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                  />
                  <Slider
                    value={[colorValues.hsl.h]}
                    onValueChange={([value]) => handleHslChange('h', value)}
                    max={360}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Saturation</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsl.s}
                    onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                  />
                  <Slider
                    value={[colorValues.hsl.s]}
                    onValueChange={([value]) => handleHslChange('s', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lightness</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={colorValues.hsl.l}
                    onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                  />
                  <Slider
                    value={[colorValues.hsl.l]}
                    onValueChange={([value]) => handleHslChange('l', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`}
                  readOnly
                  className="font-mono"
                />
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`, "HSL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Formats */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* HSV */}
            <Card>
              <CardHeader>
                <CardTitle>HSV Color</CardTitle>
                <CardDescription>Hue, Saturation, Value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={`hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`}
                    readOnly
                    className="font-mono"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(`hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`, "HSV")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CMYK */}
            <Card>
              <CardHeader>
                <CardTitle>CMYK Color</CardTitle>
                <CardDescription>Cyan, Magenta, Yellow, Black</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`}
                    readOnly
                    className="font-mono"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`, "CMYK")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Color Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>HEX:</strong> Hexadecimal representation using # followed by 6 characters (0-9, A-F)</li>
              <li><strong>RGB:</strong> Red, Green, Blue values from 0-255, commonly used in digital displays</li>
              <li><strong>HSL:</strong> Hue (0-360°), Saturation (0-100%), Lightness (0-100%), intuitive for designers</li>
              <li><strong>HSV:</strong> Hue, Saturation, Value - similar to HSL but with different lightness calculation</li>
              <li><strong>CMYK:</strong> Cyan, Magenta, Yellow, Black (0-100%), used in print design</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
