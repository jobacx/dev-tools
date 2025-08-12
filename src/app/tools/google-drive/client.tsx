"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Copy, FileDown, AlertCircle, Check, Link } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function GoogleDriveClient() {
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(directLink);
      setCopied(true);
      toast.success("Direct link copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const clearAll = () => {
    setSharingUrl("");
    setDirectLink("");
    setError("");
    setCopied(false);
  };

  const testDirectLink = () => {
    if (directLink) {
      window.open(directLink, '_blank');
      toast.success("Opening direct link in new tab");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileDown className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Google Drive Direct Link Generator</h1>
          <p className="text-muted-foreground">Convert Google Drive sharing links to direct download links</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link Converter
          </CardTitle>
          <CardDescription>
            Enter your Google Drive sharing URL to generate a direct download link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sharing-url">Google Drive Sharing URL</Label>
              <Input
                id="sharing-url"
                placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                value={sharingUrl}
                onChange={(e) => setSharingUrl(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={generateDirectLink} className="flex-1">
                Generate Direct Link
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </div>

          {directLink && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="direct-link">Direct Download Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="direct-link"
                    value={directLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className={copied ? "border-green-500 text-green-600" : ""}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={testDirectLink} className="flex-1">
                  Test Direct Link
                </Button>
                <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Step 1: Get your Google Drive sharing link</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Go to Google Drive and find your file</li>
                <li>Right-click on the file and select &quot;Share&quot;</li>
                <li>Set the permissions to &quot;Anyone with the link&quot;</li>
                <li>Copy the sharing URL</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 2: Generate direct link</h3>
              <p className="text-sm text-muted-foreground">
                Paste your sharing URL above and click &quot;Generate Direct Link&quot; to get a direct download URL.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Supported URL formats:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><code>https://drive.google.com/file/d/FILE_ID/view</code></li>
                <li><code>https://drive.google.com/open?id=FILE_ID</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>File Permissions:</strong> The file must be set to &quot;Anyone with the link&quot; for direct links to work.</li>
              <li><strong>Large Files:</strong> For files larger than 25MB, Google may show a virus scan warning page.</li>
              <li><strong>Usage:</strong> Direct links are perfect for embedding images, downloading files programmatically, or hotlinking.</li>
              <li><strong>Privacy:</strong> All processing happens in your browser - no data is sent to external servers.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
