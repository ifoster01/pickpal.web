'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  const router = useRouter();
  return (
    <div className='min-h-screen bg-background py-16 px-4'>
      <Button
        variant='ghost'
        className='absolute top-4 left-4'
        onClick={() => router.back()}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back
      </Button>

      <div className='container mx-auto max-w-4xl'>
        <h1 className='text-4xl font-bold mb-8'>Terms of Service</h1>

        <div className='prose prose-neutral dark:prose-invert max-w-none'>
          <p className='text-lg text-muted-foreground mb-6'>
            Effective Date: October 4, 2024
          </p>

          <section className='mb-8'>
            <p className='mb-4'>
              Welcome to Pickpockt (&quot;Pickpockt&quot;). By accessing or
              using our app, you agree to be bound by these Terms of Service
              (&quot;Pickpockt Terms of Service&quot;). Please read these Terms
              carefully before using the App. If you do not agree to these
              Terms, you may not use the App.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              1. Acceptance of Terms
            </h2>
            <p className='mb-4'>
              By downloading, accessing, or using the App, you agree to comply
              with and be bound by these Terms. These Terms apply to all users
              of the App, including visitors, registered users, and anyone else
              who accesses or interacts with the App.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              2. Description of Service
            </h2>
            <p className='mb-4'>
              The App provides sports betting predictions, specifically for UFC
              events, using machine learning models. The predictions offered are
              intended solely for informational purposes and should not be
              relied upon as a primary basis for making any betting decisions.
            </p>
            <p className='mb-4 font-bold'>
              Important Disclaimer: Betting carries inherent risk. The
              predictions provided by the App are not guaranteed to be accurate,
              and Pickpockt is not responsible for any financial losses or
              consequences resulting from the use of our predictions. Users are
              encouraged to bet responsibly and consider multiple sources before
              placing any bets.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>3. Eligibility</h2>
            <p className='mb-4'>
              You must be at least 18 years old, or the legal age of majority in
              your jurisdiction, to use the App. By using the App, you represent
              and warrant that you meet these eligibility requirements.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>4. User Accounts</h2>
            <p className='mb-4'>
              To access certain features of the App, you may be required to
              create an account. When creating an account, you agree to:
            </p>
            <ul className='list-disc pl-6 mb-4'>
              <li className='mb-2'>
                Provide accurate, complete, and up-to-date information.
              </li>
              <li className='mb-2'>
                Maintain the confidentiality of your account credentials.
              </li>
              <li className='mb-2'>
                Be responsible for all activities that occur under your account.
                You agree to notify us immediately of any unauthorized use of
                your account or breach of security.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              5. Prohibited Activities
            </h2>
            <p className='mb-4'>When using the App, you agree not to:</p>
            <ul className='list-disc pl-6 mb-4'>
              <li className='mb-2'>
                Use the App for any unlawful purpose or in violation of any
                local, state, national, or international laws.
              </li>
              <li className='mb-2'>
                Engage in any activity that could damage, disable, overburden,
                or impair the App&apos;s functionality.
              </li>
              <li className='mb-2'>
                Attempt to hack, exploit, or gain unauthorized access to the
                App&apos;s systems or other users&apos; accounts.
              </li>
              <li className='mb-2'>
                Post or transmit any content that is offensive, harmful, or
                violates the rights of others.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              6. Intellectual Property
            </h2>
            <p className='mb-4'>
              All content, including but not limited to text, graphics, images,
              and code, is the property of Pickpockt or its licensors and is
              protected by intellectual property laws. You are granted a
              limited, non-exclusive, and non-transferable license to access and
              use the App for personal, non-commercial use only.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              7. Disclaimer of Warranties
            </h2>
            <p className='mb-4'>
              The App and all content provided therein are offered &quot;as
              is&quot; and &quot;as available&quot; without any warranties of
              any kind, either express or implied. We make no representations or
              warranties regarding the accuracy, reliability, or availability of
              the App or its content. You agree that your use of the App is at
              your sole risk.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              8. Limitation of Liability
            </h2>
            <p className='mb-4'>
              To the fullest extent permitted by law, Pickpockt and its
              affiliates, officers, directors, employees, and agents will not be
              liable for any indirect, incidental, special, or consequential
              damages arising out of your use of or inability to use the App,
              even if advised of the possibility of such damages.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              9. Betting Responsibility
            </h2>
            <p className='mb-4'>
              You acknowledge that sports betting involves risk, and it is your
              responsibility to evaluate the information provided by the App and
              make independent betting decisions. Pickpockt does not provide
              financial, legal, or betting advice and will not be held liable
              for any losses incurred from betting activities. If you choose to
              place bets based on predictions from the App, you do so at your
              own discretion and risk.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>10. Indemnification</h2>
            <p className='mb-4'>
              You agree to indemnify, defend, and hold harmless Pickpockt, its
              affiliates, officers, directors, employees, and agents from any
              claims, liabilities, damages, or expenses (including legal fees)
              arising out of your use of the App or any violation of these
              Terms.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>11. Termination</h2>
            <p className='mb-4'>
              We reserve the right to suspend or terminate your account and
              access to the App at any time, without notice, for any reason,
              including but not limited to violation of these Terms. Upon
              termination, you must cease all use of the App and delete any
              copies of it from your devices.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              12. Changes to the Terms
            </h2>
            <p className='mb-4'>
              We may update these Terms from time to time. When we do, we will
              revise the effective date at the top of this page. Your continued
              use of the App after the changes are made will constitute
              acceptance of the updated Terms. We encourage you to review these
              Terms periodically.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>13. Governing Law</h2>
            <p className='mb-4'>
              These Terms are governed by and construed in accordance with the
              laws of New York State, without regard to its conflict of law
              principles. Any disputes arising out of these Terms or the use of
              the App will be resolved in the courts located in New York State.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              14. Contact Information
            </h2>
            <p className='mb-4'>
              If you have any questions or concerns about these Terms, please
              contact us at:
            </p>
            <p className='mb-4'>Email: ifoster41901@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
