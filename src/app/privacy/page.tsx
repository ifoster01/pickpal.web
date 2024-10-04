import { VStack } from "@/styled-system/jsx";
import { Text } from "~/components/ui/text";

export default function () {
    return (
        <VStack minH='screen' maxW='screen' p={24} pt={8} alignItems='start' overflow='auto'>
            <Text fontWeight='bold' fontSize='2xl'>
                Privacy Policy
            </Text>
            <Text fontWeight='semibold'>
                Effective Date: October 4, 2024
            </Text>
            <Text>
                Thank you for using Pickpockt (“Pickpockt”), an application that provides sports betting predictions, specifically for UFC events, using machine learning models. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our app.
            </Text>
            <Text fontWeight='semibold'>
                1. Information We Collect
            </Text>
            <Text>
                We may collect the following types of information when you use our app:
            </Text>
            <Text>
                - Personal Information: This may include your name, email address, and other contact information when you create an account.<br />
                - Usage Data: We collect information about how you interact with the app, including the features you use, the predictions you view, and the frequency of your activity.<br/>
                - Device Information: This includes information about the mobile device you use to access the app, such as device ID, operating system, and browser type.<br/>
                - Analytics Data: We may use third-party services, such as Google Analytics, to collect aggregated and anonymized data about how our users interact with the app.<br/>
            </Text>
            <Text fontWeight='semibold'>
                2. How We Use Your Information
            </Text>
            <Text>
                We use the information we collect to:
            </Text>
            <Text>
                - Provide, maintain, and improve the functionality of the App.<br/>
                - Generate and deliver UFC betting predictions.<br/>
                - Personalize your experience and deliver relevant predictions.<br/>
                - Respond to your inquiries and provide customer support.<br/>
                - Monitor and analyze usage to improve our machine learning model.<br/>
            </Text>
            <Text fontWeight='semibold'>
                3. Third-Party Sharing
            </Text>
            <Text>
                We do not sell or share your personal information with third parties for marketing purposes. However, we may share anonymized or aggregated data with third-party service providers for the purpose of improving our machine learning models and app functionality. We may also share information:
            </Text>
            <Text>
                - As required by law or to comply with legal processes.<br/>
                - To protect the rights, property, or safety of Pickpockt, our users, or others.<br/>
            </Text>
            <Text fontWeight='semibold'>
                4. Data Security
            </Text>
            <Text>
                We take reasonable measures to protect your personal information from unauthorized access, disclosure, or misuse. However, please be aware that no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </Text>
            <Text fontWeight='semibold'>
                5. Children&apos;s Privacy
            </Text>
            <Text>
                The App is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it.
            </Text>
            <Text fontWeight='semibold'>
                6. User Choices
            </Text>
            <Text>
                You may update or delete your account information at any time by accessing the settings within the app. If you wish to delete your account or request that we delete your personal data, please contact us at [email address].
            </Text>
            <Text fontWeight='semibold'>
                7. Updates to this Privacy Policy
            </Text>
            <Text>
                We may update this Privacy Policy from time to time to reflect changes in our practices. When we do, we will notify you by updating the effective date at the top of this policy. Please review this policy periodically to stay informed about how we protect your information.
            </Text>
            <Text fontWeight='semibold'>
                8. Contact Us
            </Text>
            <Text>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </Text>
            <Text>
                Email: ifoster41901@gmail.com
                Mailing Address: 18 E 50th Street, New York, NY 10022
            </Text>
        </VStack>
    )
}
