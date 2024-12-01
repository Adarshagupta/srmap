export const metadata = {
  title: 'Terms and Conditions - SRM AP Campus App',
  description: 'Terms and conditions for using the SRM AP Campus App - A student initiative by Adarsh Gupta',
}

export default function TermsAndConditions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Terms and Conditions</h1>
      
      <section className="space-y-3 pb-4 border-b">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-muted-foreground">
          Welcome to the SRM AP Campus App. This application is a student initiative
          created and maintained by Adarsh Gupta to help fellow students. This is not
          an official application of SRM University AP.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By downloading, installing, or using the app, you agree to these terms and conditions.
          If you disagree with any part of these terms, you may not use the app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. User Responsibilities</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Use the app responsibly and ethically
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Provide accurate information when required
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Do not misuse or attempt to abuse app features
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Report any bugs or issues to help improve the app
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Do not attempt to reverse engineer the app
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Do not use the app for any illegal purposes
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Account Security</h2>
        <p className="text-muted-foreground">
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activities under your account. Notify us immediately
          of any unauthorized use of your account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. App License</h2>
        <p className="text-muted-foreground">
          We grant you a limited, non-exclusive, non-transferable license to use
          the app for personal, non-commercial purposes. This license is subject
          to these Terms and Conditions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. Disclaimer</h2>
        <p className="text-muted-foreground">
          This is an unofficial app created by a student. The app is provided "as is"
          without any warranties. We do not guarantee the accuracy, completeness,
          or reliability of any content.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">6. Intellectual Property</h2>
        <p className="text-muted-foreground">
          The app and its original content are owned by Adarsh Gupta. University
          logos, names, and trademarks are property of SRM University AP and are
          used for reference purposes only.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          To the maximum extent permitted by law, we shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages resulting
          from your use or inability to use the app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">8. Changes to Terms</h2>
        <p className="text-muted-foreground">
          We reserve the right to modify these terms at any time. We will notify
          users of any material changes via email or through the app. Continued use
          after changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">9. Governing Law</h2>
        <p className="text-muted-foreground">
          These terms shall be governed by and construed in accordance with the
          laws of India, without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact</h2>
        <div className="space-y-2 text-muted-foreground">
          <p>For any questions about these terms or the app in general, please contact:</p>
          <p>Adarsh Gupta</p>
          <p>Email: adarsh_kishor@srmap.edu.in</p>
          <p>Address: SRM University AP, Andhra Pradesh, India</p>
        </div>
      </section>
    </div>
  )
} 