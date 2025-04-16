import React from "react";
import Link from "next/link";
import { rem, Stack, Text, Title } from "@mantine/core";

type Props = {
  addTitle?: boolean;
};

export default function PrivacyLegalBody({ addTitle }: Props) {
  return (
    <>
      {addTitle && <Title order={1}>Privacy Policy</Title>}
      <Text size="sm" c="dimmed">
        Last updated: March 16, 2025
      </Text>
      <Stack>
        <Text mt={0}>
          This privacy policy explains how Bettermax LLC, operating as muxout.com ("we," "us," or
          "our") uses and shares your data when you use our website ("Site") and services
          ("Services").
        </Text>
        <Text>
          By using our Site or Services, you agree to our privacy practices outlined here. If you
          disagree with our policies, please refrain from using our Site or Services. You may
          contact us at info@muxout.com with any questions.
        </Text>

        <Title order={2}>SUMMARY</Title>
        <Text>
          This summary highlights key aspects of our privacy policy. For a detailed understanding,
          please navigate through specific sections.
        </Text>

        <Title order={4}>What personal information do we collect?</Title>
        <Text>
          We may collect information such as your name, email, gender, age, country, images and
          videos of your body, audio recordings of your voice, and any other information you
          voluntarily provide when using our Services.
        </Text>

        <Title order={4}>Do we process any sensitive personal information?</Title>
        <Text>
          Yes, we collect and process sensitive information, such as your images, videos and voice,
          which are used for AI-driven analysis of your appearance and if explicitely enabled by
          you, for the purpose of sharing this data with other users of the site. Your data is
          processed only with your explicit consent or in compliance with applicable law.
        </Text>

        <Title order={4}>Do we share any information from third parties?</Title>
        <Text>
          We may share certain personal information with third-party service providers as necessary
          to deliver the Services to you. This may include, but is not limited to, payment
          processing, data management, and data storage.
        </Text>

        <Title order={4}>How do we process your information?</Title>
        <ul>
          <li>Provide appearance analysis based on your images.</li>
          <li>Provide personalized recommendations based on your images and videos.</li>
          <li>
            If you choose to participate in our revenue sharing program (the "Club") we display your
            graphical, audio and textual information to other suitable users as outlined in the{" "}
            <Link href="/legal/club" style={{ textDecoration: "underline" }}>
              Club&apos;s terms of service
            </Link>
            .
          </li>
          <li>Process payments and payouts.</li>
          <li>Suggest relevant third-party products based on your data.</li>
          <li>Communicate with you and improve our Services.</li>
        </ul>

        <Title order={4}>When and with whom do we share your information?</Title>
        <ul>
          <li>With our payment processors when you subscribe to our plans</li>
          <li>
            With other eligible members of the Club if you opt into our revenue sharing program as
            outline by the{" "}
            <Link href="/legal/club" style={{ textDecoration: "underline" }}>
              Club&apos;s terms of service
            </Link>
          </li>
          <li>With our third-party service providers for data analysis, hosting, and marketing.</li>
          <li>
            With affiliates, business partners, and legal authorities, if required by law or as part
            of a business transaction (e.g., a merger).
          </li>
        </ul>

        <Title order={4}>How do we keep your information safe?</Title>
        <Text>
          We apply reasonable technical and organizational security measures to protect your
          personal information. However, no method of data transmission or storage is completely
          secure, and we cannot guarantee absolute security.
        </Text>

        <Title order={4}>What are your rights?</Title>
        <ul>
          <li>Access, update, or delete your personal information.</li>
          <li>Withdraw consent for the processing of your sensitive data.</li>
          <li>Restrict the processing of your data or object to certain uses.</li>
          <li>Request portability of your data.</li>
        </ul>

        <Title order={4}>How do you exercise your rights?</Title>
        <Text>
          To exercise your rights, contact us at info@muxout.com. We will process your request in
          line with relevant data protection laws.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>1. WHAT PERSONAL INFORMATION WE COLLECT?</Title>
        <Title>Personal Information You Provide</Title>
        <Text>
          When you express interest in our products or services, engage in activities on our
          website, or communicate with us, we collect the personal information you provide directly
          to us. The type of information we collect depends on your interactions with us, the
          choices you make, and the features you use.
        </Text>
        <Title>Types of Personal Information</Title>
        <Text>The personal information we collect may include:</Text>
        <ul>
          <li>
            Images: Images of your body, which are uploaded to our platform for appearance analysis
            using AI and as your content Contributions for the purpose of completing the tasks.
          </li>
          <li>
            Videos: Videos of your body, uploaded as your content Contributions for the purpose of
            completing the tasks.
          </li>
          <li>
            Audio: Recordings of your voice, uploaded as your content Contributions for the purpose
            of creating progress diary records.
          </li>
          <li>
            Text: Textual content, uploaded as your content Contributions for the purpose of
            personalizing tasks and creating your public Club profile when you opt into our revenue
            sharing program (the Club).
          </li>
        </ul>
        <Title>Sensitive Information</Title>
        <Text>
          We collect and handle certain types of sensitive information, only with your explicit
          consent or as legally permitted. This includes:
        </Text>
        <ul>
          <li>
            Biometric Data: Data from the images, videos and audio files you upload that may be
            classified as biometric under certain laws. This data is used to analyze your appearance
            and enable you to access the Services of the site.
          </li>
        </ul>
        <Title>Payment Data</Title>
        <Text>
          If you subscribe to services, we collect payment-related information, such as your payment
          card details (e.g., card number, expiration date, and security code) as necessary to
          process the transaction.
        </Text>
        <Title>Information Automatically Collected</Title>
        <Text>
          We automatically collect certain information when you interact with our services. This
          information doesn&apos;t identify you directly but helps us maintain the functionality,
          security, and performance of our website.
        </Text>
        <Text>
          In Summary, when you visit or use our website, we automatically gather data about your
          interactions with our services. This may include:
        </Text>
        <ul>
          <li>Ip address: Your unique internet protocol address.</li>
          <li>
            Browser and device characteristics: Type of browser, device name, and device details.
          </li>
          <li>Operating system: The operating system of your device.</li>
          <li>Language preferences: Your preferred language settings.</li>
          <li>Referring URLs: Web pages that referred you to our website.</li>
          <li>Device name and location: The name of your device and its general location.</li>
          <li>
            Usage information and technical details: Data on how you use our services, including
            performance details and system diagnostics.
          </li>
        </ul>
        <Title>Types of Automatically Collected Information</Title>
        <ul>
          <li>
            Log and usage data: Our servers automatically collect service-related data to monitor,
            diagnose, and enhance service performance. This log data includes your IP address,
            device information, cookies, browser type, and details of your activities on our
            website, such as the pages you view, searches you conduct, and timestamps of your
            interactions.
          </li>
          <li>
            System and error reports: Information about your activity and any errors encountered
            while using our services.
          </li>
        </ul>
        <Text>
          This information is primarily used to maintain the security and performance of our
          services, as well as for internal analytics to improve your experience.
        </Text>
      </Stack>
      <Stack id="how-do-we-process-your-information">
        <Title order={2}>2. HOW DO WE PROCESS YOUR INFORMATION?</Title>
        <Text>
          We process your personal information for several purposes, depending on your interactions
          with our Services. These include:
        </Text>
        <ul>
          <li>
            <strong>To provide and manage services:</strong>
            We use your personal information, such as the images you upload, to analyze your
            appearance and offer personalized tasks aimed at helping you improve your appearance.
            This and other information is also used for enabling your participation in our revenue
            sharing program and payment processing.
          </li>
          <li>
            <strong>For communication:</strong> We may use your contact information to send you
            important notifications regarding your account, updates about our Services, or to
            respond to any inquiries you have made.
          </li>
          <li>
            <strong>For security and fraud prevention:</strong> We process your information to
            safeguard our website, detect and prevent fraud, unauthorized access, or other illegal
            activities that may compromise the integrity of our Services.
          </li>
          <li>
            <strong>To comply with legal obligations:</strong> We process personal information as
            required by applicable laws, including compliance with tax, financial, and data
            protection regulations. This may include sharing data with regulatory or law enforcement
            bodies.
          </li>
          <li>
            <strong>For vital interests:</strong> In some cases, we may process your information to
            protect the vital interests of you or another person. This may apply to emergency
            situations where harm needs to be prevented or addressed.
          </li>
        </ul>
      </Stack>

      <Stack>
        <Title order={2}>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</Title>
        <Text>
          For users located in the European Union (EU) or United Kingdom (UK), under the General
          Data Protection Regulation (GDPR) and UK GDPR, we must explain the legal bases that
          justify our processing of your personal data. These legal bases include:
        </Text>
        <ul>
          <li>
            Consent: We rely on your explicit consent to process your personal information. You can
            withdraw your consent at any time.
          </li>
          <li>
            Legal obligations: We may process your information to fulfill legal requirements, such
            as tax obligations, compliance with data protection laws, or cooperating with
            authorities in case of legal disputes.
          </li>
          <li>
            Vital interests: In situations where someone&apos;s safety or health is at risk, we may
            process your information to protect those vital interests. For example, this might apply
            in emergency situations where prompt action is required.
          </li>
        </ul>
        <Text>
          For users located in Canada, we process your personal information under the following
          bases, in accordance with Canadian privacy laws:
        </Text>
        <ul>
          <li>
            Express consent: We process your information if you have given explicit permission for
            specific uses, such as sharing images for appearance analysis. You can withdraw your
            consent at any time.
          </li>
          <li>
            Implied consent: In certain situations, your consent may be implied based on your
            actions, such as when you voluntarily upload images, audio, videos or text to our
            platform.
          </li>
        </ul>
        <Text>
          In exceptional circumstances, we may process your information without consent, including:
        </Text>
        <ul>
          <li>
            In an individual&apos;s best interest: When it is clearly in your or someone else&apos;s
            interest to process information, but obtaining consent is impractical or not feasible
            (e.g., in emergencies).
          </li>
          <li>
            For investigations or fraud prevention: To detect and prevent fraud or other illegal
            activities.
          </li>
          <li>
            For business transactions: Under specific conditions, we may process your information
            during business transactions such as mergers, acquisitions, or transfers of assets.
          </li>
          <li>
            For legal demands: When necessary to comply with subpoenas, court orders, or legal
            investigations.
          </li>
          <li>
            Professional or employment context: If the information was collected in the course of
            employment, business, or a profession, and processing aligns with its original purpose.
          </li>
          <li>
            Publicly available information: If your information is publicly available and its
            collection and use are permitted under relevant regulations.
          </li>
        </ul>
        <Text>
          If you are a Canadian resident, you may withdraw consent at any time, unless specific
          exceptions apply.
        </Text>
      </Stack>
      <Stack id="when-and-with-whom-do-we-share-your-personal-information">
        <Title order={2}>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</Title>
        <Text>
          We share your personal information with trusted third parties in specific circumstances to
          provide and improve our services. Below are the types of entities with whom we may share
          your data and the contexts in which this sharing occurs:
        </Text>
        <Title order={3}>Third-Party Service Providers</Title>
        <Text>
          We use Google OAuth to enable easy sign-up and sign-in to Site. This service allows you to
          authenticate your account securely through your Google account. By using Google OAuth, you
          acknowledge and agree that your data may be handled in accordance with Google's privacy
          practices. For more details on how Google handles your information, please review the{" "}
          <Link href="https://policies.google.com/privacy" style={{ textDecoration: "underline" }}>
            Google Privacy Policy
          </Link>
          .
        </Text>
        <Text>
          We also utilize YouTube API Services to provide relevant example videos for the tasks that
          you create. By using the Site, you acknowledge and agree that your data may be collected
          and processed according to YouTube's policies and{" "}
          <Link
            href="https://www.youtube.com/static?template=terms"
            style={{ textDecoration: "underline" }}
          >
            YouTube Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="https://policies.google.com/privacy" style={{ textDecoration: "underline" }}>
            Google Privacy Policy
          </Link>
          .
        </Text>
        <Text>
          We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and
          interact with our website through behavioral metrics, heatmaps, and session replay to
          improve and market our products/services. Website usage data is captured using first and
          third-party cookies and other tracking technologies to determine the popularity of
          products/services and online activity. Additionally, we use this information for site
          optimization, fraud/security purposes, and advertising. For more information about how
          Microsoft collects and uses your data, visit the{" "}
          <Link href="https://www.microsoft.com/en-us/privacy/privacystatement">
            Microsoft Privacy Statement
          </Link>
          .
        </Text>
        <Text>
          We use Google Analytics, to collect and analyze information about how users interact with
          our Site. This helps us understand user behavior, traffic patterns, and overall site
          performance. Google Analytics collects data such as IP addresses, browser types, and usage
          data. By using our Site, you consent to the processing of this data by Google in
          accordance with{" "}
          <Link
            href="https://marketingplatform.google.com/about/analytics/terms/us/"
            style={{ textDecoration: "underline" }}
          >
            Google Analytics Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="https://policies.google.com/privacy" style={{ textDecoration: "underline" }}>
            Google Privacy Policy
          </Link>
          .
        </Text>
        <Text>
          We use Stripe to process payments securely on our Site. When you make a purchase, your
          payment information is handled by Stripe. By using our services, you acknowledge and agree
          that your data may be processed in accordance with{" "}
          <Link href="https://stripe.com/legal/ssa" style={{ textDecoration: "underline" }}>
            Stripe's Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="https://stripe.com/privacy" style={{ textDecoration: "underline" }}>
            Stripe's Privacy Policy
          </Link>
          .
        </Text>
        <Text>
          In addition we may share your information with other third-party vendors, consultants, or
          service providers ("third parties") who perform services on our behalf. These third
          parties help us operate and improve our services by performing essential functions like
          data storage, email notification, and security.
        </Text>
        <Title>Business Transfers</Title>
        <Text>
          If we undergo a business transaction such as a merger, acquisition, sale of assets, or
          financing, we may share or transfer your personal information as part of that process.
          This includes situations where your personal information may be shared during the
          negotiation phase or after the transaction is completed.
        </Text>
        <Text>
          In such cases, the acquiring entity or any new business entity created as a result of the
          transaction will be bound by the commitments we make in this privacy policy regarding your
          personal information, unless otherwise agreed upon.
        </Text>
      </Stack>

      <Stack>
        <Title order={2}>5. WHAT IS OUR STANCE ON THIRD PARTY WEBSITES?</Title>
        <Text>
          Our Services may include links to third-party websites, online services, or mobile
          applications, as well as advertisements from parties that are not affiliated with us. It
          is important to note that:
        </Text>
        <ul>
          <li>
            No endorsement: We do not endorse or have any control over the content, products, or
            services provided by third-party websites or apps. The presence of links or
            advertisements within our Services does not imply that we endorse those third parties.
          </li>
          <li>
            No liability: We are not liable for any losses, damages, or issues you may encounter as
            a result of interacting with third-party websites, services, or applications. Any use of
            such third-party platforms is at your own risk.
          </li>
          <li>
            Privacy and security risks: We cannot guarantee the safety or privacy of any personal
            information you choose to share with third-party websites or services. Third-party data
            collection and privacy practices are not governed by this privacy policy. We encourage
            you to review the privacy policies of any third-party websites or apps you visit to
            understand how they handle your personal information.
          </li>
          <li>
            Your responsibility: You are responsible for reviewing the privacy policies of
            third-party websites, services, or applications linked from our platform. If you have
            any concerns or questions regarding their data practices, you should contact those third
            parties directly.
          </li>
        </ul>
        <Text>
          In summary, while we may provide access to third-party content or services, we are not
          responsible for their privacy practices, content, or actions. Always exercise caution when
          interacting with third-party websites or sharing your personal data with them.
        </Text>
      </Stack>

      <Stack>
        <Title order={2}>6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</Title>
        <Text>
          Our servers are based in the United States. If you access our services from outside the
          U.S., your personal information, including images, audio, videos an text you upload, may
          be transferred to, stored, and processed by us in the U.S. and other countries where we or
          our third-party service providers operate. This also applies to third parties with whom we
          share your information as outlined in the section titled{" "}
          <Link
            href="/legal/privacy#when-and-with-whom-do-we-share-your-personal-information"
            style={{ textDecoration: "underline" }}
          >
            {" "}
            WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </Link>
        </Text>
        <Title>For Residents of the EEA, UK, or Switzerland:</Title>
        <Text>
          If you are located in the European Economic Area (EEA), the United Kingdom (UK), or
          Switzerland, please be aware that the privacy and data protection laws of the U.S. and
          other jurisdictions may not be as comprehensive as the laws in your country of residence.
          However, we are committed to ensuring that your personal information is adequately
          protected in accordance with applicable data protection laws.
        </Text>
        <Text>
          To protect your personal data during transfers, we rely on mechanisms such as the European
          Commission&apos;s Standard Contractual Clauses (SCCs). These clauses ensure that any
          transfer of personal information from the EEA, UK, or Switzerland to non-EEA countries
          complies with European data protection standards. We have also implemented similar
          safeguards with third-party service providers and partners to whom your data may be
          transferred.
        </Text>
        <Title>Additional Safeguards:</Title>
        <Text>
          In addition to the SCCs, we take appropriate steps to ensure that international transfers
          of your personal data comply with applicable laws, including assessing the legal framework
          of recipient countries and ensuring any service provider or partner involved in processing
          your data follows appropriate security and privacy standards.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>7. HOW LONG DO WE KEEP YOUR INFORMATION?</Title>
        <Text>
          We retain your personal information, including your body images and videos, audio and
          text, for as long as necessary to fulfill the purposes for which it was collected,
          including providing you access to your previous scan results, maintaining your account,
          and ensuring compliance with our legal obligations.
        </Text>
        <Text>Specifically:</Text>
        <ul>
          <li>
            Facial and body scan data: Your scan data (images) is retained for a maximum of ten (10)
            years unless a longer retention period is required by law or to resolve disputes.
          </li>
          <li>
            Other personal information: Other personal information, such as your account details
            (e.g., name, email, location) and any related data, will be retained as long as your
            account is active and for a reasonable period thereafter in case you decide to
            reactivate your account or as necessary for legitimate business purposes, including
            fulfilling legal, tax, or accounting requirements.
          </li>
        </ul>
        <Text>
          Once we no longer have an ongoing legitimate business need to retain your information (for
          example, if you request the deletion of your account or after two years of inactivity), we
          will either delete or anonymize your personal information. If deletion is not feasible
          (for instance, if your information is stored in backup archives), we will securely store
          your personal information and isolate it from any further processing until deletion is
          possible.
        </Text>
        <Text>
          Retention of Club members: If you participate in our revenue sharing program (the Club) we
          may retain certain information (such as reward withdrawal, purchases and sales records)
          for the duration of your club membership and for a reasonable time after to comply with
          legal obligations, including financial regulations.
        </Text>
        <Text>
          If you have any questions regarding the retention of your information, please contact us
          at info@muxout.com.
        </Text>
      </Stack>

      <Stack>
        <Title order={2}>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</Title>
        <Text>
          We have implemented a range of technical, organizational, and administrative security
          measures designed to protect the data we process from unauthorized access, misuse,
          disclosure, loss, or alteration. This includes the use of:
        </Text>
        <ul>
          <li>
            Encryption: We use encryption protocols (such as HTTPS) to protect data transmitted to
            and from our services. We also encrypt your data at rest in our databases.
          </li>
          <li>
            Access controls: We limit access to your personal information to only those employees,
            contractors, and third parties who need access to perform essential functions, and who
            are subject to strict confidentiality obligations.
          </li>
          <li>
            Secure data storage: Your personal data, including images, videos, audio and text is
            stored on secure servers with up-to-date security technologies.
          </li>
          <li>
            Regular security audits: We regularly review our security practices and systems to
            identify potential vulnerabilities and implement necessary improvements.
          </li>
        </ul>
        <Text>
          Despite these safeguards, no security system or method of data transmission over the
          Internet is 100% secure. We cannot guarantee that unauthorized third parties, such as
          hackers or cybercriminals, will never be able to bypass our security measures or
          improperly access, steal, or alter your personal information.
        </Text>
        <Title>Transmission of Data</Title>
        <Text>
          While we strive to protect your personal information, you are responsible for ensuring
          that the devices and networks you use to access our services are secure. Data transmitted
          to and from our services, including image, video and audio uploads, is done at your own
          risk. We recommend accessing our services only from a trusted and secure network and using
          up-to-date security software to protect your own devices.
        </Text>
        <Title>Incident Response</Title>
        <Text>
          In the event of a data breach or security incident, we have procedures in place to notify
          affected individuals and the relevant authorities as required by applicable laws. We will
          take immediate steps to mitigate any potential damage and prevent further unauthorized
          access.
        </Text>
        <Text>
          If you have any concerns or believe your account may have been compromised, please contact
          us immediately at info@muxout.com.
        </Text>
      </Stack>

      <Stack>
        <Title order={2}>9. DO WE COLLECT INFORMATION FROM MINORS?</Title>
        <Text>
          We do not knowingly or intentionally collect personal information from individuals under
          the age of 18, nor do we market our services to minors. By using our services, you
          represent and confirm that you are at least 18 years of age. If you are under 18, you are
          not permitted to create an account or use our services in any capacity.
        </Text>
        <Title>Parental Consent</Title>
        <Text>
          If you are a parent or guardian and believe your minor child is using our services without
          your consent, or if we inadvertently collected personal information from someone under 18,
          please contact us immediately at info@muxout.com. We will take swift action to deactivate
          the account and delete the relevant information from our systems.
        </Text>
        <Title>Steps We Take:</Title>
        <ul>
          <li>
            Account deactivation and data deletion: Upon discovering that personal data from a minor
            has been collected, we will deactivate the associated account and take appropriate steps
            to delete the information from our records as quickly as possible.
          </li>
          <li>
            Age verification: While we do not actively verify the age of all users during
            registration, we reserve the right to request age verification at any point if we
            suspect or are informed that a user may be under the age of 18.
          </li>
        </ul>
        <Text>
          For any questions or concerns about our policies regarding minors, or if you need
          assistance with the removal of information, please contact us at info@muxout.com.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>10. WHAT ARE YOUR PRIVACY RIGHTS?</Title>
        <Text>
          If you are located in the European Economic Area (EEA), United Kingdom (UK), Switzerland,
          or Canada, you have certain rights under applicable data protection laws. Depending on the
          specific jurisdiction, these rights may include:
        </Text>
        <ul>
          <li>
            Access: You have the right to request and obtain a copy of the personal information we
            hold about you.
          </li>
          <li>
            Correction: You can request corrections to any inaccurate or incomplete personal
            information we have about you.
          </li>
          <li>
            Deletion: You can ask us to delete your personal information in certain circumstances,
            such as when it is no longer necessary for the purposes for which it was collected, or
            if you withdraw consent where consent is the legal basis for processing.
          </li>
          <li>
            Restriction: You have the right to request that we limit the processing of your personal
            information, for example, if you contest the accuracy of the information or object to
            its processing.
          </li>
          <li>
            Data portability: In certain cases, you have the right to receive your personal data in
            a structured, commonly used, and machine-readable format and request that we transfer it
            to another entity where technically feasible.
          </li>
          <li>
            Automated decision-making: You have the right not to be subject to decisions based
            solely on automated processing, including profiling, that produces legal effects
            concerning you or significantly affects you.
          </li>
          <li>
            Objection: You have the right to object to the processing of your personal information,
            including when processing is for direct marketing purposes or based on legitimate
            interests.
          </li>
        </ul>
        <Text>
          To exercise your rRights: To exercise any of these rights, please contact us using the
          details provided in the{" "}
          <Link
            href="/legal/club#how-can-you-contact-us-about-this-notice"
            style={{ textDecoration: "underline" }}
          >
            HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
          </Link>{" "}
          section below. We will review and address your requests in accordance with applicable data
          protection laws, and may ask for verification of your identity to process your request.
        </Text>
        <Title>Complaints:</Title>
        <ul>
          <li>
            EEA or UK residents: If you believe we are processing your personal information
            unlawfully or in violation of your rights, you have the right to lodge a complaint with
            your local data protection authority.
          </li>
          <li>
            Switzerland residents: You may file a complaint with the Federal Data Protection and
            Information Commissioner (FDPIC).
          </li>
          <li>
            Canada residents: You may contact the Office of the Privacy Commissioner of Canada (OPC)
            with any privacy concerns.
          </li>
        </ul>
        <Title>Withdrawing Consent:</Title>
        <Text>
          You have the right to withdraw your consent for your data processing at any time. To do
          so, please contact us using the information provided below. Please note that withdrawing
          your consent will not affect the lawfulness of any processing carried out before the
          withdrawal, nor will it impact processing based on other legal grounds (e.g., contractual
          necessity).
        </Text>
        <Title>Opting Out of Marketing Communications:</Title>
        <Text>
          You have the right to opt out of receiving marketing and promotional communications from
          us. To do so, you can follow the opt-out instructions in any marketing emails you receive,
          or you may contact us directly at info@muxout.com. Please note that opting out of
          marketing communications will not prevent you from receiving essential service-related
          communications, such as those related to your account or transactions.
        </Text>
        <Text>
          For any further questions or concerns about your privacy rights, feel free to contact us
          at info@muxout.com.
        </Text>
      </Stack>

      <Stack>
        <Title order={2}>11. CONTROLS FOR DO NOT TRACK FEATURES</Title>
        <Text>
          We do not currently respond to Do-Not-Track (DNT) signals or similar mechanisms that may
          be sent by your web browser or mobile application to indicate a preference not to be
          tracked online.
        </Text>
        <Title>What is Do-Not-Track (DNT)?</Title>
        <Text>
          Most web browsers, some mobile operating systems, and certain mobile applications offer a
          Do-Not-Track (DNT) feature. This feature allows you to signal your preference to websites
          and online services that you do not want your online browsing activities to be tracked.
          However, no consistent industry standard has been established for how websites should
          recognize and respond to DNT signals.
        </Text>
        <Title>Our Current Policy:</Title>
        <Text>
          At this time, because there is no uniform standard for interpreting and implementing DNT
          signals, we do not respond to DNT signals or other mechanisms that provide a similar
          preference for not being tracked. This means that even if you enable the DNT feature on
          your browser or device, our site may still collect information about your browsing
          behavior as described in this Privacy Notice.
        </Text>
        <Title>Future Updates:</Title>
        <Text>
          Should an industry-wide or legal standard for recognizing and responding to DNT signals be
          established, and if we are required to comply with that standard, we will update this
          Privacy Notice to reflect how we handle DNT signals and implement such requirements.
        </Text>
        <Text>
          For further information about our data collection practices or to exercise your privacy
          rights, please refer to the relevant sections of this Privacy Notice or contact us at
          info@muxout.com.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</Title>
        <Text>
          Residents of California, Colorado, Connecticut, Utah, and Virginia have specific rights
          regarding their personal information. Here&apos;s what we&apos;ve collected in the past:
        </Text>
        <Title>Categories of Personal Information We Collect:</Title>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Examples</th>
              <th>Collected</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A. Identifiers</td>
              <td>
                Contact details like name, postal address, phone number, online identifiers, IP
                address, email, and account name
              </td>
              <td>YES</td>
            </tr>
            <tr>
              <td>B. Personal Information</td>
              <td>
                Name, contact information, education, employment history, and financial details
              </td>
              <td>YES</td>
            </tr>
            <tr>
              <td>C. Protected Classification</td>
              <td>Gender and date of birth</td>
              <td>NO</td>
            </tr>
            <tr>
              <td>D. Commercial Information</td>
              <td>Transaction details, purchase history, and payment information</td>
              <td>NO</td>
            </tr>
            <tr>
              <td>E. Biometric Information</td>
              <td>Fingerprints and voiceprints</td>
              <td>NO</td>
            </tr>
            <tr>
              <td>F. Internet or Network Activity</td>
              <td>
                Browsing history, search history, online behavior, and interactions with our and
                other websites
              </td>
              <td>NO</td>
            </tr>
            <tr>
              <td>G. Geolocation Data</td>
              <td>Device location</td>
              <td>NO</td>
            </tr>
            <tr>
              <td>H. Audio, Electronic, Visual Information</td>
              <td>Images, videos, and audio related to our business activities</td>
              <td>YES</td>
            </tr>
            <tr>
              <td>I. Professional or Employment-Related Information</td>
              <td>
                Business contact details, job title, work history, and qualifications if applying
                for a job
              </td>
              <td>NO</td>
            </tr>
            <tr>
              <td>J. Education Information</td>
              <td>Student records and directory information</td>
              <td>NO</td>
            </tr>
            <tr>
              <td>K. Inferences</td>
              <td>
                Profiles or summaries about preferences and characteristics based on collected
                personal information
              </td>
              <td>NO</td>
            </tr>
            <tr>
              <td>L. Sensitive Personal Information</td>
              <td>Biometric data</td>
              <td>YES</td>
            </tr>
          </tbody>
        </table>

        <Text>
          If you are a resident of these states, you have specific rights related to your personal
          information. You can request access, correction, or deletion of your data, among other
          rights. For more details on exercising these rights or if you have any concerns, please
          contact us.
        </Text>
        <Title>Retention and Use of Collected Personal Information:</Title>
        <ul>
          <li>
            Category B (Personal Information): We retain this information as long as you have an
            active account with us.
          </li>
          <li>
            Category L (Sensitive Personal Information): We retain this information for as long as
            you have an active account with us. This information may also be used or disclosed to a
            service provider or contractor for specific purposes. You have the right to limit the
            use or disclosure of your sensitive personal information.
          </li>
        </ul>

        <Title>Additional Personal Information Collection:</Title>
        <Text>
          We may collect other personal information when you interact with us in person, online, by
          phone, or by mail. This may include:
        </Text>
        <ul>
          <li>Receiving support through our customer service channels.</li>
          <li>Participation in customer surveys or contests.</li>
          <li>Facilitating the delivery of our Services and responding to your inquiries.</li>
        </ul>

        <Title>How We Use and Share Your Personal Information:</Title>
        <Text>
          <strong>Use:</strong> We use your personal information as described in the section{" "}
          <Link href="how-do-we-process-your-information" style={{ textDecoration: "underline" }}>
            HOW DO WE PROCESS YOUR INFORMATION?
          </Link>{" "}
          for purposes such as providing and improving our Services.
        </Text>
        <Text>
          <strong>Sharing:</strong> We may share your personal information with our service
          providers under written contracts. For details, see the section{" "}
          <Link
            href="when-and-with-whom-do-we-share-your-personal-information"
            style={{ textDecoration: "underline" }}
          >
            WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </Link>
        </Text>

        <Title>Disclosure for Business or Commercial Purposes:</Title>
        <ul>
          <li>
            We have not sold or shared any personal information to third parties for business or
            commercial purposes in the past twelve (12) months.
          </li>
          <li>
            We have disclosed the following categories of personal information for business or
            commercial purposes in the past twelve (12) months: Identifiers, Personal Information,
            Sensistive Personal Information, Audio, Electronic, Visual Information.
          </li>
        </ul>

        <Title>California Residents</Title>
        <Text>
          California Civil Code Section 1798.83 (Shine The Light Law): California residents have the
          right to request and obtain, once per year and free of charge, information regarding the
          categories of personal information (if any) that we have disclosed to third parties for
          direct marketing purposes. Additionally, you can request the names and addresses of those
          third parties with whom we shared personal information in the previous calendar year. To
          make such a request, please contact us in writing using the contact information provided
          below.
        </Text>
        <Text>
          California Minors (Under 18): If you are under 18 years old, reside in California, and
          have a registered account with our Services, you have the right to request the removal of
          any unwanted data you have posted. To request removal, contact us using the information
          provided below.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>13. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</Title>
        <Text>
          Yes, depending on the country you reside in, there may be additional privacy rights and
          regulations that apply to the collection and processing of your personal information.
          Here&apos;s an overview for residents in Australia, New Zealand, and South Africa:
        </Text>

        <Title>Australia</Title>
        <Text>
          In Australia, we are committed to complying with the Privacy Act 1988 and the Australian
          Privacy Principles (APPs).
        </Text>
        <ul>
          <li>
            <strong>Access and correction:</strong> You have the right to request access to your
            personal information and to request its correction if it is inaccurate. To make such a
            request, please contact us using the contact details provided in the section{" "}
            <Link
              href={"how-can-you-review-update-or-delete-the-data-we-collect-from-you"}
              style={{ textDecoration: "underline" }}
            >
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </Link>
          </li>
          <li>
            <strong>Complaints:</strong> If you believe we are not complying with the Australian
            Privacy Principles, you can lodge a complaint with the Office of the Australian
            Information Commissioner (OAIC).
          </li>
        </ul>

        <Title>New Zealand</Title>
        <Text>In New Zealand, we are bound by the Privacy Act 2020.</Text>
        <ul>
          <li>
            <strong>Access and correction:</strong> You have the right to request access to and
            correction of your personal information. To make such a request, please contact us using
            the contact details provided in the section{" "}
            <Link
              href={"how-can-you-review-update-or-delete-the-data-we-collect-from-you"}
              style={{ textDecoration: "underline" }}
            >
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </Link>
          </li>
          <li>
            <strong>Complaints:</strong> If you believe we are not complying with New Zealand&apos;s
            Privacy Principles, you can file a complaint with the Office of the Privacy Commissioner
            (OPC).
          </li>
        </ul>

        <Title>Key Points for Australia and New Zealand:</Title>
        <ul>
          <li>
            <strong>Providing information:</strong> If you choose not to provide the necessary
            personal information, it may impact our ability to offer the products or services you
            request or to respond to your inquiries.
          </li>
          <li>
            <strong>Rights and contacts:</strong> For any questions or to exercise your rights,
            please reach out to us via the contact details in the section{" "}
            <Link
              href={"how-can-you-review-update-or-delete-the-data-we-collect-from-you"}
              style={{ textDecoration: "underline" }}
            >
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </Link>
          </li>
        </ul>

        <Title>Republic of South Africa</Title>
        <Text>
          In South Africa, we are committed to adhering to the Protection of Personal Information
          Act (POPIA).
        </Text>
        <ul>
          <li>
            <strong>Access and correction:</strong> You have the right to request access to your
            personal information and to request its correction if it is inaccurate. To exercise
            these rights, please contact us using the contact details provided in the section{" "}
            <Link
              href={"how-can-you-review-update-or-delete-the-data-we-collect-from-you"}
              style={{ textDecoration: "underline" }}
            >
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </Link>
          </li>
          <li>
            <strong>Complaints:</strong> If you are not satisfied with how we handle your complaint
            regarding our processing of personal information, you may contact the Information
            Regulator for South Africa.
            <ul>
              <li>
                <strong>General enquiries:</strong> enquiries@inforegulator.org.za
              </li>
              <li>
                <strong>Complaints:</strong>
                <ul>
                  <li>
                    <strong>PAIA Complaints:</strong>{" "}
                    <span style={{ wordBreak: "break-all" }}>
                      PAIAComplaints@inforegulator.org.za
                    </span>
                  </li>
                  <li>
                    <strong>POPIA Complaints:</strong>{" "}
                    <span style={{ wordBreak: "break-all" }}>
                      POPIAComplaints@inforegulator.org.za
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>

        <Title>Key Points for South Africa:</Title>
        <ul>
          <li>
            <strong>Providing information:</strong> Failure to provide the required personal
            information might affect our ability to deliver the services you request or address your
            inquiries effectively.
          </li>
          <li>
            <strong>Rights and contacts:</strong> For further details or to exercise your rights,
            please reach out to us via the contact information in the section{" "}
            <Link
              href={"how-can-you-review-update-or-delete-the-data-we-collect-from-you"}
              style={{ textDecoration: "underline" }}
            >
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </Link>
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>14. DO WE MAKE UPDATES TO THIS NOTICE?</Title>
        <Text>
          We may update this privacy notice periodically to reflect changes in our practices,
          technologies, legal requirements, or other factors. When we make updates, we will indicate
          the updated "Updated at" date at the top of the notice. The new version will become
          effective as soon as it is accessible.
        </Text>
        <Text>
          If we make significant changes to this privacy notice, we may inform you either by
          prominently posting a notice about the changes on our Services or by sending you a direct
          notification. We encourage you to review this notice regularly to stay informed about how
          we are protecting your information and any changes to our practices.
        </Text>
        <Text>
          If you have any questions or concerns about the updates, please reach out to us.
        </Text>
      </Stack>

      <Stack id="how-can-you-contact-us-about-this-notice">
        <Title order={2}>15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Title>
        <Text>
          If you have any questions, comments, or concerns about this privacy notice, you can reach
          out to us through the following methods:
        </Text>
        <ul>
          <li>Email: info@muxout.com</li>
          <li>Postal Mail:</li>
          <Text>
            Bettermax LLC
            <br />
            30 N Gould St Ste,
            <br />
            Sheridan, WY 82801
            <br />
            United States
          </Text>
        </ul>
        <Text>
          We are here to assist you and address any inquiries related to your personal information
          and our privacy practices.
        </Text>
      </Stack>

      <Stack
        style={{ marginBottom: rem(48) }}
        id="how-can-you-review-update-or-delete-the-data-we-collect-from-you"
      >
        <Title order={2}>
          16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
        </Title>
        <Text>
          Depending on the laws applicable in your country, you may have the right to access,
          update, or delete your personal information that we collect. To exercise these rights, you
          can reach out to us directly via email at info@muxout.com or by post at:
        </Text>
        <Text>Bettermax LLC, 30 N Gould St Ste, Sheridan, WY 82801, United States</Text>
        <Text>
          We will process your request in accordance with applicable data protection laws and make
          any necessary updates or deletions as required.
        </Text>
      </Stack>
    </>
  );
}
