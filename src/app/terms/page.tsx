export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using this website and its tools, you accept and agree to be bound by 
            the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
          <p className="text-muted-foreground mb-2">
            Permission is granted to temporarily use this website and its tools for personal, 
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
          <p className="text-muted-foreground">
            The materials on this website are provided on an &apos;as is&apos; basis. We make no warranties, 
            expressed or implied, and hereby disclaim and negate all other warranties including 
            without limitation, implied warranties or conditions of merchantability, fitness for 
            a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Limitations</h2>
          <p className="text-muted-foreground">
            In no event shall the website owner or its suppliers be liable for any damages 
            (including, without limitation, damages for loss of data or profit, or due to business 
            interruption) arising out of the use or inability to use the materials on this website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Processing</h2>
          <p className="text-muted-foreground">
            All tools on this website process data client-side only. No data is sent to our servers 
            or stored permanently. However, users are responsible for ensuring they do not input 
            sensitive or confidential information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Revisions</h2>
          <p className="text-muted-foreground">
            We may revise these terms of service at any time without notice. By using this website, 
            you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Contact Information</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us through our 
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
