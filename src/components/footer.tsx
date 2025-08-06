export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Created with ❤️ by{" "}
            <a 
              href="https://github.com/jobacx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              jobacx
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
