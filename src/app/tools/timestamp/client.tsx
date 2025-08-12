"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Clock, Calendar, RefreshCw, Info } from "lucide-react";

interface TimestampData {
  unix: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

export default function TimestampClient() {
  const [currentTime, setCurrentTime] = useState<TimestampData | null>(null);
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [timezone, setTimezone] = useState("local");
  const [customTimestamp, setCustomTimestamp] = useState<TimestampData | null>(null);

  // Real-time updates for current time
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const unixSeconds = Math.floor(now.getTime() / 1000);
      
      setCurrentTime({
        unix: unixSeconds,
        milliseconds: now.getTime(),
        iso: now.toISOString(),
        utc: now.toUTCString(),
        local: now.toLocaleString(),
        relative: "now"
      });
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize with current date and time
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    setInputDate(`${year}-${month}-${day}`);
    setInputTime(`${hours}:${minutes}`);
  }, []);

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (Math.abs(diffSeconds) < 60) return "just now";
    if (Math.abs(diffMinutes) < 60) return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? 's' : ''} ${diffMinutes < 0 ? 'from now' : 'ago'}`;
    if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours < 0 ? 'from now' : 'ago'}`;
    if (Math.abs(diffDays) < 30) return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ${diffDays < 0 ? 'from now' : 'ago'}`;
    if (Math.abs(diffMonths) < 12) return `${Math.abs(diffMonths)} month${Math.abs(diffMonths) !== 1 ? 's' : ''} ${diffMonths < 0 ? 'from now' : 'ago'}`;
    return `${Math.abs(diffYears)} year${Math.abs(diffYears) !== 1 ? 's' : ''} ${diffYears < 0 ? 'from now' : 'ago'}`;
  };

  const convertTimestamp = (timestamp: string): TimestampData | null => {
    try {
      let unixSeconds: number;
      
      // Handle both seconds and milliseconds
      if (timestamp.length <= 10) {
        unixSeconds = parseInt(timestamp);
      } else {
        unixSeconds = Math.floor(parseInt(timestamp) / 1000);
      }

      const date = new Date(unixSeconds * 1000);
      
      if (isNaN(date.getTime())) {
        throw new Error("Invalid timestamp");
      }

      return {
        unix: unixSeconds,
        milliseconds: date.getTime(),
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        relative: formatRelativeTime(date)
      };
    } catch {
      return null;
    }
  };

  const convertDateToTimestamp = (): TimestampData | null => {
    try {
      if (!inputDate || !inputTime) {
        toast.error("Please enter both date and time");
        return null;
      }

      const dateTimeString = `${inputDate}T${inputTime}`;
      let date: Date;

      if (timezone === "utc") {
        date = new Date(dateTimeString + ":00.000Z");
      } else {
        date = new Date(dateTimeString);
      }

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date/time");
      }

      const unixSeconds = Math.floor(date.getTime() / 1000);

      return {
        unix: unixSeconds,
        milliseconds: date.getTime(),
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        relative: formatRelativeTime(date)
      };
    } catch {
      return null;
    }
  };

  const handleTimestampConvert = () => {
    if (!inputTimestamp) {
      toast.error("Please enter a timestamp");
      return;
    }

    const result = convertTimestamp(inputTimestamp);
    if (result) {
      setCustomTimestamp(result);
      toast.success("Timestamp converted successfully");
    } else {
      toast.error("Invalid timestamp format");
      setCustomTimestamp(null);
    }
  };

  const handleDateConvert = () => {
    const result = convertDateToTimestamp();
    if (result) {
      setCustomTimestamp(result);
      toast.success("Date converted to timestamp successfully");
    } else {
      toast.error("Invalid date/time format");
      setCustomTimestamp(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const loadCurrentTimestamp = () => {
    if (currentTime) {
      setInputTimestamp(currentTime.unix.toString());
      setCustomTimestamp(currentTime);
      toast.success("Current timestamp loaded");
    }
  };

  const commonTimestamps = [
    { label: "Unix Epoch", value: "0", description: "January 1, 1970" },
    { label: "Y2K", value: "946684800", description: "January 1, 2000" },
    { label: "JavaScript Max Date", value: "8640000000000", description: "September 13, 275760" },
  ];

  const formatDisplayValue = (value: string | number, label: string) => {
    const str = value.toString();
    return (
      <div className="flex gap-2 items-center">
        <Input
          value={str}
          readOnly
          className="font-mono text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(str, label)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Timestamp Converter</h1>
          <p className="text-muted-foreground">Convert Unix timestamps to human-readable dates and vice versa</p>
        </div>
      </div>

      {/* Current Time Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Current Time (Real-time)
          </CardTitle>
          <CardDescription>
            Live display of the current timestamp and formatted date
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentTime && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Unix Timestamp (seconds)</Label>
                {formatDisplayValue(currentTime.unix, "Unix Timestamp")}
              </div>
              <div className="space-y-2">
                <Label>Milliseconds</Label>
                {formatDisplayValue(currentTime.milliseconds, "Milliseconds")}
              </div>
              <div className="space-y-2">
                <Label>ISO 8601</Label>
                {formatDisplayValue(currentTime.iso, "ISO Date")}
              </div>
              <div className="space-y-2">
                <Label>UTC</Label>
                {formatDisplayValue(currentTime.utc, "UTC Date")}
              </div>
              <div className="space-y-2">
                <Label>Local Time</Label>
                {formatDisplayValue(currentTime.local, "Local Date")}
              </div>
              <div className="flex items-center">
                <Button onClick={loadCurrentTimestamp} className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Use Current Timestamp
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timestamp to Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timestamp to Date
            </CardTitle>
            <CardDescription>
              Convert Unix timestamp to human-readable date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timestamp-input">Unix Timestamp</Label>
              <div className="flex gap-2">
                <Input
                  id="timestamp-input"
                  placeholder="Enter timestamp (seconds or milliseconds)"
                  value={inputTimestamp}
                  onChange={(e) => setInputTimestamp(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={handleTimestampConvert}>
                  Convert
                </Button>
              </div>
            </div>

            {/* Common Timestamps */}
            <div className="space-y-2">
              <Label>Common Timestamps</Label>
              <div className="space-y-2">
                {commonTimestamps.map((ts) => (
                  <Button
                    key={ts.value}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-12"
                    onClick={() => {
                      setInputTimestamp(ts.value);
                      const result = convertTimestamp(ts.value);
                      if (result) setCustomTimestamp(result);
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">{ts.label}</div>
                      <div className="text-xs text-muted-foreground">{ts.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date to Timestamp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Date to Timestamp
            </CardTitle>
            <CardDescription>
              Convert human-readable date to Unix timestamp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date-input">Date</Label>
                <Input
                  id="date-input"
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-input">Time</Label>
                <Input
                  id="time-input"
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Timezone</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleDateConvert} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Convert to Timestamp
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Results */}
      {customTimestamp && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Results</CardTitle>
            <CardDescription>
              All format representations of your timestamp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Unix Timestamp</Label>
                {formatDisplayValue(customTimestamp.unix, "Unix Timestamp")}
              </div>
              <div className="space-y-2">
                <Label>Milliseconds</Label>
                {formatDisplayValue(customTimestamp.milliseconds, "Milliseconds")}
              </div>
              <div className="space-y-2">
                <Label>ISO 8601</Label>
                {formatDisplayValue(customTimestamp.iso, "ISO Date")}
              </div>
              <div className="space-y-2">
                <Label>UTC</Label>
                {formatDisplayValue(customTimestamp.utc, "UTC Date")}
              </div>
              <div className="space-y-2">
                <Label>Local Time</Label>
                {formatDisplayValue(customTimestamp.local, "Local Date")}
              </div>
              <div className="space-y-2">
                <Label>Relative Time</Label>
                <Input
                  value={customTimestamp.relative}
                  readOnly
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Unix Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), 
              not counting leap seconds. This moment is known as the Unix epoch.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Unix Timestamp:</strong> Seconds since epoch (most common format)</li>
              <li><strong>Milliseconds:</strong> Milliseconds since epoch (used in JavaScript)</li>
              <li><strong>ISO 8601:</strong> International standard format (YYYY-MM-DDTHH:mm:ss.sssZ)</li>
              <li><strong>UTC:</strong> Coordinated Universal Time format</li>
              <li><strong>Local:</strong> Time in your current timezone</li>
              <li><strong>Relative:</strong> Human-friendly relative time description</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
