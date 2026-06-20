import PageShell from '../components/PageShell';

export default function Contact() {
  return (
    <PageShell
      title="Contact us"
      lead="We're happy to help with questions about the course, the roadmap, feedback, or anything else."
    >
      <h2>Email</h2>
      <p>
        The best way to reach the ReactWay team is by email. We aim to respond within 2–3 business
        days.
      </p>
      <p>
        <a href="mailto:hello@learn-react.com">hello@learn-react.com</a>
      </p>

      <h2>What to contact us about</h2>
      <ul>
        <li>Questions about the course content or learning roadmap</li>
        <li>Feedback, corrections, or suggestions for improvement</li>
        <li>Technical issues with the website</li>
        <li>Privacy requests (see our <a href="/privacy">Privacy Policy</a>)</li>
        <li>Partnership or advertising enquiries</li>
      </ul>

      <h2>Send a message</h2>
      <p>
        Prefer a form? Use the button below to open a pre-addressed email in your mail app. (No
        message data is sent or stored by this website.)
      </p>
      <p>
        <a className="btn btn-primary" href="mailto:hello@learn-react.com?subject=ReactWay%20enquiry">
          Email the ReactWay team
        </a>
      </p>
    </PageShell>
  );
}
