"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Copy, Type, RefreshCw, AlertCircle } from "lucide-react";

export default function LoremClient() {
  const [generatedText, setGeneratedText] = useState("");
  const [paragraphs, setParagraphs] = useState(3);
  const [words, setWords] = useState(50);
  const [sentences, setSentences] = useState(5);
  const [generateType, setGenerateType] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);

  // Lorem ipsum word bank
  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
    "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
    "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
    "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
    "est", "laborum", "at", "vero", "eos", "accusamus", "accusantium", "doloremque", "laudantium", "totam",
    "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "et",
    "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo", "nemo", "ipsam", "voluptatem",
    "quia", "voluptas", "aspernatur", "aut", "odit", "fugit", "sed", "quia", "consequuntur", "magni",
    "dolores", "eos", "qui", "ratione", "voluptatem", "sequi", "nesciunt", "neque", "porro", "quisquam",
    "est", "qui", "dolorem", "ipsum", "quia", "dolor", "sit", "amet", "consectetur", "adipisci",
    "velit", "sed", "quia", "non", "numquam", "eius", "modi", "tempora", "incidunt", "ut",
    "labore", "et", "dolore", "magnam", "aliquam", "quaerat", "voluptatem", "ut", "enim", "ad",
    "minima", "veniam", "quis", "nostrum", "exercitationem", "ullam", "corporis", "suscipit", "laboriosam", "nisi",
    "ut", "aliquid", "ex", "ea", "commodi", "consequatur", "quis", "autem", "vel", "eum",
    "iure", "reprehenderit", "qui", "in", "ea", "voluptate", "velit", "esse", "quam", "nihil",
    "molestiae", "consequatur", "vel", "illum", "qui", "dolorem", "eum", "fugiat", "quo", "voluptas",
    "nulla", "pariatur", "at", "vero", "eos", "et", "accusamus", "et", "iusto", "odio",
    "dignissimos", "ducimus", "qui", "blanditiis", "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos"
  ];

  const getRandomWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
  };

  const capitalizeFirst = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const generateSentence = (wordCount: number = 8) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord());
    }
    return capitalizeFirst(words.join(" ")) + ".";
  };

  const generateParagraph = (sentenceCount: number = 5) => {
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 8) + 5; // 5-12 words per sentence
      sentences.push(generateSentence(wordCount));
    }
    return sentences.join(" ");
  };

  const generateLoremText = () => {
    let result = "";

    switch (generateType) {
      case "paragraphs":
        const paragraphArray = [];
        for (let i = 0; i < paragraphs; i++) {
          let paragraph = generateParagraph(Math.floor(Math.random() * 3) + 4); // 4-6 sentences per paragraph
          
          // Start first paragraph with "Lorem ipsum..." if enabled
          if (i === 0 && startWithLorem) {
            paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + paragraph;
          }
          
          paragraphArray.push(paragraph);
        }
        result = paragraphArray.join("\n\n");
        break;

      case "words":
        const wordArray = [];
        for (let i = 0; i < words; i++) {
          if (i === 0 && startWithLorem) {
            wordArray.push("Lorem");
          } else if (i === 1 && startWithLorem) {
            wordArray.push("ipsum");
          } else {
            wordArray.push(getRandomWord());
          }
        }
        result = capitalizeFirst(wordArray.join(" ")) + ".";
        break;

      case "sentences":
        const sentenceArray = [];
        for (let i = 0; i < sentences; i++) {
          let sentence;
          if (i === 0 && startWithLorem) {
            sentence = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
          } else {
            const wordCount = Math.floor(Math.random() * 8) + 5;
            sentence = generateSentence(wordCount);
          }
          sentenceArray.push(sentence);
        }
        result = sentenceArray.join(" ");
        break;
    }

    setGeneratedText(result);
    toast.success("Lorem ipsum text generated successfully");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast.success("Text copied to clipboard");
  };

  const clearText = () => {
    setGeneratedText("");
  };

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  const getSentenceCount = (text: string) => {
    return text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
  };

  const getParagraphCount = (text: string) => {
    return text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Type className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Lorem Ipsum Generator</h1>
          <p className="text-muted-foreground">Generate placeholder text for your designs and layouts</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Generated Text */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Generated Lorem Ipsum
              </CardTitle>
              <CardDescription>
                Your placeholder text with statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="generated-text">Generated Text</Label>
                  {generatedText && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearText}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
                <Textarea
                  id="generated-text"
                  value={generatedText}
                  placeholder="Generated Lorem ipsum text will appear here..."
                  readOnly
                  className="min-h-[300px] font-serif"
                />
              </div>

              {generatedText && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-lg">{getWordCount(generatedText)}</div>
                    <div className="text-muted-foreground">Words</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-lg">{getCharCount(generatedText)}</div>
                    <div className="text-muted-foreground">Characters</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-lg">{getSentenceCount(generatedText)}</div>
                    <div className="text-muted-foreground">Sentences</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold text-lg">{getParagraphCount(generatedText)}</div>
                    <div className="text-muted-foreground">Paragraphs</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={generateLoremText} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Lorem Ipsum
                </Button>
                <Button variant="outline" onClick={copyToClipboard} disabled={!generatedText}>
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
                Customize your lorem ipsum generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Generation Type */}
              <div className="space-y-3">
                <Label>Generate By</Label>
                <Select value={generateType} onValueChange={(value: "paragraphs" | "words" | "sentences") => setGenerateType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Count Input */}
              <div className="space-y-3">
                <Label htmlFor="count">
                  {generateType === "paragraphs" && "Number of Paragraphs"}
                  {generateType === "words" && "Number of Words"}
                  {generateType === "sentences" && "Number of Sentences"}
                </Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max={generateType === "words" ? "1000" : "100"}
                  value={
                    generateType === "paragraphs" ? paragraphs :
                    generateType === "words" ? words : sentences
                  }
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    if (generateType === "paragraphs") {
                      setParagraphs(Math.min(100, value));
                    } else if (generateType === "words") {
                      setWords(Math.min(1000, value));
                    } else {
                      setSentences(Math.min(100, value));
                    }
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  {generateType === "paragraphs" && "1-100 paragraphs"}
                  {generateType === "words" && "1-1000 words"}
                  {generateType === "sentences" && "1-100 sentences"}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <Label>Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="start-with-lorem"
                      checked={startWithLorem}
                      onCheckedChange={(checked) => setStartWithLorem(checked === true)}
                    />
                    <Label htmlFor="start-with-lorem" className="text-sm">
                      Start with &quot;Lorem ipsum...&quot;
                    </Label>
                  </div>
                </div>
              </div>

              {/* Quick Generate Buttons */}
              <div className="space-y-3">
                <Label>Quick Generate</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGenerateType("paragraphs");
                      setParagraphs(1);
                      setTimeout(generateLoremText, 0);
                    }}
                  >
                    1 Paragraph
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGenerateType("paragraphs");
                      setParagraphs(3);
                      setTimeout(generateLoremText, 0);
                    }}
                  >
                    3 Paragraphs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGenerateType("words");
                      setWords(50);
                      setTimeout(generateLoremText, 0);
                    }}
                  >
                    50 Words
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGenerateType("sentences");
                      setSentences(5);
                      setTimeout(generateLoremText, 0);
                    }}
                  >
                    5 Sentences
                  </Button>
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
            About Lorem Ipsum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the 
              industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley 
              of type and scrambled it to make a type specimen book.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Purpose:</strong> Used as placeholder text in the printing and typesetting industry.</li>
              <li><strong>Origin:</strong> Derived from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; by Cicero, written in 45 BC.</li>
              <li><strong>Benefits:</strong> Allows focus on visual elements without being distracted by readable content.</li>
              <li><strong>Standard:</strong> Has been the industry standard for over 500 years.</li>
              <li><strong>Usage:</strong> Perfect for web design, print layouts, and content mockups.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
