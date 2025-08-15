"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, QrCode, Download, Wifi, User, Link as LinkIcon, Type, AlertCircle } from "lucide-react";
import QRCodeLib from "qrcode";

type QRDataType = "text" | "url" | "wifi" | "contact" | "email" | "phone";
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

interface WiFiData {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
}

interface ContactData {
  name: string;
  phone: string;
  email: string;
  organization: string;
}

export default function QrCodeClient() {
  const [text, setText] = useState("https://dev-tools.vercel.app");
  const [dataType, setDataType] = useState<QRDataType>("url");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [size, setSize] = useState([256]);
  const [margin, setMargin] = useState([4]);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>("M");
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  
  // WiFi specific data
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: "",
    password: "",
    security: "WPA"
  });

  // Contact specific data
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    phone: "",
    email: "",
    organization: ""
  });



  const generateWiFiString = (data: WiFiData): string => {
    const { ssid, password, security } = data;
    if (!ssid) return "";
    
    const escapedSSID = ssid.replace(/([\\";,:])/g, '\\$1');
    const escapedPassword = password.replace(/([\\";,:])/g, '\\$1');
    
    return `WIFI:T:${security};S:${escapedSSID};P:${escapedPassword};H:false;`;
  };

  const generateVCardString = (data: ContactData): string => {
    const { name, phone, email, organization } = data;
    if (!name && !phone && !email) return "";
    
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      name ? `FN:${name}` : "",
      phone ? `TEL:${phone}` : "",
      email ? `EMAIL:${email}` : "",
      organization ? `ORG:${organization}` : "",
      "END:VCARD"
    ].filter(Boolean).join("\\n");
  };

  const getQRData = (): string => {
    switch (dataType) {
      case "wifi":
        return generateWiFiString(wifiData);
      case "contact":
        return generateVCardString(contactData);
      case "email":
        return `mailto:${text}`;
      case "phone":
        return `tel:${text}`;
      default:
        return text;
    }
  };

  const generateQRCode = async () => {
    try {
      const qrData = getQRData();
      
      if (!qrData) {
        toast.error("Please enter data to generate QR code");
        return;
      }

      const options = {
        errorCorrectionLevel: errorCorrectionLevel,
        width: size[0],
        margin: margin[0],
        color: {
          dark: color,
          light: backgroundColor
        }
      };

      const url = await QRCodeLib.toDataURL(qrData, options);
      setQrCodeUrl(url);
      toast.success("QR code generated successfully");
    } catch (error) {
      toast.error("Failed to generate QR code");
      console.error(error);
    }
  };

  const downloadQRCode = (format: "png" | "svg" = "png") => {
    if (!qrCodeUrl) {
      toast.error("Please generate a QR code first");
      return;
    }

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `qr-code-${Date.now()}.png`;
      link.href = qrCodeUrl;
      link.click();
      toast.success("QR code downloaded as PNG");
    } else if (format === "svg") {
      const qrData = getQRData();
      if (!qrData) return;

      QRCodeLib.toString(qrData, { 
        type: 'svg',
        errorCorrectionLevel: errorCorrectionLevel,
        width: size[0],
        margin: margin[0],
        color: {
          dark: color,
          light: backgroundColor
        }
      }).then(svgString => {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `qr-code-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("QR code downloaded as SVG");
      }).catch(error => {
        toast.error("Failed to generate SVG");
        console.error(error);
      });
    }
  };

  const copyToClipboard = () => {
    if (!qrCodeUrl) {
      toast.error("No QR code to copy");
      return;
    }
    
    // Create a temporary canvas to copy the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(() => {
            toast.success("QR code copied to clipboard");
          }).catch(() => {
            toast.error("Failed to copy QR code");
          });
        }
      });
    };
    
    img.src = qrCodeUrl;
  };

  // Auto-generate QR code when data changes
  useEffect(() => {
    if (getQRData()) {
      generateQRCode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, dataType, wifiData, contactData, size, margin, errorCorrectionLevel, color, backgroundColor]);

  const renderDataInput = () => {
    switch (dataType) {
      case "wifi":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input
                id="wifi-ssid"
                placeholder="Enter WiFi network name"
                value={wifiData.ssid}
                onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifi-password">Password</Label>
              <Input
                id="wifi-password"
                type="password"
                placeholder="Enter WiFi password"
                value={wifiData.password}
                onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifi-security">Security Type</Label>
              <Select value={wifiData.security} onValueChange={(value: "WPA" | "WEP" | "nopass") => 
                setWifiData(prev => ({ ...prev, security: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Full Name</Label>
              <Input
                id="contact-name"
                placeholder="Enter full name"
                value={contactData.name}
                onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                placeholder="Enter phone number"
                value={contactData.phone}
                onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="Enter email address"
                value={contactData.email}
                onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-org">Organization</Label>
              <Input
                id="contact-org"
                placeholder="Enter organization (optional)"
                value={contactData.organization}
                onChange={(e) => setContactData(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="text-input">
              {dataType === "url" ? "URL" : 
               dataType === "email" ? "Email Address" :
               dataType === "phone" ? "Phone Number" : "Text"}
            </Label>
            <Textarea
              id="text-input"
              placeholder={
                dataType === "url" ? "https://example.com" :
                dataType === "email" ? "user@example.com" :
                dataType === "phone" ? "+1234567890" :
                "Enter your text here..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </div>
        );
    }
  };

  const getDataTypeIcon = (type: QRDataType) => {
    switch (type) {
      case "url": return <LinkIcon className="h-4 w-4" />;
      case "wifi": return <Wifi className="h-4 w-4" />;
      case "contact": return <User className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <QrCode className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
          <p className="text-muted-foreground">Generate customizable QR codes with various design and download options</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Data Type</CardTitle>
              <CardDescription>Select the type of data for your QR code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([
                  { value: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
                  { value: "url", label: "URL", icon: <LinkIcon className="h-4 w-4" /> },
                  { value: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
                  { value: "contact", label: "Contact", icon: <User className="h-4 w-4" /> },
                ] as const).map((type) => (
                  <Button
                    key={type.value}
                    variant={dataType === type.value ? "default" : "outline"}
                    onClick={() => setDataType(type.value)}
                    className="h-auto p-4 flex flex-col gap-2"
                  >
                    {type.icon}
                    <span className="text-sm">{type.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getDataTypeIcon(dataType)}
                {dataType === "text" ? "Text Input" :
                 dataType === "url" ? "URL Input" :
                 dataType === "wifi" ? "WiFi Configuration" :
                 dataType === "contact" ? "Contact Information" :
                 "Data Input"}
              </CardTitle>
              <CardDescription>
                {dataType === "wifi" ? "Enter WiFi network details to generate a QR code for easy connection" :
                 dataType === "contact" ? "Enter contact information to generate a vCard QR code" :
                 dataType === "url" ? "Enter the URL you want to encode in the QR code" :
                 "Enter the data you want to encode in the QR code"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDataInput()}
            </CardContent>
          </Card>
        </div>

        {/* Settings & QR Code Preview */}
        <div className="space-y-6">
          {/* QR Code Preview */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>Generated QR code will appear here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                {qrCodeUrl ? (
                  <div className="relative group">
                    <Image
                      src={qrCodeUrl} 
                      alt="Generated QR Code" 
                      width={size[0]}
                      height={size[0]}
                      className="max-w-full h-auto border rounded-lg"
                      style={{ backgroundColor: backgroundColor }}
                    />
                  </div>
                ) : (
                  <div 
                    className="flex items-center justify-center border-2 border-dashed border-muted-foreground rounded-lg"
                    style={{ width: size[0], height: size[0] }}
                  >
                    <div className="text-center text-muted-foreground">
                      <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">QR code will appear here</p>
                    </div>
                  </div>
                )}
              </div>
              
              {qrCodeUrl && (
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={() => downloadQRCode("png")} variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    PNG
                  </Button>
                  <Button onClick={() => downloadQRCode("svg")} variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    SVG
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your QR code appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Size</Label>
                  <span className="text-sm font-medium">{size[0]}px</span>
                </div>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  max={512}
                  min={128}
                  step={32}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Margin</Label>
                  <span className="text-sm font-medium">{margin[0]}</span>
                </div>
                <Slider
                  value={margin}
                  onValueChange={setMargin}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>

              {/* Error Correction */}
              <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <Select value={errorCorrectionLevel} onValueChange={(value: ErrorCorrectionLevel) => setErrorCorrectionLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foreground-color">Foreground</Label>
                  <div className="flex gap-2">
                    <Input
                      id="foreground-color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-10 p-1 rounded border"
                    />
                    <Input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="background-color">Background</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 p-1 rounded border"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            About QR Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              QR (Quick Response) codes are two-dimensional barcodes that can store various types of information 
              and can be quickly scanned by smartphones and other devices.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Error Correction:</strong> Higher levels allow the code to be readable even if partially damaged.</li>
              <li><strong>WiFi QR Codes:</strong> Allow devices to automatically connect to wireless networks.</li>
              <li><strong>vCard Contact:</strong> Create QR codes that add contact information to address books.</li>
              <li><strong>Size & Margin:</strong> Larger codes are easier to scan, and adequate margin ensures reliable scanning.</li>
              <li><strong>Color Contrast:</strong> Ensure sufficient contrast between foreground and background colors.</li>
              <li><strong>Testing:</strong> Always test your QR codes with multiple devices before using them.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
