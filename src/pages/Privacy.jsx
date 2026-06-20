import PageShell from '../components/PageShell';

const EXT = { target: '_blank', rel: 'noopener noreferrer' };

export default function Privacy() {
  return (
    <PageShell
      title="Privacy Policy"
      lead="This policy explains what information ReactWay collects, how it is used, and the choices you have — including how advertising and cookies work on this site."
      updated="June 20, 2026"
    >
      <p>
        This Privacy Policy describes how ReactWay ("ReactWay", "we", "us", or "our") handles
        information in connection with the website at this domain (the "Site"). By using the Site you
        agree to the practices described here. If you do not agree, please discontinue use of the
        Site.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information you provide</h3>
      <p>
        We do not require you to create an account to use the Site. If you contact us by email, we
        receive the information you choose to include (such as your email address and message).
      </p>
      <h3>Information collected automatically</h3>
      <p>
        Like most websites, we and our service providers may automatically collect certain technical
        information when you visit, such as your IP address, approximate location derived from it,
        browser and device type, referring pages, and the pages you view. This information is used to
        operate, secure, and improve the Site and to serve advertising as described below.
      </p>
      <h3>Information stored on your device</h3>
      <p>
        Your course and roadmap progress is saved using your browser's <code>localStorage</code>.
        This data stays on your device, is not transmitted to us, and can be cleared at any time
        through your browser settings or by resetting your progress within the Site.
      </p>

      <h2>2. Cookies and similar technologies</h2>
      <p>
        Cookies are small files stored on your device. We and third parties use cookies and similar
        technologies for purposes including:
      </p>
      <ul>
        <li><strong>Essential</strong> — to make the Site function and remember basic preferences.</li>
        <li><strong>Analytics</strong> — to understand how the Site is used so we can improve it.</li>
        <li><strong>Advertising</strong> — to deliver and measure ads (see the next section).</li>
      </ul>
      <p>
        You can control or delete cookies through your browser settings. Blocking some cookies may
        affect how the Site works.
      </p>

      <h2>3. Advertising and Google AdSense</h2>
      <p>
        We use third-party advertising, including <strong>Google AdSense</strong>, to display ads on
        the Site. Third-party vendors, including Google, use cookies to serve ads based on your prior
        visits to this and other websites.
      </p>
      <ul>
        <li>
          Google's use of advertising cookies enables it and its partners to serve ads to you based
          on your visit to this Site and/or other sites on the internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://adssettings.google.com" {...EXT}>Google Ads Settings</a>.
        </li>
        <li>
          You can opt out of a third-party vendor's use of cookies for personalized advertising at{' '}
          <a href="https://www.aboutads.info/choices" {...EXT}>aboutads.info/choices</a> and (for
          EU/UK users){' '}
          <a href="https://www.youronlinechoices.eu" {...EXT}>youronlinechoices.eu</a>.
        </li>
        <li>
          For more on how Google uses information from sites that use its services, see{' '}
          <a href="https://policies.google.com/technologies/partner-sites" {...EXT}>
            Google's Partner Sites policy
          </a>.
        </li>
      </ul>
      <p>
        Where required (for example, for visitors in the European Economic Area, the United Kingdom,
        and Switzerland), we use a consent management platform to request your consent for the use of
        cookies and data for personalized advertising before such cookies are set. You can change
        your choices at any time using the privacy/consent control provided on the Site.
      </p>

      <h2>4. Analytics</h2>
      <p>
        We may use analytics services (such as Google Analytics) to collect aggregated usage
        statistics. These services may set their own cookies and process data in accordance with
        their respective privacy policies.
      </p>

      <h2>5. How we use information</h2>
      <ul>
        <li>To operate, maintain, secure, and improve the Site;</li>
        <li>To display and measure advertising;</li>
        <li>To respond to your enquiries; and</li>
        <li>To comply with legal obligations and enforce our terms.</li>
      </ul>

      <h2>6. Legal bases (EEA/UK)</h2>
      <p>
        Where the GDPR or UK GDPR applies, we process personal data on the basis of your consent (for
        non-essential cookies and personalized advertising), our legitimate interests (to operate and
        improve the Site and serve non-personalized ads), and to comply with legal obligations. You
        may withdraw consent at any time.
      </p>

      <h2>7. Your privacy rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete, or restrict the
        processing of your personal data, to object to processing, to data portability, and to lodge
        a complaint with a supervisory authority. If you are a California resident, you have rights
        under the CCPA/CPRA, including the right to know, delete, and opt out of the "sale" or
        "sharing" of personal information. We do not sell personal information for money. To exercise
        any right, contact us at <a href="mailto:hello@learn-react.com">hello@learn-react.com</a>.
      </p>

      <h2>8. Data retention</h2>
      <p>
        We retain information only for as long as necessary for the purposes described in this policy
        or as required by law. Progress data stored in your browser remains until you clear it.
      </p>

      <h2>9. Children's privacy</h2>
      <p>
        The Site is not directed to children under the age of 16, and we do not knowingly collect
        personal data from children. If you believe a child has provided us personal data, please
        contact us so we can remove it.
      </p>

      <h2>10. International data transfers</h2>
      <p>
        Our service providers may process information in countries other than your own. Where
        required, appropriate safeguards are used for such transfers.
      </p>

      <h2>11. Third-party links</h2>
      <p>
        The Site may link to third-party websites and resources. We are not responsible for the
        privacy practices of those third parties; please review their privacy policies.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected by
        updating the "Last updated" date above. Your continued use of the Site after changes take
        effect constitutes acceptance of the updated policy.
      </p>

      <h2>13. Contact us</h2>
      <p>
        For any questions or requests regarding this Privacy Policy or your data, contact us at:
      </p>
      <address>
        ReactWay<br />
        Email: <a href="mailto:hello@learn-react.com">hello@learn-react.com</a>
      </address>
    </PageShell>
  );
}
