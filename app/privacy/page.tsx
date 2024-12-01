export const metadata = {
  title: 'Privacy Policy - SRM AP Campus App',
  description: 'Privacy Policy for the SRM AP Campus App - A student initiative by Adarsh Gupta',
}

export default function PrivacyPolicy() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      
      <section className="space-y-3 pb-4 border-b">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-muted-foreground">
          This app is a student initiative created by Adarsh Gupta to help fellow students
          of SRM University AP. This is not an official application of SRM University AP.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Information We Collect</h2>
        <p className="text-muted-foreground">
          We collect minimal information necessary to provide you with a better campus experience:
        </p>
        <ul className="space-y-2 text-muted-foreground">
          {[
            'Basic profile information (name, email, student ID)',
            'App preferences and settings',
            'Usage data to improve app features',
            'Device information (device type, OS version)',
            'Log data (app crashes, performance data)',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How We Use Your Information</h2>
        <ul className="space-y-2 text-muted-foreground">
          {[
            'Providing app functionality',
            'Improving user experience',
            'Sending important updates about the app',
            'Creating better features for students',
            'Analytics and app performance monitoring',
            'Bug fixing and technical support',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Data Storage and Security</h2>
        <p className="text-muted-foreground">
          We take the security of your data seriously and implement appropriate measures
          to protect your information. Your data is stored securely and is never sold
          to third parties. We use industry-standard encryption and security practices.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Third-Party Services</h2>
        <ul className="space-y-2 text-muted-foreground">
          {[
            'Firebase Analytics for app usage statistics',
            'Firebase Crashlytics for crash reporting',
            'Google Play Services for app functionality',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your Rights</h2>
        <ul className="space-y-2 text-muted-foreground">
          {[
            'Access your personal data',
            'Request deletion of your data',
            'Opt-out of analytics collection',
            'Update or correct your information',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact Information</h2>
        <div className="space-y-2 text-muted-foreground">
          <p>Adarsh Gupta</p>
          <p>Email: adarsh_kishor@srmap.edu.in</p>
          <p>Address: SRM University AP, Andhra Pradesh, India</p>
        </div>
      </section>
    </div>
  )
} 