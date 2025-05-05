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
        Last updated: 5 May, 2025
      </Text>
      <Stack>
        <Text mt={0}>
          Bettermax LLC, doing business as Muxout (“Muxout,” “we,” “us,” or “our”), is committed to
          protecting your privacy. This Privacy Policy describes how we collect, use, share, and
          protect your personal information when you use the Muxout website and services (the “Site”
          or “Services”). It also explains your rights and choices regarding your personal data. We
          adhere to applicable privacy laws worldwide, including the EU General Data Protection
          Regulation (GDPR), the California Consumer Privacy Act and California Privacy Rights Act
          (CCPA/CPRA), Brazil&apos;s Lei Geral de Proteção de Dados (LGPD), Canada&apos;s Personal
          Information Protection and Electronic Documents Act (PIPEDA), and other relevant data
          protection regulations.
        </Text>
        <Text>
          By using our Site or Services, you agree to the practices described in this Privacy Policy
          and in our Terms of Service. If you do not agree with any part of this Policy, please do
          not use Muxout. If you have questions, you can contact us at privacy@muxout.com or by mail
          at the address provided in the “Contact Us” section below.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Information We Collect</Title>
        <Text>
          We collect various types of personal information from you in order to provide and improve
          our Services. The information we collect falls into a few categories:
        </Text>
        <Title order={3}>Personal Information You Provide to Us</Title>
        <Text>
          When you create an account, use Muxout&apos;s features, participate in the Club program,
          or communicate with us, you may provide personal information, including:
        </Text>
        <ul>
          <li>
            <b>Profile Information:</b> Your contact and account details such as name, email
            address, and other profile details. We may also ask for optional demographic information
            like your age or gender and your country of residence (to personalize your experience
            and ensure compliance with local laws).
          </li>
          <li>
            <b>Photos and Videos of Your Appearance:</b> Images or videos of your skin, hair, or
            body that you upload for analysis. Our platform uses AI to analyze these images (for
            example, to generate a severity score from 0–100 for a skin or hair concern you select,
            and to track your progress over time). These photos or videos may contain biometric
            identifiers (e.g. your facial features) and are treated as sensitive personal data under
            laws like GDPR. We only use them to analyze your stated concerns and provide the
            Services (including showing you comparisons over time, as well as enabling you to share
            before-and-after results if you choose).
          </li>
          <li>
            <b>Textual Inputs:</b> Any text information you provide, such as descriptions of your
            skin or hair concerns, notes about your routines, or other journal entries. This can
            include the routines or regimen details you input on the platform. If you choose to
            participate in our community revenue-sharing program (the Club), certain textual content
            (like routine descriptions or diary entries) that you designate for sharing will become
            part of your public profile in the Club.
          </li>
          <li>
            <b>Audio Recordings:</b> If you use voice features, we may collect audio clips (for
            example, voice notes describing your progress or routine). These recordings, like other
            content you provide, can help personalize your experience (and if you opt-in, can be
            shared with others in the Club or community features).
          </li>
          <li>
            <b>Payment and Financial Information:</b> If you make purchases (such as subscribing to
            a premium plan) or earn revenue through the Club, we (or our payment processor) collect
            payment information. This may include your credit or debit card number, expiration date,
            and security code, or bank account details for payouts. Note: Muxout uses a secure
            third-party payment processor (such as Stripe) to handle payment transactions, so we
            generally do not store your full payment card details on our systems. We keep records of
            your transactions (e.g. subscription details, payout records) as needed for billing and
            compliance.
          </li>
        </ul>
        <Title order={3}>Sensitive Personal Data</Title>
        <Text>
          Some of the information you provide is considered sensitive under various privacy laws.
          This includes any biometric data (like facial images or scans from your photos/videos) and
          potentially health-related information inferred from your content. We only collect or
          process sensitive personal data with your explicit consent or as otherwise permitted by
          law. For example, when you upload your photos for analysis, we obtain your explicit
          consent to process those images using AI algorithms to assess your skin/hair condition. If
          you enable certain features (such as sharing your content in the Club), you are explicitly
          consenting to share that sensitive data with other users as you direct. We handle all
          sensitive information with a high level of care and security, as described in this Policy.
        </Text>
        <Title order={3}>Information Collected Automatically</Title>
        <Text>
          Like most online services, we and our service providers automatically collect certain
          technical and usage data when you use Muxout. This information helps us operate, secure,
          and improve our Site and does not usually identify you directly. It includes:
        </Text>
        <ul>
          <li>
            <b>Device and Browser Information:</b> Details about the device and browser you use to
            access Muxout, such as your IP address, device type, operating system, browser type,
            language preferences, and time zone.
          </li>
          <li>
            <b>Usage Data:</b> Information about how you interact with our Site and app, including
            the pages or screens you view, features you use, links or buttons you click, the time
            and date of your visits, and error/crash reports. For example, we may log that you
            visited a particular routine page or how long you spent on a certain feature. This helps
            us understand usage trends and improve service performance.
          </li>
          <li>
            <b>Cookies and Tracking Technologies:</b> We use cookies and similar technologies (like
            web beacons or pixels) to collect and analyze usage data. Cookies are small data files
            stored on your browser or device that help our site function and remember your
            preferences. For instance, cookies enable you to stay logged in and help us track
            aggregate usage statistics. You can control cookies through your browser settings, but
            disabling cookies may affect the functionality of Muxout. (For more details, you can
            refer to our Cookies Policy if available.)
          </li>
        </ul>
        <Text>
          Note: The automatically collected data is primarily used for maintaining the security and
          performance of our services, and for internal analytics. We do not use this data to
          identify you personally, and we do not collect precise geolocation (GPS-level location)
          without your permission. We may infer a general location (e.g. country or city) from your
          IP address to customize your experience (such as content language) and for fraud
          prevention.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>How We Use Your Information</Title>
        <Text>
          Muxout processes your personal information to operate our platform, provide you with
          services, and improve your user experience. Specifically, we use personal data for the
          following purposes:
        </Text>
        <ul>
          <li>
            <b>Providing and Personalizing Our Services:</b> We use the information you provide
            (especially your photos, videos, and routine inputs) to deliver Muxout&apos;s core
            services. This includes analyzing your appearance through our AI algorithms to generate
            a severity score for your chosen skin or hair concern, creating a personalized
            improvement plan or routine for you, and tracking your progress over time. We also use
            your data to personalize the content you see (for example, suggesting tips, articles, or
            product recommendations tailored to your profile and concerns).
          </li>
          <li>
            <b>Enabling the Club Program (Content Sharing and Revenue Sharing):</b> If you choose to
            join the optional “Club” program, we will use and display your relevant personal
            information as needed for that feature. For example, if you opt-in, we will publish the
            content you choose to share (such as your before-and-after photos, routine details, and
            progress notes) to other users of Muxout. We will also use your information to
            facilitate transactions related to the Club (allowing other users to purchase access to
            your shared routines, and tracking any revenue share payouts to you). Participation in
            the Club is entirely voluntary and opt-in; if you do not join, your photos and routines
            remain private.
          </li>
          <li>
            <b>Account Management and Communication:</b> We use your contact information (such as
            email address) to create and manage your account, to communicate with you about
            important service-related matters, and to respond to inquiries or support requests. For
            example, we may send you administrative emails to confirm your registration, notify you
            of changes to our terms or policies, provide password reset instructions, or inform you
            about updates or improvements to the Service.
          </li>
          <li>
            <b>Payments and Transactions:</b> We process payment information to handle subscription
            fees, purchases, and any payouts. For instance, if you subscribe to a premium plan or
            make a purchase through Muxout, we (through our payment processor) will use your payment
            details to complete the transaction. Similarly, if you earn money through the Club, we
            will use your payout information to send you payments.
          </li>
          <li>
            <b>Improving and Developing Our Services:</b> We analyze usage data, feedback, and
            aggregated user content to improve Muxout&apos;s functionality and to develop new
            features. For example, we might review aggregated, de-identified data from many users to
            refine our AI algorithms (ensuring the skin/hair analysis becomes more accurate over
            time) or to understand what features are most popular. We may also use analytics tools
            to troubleshoot issues, test out new features, and enhance user experience. Any use of
            your data for development purposes will either be in an aggregated form or in a manner
            that does not personally identify you, unless we obtain your consent.
          </li>
          <li>
            <b>Security and Fraud Prevention:</b> Your information (both the data you provide and
            data collected automatically) is used to protect the integrity of our platform and our
            users. We monitor usage and account activity to detect, investigate, and prevent
            fraudulent behavior, security incidents, and other malicious or unauthorized activities.
            For example, we may use IP addresses and log-in history to identify potential
            unauthorized logins, or use cookies to implement security features.
          </li>
          <li>
            <b>Compliance with Legal Obligations:</b> We may process and retain your personal
            information as needed to comply with applicable laws and regulations. This includes
            fulfilling our obligations under tax and financial laws (for instance, maintaining
            transaction records for accounting), responding to legally binding requests from
            authorities (such as court orders or lawful subpoenas), or handling legal claims. If
            required by law, we might also disclose information to law enforcement or regulatory
            agencies (for example, providing information to authorities if properly required for an
            investigation).
          </li>
          <li>
            <b>Protection of Vital Interests:</b> In rare cases, we might need to process personal
            information to protect someone&apos;s vital interests, such as in an emergency. For
            example, if we became aware that a user was in immediate danger and personal data could
            help notify emergency services, we might use or disclose data to attempt to prevent
            harm. This kind of processing would only occur under urgent circumstances where it is
            necessary to protect life or safety.
          </li>
          <li>
            <b>Other Purposes with Your Consent:</b> If we ever need to use your personal
            information for a purpose not covered above, we will explain the purpose to you and, if
            required, ask for your consent before proceeding. For example, if we wanted to use your
            testimonial or before/after photos in our marketing materials, we would only do so with
            your explicit permission.
          </li>
        </ul>
        <Text>
          <b>No Automated Decisions with Legal Effect:</b> While Muxout uses AI-based automated
          analysis to evaluate your skin/hair images and generate recommendations, we do not make
          any decisions about you that have legal or similarly significant effects solely by
          automated means. The AI-generated severity scores and suggestions are provided for your
          information and self-improvement only - they do not determine your access to our Service
          or result in any formal denial of service or rights. You always have the option to not use
          the recommendations. We maintain transparency about our AI processes and are accountable
          for their results. If you believe an automated processing of your data is impacting you
          significantly, you have the right to contact us and request review or explanation (see
          Your Privacy Rights below for more details).
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Legal Bases for Processing (GDPR, LGPD, etc.)</Title>
        <Text>
          We process personal data only when we have a valid legal basis to do so. The appropriate
          legal basis depends on how and where you are using our Services:
        </Text>
        <ul>
          <li>
            <b>Consent:</b> In many cases, we rely on your consent. By providing us with certain
            data, you consent to our processing of that data for the purposes explained. For
            example, because photos of your face or body can be considered biometric and sensitive
            information, we will only use the images and videos you upload for AI analysis with your
            explicit consent. You may withdraw your consent at any time (see Your Privacy Rights),
            though note that doing so will not undo any processing already performed and may mean we
            can no longer provide some Services to you.
          </li>
          <li>
            <b>Contractual Necessity:</b> When we enter into a contract with you (for instance, when
            you agree to our Terms of Service by creating an account and using Muxout), we will
            process certain personal data as needed to perform that contract. In other words, we use
            your information to deliver the Services you have requested. For example, processing
            your photos to generate analysis results, or using your email to log you in and send
            service communications, is necessary for us to provide the service you expect. If you
            are a Club member, processing your relevant data (content, payout info, etc.) is
            necessary to carry out the Club services and payments as agreed.
          </li>
          <li>
            <b>Legitimate Interests:</b> We may process some information for our legitimate business
            interests, provided that those interests are not overridden by your data-protection
            rights. This legal basis covers uses that are fundamental to running and improving our
            business - such as securing our platform, preventing fraud, analyzing and improving our
            services, and providing customer support - in cases where those uses are not strictly
            required by a contract or law but still important for our service quality. For example,
            we have a legitimate interest in understanding how users interact with Muxout (through
            analytics) to improve functionality, and in keeping our platform secure. When we rely on
            legitimate interests, we will ensure our processing is proportional and respects your
            privacy. You have the right to object to processing based on our legitimate interests
            (see Your Privacy Rights below).
          </li>
          <li>
            <b>Legal Obligation:</b> We will process and retain personal information as necessary
            for us to comply with our legal obligations. For instance, we may keep transaction
            records to meet financial reporting laws, or disclose information if required by
            government authorities under applicable law. In such cases, the law is the basis for
            processing.
          </li>
          <li>
            <b>Vital Interests:</b> In extreme circumstances, we may process data to protect vital
            interests - either yours or another person&apos;s. This could apply in life-threatening
            situations (as described above in how we use information) where we need to process or
            disclose data to prevent serious harm. This basis is rarely invoked and only in critical
            situations.
          </li>
          <li>
            <b>Public Interest:</b> In the unlikely event we need to perform a task in the public
            interest or exercise official authority (for example, public health reporting
            requirements), we would rely on that basis as provided by law. (This is generally not
            applicable to Muxout&apos;s usual activities, but we include it for completeness.)
          </li>
        </ul>
        <Title order={4}>Special Notes for Certain Jurisdictions:</Title>
        <ul>
          <li>
            <b>European Union/United Kingdom/Switzerland:</b> If you are in the EU, UK, or a similar
            jurisdiction, we will ensure we have one of the above legal bases (as defined under GDPR
            or equivalent laws) for all processing of your personal data. Notably, when we process
            “special category” data like biometric information in your photos, we do so based on
            your explicit consent (GDPR Art. 9(2)(a)), unless another exception applies. We will
            also respect additional principles like data minimization, and we honor your rights as
            described in the Your Privacy Rights section.
          </li>
          <li>
            <b>Canada:</b> We process personal data of Canadian users in accordance with PIPEDA and
            other applicable provincial laws. In practice, this means we obtain your express consent
            for most collection and uses of your personal information (for example, when you upload
            images for analysis or join the Club). In some cases, your consent may be implied by
            your actions (for instance, if you voluntarily provide information or use a feature, we
            infer you consent to the associated use of that information). We may also process data
            without consent in certain exceptional circumstances allowed by law – for example, if
            required by subpoena, for an investigation of fraud, or if it&apos;s clearly in your
            interests and consent cannot be obtained in a timely way (such as an emergency). PIPEDA
            also permits use of personal information for reasonable purposes that a reasonable
            person would consider appropriate in the circumstances, but we will not use your data
            for unexpected purposes without informing you.
          </li>
          <li>
            Brazil: For users in Brazil, we comply with the LGPD. We primarily rely on your consent
            to process personal data, especially for sensitive personal data like biometric
            information (as defined in LGPD). We may also process your data on other legal bases
            permitted by LGPD, such as when processing is necessary to fulfill a legal obligation,
            to execute a contract with you or at your request (e.g., providing our services), to
            exercise our rights in judicial or administrative proceedings, to protect life and
            safety in emergencies, or for legitimate interests of Muxout or third parties (balanced
            against your fundamental rights). Where we rely on legitimate interests under LGPD, it
            will be in situations similar to those described above (security, service improvement,
            etc.), and not for uses that require consent by law. You have rights to know and control
            how your data is processed under LGPD - see Your Privacy Rights for more information.
          </li>
          <li>
            <b>United States (General):</b> In the U.S., the above GDPR-style legal basis framework
            does not formally apply, but we still strive to collect and use data responsibly and
            only as outlined in this Policy or as otherwise permitted by law. For certain types of
            data (like biometric identifiers), some U.S. state laws require consent - in those
            cases, we will obtain consent as needed (for example, Illinois law requires consent for
            biometric data usage, which we obtain from you when you upload your photos for
            analysis). We also adhere to state-specific privacy laws as detailed later in this
            Policy.
          </li>
        </ul>
        <Text>
          If you ever have questions about the legal basis for any specific processing of your data,
          please contact us and we will be happy to provide additional information.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>How We Share Your Information</Title>
        <Text>
          We do not sell your personal information to third-party companies for their own marketing
          or profit. We only share your data in a few specific circumstances, outlined below, and
          always with appropriate protections in place. When we disclose personal information, we do
          so either at your direction or to support the purposes described in this Privacy Policy.
          The types of third parties with whom we may share information include:
        </Text>
        <ul>
          <li>
            <b>Service Providers and Contractors:</b> We share personal information with trusted
            third-party companies that perform services on our behalf and under our instructions.
            These providers help us operate and enhance Muxout - for example, cloud hosting
            providers that store data, analytics providers that help us understand how users use our
            site, email providers that send out communications, and customer support tools that help
            us respond to inquiries. We have agreements with these parties to ensure your data is
            protected and used only for the agreed-upon purposes. Key service partners include:
            <ul>
              <li>
                <b>Authentication and Login:</b> We offer convenient login options like Google OAuth
                for signing into Muxout. If you choose to register or log in via a third-party
                account (e.g., your Google account), the authentication process will route through
                that provider. We receive information such as your name and email from your Google
                profile (as permitted by your Google privacy settings) to create or sign into your
                Muxout account. Using Google OAuth means you also agree to{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  style={{ textDecoration: "underline" }}
                >
                  Google&apos;s Privacy Policy
                </Link>
                .
              </li>
              <li>
                <b>Analytics and User Experience Tools:</b> We use tools like Google Analytics to
                collect information about Site traffic and usage patterns. Google Analytics may set
                cookies or similar identifiers to gather data such as your IP address, browser type,
                pages visited, and time spent on pages. This helps us understand user engagement and
                improve our Services. (Learn more in Google&apos;s Privacy Policy.) We also use
                Microsoft Clarity (a user behavior analytics tool) which can record page interaction
                information (like clicks, scrolls, and heatmaps of usage) to help us optimize our
                user interface. Microsoft Clarity may use cookies and other tracking technologies
                for these purposes. Data collected through these analytics services is generally
                aggregated and does not directly identify individuals. However, these providers
                might have access to certain device identifiers or IP addresses in the process of
                providing their services. Please refer to the{" "}
                <Link href="https://www.microsoft.com/en-us/privacy/privacystatement">
                  Microsoft Privacy Statement
                </Link>{" "}
                and Google Privacy Policy for details on their handling of data.
              </li>
              <li>
                <b>Video Content Integration:</b> As part of enhancing your routine recommendations,
                Muxout may show you relevant tutorial videos or content. Some of this content may be
                provided through YouTube API Services. For example, if a recommended task in your
                routine has a related demonstration video, it might be embedded via YouTube. If you
                view such a video, YouTube/Google may collect usage data under their policies. By
                using this aspect of our Services, you agree to be bound by the YouTube Terms of
                Service, and{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  style={{ textDecoration: "underline" }}
                >
                  Google&apos;s Privacy Policy
                </Link>{" "}
                will apply to the data they collect.
              </li>
              <li>
                <b>Payment Processors:</b> When you make a purchase or receive a payout, we rely on
                third-party payment processors like Stripe to handle your financial transactions
                securely. These processors will receive your payment details to process
                transactions. We share the minimum necessary information with them (for instance, we
                might pass your email and payment amount, while you enter your card details directly
                into Stripe&apos;s form). Stripe&apos;s handling of your information is governed by
                <Link href="https://stripe.com/privacy" style={{ textDecoration: "underline" }}>
                  Stripe&apos;s Privacy Policy
                </Link>
                . We do not store your full payment card numbers on our own servers; that
                information is tokenized or stored by the payment processor.
              </li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </li>
          <li>
            <b>Other Users and the Public (at Your Direction):</b> We will only share your personal
            content with other users if you actively choose to do so. By default, the photos,
            routines, and other data you upload to Muxout are private to your account. If you choose
            to participate in community features or the Club revenue-sharing program, you are giving
            us permission to share certain information with others: for example, if you publish a
            routine in the Club, other users will be able to see your submitted content (such as
            your before-and-after images, your routine steps, and progress diary entries) and your
            chosen display name or profile. Likewise, if you post a review or comment in a public
            forum on our Site, any personal information you include in that post (including any
            images) will be visible to others who access that forum. We will never make your
            sensitive data (like your images or full name) visible to other users unless you opt-in
            by using a feature that clearly involves sharing that information. Please exercise
            caution when opting to share any personal data publicly, as we cannot control what other
            users may do with content you make public. If you change your mind, you may delete
            shared content or end your participation in the Club, and we will cease further sharing
            of your content; however, note that we cannot retroactively undo views or access that
            already occurred.
          </li>
          <li>
            <b>Business Transfers:</b> If Muxout (Bettermax LLC) is involved in a significant
            business transaction, such as a merger, acquisition, reorganization, financing, or sale
            of some or all of our assets, your personal information may be transferred to the
            acquiring or successor entity as part of that transaction. We will ensure that any such
            entity is bound by confidentiality and privacy obligations consistent with this Policy.
            If a transfer results in a material change in how your personal data will be handled, we
            will notify you and/or give you choices as required by law.
          </li>
          <li>
            <b>Legal Compliance and Protection:</b> We may disclose your personal information when
            we believe in good faith that such disclosure is necessary to comply with a legal
            obligation or request. This includes responding to court orders, warrants or subpoenas,
            cooperating with government investigations, or meeting law enforcement or national
            security requirements. We may also disclose information if we believe it is necessary or
            appropriate to protect the rights, property, or safety of Muxout, our users, or the
            public. For example, we might share information with law enforcement agencies to
            investigate fraud, harassment, or other violations of law or our Terms of Service. We
            will endeavor to notify you of any such disclosure, if permitted by law.
          </li>
          <li>
            <b>Affiliates and Partners:</b> We might share information with our corporate affiliates
            (such as a parent company, subsidiaries, or entities under common ownership) if any
            exist in the future, in which case they will honor this Privacy Policy. We do not
            currently have separate affiliate companies, but if that changes, we would ensure any
            affiliate handling personal data applies protections equivalent to ours. We do not
            currently share personal data with any third-party business partners for their
            independent use, except as described above (service providers acting on our behalf). If
            we ever engage in joint offerings with a partner where sharing of user data is involved,
            we will only do so with your consent or with clear notice and opt-out opportunities.
          </li>
        </ul>
        <Text>
          <b>No Selling of Personal Data:</b> Muxout does not sell or rent your personal information
          to data brokers or third parties for monetary consideration. We also do not share your
          personal information with third parties for their own direct marketing purposes unless you
          explicitly agree. In the past 12 months, we have not sold any personal information, and we
          have only shared personal information with third parties in ways consistent with the
          purposes described above (such as with service providers processing data for us). If this
          ever changes, we will update this Policy and provide any required notices or opt-out
          mechanisms.
        </Text>
        <Text>
          <b>Aggregated or De-Identified Data:</b> We may share information that has been aggregated
          (combined with information about many users) or de-identified (stripped of personal
          identifiers) in such a way that it cannot reasonably be used to identify you. For example,
          we might publish trends about user improvement (e.g., “80% of users saw a reduction in
          acne score after 8 weeks”) or share statistics with researchers or business partners. Such
          aggregated or anonymized information is not considered personal information and may be
          used freely, but we will ensure that it cannot be traced back to individual users.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Third-Party Websites and Content</Title>
        <Text>
          Muxout may contain links to external websites or integrate third-party services and
          content that we do not operate. For example, our platform might link to an article on a
          skincare blog, redirect you to an e-commerce site to purchase a recommended product, or
          show embedded content (like a YouTube video, as mentioned above). This section explains
          how these third-party links and integrations work and cautions that their privacy
          practices are separate from ours:
        </Text>
        <ul>
          <li>
            <b>Independent Privacy Policies:</b> If you click a link to a third-party website or
            service, or interact with third-party content through Muxout, you will be governed by
            that third party&apos;s own privacy policy and terms of use. We do not control the data
            collection or handling practices of third parties. For instance, if you follow a link
            from Muxout to purchase a product on another site (say, Amazon or a skincare
            brand&apos;s site), any information you provide on that site will be subject to their
            rules, not Muxout&apos;s Privacy Policy. We recommend you review the privacy policy of
            any external site or service you visit.
          </li>
          <li>
            <b>No Endorsement or Control:</b> A link to or integration with a third-party service is
            not an endorsement by Muxout of that third party&apos;s content, products, or data
            practices. We provide these links or features for your convenience or to enhance your
            experience, but we have no control over the content, accuracy, or availability of
            external services. You use them at your own discretion and risk.
          </li>
          <li>
            <b>Third-Party Data Collection:</b> Third-party sites or services may independently
            collect information about you when you interact with them. For example, if we embed a
            YouTube video, Google/YouTube might record your views or clicks on that video. If we use
            Microsoft Clarity, Microsoft may collect certain usage data from your browser. Such
            information is collected directly by those third parties and is subject to their privacy
            practices. Muxout does not receive all data that those third parties may collect (for
            example, we see aggregated analytics from Google Analytics, but we don&apos;t see raw
            data that personally identifies you collected by Google). We cannot guarantee the
            privacy or security of information you provide to any outside website.
          </li>
          <li>
            <b>Your Choices with Third Parties:</b> You are never required to click on a link or use
            an integrated third-party service when using Muxout. If you prefer not to share data
            with third-party content providers, you may choose not to engage with those features
            (for instance, you can skip watching an embedded video or not use a social login option
            and register with email instead). If you have questions or concerns about a third-party
            integration on our Site, feel free to contact us for more information.
          </li>
        </ul>
        <Text>
          In summary, once you leave our Site or interact with a separate service, this Privacy
          Policy will no longer apply to any data collected by that third party. We encourage you to
          be cautious and to read the privacy policies of any other websites or services you visit
          through links on Muxout.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>International Data Transfers</Title>
        <Text>
          Muxout is a global platform, and your personal information may be transferred to or stored
          on servers in countries different from your own. Primarily, our data servers are located
          in the United States (since Bettermax LLC is a U.S.-based company). Additionally, some of
          our service providers may process data in other countries. This means that if you use
          Muxout from outside the U.S., your personal data (including images, text, and other
          content you upload) might be transferred to and processed in the United States or other
          jurisdictions that may not have the same level of data protection laws as in your home
          country.
        </Text>
        <Text>
          However, we take steps to ensure that your personal information remains protected
          according to the standards of your home jurisdiction:
        </Text>
        <ul>
          <li>
            <b>Transfers from the EEA/UK/Switzerland:</b> If you are located in the European
            Economic Area (EEA), United Kingdom, or Switzerland, we will ensure that appropriate
            safeguards are in place for transfers of personal data out of those regions. For
            example, we may rely on the European Commission&apos;s Standard Contractual Clauses
            (SCCs) or equivalent legal mechanisms as a legal basis for data transfers. These SCCs
            are contractual commitments between parties transferring personal data, binding them to
            protect the privacy and security of the data in line with EU law. We have implemented
            SCCs where required (such as between us and our U.S. service providers) to cover your
            data moving from the EEA/UK to the U.S. or other countries. In some cases, we may also
            rely on your explicit consent for certain cross-border transfers if that is more
            appropriate (though generally SCCs or other measures will be used).
          </li>
          <li>
            <b>Additional Safeguards:</b> In addition to legal transfer mechanisms, we apply
            technical measures like encryption and strict access controls to protect your data
            during transit and in storage (see Data Security below). We also carefully vet our
            vendors and require that they uphold privacy and security obligations regardless of
            where they operate. We monitor developments in international data transfer law (such as
            new frameworks or rulings) and will adjust our practices as needed to remain compliant.
            If a given country&apos;s legal environment is deemed inadequate to protect personal
            data, we will take supplementary measures or cease transfers as required.
          </li>
          <li>
            <b>Your Consent & Acknowledgment:</b> By using Muxout and providing us with information,
            you acknowledge that your data may be transferred to and processed in the United States
            and other jurisdictions as explained. We will always handle your personal information in
            accordance with this Privacy Policy and applicable law, wherever it is processed. If you
            prefer not to have your data transferred to other countries, please do not use our
            Services or contact us to discuss your concerns; we may be able to accommodate certain
            arrangements, but in general cross-border data flows are integral to our operations (for
            example, if you are in the EU, we cannot provide the service without transferring your
            data to our U.S. servers).
          </li>
        </ul>
        <Text>
          If you have questions about our international data transfer practices or need more
          information about the safeguards we have in place, please contact us (see Contact Us
          section below). We can provide copies of relevant contractual protections upon request.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Data Retention: How Long We Keep Your Information</Title>
        <Text>
          We retain personal information only as long as necessary to fulfill the purposes described
          in this Privacy Policy, unless a longer retention period is required or permitted by law.
          This means we keep your data for the duration of your relationship with us and for a
          period afterward where there is an ongoing legitimate need or legal obligation to do so.
          Below are our general retention practices for different types of data:
        </Text>
        <ul>
          <li>
            <b>Account Information and Content:</b> As long as you maintain an active account on
            Muxout, we will retain the personal information you have provided (such as your profile
            info, images, routines, and other content in your account) so that we can provide the
            Services to you. Your data is used to show your historical scan results and progress,
            enable you to resume your routines, etc. If you decide to delete your account or if your
            account becomes inactive for an extended period, we will initiate the deletion process
            for your personal data (after any mandatory retention periods).
          </li>
          <li>
            <b>Appearance Photos and Scan Data:</b> The images and analysis data you upload (e.g.,
            your “before” and “after” photos and the associated AI-generated scores) are retained
            while your account is active so that you can review your progress over time. After your
            account is deleted or becomes inactive, we will generally retain your photos and related
            biometric analysis data for no more than ten (10) years, unless a longer period is
            required for legal reasons or to resolve disputes. Note: In some jurisdictions, laws may
            require a shorter retention period for biometric information - we comply with any such
            requirements. For example, if applicable law mandates deletion of biometric data within
            a certain timeframe (such as 3 years after your last interaction, under Illinois law),
            we will follow that rule for users from that jurisdiction.
          </li>
          <li>
            <b>Other Personal Data:</b> Other data you have provided (like your name, contact info,
            text notes, etc.) and records of your use of the Service are retained while your account
            is active. After you stop using Muxout, we typically keep this information for a
            reasonable period (for example, a few years) in case you return and wish to reactivate
            your account or if we need the data for our legitimate business purposes. “Legitimate
            purposes” may include things like maintaining accurate financial records, handling any
            disputes or requests from you, or demonstrating our compliance with laws. For instance,
            if you delete your account, we might keep a backup of your account data for a short time
            in case you contact us to restore it, and we might retain transactional records for a
            longer period as needed for auditing or tax purposes.
          </li>
          <li>
            <b>Club Participation Records:</b> If you participate in the Club (our revenue-sharing
            program), we will keep certain records related to that program for the duration of your
            participation and for an appropriate time afterward. For example, we will retain
            information about routine purchases and sales, payout transactions, and other
            Club-related activities to comply with financial reporting and tax laws. These records
            may be kept for several years as required by statutes of limitations for tax or
            accounting regulations. They will be maintained even if you leave the Club or delete
            your account, strictly for compliance purposes.
          </li>
          <li>
            <b>Automatically Collected Data:</b> Logs and analytics data are generally retained for
            a shorter period, unless needed longer for security analysis. For example, our server
            logs and Clarity/Analytics data might be kept for a few months up to a couple of years,
            depending on the type of data, after which they are deleted or anonymized. We use
            aggregated analytics reports (which do not identify you personally) for business
            planning and those may be kept indefinitely.
          </li>
          <li>
            <b>Backup and Archival Copies:</b> Please note that when we delete data from our live
            systems, it may still persist in our backups or archival systems for a period of time
            until those backups rotate out or are overwritten. We maintain backups for disaster
            recovery and business continuity purposes. Access to any personal data in backups is
            limited, and we will ensure deleted data is not restored except as needed for system
            recovery or required by law. If it is restored (for example, in recovering from a system
            failure), we will re-delete the data as appropriate.
          </li>
        </ul>
        <Text>
          When we no longer have a legitimate need to keep your personal information, we will
          securely delete, anonymize, or isolate it. Anonymization means we alter the data so it can
          no longer be associated with you (for example, we might remove identifiers from a dataset
          but keep aggregate statistics). If immediate deletion of certain data is not technically
          feasible (e.g., data stored in long-term backups), we will safeguard that data and
          restrict any further use until deletion is possible.
        </Text>
        <Text>
          <b>Your Deletion Requests:</b> You have the right to request deletion of your data at any
          time (see Your Privacy Rights below). We will honor such requests in accordance with
          applicable law, which may involve retaining certain information if necessary (for example,
          to complete a transaction you initiated, or to comply with a legal obligation to keep
          records). In the event we must retain some data after a deletion request, we will inform
          you of what we are keeping and why.
        </Text>
        <Text>
          If you have any specific questions about our data retention practices (for example, if you
          want to know if we still have certain information about you), you can contact us at
          privacy@muxout.com.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Data Security Measures</Title>
        <Text>
          We take the security of your personal information very seriously. Muxout has implemented a
          variety of technical, administrative, and physical security measures to protect your data
          from unauthorized access, alteration, disclosure, or destruction. While no website or
          internet transmission is completely secure, we strive to protect your information to the
          best of our abilities. Our security practices include:
        </Text>
        <ul>
          <li>
            <b>Encryption:</b> We protect data in transit between your device and our servers by
            using encryption protocols like HTTPS/TLS. This means that when you send us information
            (such as uploading photos or entering your password), it is encrypted so that third
            parties cannot easily intercept it. We also employ encryption or pseudonymization for
            certain sensitive data at rest in our databases. For example, passwords are stored in a
            hashed form (not in plain text), and other sensitive fields may be encrypted on our
            servers.
          </li>
          <li>
            <b>Access Controls:</b> We limit access to personal information strictly to those
            employees, contractors, and service providers who need it to perform their work. Access
            to sensitive data (like user photos or payment info) is restricted to authorized
            personnel under the principle of least privilege. All staff with such access are bound
            by confidentiality obligations. We also use authentication measures (such as
            multi-factor authentication and unique credentials) to prevent unauthorized access to
            our systems.
          </li>
          <li>
            <b>Secure Infrastructure:</b> We host data with reputable cloud service providers that
            maintain robust security standards and certifications. Our servers are protected by
            firewalls, network security monitoring, and other hardening measures. We keep our
            software and systems updated to address security vulnerabilities, and we use anti-virus
            and anti-malware tools where appropriate.
          </li>
          <li>
            <b>Monitoring and Testing:</b> We monitor our platform for suspicious activities and
            have systems in place to detect and automatically block abnormal or malicious behavior
            (for example, multiple failed login attempts might trigger a temporary lock). We conduct
            regular security assessments and audits of our systems to identify potential weaknesses.
            This may include penetration testing by security experts and code reviews focused on
            security.
          </li>
          <li>
            <b>Employee Training and Policies:</b> Our team is trained on data protection best
            practices. We have internal policies governing how to handle user data, and procedures
            for reporting and responding to security incidents. Only authorized individuals are
            allowed to handle sensitive user data, and they must follow strict guidelines.
          </li>
          <li>
            <b>Payment Security:</b> For financial transactions, we comply with industry standards
            such as PCI-DSS (Payment Card Industry Data Security Standard) via our payment
            processor. Sensitive payment information is handled by the processor&apos;s secure
            systems, and any interaction on our site that involves payment data is done through
            secure, encrypted channels.
          </li>
        </ul>
        <Text>
          Despite all these precautions, it&apos;s important to note that no method of transmission
          over the Internet or method of electronic storage is 100% secure. We cannot guarantee
          absolute security of your information. However, we continuously review and enhance our
          security protocols to mitigate risks of unauthorized access.
        </Text>
        <Text>
          <b>User Responsibility:</b> You also play a role in keeping your information secure. We
          urge you to choose a strong, unique password for your Muxout account and to keep your
          login credentials confidential. Do not share your password with others and be cautious of
          phishing attempts or other scams that might trick you into divulging personal information.
          Always log out of your account on shared devices. If you use our mobile app, enabling a
          device lock (PIN, fingerprint, etc.) adds another layer of protection. When uploading
          images or content, consider what you are comfortable storing on the platform. While we
          secure your uploads, avoid using Muxout over unsecured public Wi-Fi networks if possible,
          or use a VPN on such networks.
        </Text>
        <Text>
          <b>Data Transmission Warnings:</b> We encrypt data to protect it, but please be aware that
          emails or other communications you send to us may not be encrypted on your end. Avoid
          sending highly sensitive information (like full payment card numbers or passwords) via
          email or other unsecured channels. When you are using the Site, ensure your browser shows
          a secure connection (look for “https://” and a lock icon in the address bar).
        </Text>
        <Text>
          <b>Incident Response and Data Breach Notification:</b> In the event of a data breach or
          security incident that affects your personal information, we have a response plan to
          address and mitigate the issue promptly. This includes investigating the scope of the
          breach, securing the system, and notifying affected users and relevant authorities as
          required by law. For example, GDPR requires us to notify the appropriate data protection
          authority within 72 hours of discovering certain significant breaches, and to inform
          impacted individuals without undue delay. If such an incident occurs, we will provide you
          with information on what happened, what data might be involved, and recommendations on
          steps you can take to protect yourself. We will also take necessary measures to prevent
          any further unauthorized access to your data.
        </Text>
        <Text>
          If you believe that your Muxout account or information has been compromised (for instance,
          if you notice suspicious activity in your account or you lose access to your account),
          please contact us immediately at privacy@muxout.com. We will work with you to investigate
          and address the issue.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Children&apos;s Privacy (Minors)</Title>
        <Text>
          Muxout&apos;s Services are not intended for anyone under the age of 18. We do not
          knowingly collect or solicit personal information from minors (children under 18 years of
          age). If you are under 18, you are not permitted to create an account on Muxout or use our
          platform in any way.
        </Text>
        <Text>
          We explicitly restrict usage in our Terms of Service to individuals 18 or older (or the
          age of majority in your jurisdiction, if higher). By using Muxout, you represent and
          warrant that you meet this age requirement.
        </Text>
        <Text>
          Parental Involvement: If you are a parent or legal guardian and you become aware that your
          minor child has registered for Muxout or otherwise provided us with personal information
          without your consent, please contact us right away at privacy@muxout.com. We will take
          prompt steps to delete the child&apos;s account and remove any personal data we may have
          collected. We appreciate your cooperation in monitoring your children&apos;s internet
          usage and in helping enforce our age restrictions.
        </Text>
        <Title order={4}></Title>
        <ul>
          <li>
            If we learn that we have inadvertently collected personal data from a person under 18,
            we will immediately deactivate the account and cease any further processing of the
            minor&apos;s information.
          </li>
          <li>
            We will delete the minor&apos;s personal information from our records as soon as
            reasonably practicable. In circumstances where deletion is complex (for example, data
            stored in backups), we will ensure the data is isolated from any active use and then
            purge it when feasible.
          </li>
          <li>
            In cases of uncertainty about a user&apos;s age, we reserve the right to request proof
            of age or perform age verification checks. If we suspect a user may be underage, we may
            suspend the account and seek confirmation of age. Failure to provide satisfactory proof
            of age will result in account termination.
          </li>
        </ul>
        <Text>
          We are committed to complying with all applicable laws concerning children&apos;s privacy,
          such as the U.S. Children&apos;s Online Privacy Protection Act (COPPA), even though our
          Service is not directed at children. If you have any questions or concerns about our
          practices in relation to children&apos;s personal information, please contact us.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Your Privacy Rights and Choices</Title>
        <Text>
          You have a number of rights regarding your personal information, which may vary depending
          on your location and the applicable privacy laws. Muxout is committed to honoring these
          rights and providing you with control over your data. Below is an overview of the rights
          you may have and how you can exercise them:
        </Text>
        <Title order={4}>
          General Data Subject Rights (Applicable to EU/EEA, UK, Switzerland, Canada, and similar
          jurisdictions):
        </Title>
        <ul>
          <li>
            <b>Right to Access:</b> You have the right to request confirmation of whether we are
            processing your personal information, and if so, to request a copy of the data we hold
            about you. This allows you to know what information we have collected and to verify that
            we are processing it in accordance with the law. We will provide your data in a common
            digital format (typically electronically) unless otherwise requested.
          </li>
          <li>
            <b>Right to Rectification (Correction):</b> If any of your personal information is
            inaccurate or incomplete, you have the right to request that we correct or update it.
            You can also correct some of your basic information directly by logging into your
            account (for example, you can update your email or other profile details in your account
            settings). We appreciate it if you keep your information up to date.
          </li>
          <li>
            <b>Right to Erasure (Deletion):</b> You have the right to request deletion of your
            personal data in certain circumstances. For example, you can ask us to delete
            information if it&apos;s no longer necessary for the purposes for which it was
            collected, if you withdraw consent (where consent was the legal basis for processing),
            or if you object to processing and we have no overriding legitimate grounds to continue.
            We will honor valid deletion requests and will also instruct any service providers
            processing your data on our behalf to delete the data. Keep in mind that we might retain
            certain information if required by law or for legitimate business purposes (we will
            inform you if so). Deleting your data may also mean we cannot provide you with some
            Services moving forward.
          </li>
          <li>
            <b>Right to Restrict Processing:</b> You have the right to request that we limit the
            processing of your personal information in certain situations. This can apply, for
            example, if you contest the accuracy of your data (you can ask us to pause processing
            until we verify or correct it), or if you have objected to processing (and we are
            weighing whether our legitimate grounds override yours). When processing is restricted,
            we will store your data but not use it until the restriction is lifted (unless for legal
            reasons).
          </li>
          <li>
            <b>Right to Data Portability:</b> Where applicable (generally for data processed by
            automated means on the basis of your consent or performance of a contract), you have the
            right to obtain a copy of certain personal information in a structured, commonly used,
            machine-readable format (for instance, CSV or JSON). You can also request that we
            transfer this data to another controller, where technically feasible. Essentially, this
            is your right to take your data with you. For example, you could request an export of
            the personal data you provided to us and the analysis results we generated, to port to
            another service.
          </li>
          <li>
            <b>Right to Object:</b> You have the right to object to our processing of your personal
            information in some cases. If we are processing your data based on legitimate interests,
            you can object if you feel our processing impacts your rights and freedoms unfairly. If
            you object, we will review the reasons for your objection and stop or adjust processing
            unless we have a compelling legitimate ground to continue or the processing is needed
            for legal claims. You also have an unconditional right to object to the processing of
            your data for direct marketing purposes (see below).
          </li>
          <li>
            <b>Right to Withdraw Consent:</b> If we rely on your consent to process personal data,
            you have the right to withdraw that consent at any time. This will not affect the
            lawfulness of any processing done before your withdrawal, but it will mean we stop the
            processing that was based on consent. For example, you can withdraw your consent for us
            to use your biometric data (photos) and we will cease using and delete those images
            (subject to any legal retention needs). However, please note that if you withdraw
            consent for us to process information that is necessary to provide Muxout&apos;s core
            features, you may no longer be able to use those features. We will advise you if that is
            the case. Withdrawing consent for optional uses (like marketing) will not affect your
            ability to use the Service.
          </li>
          <li>
            <b>Right not to be subject to Automated Decisions:</b> Muxout does not make any legally
            significant decisions about you solely by automated means without human involvement.
            However, if that were to occur, you would have the right not to be subject to a decision
            based solely on automated processing (including profiling) that produces legal effects
            or similarly significantly affects you. You would also have the right to request human
            intervention, to express your point of view, and to contest the decision. (As noted, our
            AI analysis is intended for informational purposes and does not fit this criterion, but
            we include this right for completeness under GDPR and similar laws.)
          </li>
          <li>
            <b>Right to Lodge a Complaint:</b> If you believe that we have infringed your data
            protection rights or processed your information unlawfully, you have the right to lodge
            a complaint with a supervisory authority. For individuals in the EU, this would be your
            country&apos;s Data Protection Authority (DPA). In the UK, this is the Information
            Commissioner&apos;s Office (ICO). In Switzerland, you can contact the Federal Data
            Protection and Information Commissioner (FDPIC). In Canada, you can reach out to the
            Office of the Privacy Commissioner (OPC). We would appreciate the chance to address your
            concerns directly before you do this, so please consider contacting us first, but you
            are fully entitled to contact the regulators at any time.
          </li>
        </ul>
        <Text>
          These rights are not absolute - they may not apply in all situations and may be subject to
          certain exemptions or limitations under applicable law. For example, we might not be able
          to delete data that we are legally required to keep, or we might decline a request if it
          jeopardizes the rights of others. But our policy is to be as responsive as possible to
          your requests and to explain our reasoning if we cannot comply with a request in full.
        </Text>
        <Title order={4}>U.S. State Privacy Rights (California and Others):</Title>
        <Text>
          If you are a resident of certain U.S. states, you may have additional privacy rights under
          state laws. In particular, the California Consumer Privacy Act (CCPA), as amended by the
          California Privacy Rights Act (CPRA), provides specific rights to California residents.
          Other states such as Colorado, Connecticut, Utah, and Virginia have also enacted privacy
          laws (largely similar in scope to CCPA) that grant rights to their residents. Muxout is
          committed to extending relevant rights to users in these states as well. Key rights and
          disclosures under these laws include:
        </Text>
        <ul>
          <li>
            <b>Right to Know (Access) - Categories and Specific Pieces:</b> California residents
            have the right to request that we disclose what personal information we have collected,
            used, disclosed, and (if applicable) sold or shared about them over the past 12 months.
            This includes the categories of personal information, the sources of that information,
            the business or commercial purposes for collecting it, and the third parties with whom
            we share it. You also have the right to request the specific pieces of personal
            information we have collected about you. We will provide this information in a portable
            and, if possible, readily usable format (usually within the account or via email).
          </li>
          <li>
            <b>Right to Delete:</b> You can request that we delete personal information we have
            collected from you. We will honor such requests except where the information is
            necessary for us or our service providers to retain for certain permitted purposes (for
            example, completing a transaction you initiated, detecting security incidents, complying
            with a legal obligation, etc., as allowed by CCPA/CPRA). If we must deny a deletion
            request in part (due to an exception), we will let you know.
          </li>
          <li>
            <b>Right to Correct:</b> California (under CPRA) and some other states grant you the
            right to request correction of inaccurate personal information we hold about you. Upon
            verification of your identity and considering the nature of the information and purpose
            of processing, we will correct any confirmed inaccuracies. In many cases, you can also
            correct your information directly in your account settings.
          </li>
          <li>
            <b>Right to Opt-Out of Sale or Sharing:</b> You have the right to opt out of the “sale”
            of your personal information or the “sharing” of your personal information for
            cross-context behavioral advertising (as those terms are defined in law). Note: Muxout
            does not sell personal information for monetary consideration. We also do not share your
            personal information with third parties for targeted advertising in the conventional
            sense (where data about your browsing on our site is shared with advertisers to target
            you on other sites). The only “sharing” of data with third parties is with service
            providers for our own purposes (which the law does not treat as a sale) or when you opt
            to share information via the Club or public content (which is at your direction).
            Therefore, there is no need to opt out as we do not engage in selling or monetizing your
            data in that way. If our practices change, we will implement a “Do Not Sell or Share My
            Personal Information” link or a similar mechanism for you to exercise this right.
          </li>
          <li>
            <b>Right to Limit Use of Sensitive Personal Information:</b> Under the CPRA, California
            residents can direct businesses to limit the use or disclosure of “sensitive personal
            information” to what is necessary to perform the services or provide the goods
            reasonably expected, or for certain allowed purposes. Muxout&apos;s use of sensitive
            personal information (for example, your biometric data in images, or any health-related
            info inferred) is already limited to what is necessary to provide our Services
            (appearance analysis and related features) and to comply with law. We do not use
            sensitive information for secondary purposes like targeted advertising, nor do we
            disclose it to third parties except as described (service providers, or if you opt to
            share it). Thus, by default we are in compliance with this requirement. If you still
            wish to request that we further limit or cease any use of your sensitive data, you may
            contact us and we will evaluate your request in light of applicable law. For instance,
            you might request that we not retain your photos any longer than needed to produce the
            immediate analysis result - we could accommodate that by deleting images right after
            analysis if you do not want them stored for progress tracking (though you would lose the
            ability to see comparisons over time). We will work with you to address any such
            concerns.
          </li>
          <li>
            <b>Right of No Retaliation/Non-Discrimination:</b> We will not discriminate against you
            for exercising any of your privacy rights. This means we will not deny you services,
            charge you a different price, or provide a lesser quality of service just because you
            exercised your rights under CCPA or other state laws. (However, note that if the
            exercise of your rights renders us unable to provide certain features - for example, if
            you ask us to delete all your data, we cannot continue to offer you personalized
            analysis - that outcome is a natural consequence and not unlawful discrimination. We
            will inform you if such a situation arises.)
          </li>
        </ul>
        <Text>
          <b>Categories of Personal Information Collected:</b> For transparency under CCPA, below
          are the categories of personal information (as enumerated in the law) that Muxout has
          collected in the past 12 months, and whether we have disclosed them for a business
          purpose:
        </Text>
        <ul>
          <li>
            <i>Identifiers:</i> Yes - We collect identifiers like your name, email address, account
            username, and IP address. We disclose some identifiers to our service providers (e.g.,
            your email is shared with our email service to send notifications, and IP address is
            processed by analytics/security tools).
          </li>
          <li>
            <i>Customer Records Information:</i> Yes - This refers to personal information such as
            contact details, payment card information, or other information described in Cal. Civ.
            Code §1798.80(e). We do collect contact details and (through our payment processor)
            payment information when you engage in transactions. We may share necessary elements of
            this with processors (e.g., Stripe for payments).
          </li>
          <li>
            <i>Protected Classification Characteristics:</i> Limited - We do not require sensitive
            protected characteristics like race, ethnic origin, or religion. We may collect age
            (date of birth or confirmation that you are over 18) and gender if you choose to provide
            them in your profile; these can be considered protected characteristics under California
            law. We only use age and gender to personalize your experience or ensure compliance
            (e.g., age verification). We do not use this information for discriminatory purposes. We
            do not disclose this information except as needed for the service (and typically it
            remains internal).
          </li>
          <li>
            <i>Commercial Information:</i> Yes - If you make purchases or participate in Club
            transactions, we maintain records of those transactions (e.g., subscription purchase
            history or sales of routines). This is considered commercial information. We use it for
            providing receipts, customer support, and financial recordkeeping. We share transaction
            data with payment processors and retain records for legal compliance. We have not “sold”
            this information.
          </li>
          <li>
            <i>Biometric Information:</i> Yes - We collect biometric identifiers/information in the
            form of facial images and possibly facial measurements (the AI might derive features
            from your images to compute the severity score). Under CCPA, a “biometric identifier”
            includes imagery of the face and data generated from it. We use this biometric data
            solely to provide the analysis service to you (and for you to track progress) and, if
            you consent, to allow others to see your results (Club). We protect this data as
            sensitive and do not disclose it to third parties except service providers assisting
            with our AI processing or storage (and they are bound to use it only for us). We do not
            use biometric data for any commercial purpose beyond providing the service to you.
          </li>
          <li>
            <i>Internet or Network Activity:</i> Yes - We collect information about your
            interactions with our website/app, which falls under this category (e.g., browsing
            history on our Site, search queries within Muxout, clickstream data). This is done via
            logs and cookies/analytics as described earlier. We use this data internally for
            analytics and security. We may share some with analytics providers (like Google
            Analytics, Microsoft Clarity) as a business purpose, but this is not sold and is
            typically in aggregate form.
          </li>
          <li>
            <i>Geolocation Data:</i> No (with a caveat) - We do not specifically collect precise
            geolocation (like GPS coordinates) from your device. We do infer general location (city,
            country) from your IP address for purposes like language settings and fraud prevention.
            General region info is considered personal data but not “geolocation” in the sense of
            tracking your exact movements. We do not collect or store any precise location history
            of users.
          </li>
          <li>
            <i>Audio, Electronic, Visual, or Similar Information:</i> Yes - Audio recordings (if you
            use that feature) and visual information (photos/videos) are key parts of our Service.
            As explained, we collect and use these only with your consent, and they are shared only
            as needed (e.g., storing on cloud servers, processing through AI algorithms, or sharing
            with other users if you opt-in). These have been disclosed to service providers (for
            example, our cloud storage provider has your images stored on their servers, though
            under our control) but not sold to any third party.
          </li>
          <li>
            <i>Professional or Employment Information:</i> No - We do not collect professional or
            employment-related info from users (unless you separately apply for a job with us, which
            would be outside the scope of this consumer Privacy Policy).
          </li>
          <li>
            <i>Education Information:</i> No - We do not collect educational records or information
            about students in the context of our consumer services.
          </li>
          <li>
            <i>Inferences:</i> Limited - We generate certain inferences from your data internally to
            personalize your experience (for instance, inferring your skin type from your inputs, or
            deriving a severity score from your images). These inferences are used to tailor the
            Service to you. We do not create broad marketing profiles or personality profiles for
            exploitation - any inference stays tightly related to your self-improvement goals on
            Muxout. We treat these inferences as part of your personal data and protect them
            accordingly. We do not sell these inferences or share them except with service providers
            for internal purposes (like storing the scores in our database, etc.)
          </li>
        </ul>
        <Text>
          <b>California “Shine the Light” Disclosure:</b> Separate from CCPA, California Civil Code
          §1798.83 (the “Shine the Light” law) allows California residents to request information
          about what personal information is shared with third parties for those third parties&apos;
          direct marketing purposes. Muxout&apos;s policy is that we do not share your personal
          information with unaffiliated third parties for their own direct marketing use without
          your consent. Therefore, we believe we have no disclosures to make under that law. If you
          are a California resident and would like to make an inquiry under Shine the Light, you can
          contact us and we will provide the required information if applicable. Typically, such an
          inquiry would confirm that we do not disclose personal data to third parties for their
          direct marketing, in line with this Policy.
        </Text>
        <Text>
          <b>California Minors (Online Content Removal):</b> If you are under 18 and a California
          resident (and if, contrary to our intent, you have created an account on Muxout),
          California Business & Professions Code §22581 allows you to request removal of content or
          information you have publicly posted. Since our platform is 18+, we expect this scenario
          to not occur. However, if it does, please contact us to remove the content you posted. We
          will make sure any content you publicly posted is taken down (although this doesn&apos;t
          guarantee complete erasure if it was copied by others, but we will do our best to remove
          it from our Site).
        </Text>
        <Text>
          <b>Other U.S. States:</b> Users in states like Colorado, Connecticut, Utah, and Virginia
          have rights similar to those described above (right to access, correct, delete, opt-out of
          certain processing, etc.). We extend the same core rights and procedures to you. For
          example, Colorado residents can request access or deletion of their data and opt-out of
          profiling for significant decisions; Virginia residents can appeal a decision we make
          about a privacy request within a defined time; etc. If you are a resident of one of these
          states and contact us with a privacy rights request, we will treat it in accordance with
          the applicable state law requirements.
        </Text>
        <Text>
          <b>Exercising Your Rights (U.S. States):</b> To exercise any of the rights above (access,
          deletion, correction, etc.), please reach out to us through the methods listed in the
          “Contact Us” section. For California and other state requests, we will need to verify your
          identity to a reasonable degree of certainty before fulfilling the request. This is to
          protect your privacy - we wouldn&apos;t want to release or delete someone&apos;s data just
          because an impostor asked us. Verification may involve confirming information that we have
          on file about you (for example, responding from the email associated with your account and
          providing some identifier or recent activity that matches our records). If you have an
          account, verification will likely be through your logging in or responding to a verified
          email. If you are not a registered user, we might ask for additional proof. In certain
          cases, you can designate an authorized agent to make a request on your behalf (California
          allows this). If you do so, we will need proof of the agent&apos;s identity and authority
          (such as a signed permission from you). We will respond to requests within the timeframe
          required by law (for example, CCPA generally requires initial response within 10 business
          days and fulfillment within 45 calendar days, with possible extensions). We will inform
          you if we need more time.
        </Text>
        <Text>
          We reiterate that we will not retaliate or discriminate against you for exercising any of
          these rights. Our goal is to be transparent and helpful in addressing your privacy
          concerns.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Additional Privacy Rights in Other Regions</Title>
        <Text>
          Beyond the EU, North America, and the specific U.S. states already discussed, Muxout also
          strives to comply with privacy regulations in other jurisdictions. Below we provide
          information for users in a few other regions where data protection laws apply:
        </Text>
        <ul>
          <li>
            <b>Brazil (LGPD):</b> If you are in Brazil, the LGPD grants you several rights regarding
            your personal data. These include: (i) the right to confirm whether we process your
            personal data, and to access the data we have about you; (ii) the right to request
            correction of incomplete, inaccurate, or outdated data; (iii) the right to request
            anonymization, blocking, or deletion of unnecessary or excessive data or data processed
            in noncompliance with the law; (iv) the right to request data portability to another
            service or product provider, by means of an express request, in accordance with the
            regulations of the national authority (note: as of the last update, detailed regulations
            on portability are pending, but we will cooperate with legitimate requests to transfer
            your data in a usable format); (v) if we process your data based on your consent, the
            right to withdraw consent at any time; (vi) the right to request information about
            public and private entities with which we have shared your data; (vii) the right to
            information about the possibility of denying consent and the consequences of such denial
            (for instance, if you don&apos;t consent to us processing your photos, we cannot provide
            the AI analysis feature); and (viii) the right to oppose processing that is not being
            carried out in compliance with the law. To exercise your LGPD rights, you can contact us
            (see Contact Us below). We will respond in accordance with the timeframes and procedures
            set out by the ANPD (Brazil&apos;s National Data Protection Authority). If you believe
            your data rights have been violated, you have the right to petition the ANPD. We note
            that we process sensitive personal data (e.g., biometric data from your photos) under
            the legal basis of your consent (Art. 11, I of LGPD), and you can revoke that consent as
            described. We will not process your sensitive data for discriminatory or illicit
            purposes.
          </li>
          <li>
            <b>Australia:</b> We are committed to protecting personal information in accordance with
            the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs). Australian
            users have the right to access the personal information we hold about them and to
            request correction of any inaccuracies. To make such a request, please contact us. We
            may ask you to verify your identity and specify what information you require. We will
            respond within a reasonable time and provide the information except in limited
            circumstances where we are permitted by law to refuse access. If you believe we have
            breached the APPs or mishandled your personal information, you have the right to
            complain. Please direct any complaints to us first - we will investigate and respond to
            your complaint. If you are not satisfied with our response, you can escalate the issue
            to the Office of the Australian Information Commissioner (OAIC). We note that providing
            certain information is optional, but if you choose not to provide personal data that we
            need to deliver a service, we may not be able to provide you with that service. We do
            not typically transfer Australian users&apos; data overseas except to our U.S. servers
            and other processors as stated; by using our service, you consent to these overseas
            transfers, but we ensure they are protected as described in this Policy.
          </li>
          <li>
            <b>New Zealand:</b> We handle personal information of New Zealand users in accordance
            with the New Zealand Privacy Act 2020 and its Information Privacy Principles (IPPs). As
            a New Zealand user, you have the right to access the personal information we hold about
            you and to request correction of any personal information that is inaccurate,
            incomplete, or out-of-date. You can contact us to exercise these rights. If you request
            a correction and we do not make it (for example, if we disagree that the information is
            wrong), you have the right to request that we attach a statement of correction sought
            but not made to the information. We will respond to access requests as soon as
            practicable and no later than 20 working days after receiving the request, as required
            by law. If you have a complaint about your privacy or how we handled your request, you
            can lodge a complaint with the Office of the Privacy Commissioner (OPC) in New Zealand.
            As with Australia, providing certain data is often voluntary, but without it we might
            not be able to fulfill certain services.
          </li>
          <li>
            <b>South Africa:</b> We respect the rights of South African users under the Protection
            of Personal Information Act, 2013 (POPIA). South African users have the right to request
            access to their personal information and to request correction or deletion of personal
            information that is inaccurate, irrelevant, excessive, out-of-date, incomplete, or
            obtained unlawfully. You also have rights to object to processing of personal
            information under certain circumstances (for instance, for purposes of direct marketing
            not consented to) and to withdraw consent where processing was based on consent. If you
            would like to exercise your POPIA rights, please contact us. We may require proof of
            identity and a completed request form (if applicable under South African regulations)
            for processing your request. We will respond within a reasonable time. Additionally, if
            you have a complaint regarding our compliance with POPIA, you may lodge a complaint with
            South Africa&apos;s Information Regulator. The Information Regulator&apos;s contact
            details can be found on their official website (for general inquiries you can email
            inquiries@inforegulator.org.za, and for complaints, they have dedicated addresses such
            as POPIAComplaints@inforegulator.org.za). We encourage you to contact us first to
            resolve any issue. Finally, note that if you do not provide certain personal
            information, we may not be able to provide you with the services or responses you
            expect, which we will inform you about at the time.
          </li>
        </ul>
        <Text>
          These region-specific notes are intended to ensure transparency and compliance. Regardless
          of where you are located, we strive to uphold high standards of privacy protection. If you
          are in a country not explicitly listed above but have questions about how we handle your
          data in light of your local laws, please reach out to us. We are continually monitoring
          international privacy developments and adjusting our practices as needed to comply with
          new requirements (for example, new regulations in other countries or states).
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Do-Not-Track Signals and Online Tracking</Title>
        <Text>
          <b>Do Not Track (DNT):</b> Some web browsers and devices offer a “Do Not Track” setting or
          signal that you can enable to indicate your preference regarding online tracking. At this
          time, Muxout does not respond to Do Not Track signals in a standardized way. The reason is
          that there is currently no consistent industry standard or legal requirement for
          interpreting DNT signals. Different browsers send DNT signals differently, and many
          websites, including ours, have not adopted a uniform response to those signals.
        </Text>
        <Text>
          When you have DNT enabled in your browser, our Site will still collect usage information
          as described in this Policy (for example, via cookies or analytics scripts) because we
          have not implemented a separate mechanism to alter our data collection in response to that
          signal. We treat all users&apos; data according to this Privacy Policy, whether or not a
          DNT signal is present. If a clear industry standard for honoring Do Not Track is
          established in the future, or if laws require us to respond to DNT signals, we will update
          our practices and this Privacy Policy accordingly. In the meantime, if you wish to limit
          online tracking, you can manage cookie preferences (e.g., use browser settings or plugins
          to block or delete cookies and trackers). Note that doing so may affect your experience
          with Muxout (for instance, some features might not work correctly without certain
          cookies).
        </Text>
        <Text>
          For more information about Do Not Track, you may visit allaboutdnt.com, which provides a
          helpful explanation. Keep in mind that DNT is different from the “Do Not Sell/Share”
          opt-outs under privacy laws (which we discussed in the U.S. State Privacy Rights section).
          If you have any questions about our online tracking practices, feel free to contact us.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Updates to This Privacy Policy</Title>
        <Text>
          We may update or revise this Privacy Policy from time to time to reflect changes in our
          practices, technologies, legal requirements, or for other operational reasons. When we
          make changes, we will update the “Last Updated” date at the top of this Policy. Any
          changes will become effective when we post the revised Privacy Policy on the Site, unless
          otherwise required by applicable law.
        </Text>
        <Text>
          If we make any material changes to this Policy - meaning changes that significantly affect
          how we collect or use your personal information or your rights - we will take additional
          steps to notify you. This might include prominently posting a notice of the changes on our
          website, sending you a direct notification (e.g., via email or an in-app message), or any
          other method required by law. We will describe the key changes in the notice so you can
          understand what&apos;s different.
        </Text>
        <Text>
          We encourage you to review this Privacy Policy periodically to stay informed about how we
          are protecting your information. Your continued use of Muxout after any update to this
          Policy will signify your acceptance of the changes, to the extent permitted by law. If you
          do not agree with any updates or modifications, you should stop using the Site and
          Services and may contact us if you wish to delete your account or have concerns.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Contact Us</Title>
        <Text>
          If you have any questions, comments, or requests regarding this Privacy Policy or about
          how Muxout handles your personal information, please do not hesitate to contact us. We are
          here to help and address any privacy-related concerns you may have.
        </Text>
        <ul>
          <li>
            <b>Email:</b> You can reach our privacy team at privacy@muxout.com. This is the
            dedicated email address for privacy inquiries, including questions about your data,
            requests to exercise your rights, or complaints. We strive to respond promptly to all
            legitimate inquiries.
          </li>
          <li>
            <b>Postal Mail:</b> If you prefer to contact us by mail, you can write to: <br />
            <i>Bettermax LLC 30 N Gould St, Sheridan, WY 82801 United States</i>
          </li>
        </ul>
        <Text>
          We will do our best to respond to your inquiry or request within a reasonable timeframe
          and in accordance with any applicable laws. When you contact us to exercise a privacy
          right (such as accessing or deleting your data), we may need to verify your identity for
          security purposes, as described earlier.
        </Text>
        <Text>
          Thank you for entrusting Muxout with your skin and hair improvement journey. Your privacy
          is important to us, and we are committed to safeguarding your personal information.
        </Text>
      </Stack>
    </>
  );
}
