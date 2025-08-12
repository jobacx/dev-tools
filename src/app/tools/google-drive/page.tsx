"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Copy, FileDown, AlertCircle, Check, Link } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function GoogleDriveTool() {
  const [sharingUrl, setSharingUrl] = useState("");
  const [directLink, setDirectLink] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateDirectLink = () => {
    setError("");
    setDirectLink("");
    setCopied(false);

    // Check if URL is empty
    if (!sharingUrl.trim()) {
      setError("Please enter a Google Drive sharing URL");
      toast.error("Please enter a Google Drive sharing URL");
      return;
    }

    // Extract file ID using regex
    let fileId = "";

    // Match patterns like /file/d/FILE_ID/view or /open?id=FILE_ID
    const filePattern = /\/file\/d\/([a-zA-Z0-9_-]+)\/|\/open\?id=([a-zA-Z0-9_-]+)/;
    const match = sharingUrl.match(filePattern);

    if (match) {
      fileId = match[1] || match[2];
    } else {
      setError("Invalid Google Drive URL format. Please use a valid sharing URL.");
      toast.error("Invalid Google Drive URL format");
      return;
    }

    // Generate direct download link
    const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
    setDirectLink(downloadLink);
    toast.success("Direct download link generated successfully");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setSharingUrl("");
    setDirectLink("");
    setError("");
    setCopied(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      generateDirectLink();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileDown className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Google Drive Link Generator</h1>
          <p className="text-muted-foreground">Convert Google Drive sharing links to direct download links</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Generate Direct Download Link
            </span>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </CardTitle>
          <CardDescription>
            Enter a Google Drive sharing URL to generate a direct download link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Drive Sharing URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Google Drive Sharing URL</Label>
            <Input
              placeholder="https://drive.google.com/file/d/1LDRlyZa..."
              value={sharingUrl}
              onChange={(e) => setSharingUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Paste your Google Drive sharing URL here
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <div className="flex">
            <Button 
              onClick={generateDirectLink} 
              className="w-full" 
              size="lg"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Generate Direct Link
            </Button>
          </div>

          {/* Direct Download Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Direct Download Link</Label>
              {directLink && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(directLink)}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <Input
              placeholder="Direct download link will appear here..."
              value={directLink}
              readOnly
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              <span>Characters: {directLink.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Usage Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm space-y-3">
              <div>
                <h4 className="font-medium mb-2">Step 1: Get Google Drive Sharing URL</h4>
                <p className="text-muted-foreground">
                  Right-click on your file in Google Drive and select &quot;Get link&quot; or &quot;Share&quot;. 
                  Make sure the file is set to &quot;Anyone with the link can view&quot;.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Step 2: Paste the URL</h4>
                <p className="text-muted-foreground">
                  Copy the sharing URL and paste it into the input field above.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Step 3: Generate Direct Link</h4>
                <p className="text-muted-foreground">
                  Click &quot;Generate Direct Link&quot; to convert it to a direct download URL.
                </p>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Example URLs:</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <strong>Input:</strong> https://drive.google.com/file/d/1ABC123.../view?usp=sharing
                </div>
                <div>
                  <strong>Output:</strong> https://drive.google.com/uc?export=download&id=1ABC123...
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Direct Download Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This tool converts Google Drive sharing URLs into direct download links that can be used 
              for automated downloads, embedding, or programmatic access.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Direct Access:</strong> Bypass the Google Drive preview page for immediate downloads</li>
              <li><strong>Automation:</strong> Use in scripts, applications, or automated workflows</li>
              <li><strong>File Sharing:</strong> Perfect for sharing files that should download directly</li>
              <li><strong>Embedding:</strong> Use in applications that need direct file access</li>
            </ul>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-xs">
                <strong>Note:</strong> The file must be publicly accessible (set to &quot;Anyone with the link can view&quot;) 
                for the direct download link to work properly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
