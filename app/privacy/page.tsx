import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Privacy Policy - SRM AP Campus App',
  description: 'Privacy Policy for the SRM AP Campus App - A student initiative by Adarsh Gupta',
}

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      
      <Card className="p-6 space-y-4">
        <section className="space-y-4">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-muted-foreground">
            This app is a student initiative created by Adarsh Gupta to help fellow students
            of SRM University AP. This is not an official application of SRM University AP.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect minimal information necessary to provide you with a better campus experience:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Basic profile information (name, email, student ID)</li>
            <li>App preferences and settings</li>
            <li>Usage data to improve app features</li>
            <li>Device information (device type, OS version)</li>
            <li>Log data (app crashes, performance data)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <p className="text-muted-foreground">
            Your information is used solely for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Providing app functionality</li>
            <li>Improving user experience</li>
            <li>Sending important updates about the app</li>
            <li>Creating better features for students</li>
            <li>Analytics and app performance monitoring</li>
            <li>Bug fixing and technical support</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Storage and Security</h2>
          <p className="text-muted-foreground">
            We take the security of your data seriously and implement appropriate measures
            to protect your information. Your data is stored securely and is never sold
            to third parties. We use industry-standard encryption and security practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Third-Party Services</h2>
          <p className="text-muted-foreground">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Firebase Analytics for app usage statistics</li>
            <li>Firebase Crashlytics for crash reporting</li>
            <li>Google Play Services for app functionality</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of analytics collection</li>
            <li>Update or correct your information</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Children's Privacy</h2>
          <p className="text-muted-foreground">
            Our app is not intended for children under 13. We do not knowingly collect
            personal information from children under 13. If you are a parent and discover
            that your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes to Privacy Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy from time to time. We will notify users
            of any material changes via email or through the app. Continued use of the
            app after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-muted-foreground">
            For any questions about this Privacy Policy or the app in general, please contact:
            <br />
            Adarsh Gupta
            <br />
            Email: adarsh_kishor@srmap.edu.in
            <br />
            Address: SRM University AP, Andhra Pradesh, India
          </p>
        </section>
      </Card>
    </div>
  )
} 