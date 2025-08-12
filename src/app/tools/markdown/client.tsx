"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Eye, Download, Upload, Wand2, RotateCcw, AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import prettier from 'prettier/standalone';
import prettierMarkdown from 'prettier/parser-markdown';

// import 'highlight.js/styles/github.css';

export default function MarkdownClient() {
  const [inputText, setInputText] = useState(`# Markdown Preview

Welcome to the **Markdown Preview Tool**! 

## Features

- Live preview as you type
- GitHub Flavored Markdown support
- Syntax highlighting for code blocks
- Prettier formatting
- Copy to clipboard
- File import/export

## Example Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Table Example

| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| Syntax Highlighting | ✅ |
| Prettier Format | ✅ |
| Copy/Paste | ✅ |

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[Visit Google](https://google.com)

> This is a blockquote example.
> It can span multiple lines.

---

**Try editing this markdown to see the live preview!**
`);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Memoized markdown rendering for performance
  const renderedMarkdown = useMemo(() => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom components for better styling
          h1: ({children}) => <h1 className="text-3xl font-bold mb-4 pb-2 border-b">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-bold mb-3 mt-6 pb-1 border-b">{children}</h2>,
          h3: ({children}) => <h3 className="text-xl font-semibold mb-2 mt-5">{children}</h3>,
          h4: ({children}) => <h4 className="text-lg font-semibold mb-2 mt-4">{children}</h4>,
          h5: ({children}) => <h5 className="text-base font-semibold mb-2 mt-3">{children}</h5>,
          h6: ({children}) => <h6 className="text-sm font-semibold mb-2 mt-3">{children}</h6>,
          p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          li: ({children}) => <li className="ml-4">{children}</li>,
          blockquote: ({children}) => (
            <blockquote className="border-l-4 border-muted-foreground pl-4 my-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          code: (props: {className?: string; children?: React.ReactNode}) => {
            const { className, children, ...restProps } = props;
            const inline = !className;
            if (inline) {
              return (
                <code 
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                  {...restProps}
                >
                  {children}
                </code>
              );
            }
            return (
              <code 
                className={`${className} block bg-muted p-3 rounded-lg overflow-x-auto text-sm font-mono`}
                {...restProps}
              >
                {children}
              </code>
            );
          },
          pre: ({children}) => <pre className="mb-4 overflow-x-auto">{children}</pre>,
          table: ({children}) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border">{children}</table>
            </div>
          ),
          thead: ({children}) => <thead className="bg-muted">{children}</thead>,
          tbody: ({children}) => <tbody>{children}</tbody>,
          tr: ({children}) => <tr className="border-b border-border">{children}</tr>,
          th: ({children}) => <th className="px-4 py-2 text-left font-semibold">{children}</th>,
          td: ({children}) => <td className="px-4 py-2">{children}</td>,
          a: ({children, href}) => (
            <a 
              href={href} 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-6 border-border" />,
          img: ({src, alt}) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full h-auto rounded-lg my-4"
            />
          ),
        }}
      >
        {inputText}
      </ReactMarkdown>
    );
  }, [inputText]);

  const handleFormat = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter markdown text to format");
      return;
    }

    setIsFormatting(true);
    try {
      const formatted = await prettier.format(inputText, {
        parser: 'markdown',
        plugins: [prettierMarkdown],
        printWidth: 80,
        proseWrap: 'preserve',
        tabWidth: 2,
        useTabs: false,
      });
      setInputText(formatted);
      toast.success("Markdown formatted successfully");
    } catch (error) {
      toast.error("Failed to format markdown");
      console.error("Formatting error:", error);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      toast.error("Please select a markdown file (.md or .markdown)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputText(content);
      toast.success("Markdown file loaded successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);

    // Clear the input to allow the same file to be selected again
    event.target.value = '';
  }, []);

  const handleDownload = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("No markdown content to download");
      return;
    }

    const blob = new Blob([inputText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markdown-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Markdown file downloaded");
  }, [inputText]);

  const handleClear = () => {
    setInputText("");
    toast.success("Markdown cleared");
  };

  const getStats = () => {
    const lines = inputText.split('\n').length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const chars = inputText.length;
    const charsNoSpaces = inputText.replace(/\s/g, '').length;
    
    return { lines, words, chars, charsNoSpaces };
  };

  const stats = getStats();

  // Handle escape key for fullscreen exit
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex h-full flex-col">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Markdown Preview - Fullscreen</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(inputText, "Markdown")}
                  disabled={!inputText.trim()}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </Button>
              </div>
            </div>
            
            {/* Fullscreen Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-4xl prose prose-sm dark:prose-invert" style={{maxWidth: 'none'}}>
                {inputText.trim() ? (
                  renderedMarkdown
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No markdown content to preview</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Fullscreen Footer */}
            <div className="border-t p-4 text-center text-sm text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> to exit fullscreen
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Eye className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Markdown Preview</h1>
            <p className="text-muted-foreground">Live markdown editor with preview and formatting</p>
          </div>
        </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Markdown Editor
              </CardTitle>
              <CardDescription>
                Type or paste your markdown here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="markdown-input" className="text-sm font-medium">
                    Markdown Input
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".md,.markdown"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      disabled={!inputText.trim()}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="markdown-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="# Start typing your markdown here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-semibold">{stats.lines}</div>
                  <div className="text-muted-foreground">Lines</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-semibold">{stats.words}</div>
                  <div className="text-muted-foreground">Words</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-semibold">{stats.chars}</div>
                  <div className="text-muted-foreground">Characters</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-semibold">{stats.charsNoSpaces}</div>
                  <div className="text-muted-foreground">No Spaces</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleFormat}
                  disabled={isFormatting || !inputText.trim()}
                  className="flex-1 sm:flex-initial"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isFormatting ? "Formatting..." : "Format with Prettier"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCopy(inputText, "Markdown")}
                  disabled={!inputText.trim()}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={!inputText.trim()}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                Rendered markdown with GitHub flavored syntax
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="preview-content" className="text-sm font-medium">
                    Rendered Output
                  </label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={toggleFullscreen}
                      disabled={!inputText.trim()}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Fullscreen
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(inputText, "Rendered HTML")}
                      disabled={!inputText.trim()}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Markdown
                    </Button>
                  </div>
                </div>
                <div 
                  className="min-h-[400px] p-4 border rounded-lg bg-background overflow-auto prose prose-sm max-w-none dark:prose-invert"
                  style={{ maxHeight: '600px' }}
                >
                  {inputText.trim() ? (
                    renderedMarkdown
                  ) : (
                    <div className="text-center text-muted-foreground py-20">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your markdown preview will appear here...</p>
                    </div>
                  )}
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
            Markdown Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-3">
            <p>
              This markdown preview tool supports GitHub Flavored Markdown (GFM) with additional features:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Supported Syntax:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Headers (# ## ### etc.)</li>
                  <li>Bold and italic text</li>
                  <li>Code blocks with syntax highlighting</li>
                  <li>Tables</li>
                  <li>Lists (ordered and unordered)</li>
                  <li>Links and images</li>
                  <li>Blockquotes</li>
                  <li>Horizontal rules</li>
                  <li>Strikethrough text</li>
                  <li>Task lists</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Features:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Live preview as you type</li>
                  <li>Fullscreen preview mode</li>
                  <li>Prettier formatting</li>
                  <li>Import/export markdown files</li>
                  <li>Copy to clipboard</li>
                  <li>Word and character count</li>
                  <li>Syntax highlighting for code</li>
                  <li>GitHub Flavored Markdown support</li>
                  <li>Responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
