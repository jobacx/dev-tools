export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            This website does not collect, store, or transmit any personal information. All tools 
            operate entirely client-side in your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Data Processing</h2>
          <p className="text-muted-foreground mb-2">
            All data processing happens locally in your browser. This means:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>No data is sent to our servers</li>
            <li>No data is stored on our servers</li>
            <li>No data is shared with third parties</li>
            <li>All processing is done locally on your device</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Cookies</h2>
          <p className="text-muted-foreground">
            This website may use local storage and session storage to remember your preferences 
            (such as theme settings) but does not use tracking cookies or collect personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
          <p className="text-muted-foreground">
            This website is hosted on Vercel/Netlify and may use their analytics services. 
            Please refer to their privacy policies for more information about their data practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Security</h2>
          <p className="text-muted-foreground">
            Since all processing happens client-side, your data never leaves your device. 
            However, we recommend not entering sensitive or confidential information into any web-based tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground">
            Since we don't collect or store any personal data, there is no personal information 
            to access, modify, or delete. All data remains under your control on your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibred mb-3">7. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. Any changes will be posted on 
            this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us through our 
            GitHub repository.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t">
        <p className="text-xs text-muted-foreground">
          Last updated: August 6, 2025
        </p>
      </div>
    </div>
  );
}
