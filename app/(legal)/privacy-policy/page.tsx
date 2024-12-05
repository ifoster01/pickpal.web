'use client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-6">Effective Date: October 4, 2024</p>
          
          <section className="mb-8">
            <p className="mb-4">
              Thank you for using Pickpockt ("Pickpockt"), an application that provides sports betting predictions,
              specifically for UFC events, using machine learning models. This Privacy Policy outlines how we collect,
              use, and protect your personal information when you use our app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We may collect the following types of information when you use our app:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Personal Information: This may include your name, email address, and other contact information when you create an account.</li>
              <li className="mb-2">Usage Data: We collect information about how you interact with the app, including the features you use, the predictions you view, and the frequency of your activity.</li>
              <li className="mb-2">Device Information: This includes information about the mobile device you use to access the app, such as device ID, operating system, and browser type.</li>
              <li className="mb-2">Analytics Data: We may use third-party services, such as Google Analytics, to collect aggregated and anonymized data about how our users interact with the app.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Provide, maintain, and improve the functionality of the App.</li>
              <li className="mb-2">Generate and deliver UFC betting predictions.</li>
              <li className="mb-2">Personalize your experience and deliver relevant predictions.</li>
              <li className="mb-2">Respond to your inquiries and provide customer support.</li>
              <li className="mb-2">Monitor and analyze usage to improve our machine learning model.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Sharing</h2>
            <p className="mb-4">
              We do not sell or share your personal information with third parties for marketing purposes. However, we
              may share anonymized or aggregated data with third-party service providers for the purpose of improving
              our machine learning models and app functionality. We may also share information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">As required by law or to comply with legal processes.</li>
              <li className="mb-2">To protect the rights, property, or safety of Pickpockt, our users, or others.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We take reasonable measures to protect your personal information from unauthorized access, disclosure, or
              misuse. However, please be aware that no method of electronic transmission or storage is 100% secure, and
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Children's Privacy</h2>
            <p className="mb-4">
              The App is not intended for use by individuals under the age of 18. We do not knowingly collect personal
              information from children under 18. If we become aware that we have collected such information, we will
              take steps to delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. User Choices</h2>
            <p className="mb-4">
              You may update or delete your account information at any time by accessing the settings within the app. If
              you wish to delete your account or request that we delete your personal data, please contact us at
              ifoster41901@gmail.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Updates to this Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices. When we do, we
              will notify you by updating the effective date at the top of this policy. Please review this policy
              periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mb-4">
              Email: ifoster41901@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}