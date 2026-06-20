import PageShell from '../components/PageShell';

export default function Terms() {
  return (
    <PageShell
      title="Terms of Service"
      lead="These terms govern your use of the ReactWay website. Please read them carefully."
      updated="June 20, 2026"
    >
      <h2>1. Acceptance of terms</h2>
      <p>
        By accessing or using the ReactWay website (the "Site"), you agree to be bound by these Terms
        of Service and our <a href="/privacy">Privacy Policy</a>. If you do not agree, please do not
        use the Site.
      </p>

      <h2>2. The service</h2>
      <p>
        ReactWay provides educational content about React, including a structured course, a learning
        roadmap, and progress tracking. The content is provided for general informational and
        educational purposes only.
      </p>

      <h2>3. Use of the Site</h2>
      <p>
        You may access and use the Site for your personal, non-commercial learning. You agree not to:
      </p>
      <ul>
        <li>Use the Site in any way that violates applicable law or regulation;</li>
        <li>Attempt to gain unauthorised access to, interfere with, or disrupt the Site;</li>
        <li>Scrape, copy, or redistribute Site content at scale without permission; or</li>
        <li>Misuse or attempt to circumvent any security or advertising features.</li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        The Site and its original content, features, and design are owned by ReactWay and are
        protected by intellectual property laws. "React" and related marks are the property of their
        respective owners; ReactWay is an independent educational resource and is not affiliated with
        or endorsed by them.
      </p>

      <h2>5. Advertising and third-party links</h2>
      <p>
        The Site displays third-party advertising and may contain links to third-party websites. We
        are not responsible for the content, products, or practices of third parties. Your dealings
        with advertisers or linked sites are solely between you and that third party.
      </p>

      <h2>6. Disclaimer of warranties</h2>
      <p>
        The Site and its content are provided "as is" and "as available" without warranties of any
        kind, whether express or implied, including but not limited to accuracy, fitness for a
        particular purpose, or non-infringement. We do not warrant that the Site will be
        uninterrupted, error-free, or secure.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, ReactWay shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages, or any loss of data, arising out of
        or related to your use of (or inability to use) the Site.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may modify the Site or these Terms at any time. Material changes will be reflected by
        updating the "Last updated" date above. Continued use of the Site after changes take effect
        constitutes acceptance of the updated Terms.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These Terms are governed by the laws of [your jurisdiction], without regard to its conflict
        of law provisions. {/* TODO: set your operating jurisdiction. */}
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms? Email{' '}
        <a href="mailto:hello@affsquad.com">hello@affsquad.com</a>.
      </p>
    </PageShell>
  );
}
