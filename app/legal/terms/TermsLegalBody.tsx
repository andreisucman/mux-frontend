import React from "react";
import Link from "next/link";
import { rem, Stack, Text, Title } from "@mantine/core";

type Props = {
  addTitle?: boolean;
};

export default function TermsLegalBody({ addTitle }: Props) {
  return (
    <>
      {addTitle && <Title order={1}>Terms of Service</Title>}
      <Text size="sm" c="dimmed">
        Last updated: Match 16, 2025
      </Text>
      <Stack>
        <Text mt={0}>
          This website is owned and operated by Bettermax LLC ("Company," "we," "us," "our"), a
          company incorporated in Wyoming, United States, with its registered address at 30 N Gould
          St, Sheridan, WY 82801.
        </Text>
        <Text>
          We operate the website muxout.com (the "Site"), along with any related products and
          services that reference or link to these terms (the "Terms") (collectively, the
          "Services"), which include the collection, analysis, and storage of user-provided
          information for AI-based assessments and personalized guidance about physical appearance
          and products.
        </Text>
        <Text>
          You can contact us by email at info@muxout.com, or by mail at Bettermax LLC, 30 N Gould
          St, Sheridan, WY 82801, United States.
        </Text>
        <Text>
          These Terms constitute a legally binding agreement between you, whether as an individual
          or on behalf of an organization ("you"), and Bettermax LLC, regarding your access to and
          use of the Services.
        </Text>
        <Text>
          By accessing the Site, you acknowledge that you have read, understood, and agree to be
          bound by these Terms, including the collection, analysis, and processing of your images,
          videos, and personal information as described in our Privacy Policy. IF YOU DO NOT AGREE
          TO ALL OF THESE TERMS, YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND MUST CEASE
          USE IMMEDIATELY.
        </Text>
        <Text>
          Supplemental terms or documents that may be posted on the Site from time to time are
          incorporated by reference into these Terms. We reserve the right to modify these Terms at
          our discretion, with updates indicated by a change in the "Last updated" date. You waive
          any right to receive individual notice of such changes.
        </Text>
        <Text>
          It is your responsibility to review these Terms periodically for any updates. Continued
          use of the Site after any revised Terms are posted signifies your acceptance of the
          updated Terms.
        </Text>
        <Text>
          The Services are intended for users who are at least 18 years old. Users under the age of
          18 are not permitted to use or register for the Services.
        </Text>
        <Text>
          By using the Services, you affirm that you are at least 18 years of age. In the event of a
          dispute arising from these Terms or the use of the Services, the laws of the State of
          Wyoming will govern, and you agree to submit to the exclusive jurisdiction of the state
          and federal courts located in Wyoming for the resolution of any disputes.
        </Text>
      </Stack>

      <Stack>
        <Title order={2}>1. OUR SERVICES</Title>
        <Text>
          The Services we provide are intended solely for personal, non-commercial use, and the
          information and assessments offered through our Services are for general informational
          purposes only. Our Services, including AI-based image analysis and the personalized tasks
          created based on them, are not a substitute for professional, medical, or health-related
          advice or services. The results provided are based on our proprietary algorithms that have
          not been reviewed by medical professionals and are not intended to diagnose, treat, cure,
          or prevent any condition. Users should seek professional advice before making any
          decisions based on the information received from our Services.
        </Text>
        <Text>
          The information provided through our Services is not intended for use or distribution in
          any jurisdiction or country where such actions would be unlawful or require special
          registration. Users accessing the Services from locations outside the United States do so
          at their own risk and are responsible for complying with any local laws that may apply,
          including but not limited to, data privacy regulations such as the General Data Protection
          Regulation (GDPR) or any other regional laws concerning data collection and processing.
        </Text>
        <Text>
          Our Services are not designed to meet specific industry regulations, including, but not
          limited to, the Health Insurance Portability and Accountability Act (HIPAA), the Federal
          Information Security Management Act (FISMA), or the General Data Protection Regulation
          (GDPR).
        </Text>
        <Text>
          If your activities are governed by such regulations, you must not use the Services.
          Additionally, you are responsible for ensuring that your use of the Services does not
          contravene the Gramm-Leach-Bliley Act (GLBA) or any similar financial privacy laws. By
          using our Services, you agree that you will not hold the Company liable for any failure to
          meet regulatory compliance if such compliance is required for your activities. You are
          solely responsible for determining whether your use of the Services is appropriate and
          lawful based on your jurisdiction’s regulations.
        </Text>
      </Stack>

      <Stack>
        <Title order={2}>2. INTELLECTUAL PROPERTY RIGHTS</Title>
        <Title order={3}>Our Intellectual Property</Title>
        <Text>
          We own or license all intellectual property rights related to our Services, including but
          not limited to the source code, databases, functionalities, software, website designs,
          audio, video, text, photographs, and graphics (collectively referred to as the "Content"),
          as well as the trademarks, service marks, and logos (referred to as the "Marks"). These
          intellectual property rights are protected under copyright, trademark laws, and other
          intellectual property regulations and treaties both in the United States and
          internationally. The Content and Marks are provided through our Services "AS IS" for your
          personal, non-commercial use only. Access to the Services does not grant you any ownership
          rights in the Content or Marks. All rights not expressly granted to you are reserved by
          us.
        </Text>
        <Title order={3}>Your Use of Our Services</Title>
        <Text>
          {`Provided you comply with these Legal Terms, including the "PROHIBITED
          ACTIVITIES" section below, we grant you a limited, non-exclusive,
          non-transferable, and revocable license to:`}
        </Text>
        <ul>
          <li>Access the Services; and</li>
          <li>
            Download or print portions of the Content that you have lawfully accessed, exclusively
            for your personal, non-commercial use.
          </li>
        </ul>
        <Text>
          Except as explicitly provided in this section or elsewhere in our Legal Terms, you may
          not:
        </Text>
        <ul>
          <li>
            Copy, reproduce, aggregate, republish, upload, post, publicly display, encode,
            translate, transmit, distribute, sell, license, or otherwise exploit any part of the
            Services, Content, or Marks for commercial purposes without our prior written consent.
          </li>
        </ul>
        <Text>
          If you wish to use any part of the Services, Content, or Marks beyond the scope provided
          here, please contact us at: info@muxout.com.
        </Text>
        <Text>
          If we grant permission to use any part of our Services or Content, you must acknowledge us
          as the owner or licensor, and ensure that any copyright or proprietary notices remain
          intact.
        </Text>
        <Text>
          Violations of these Intellectual Property Rights constitute a serious breach of our Legal
          Terms and may result in the immediate termination of your right to use our Services.
        </Text>
        <Title order={3}>Your Submissions</Title>
        <Text>
          Please carefully read this section, along with the "PROHIBITED ACTIVITIES" section, to
          understand your rights and obligations when submitting content, including images and
          videos through our Services.
        </Text>
        <Text>
          Submissions: By uploading images, videos to the platform or sending us us any questions,
          comments, suggestions, ideas, feedback, or other information related to the Services
          (collectively, "Submissions"), you grant us an irrevocable, worldwide, exclusive,
          fully-paid, royalty-free, perpetual, transferable, and sub-licensable right to use,
          reproduce, modify, adapt, publish, distribute, and otherwise exploit your Submissions for
          any purpose, including commercial purposes, without acknowledgment or compensation to you.
          This includes using your Submissions in any media or platform, whether now known or later
          developed.
        </Text>
        <Text>
          You agree that we have no obligation to use or respond to any Submissions, and any use of
          Submissions is entirely at our discretion.
        </Text>
        <Title id="responsibility-for-your-submissions" order={3}>
          Responsibility for Your Submissions
        </Title>
        <Text>
          By submitting content, including images and videos of your body and head, through our
          Services, you:
        </Text>
        <ol>
          <li>
            1. Confirm that you have read and agree with our "PROHIBITED ACTIVITIES" section and
            will not post or transmit any content that is illegal, harassing, hateful, harmful,
            defamatory, obscene, abusive, discriminatory, threatening, sexually explicit, false,
            inaccurate, deceptive, or misleading;
          </li>
          <li>
            2. Waive any moral rights associated with your Submissions, to the extent permitted by
            applicable law;
          </li>
          <li>
            3. Guarantee that the Submissions are original to you, or that you have obtained the
            necessary rights, licenses, or permissions to submit them, and that you have full
            authority to grant the rights described above; and
          </li>
          <li>
            4. Confirm that your Submissions do not contain confidential or proprietary information
            from any third party.
          </li>
        </ol>
        <Text>
          You remain solely responsible for your Submissions and any consequences arising from your
          breach of (a) this section, (b) third-party intellectual property rights, or (c) any
          applicable laws. You agree to indemnify us for any losses, claims, or damages resulting
          from your Submissions or your violation of these Legal Terms.
        </Text>
        <Title order={3}>Sensitive Data Handling</Title>
        <Text>
          We collect and process personal data as outlined in our{" "}
          <Link href="/legal/privacy" style={{ textDecoration: "underline" }}>
            Privacy Policy
          </Link>
          . This may include sensitive data, such as images and videos of your body and audio
          recordings of your voice.
        </Text>
        <Text>
          By using our services, you consent to the collection, storage, and processing of this
          sensitive data as required to fulfill the services offered on our platform.
        </Text>
        <Title order={3}>Consent for Data Processing and Sharing</Title>
        <Text>
          By using our services and uploading any personal content, including sensitive data such as
          the images and videos of your body and audio recordings of your voice, you consent to the
          following:
        </Text>
        <ul>
          <li>The analysis of your appearance using AI technologies.</li>
          <li>
            Making this information accessible by other users of the site with your explicit
            consent.
          </li>
          <li>
            The processing of your data for suggesting third-party products and services that we
            believe may be of interest to you. No personal data will be shared with third-party
            product providers without your explicit consent.
          </li>
        </ul>
        <Text>
          IF YOU DO NOT CONSENT TO THE COLLECTION, PROCESSING AND SHARING OF YOUR SENSITIVE DATA AS
          DESCRIBED ABOVE, YOU MUST CEASE TO USE THE SERVICES IMMEDIATELY.
        </Text>
        <Stack>
          <Title order={2}>3. USER REPRESENTATIONS</Title>
          <Text>By using the Services, you represent, warrant, and affirm that:</Text>
          <ol>
            <li>You possess the legal capacity to agree to and adhere to these Legal Terms;</li>
            <li>
              You are not considered a minor under the laws of your jurisdiction and are at least 18
              years of age;
            </li>
            <li>
              You will not access the Services through automated methods or non-human means,
              including but not limited to bots, scripts, or other forms of automated technology;
            </li>
            <li>
              You will not use the Services for any unlawful or unauthorized purposes, including in
              violation of any applicable data privacy, intellectual property, or other laws in your
              jurisdiction;
            </li>
            <li>Your use of the Services will comply with all applicable laws and regulations;</li>
            <li>
              All information you provide to us, including during registration or account creation,
              is true, accurate, current, and complete to the best of your knowledge;
            </li>
            <li>
              You will promptly update any information provided to us to ensure that it remains
              accurate and current at all times; and
            </li>
            <li>
              You have the necessary rights and permissions to upload any images, videos, audio or
              text through the Services, and such content does not infringe the intellectual
              property, privacy, or other rights of any third party.
            </li>
          </ol>
          <Text>
            You acknowledge that providing false, inaccurate, outdated, or incomplete information is
            a breach of these Legal Terms and may result in the immediate suspension or termination
            of your account, as well as the denial of any current or future access to the Services
            (or any part thereof).
          </Text>
          <Text>
            In cases of unlawful or unauthorized use of the Services, we reserve the right to take
            additional actions, including reporting such activity to law enforcement or other
            relevant authorities, and pursuing any other legal remedies available to us.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>4. PURCHASES AND PAYMENT</Title>
          <Title order={3}>Payment Methods</Title>
          <Text>
            We accept various payment methods for purchases made through our Services. This
            includes, but is not limited to, credit cards, debit cards, and other methods permitted
            by out payment processing services.
          </Text>
          <Title order={3}>Accurate Information and Updates</Title>
          <Text>
            You agree to provide accurate, current, and complete information for all transactions
            and account details, including payment information. You are responsible for promptly
            updating your account details, such as your email address, payment method, and card
            expiration date, to ensure the successful processing of your transactions. Failure to do
            so may result in transaction failures or service interruptions.
          </Text>
          <Title order={3}>Subscription Services</Title>
          <Text>
            When you subscribe to our paid services you agree to pay the applicable subscription
            fee, which may be subject to changes at our discretion. Subscription fees are billed on
            a recurring basis unless canceled. By subscribing, you authorize us to charge your
            selected payment method automatically for each subscription period without further
            approval.
          </Text>
          <Title order={3}>Currency and Sales Tax</Title>
          <Text>
            All prices listed on our platform are in US dollars, unless otherwise specified. You are
            responsible for any applicable sales, use, or similar taxes imposed by applicable laws.
            Taxes will be added to your purchase where required by law.
          </Text>
          <Title order={3}>Pricing and Errors</Title>
          <Text>
            We reserve the right to modify pricing for any products or services at any time. In the
            event of a pricing error, we reserve the right to correct the error and adjust the
            transaction accordingly, even after payment has been processed. If you are not satisfied
            with the corrected price, you may choose to cancel your subscription by contacting us at
            info@muxout.com.
          </Text>
          <Title order={3}>Order Refusal</Title>
          <Text>
            We retain the right to refuse any subscription placed through our Services at our sole
            discretion. This may include, but is not limited to, cases where we suspect fraudulent
            activity, incorrect account information, or violations of our terms.
          </Text>
          <Title order={3}>Content monetization ("Club")</Title>
          <Text>
            We offer our users the right to join the "Club" and earn from making their image, video
            and audio data accessible to other users.
          </Text>
          <Text>
            If you choose to participate in the "Club", you will be required to complete an
            onboarding process and provide accurate bank account information. You are solely
            responsible for any fees associated with receiving payments, and we disclaim any
            liability for issues arising from inaccurate payment details or the onboarding process.
            The full terms and conditions of the "Club" are detailed in a separate document, which
            can be accessed{" "}
            <Link href="/legal/club" style={{ textDecoration: "underline" }}>
              here
            </Link>
            .
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>5. FREE TRIAL</Title>
          <Title order={3}>Eligibility</Title>
          <Text>
            We offer a 1-day free trial for some of our services to new users. The free trial is
            available only once per user and is intended to help explore the platform.
          </Text>
          <Title order={3}>Trial Period and Subscription</Title>
          <Text>
            You can start the free trial by clicking the corresponding button on a specific service
            you intend to try. The trial period lasts for 24 hours at the end of which, your access
            to related service will be restricted until you pay the applicable subscription fee.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>6. CANCELLATION</Title>
          <Title order={3}>Non-Refundable Purchases</Title>
          <Text>
            All purchases, including subscription fees, are non-refundable. Once a payment has been
            processed, we do not offer refunds or credits, whether for partial subscription periods,
            unused features, or any other reason.
          </Text>
          <Title order={3}>Subscription Cancellation</Title>
          <Text>
            You may cancel your subscription at any time. Cancellation will take effect at the end
            of the current billing period, meaning you will retain access to the Services until the
            end of the subscription cycle. After this period, you will no longer be billed, and your
            access to paid features will be terminated.
          </Text>
          <Title order={3}>No Prorated Refunds</Title>
          <Text>
            We do not provide prorated refunds for canceled subscriptions. For example, if you
            cancel midway through a billing period, you will continue to have access until the end
            of that period, but no refunds or credits will be issued for unused time.
          </Text>
          <Title order={3}>How to Cancel</Title>
          <Text>
            You can cancel your subscription through your account settings on our platform. If you
            encounter difficulties or need assistance, you may contact our support team for help
            with the cancellation process.
          </Text>
          <Title order={3}>Customer Support</Title>
          <Text>
            If you have any concerns, technical issues, or are dissatisfied with our Services, we
            encourage you to contact us at info@muxout.com.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>7. USE OF SOFTWARE</Title>
          <Text>
            We may provide software as part of our Services, including but not limited to
            Progressive Web Apps (PWA) or other web-based applications. Your use of such software is
            subject to the following terms:
          </Text>
          <Title order={3}>License Grant</Title>
          <Text>
            We grant you a limited, non-exclusive, revocable, personal, non-transferable, and
            non-sublicensable license to access and use the software provided as part of our
            Services, including any PWAs, solely for the purpose of interacting with or benefiting
            from our Services and in compliance with these Terms of Service. This license is granted
            only for your personal, non-commercial use.
          </Text>
          <Title order={3}>Restrictions</Title>
          <Text>
            You agree that, except as expressly permitted by these Terms of Service, you will not:
          </Text>
          <ul>
            <li>Reproduce, distribute, publicly display, or perform the software.</li>
            <li>
              Modify, adapt, translate, reverse-engineer, decompile, disassemble, or attempt to
              discover the source code of the software.
            </li>
            <li>
              Rent, lease, lend, sell, sublicense, or otherwise transfer rights to the software. Any
              unauthorized use of the software or PWA constitutes a violation of these Terms of
              Service and may result in termination of your access to the Services.
            </li>
          </ul>

          <Title order={3}>Disclaimer of Warranties</Title>
          <Text>
            {`All software, including any PWA, is provided "AS IS" and "AS
            AVAILABLE" without any warranties of any kind, whether express or
            implied, including but not limited to implied warranties of
            merchantability, fitness for a particular purpose, and
            non-infringement. We do not guarantee that the software will be
            error-free, secure, or free of defects, viruses, or other harmful
            components.`}
          </Text>
          <Title order={3}>Limitation of Liability</Title>
          <Text>
            To the fullest extent permitted by law, we disclaim any liability arising from your use
            or inability to use the software, including any direct, indirect, incidental,
            consequential, special, or punitive damages, even if we have been advised of the
            possibility of such damages. You assume all risks associated with your use of the
            software and any PWA.
          </Text>
          <Title order={3}>Termination of License</Title>
          <Text>
            We reserve the right to terminate or suspend your license to use the software, including
            any PWA, at any time and for any reason, including but not limited to a breach of these
            Terms of Service. Upon termination, you must immediately stop using the software and, if
            applicable, delete all copies from your device.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>8. PROHIBITED ACTIVITIES</Title>
          <Text>
            You are prohibited from using the Services for any purposes other than those for which
            they are intended. The Services may not be used for commercial purposes unless
            explicitly authorized by us. As a user, you agree not to:
          </Text>
          <ul>
            <li>
              Systematically retrieve data or other content from the Services to create, compile, or
              populate a collection, database, or directory without our written permission.
            </li>
            <li>
              Deceive, defraud, or mislead us or other users, especially in attempts to obtain
              sensitive information such as passwords or account details.
            </li>
            <li>
              Bypass, disable, or interfere with security-related features of the Services,
              including those restricting the use or copying of content.
            </li>
            <li>Damage, disparage, or harm our reputation or the functionality of the Services.</li>
            <li>
              Use information obtained from the Services to harass, abuse, or harm another person.
            </li>
            <li>Misuse our support services or submit false reports of abuse or misconduct.</li>
            <li>Violate any applicable laws, regulations, or rules while using the Services.</li>
            <li>Engage in unauthorized linking to or framing of the Services.</li>
            <li>
              Upload or transmit viruses, malware, or any other malicious code, or use excessive
              capital letters or spam that interferes with the operation of the Services.
            </li>
            <li>
              Use any automated system, such as scripts, bots, or scrapers, to interact with the
              Services without our prior approval.
            </li>
            <li>Remove or alter any copyright or other proprietary notices within the Services.</li>
            <li>
              Upload or transmit any material that acts as an unauthorized data collection
              mechanism, such as tracking pixels, web bugs, cookies, or similar tools.
            </li>
            <li>
              Interfere with, disrupt, or impose an undue burden on the Services or the networks
              connected to the Services.
            </li>
            <li>Harass, intimidate, or threaten our employees, agents, or users.</li>
            <li>
              Attempt to circumvent any measures designed to restrict or prevent access to the
              Services.
            </li>
            <li>
              Copy, modify, reverse-engineer, decompile, or disassemble any aspect of the software
              that powers the Services, except as permitted by applicable law.
            </li>
            <li>
              Employ unauthorized purchasing agents or otherwise make commercial transactions
              through the Services without authorization.
            </li>
            <li>
              Collect or harvest usernames, email addresses, or other user data for the purpose of
              sending unsolicited communications.
            </li>
            <li>
              Use the Services for any competitive or revenue-generating purposes, unless expressly
              permitted.
            </li>
            <li>
              Advertise or offer to sell goods or services via the Services without our permission.
            </li>
            <li>Transfer or sell your user account or profile to another party.</li>
          </ul>
        </Stack>
        <Stack>
          <Title order={2}>9. USER GENERATED CONTRIBUTIONS</Title>
          <Text>
            By making any Contributions to our site including image, video and audio content of
            yourself, you agree that your Contributions will be governed by our Privacy Policy, and
            you further represent and warrant that:
          </Text>
          <ul>
            <li>
              You own or control all rights in and to your Contributions, or you have obtained the
              necessary licenses, rights, consents, releases, and permissions to grant us and your
              Followers the right to view, use, and distribute your Contributions, as permitted by
              these Legal Terms.
            </li>
            <li>
              Your Contributions do not infringe upon any intellectual property rights, including
              but not limited to copyrights, trademarks, patents, trade secrets, or moral rights of
              any third party.
            </li>
            <li>
              You have obtained the necessary consent from each identifiable person featured in your
              Contributions to use their name, likeness, or image as part of your Contributions, and
              to allow us and other users to use such material in accordance with these Legal Terms.
            </li>
            <li>Your Contributions are accurate, truthful, and not misleading.</li>
            <li>
              Your Contributions are not intended to deceive, defraud, or mislead users,
              particularly regarding any financial or personal information.
            </li>
            <li>
              Your Contributions do not include unauthorized advertising, promotional materials,
              spam, chain letters, pyramid schemes, or other forms of solicitation.
            </li>
            <li>
              Your Contributions do not contain any unlawful, offensive, or otherwise objectionable
              material, including but not limited to obscene, lewd, violent, harassing, defamatory,
              or inappropriate content, as determined by us.
            </li>
            <li>
              Your Contributions are not used to harass, threaten, intimidate, or incite violence
              against any individual or group.
            </li>
            <li>Your Contributions comply with all applicable laws, rules, and regulations.</li>
            <li>
              Your Contributions do not violate any privacy or publicity rights of any third party.
            </li>
            <li>
              Your Contributions do not include material that violates laws protecting minors,
              including but not limited to child pornography or exploitation laws.
            </li>
            <li>
              Your Contributions do not contain offensive or discriminatory content related to race,
              ethnicity, gender, sexual orientation, religion, or disability.
            </li>
            <li>
              Your Contributions do not violate, or link to material that violates, any provisions
              of these Legal Terms, applicable laws, or regulations.
            </li>
          </ul>
          <Title order={3}>Financial Compensation and Rights</Title>
          <Text>
            If you choose to participate in our content sharing program ("Club"), you may be
            eligible to receive compensation from each sale of your Contributions. By uploading your
            Contributions and making them publicly available through the "Club", you grant us a
            limited, non-exclusive, transferable, royalty-free license to display your Contributions
            to other users of the site.
          </Text>
          <Text>
            You understand and agree that this license continues for as long as your Contributions
            are made available through the Services and the "Club", and that we may retain copies of
            your Contributions as required for legal, compliance, or operational purposes.
          </Text>
          <Title order={3}>Management and Removal of Contributions</Title>
          <Text>
            We reserve the right to monitor, edit and remove any Contributions at our sole
            discretion if they violate these Legal Terms or are otherwise deemed inappropriate by
            us. We also reserve the right to block or terminate your participation in the "Club" if
            your Contributions violate these Legal Terms, applicable laws, or regulations.
          </Text>
          <Title order={3}>Consequences of Violations</Title>
          <Text>
            Violations of these conditions may result in the suspension or termination of your
            rights to use the Services and/or participate in the "Club". In such cases, you may lose
            access to any financial compensation or pending payments, and we may report any unlawful
            activity to the relevant authorities.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>10. CONTRIBUTION LICENSE</Title>
          <Text>
            By uploading or submitting any Contributions as part of the Services, including but not
            limited to your participation in the "Club", you acknowledge and agree that we may
            access, store, process, and use any information and personal data you provide in
            accordance with our Privacy Policy and your account&apos;s data sharing settings. This
            includes the right to use your Contributions to provide the Services, display your
            content to Followers, and facilitate any related payment or compensation.
          </Text>
          <Text>
            While we do not claim ownership of your Contributions. By submitting your Contributions,
            you grant us a worldwide, non-exclusive, royalty-free, transferable, sublicensable
            license to use, reproduce, distribute, display, and perform your Contributions in
            connection with the Services. This license is necessary to operate, promote, and improve
            the Services and to enable the functionality of the "Club", including displaying your
            public content to the site vistors.
          </Text>
          <Text>
            You retain full ownership of your Contributions and any intellectual property or
            proprietary rights associated with them. This license does not transfer ownership of
            your Contributions to us. However, you understand that by submitting Contributions, you
            are granting us permission to use them as described above without additional
            compensation, aside from any financial compensation agreed upon through in the{" "}
            <Link href="/legal/club" style={{ textDecoration: "underline" }}>
              {"Club's terms of service"}
            </Link>
            .
          </Text>
          <Text>
            If you provide suggestions, ideas, or feedback regarding the Services, you agree that we
            may use and share such feedback for any purpose without compensating you. Such feedback
            is considered non-confidential and non-proprietary.
          </Text>
          <Text>
            You are solely responsible for your Contributions and for any consequences that arise
            from their posting or distribution. We are not liable for any statements or
            representations made in your Contributions, and you agree to release us from any
            liability and refrain from initiating any legal action related to your Contributions.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>11. GUIDELINES FOR REVIEWS</Title>
          <Text>
            We may offer areas on the Services where users can leave reviews or scores of
            individuals, entities, or the Services themselves. When posting a review, you agree to
            comply with the following guidelines:
          </Text>
          <ul>
            <li>
              You must have firsthand experience with the person, entity, or Service being reviewed.
            </li>
            <li>
              Your review must not contain offensive language, profanity, or any form of abusive,
              racist, or hateful remarks.
            </li>
            <li>
              Your review must not include discriminatory comments based on religion, race, gender,
              nationality, age, marital status, sexual orientation, or disability.
            </li>
            <li>Your review must not reference or endorse illegal activities.</li>
            <li>
              You must not be affiliated with competitors of the person, entity, or Service being
              reviewed if you are posting a negative review.
            </li>
            <li>
              You must not make legal conclusions or accusations regarding conduct in your review.
            </li>
            <li>
              Your review must be truthful and not contain any false, misleading, or inaccurate
              information.
            </li>
            <li>
              You are prohibited from organizing or participating in campaigns that encourage others
              to post reviews, whether positive or negative.
            </li>
          </ul>
          <Text>
            We reserve the right to accept, reject, or remove reviews at our sole discretion. We are
            under no obligation to screen or remove reviews, even if someone considers them
            objectionable or inaccurate. Reviews reflect the opinions of individual users and do not
            represent our views or those of our affiliates or partners.
          </Text>
          <Text>
            We disclaim all liability for any reviews posted on the Services, and we are not
            responsible for any claims, liabilities, or damages that arise from reviews. You
            acknowledge that by posting a review, you grant us an irrevocable, perpetual,
            non-exclusive, worldwide, royalty-free, fully paid, assignable, and sublicensable
            license to use, reproduce, modify, translate, transmit, display, perform, and distribute
            any content related to your review in any format or through any media channels.
          </Text>

          <Title order={2}>12. THIRD-PARTY WEBSITES AND CONTENT</Title>
          <Text>
            The Services may include links to third-party websites ("Third-Party Websites") and
            content, including but not limited to articles, photographs, text, graphics, designs,
            music, sound, video, information, applications, software, and other materials
            originating from third parties ("Third-Party Content"). We do not investigate, monitor,
            or verify the accuracy, appropriateness, or completeness of any Third-Party Websites or
            Third-Party Content. This includes links or recommendations for third-party products and
            services made based on the information you provide or content uploaded to the Services.
            We are not responsible for any Third-Party Websites accessed through the Services or any
            Third-Party Content posted on, available through, or installed from the Services,
            including the content, accuracy, opinions, reliability, privacy practices, or other
            policies of such Third-Party Websites or Third-Party Content.
          </Text>
          <Text>
            The inclusion of links to, or use of, Third-Party Websites or Third-Party Content does
            not imply our endorsement or approval of the third party, its website, or its content.
            If you choose to leave the Services to visit Third-Party Websites, or use or install
            Third-Party Content, you do so at your own risk. Once you leave the Services, our Terms
            of Service and Privacy Policy no longer apply. It is your responsibility to review the
            applicable terms, policies, and privacy practices of any Third-Party Website or
            application, including those suggested to you by our Services.
          </Text>
          <Text>
            Any transactions or purchases made through Third-Party Websites are solely between you
            and the third party. We assume no responsibility for such transactions, products,
            services, or content offered by Third-Party Websites. If you purchase any products or
            services based on recommendations or links provided through our Services, we are not
            liable for any issues, damages, or losses arising from those transactions. You agree to
            hold us harmless from any harm, losses, or claims arising from your interaction with
            Third-Party Websites or Third-Party Content.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>13. SERVICES MANAGEMENT</Title>
          <Text>We reserve the right, though we are not obligated, to:</Text>
          <ol>
            <li>
              <Text>
                Monitor the Services to ensure compliance with these Legal Terms, applicable laws,
                and our internal policies. This includes reviewing user activity, Contributions (as
                defined in these Terms), and any content shared within the Services.
              </Text>
            </li>
            <li>
              <Text>
                Take appropriate action against any individual who, in our sole judgment, violates
                applicable laws or these Legal Terms. Such actions may include, but are not limited
                to:
              </Text>
              <ul>
                <li>Reporting the user to law enforcement or other relevant authorities,</li>
                <li>Restricting, suspending, or terminating access to the Services,</li>
                <li>Disabling the ability to upload content or interact with certain features.</li>
              </ul>
            </li>
            <li>
              <Text>
                At our sole discretion, refuse, limit access to, or restrict the availability of any
                Contributions, or any part thereof, to the extent technologically possible. This
                includes, but is not limited to, restricting or disabling images, videos, audio and
                text content you upload or share with other users within the Services, especially if
                such content violates these Legal Terms or is deemed inappropriate.
              </Text>
            </li>
            <li>
              <Text>
                Without prior notice or liability, remove or disable any files or content that we
                determine to be excessively large, burdensome to our systems, or otherwise harmful
                to the operation or security of the Services.
              </Text>
            </li>
            <li>
              <Text>
                Manage the Services in a manner designed to protect our rights, property, and ensure
                the efficient and secure operation of the platform. This may involve the removal of
                harmful content, maintaining system integrity, and implementing technical
                limitations to safeguard users and the Services.
              </Text>
            </li>
            <li>
              <Text>
                We may undertake any of the above actions at our sole discretion and without prior
                notice to you, although we will endeavor to notify users where appropriate and
                feasible.
              </Text>
            </li>
          </ol>
        </Stack>
        <Stack>
          <Title order={2}>14. TERM AND TERMINATION</Title>
          <Text>
            These Legal Terms will remain in full force and effect for as long as you use the
            Services. We reserve the right, at our sole discretion and without prior notice or
            liability, to deny access to or use of the Services (including blocking specific IP
            addresses) to any individual or entity, for any reason or no reason, including but not
            limited to:
          </Text>
          <ul>
            <li>
              A violation of any representation, warranty, covenant, or agreement contained in these
              Legal Terms;
            </li>
            <li>A breach of applicable laws or regulations;</li>
            <li>
              Any behavior that, in our sole judgment, interferes with the proper operation of the
              Services or negatively impacts other users.
            </li>
          </ul>
          <Text>
            {`We may, at any time, terminate your use of the Services or
            participation in any part of the Services (including your membership
            in the "Club") without prior notice. This includes deleting or
            removing any content, Contributions, or information you have posted
            to the Services.`}
          </Text>

          <Title order={3}>Account Suspension and Termination</Title>
          <Text>If we terminate or suspend your account for any reason:</Text>
          <ul>
            <li>
              You are prohibited from registering or creating a new account under your name, a false
              name, or the name of any third party, even if you are acting on behalf of that third
              party.
            </li>
            <li>
              We may, at our discretion, take additional legal actions, including pursuing civil,
              criminal, or injunctive remedies, to protect our rights and interests.
            </li>
          </ul>
          <Text>
            You understand that any termination of your access to the Services may involve the
            deletion of your user account, associated data, and Contributions (including image,
            video, audio and text content you have uploaded) without the possibility of recovery. We
            are not liable for any loss of data or other information resulting from such
            termination.
          </Text>

          <Title order={3}>Account Deletion and Data Retention</Title>
          <Text>
            You have the right to request the deletion of your account and all associated personal
            data at any time. You can do this by navigating to the settings page and clicking the
            appropriate button under the Account section.
          </Text>
          <Text>
            Upon initiating the account deletion request, all of your data will become private
            immediately (if it was public) and will be deleted permanently from our systems after 7
            days from the request in accordance with our{" "}
            <Link href="/legal/privacy" style={{ textDecoration: "underline" }}>
              Privacy Policy
            </Link>
            .
          </Text>

          <Title order={2}>15. MODIFICATIONS AND INTERRUPTIONS</Title>
          <Text>
            {`We reserve the right, at our sole discretion, to alter, modify,
            update, suspend, or remove any aspect of the Services, at any time
            and for any reason, without prior notice to you. This includes, but
            is not limited to, changes in the Services' features, functionality,
            content, or pricing. We are not obligated to update any information
            on the Services and shall not be liable to you or any third party
            for any modifications, price changes, suspensions, or
            discontinuations of the Services.`}
          </Text>

          <Title order={3}>Service Availability</Title>
          <Text>
            We do not guarantee that the Services will be available at all times. You acknowledge
            that the Services may experience interruptions due to technical issues, such as hardware
            or software failures, or may require maintenance or updates, which could result in
            delays, interruptions, or errors in accessing the Services.
          </Text>
          <Text>
            We reserve the right to revise, update, suspend, discontinue, or otherwise modify the
            Services at any time or for any reason without prior notice. You agree that we will not
            be liable for any loss, damage, or inconvenience resulting from your inability to access
            or use the Services during any period of downtime or discontinuation.
          </Text>

          <Title order={3}>No Obligation to Maintain</Title>
          <Text>These Legal Terms do not create an obligation for us to:</Text>
          <ul>
            <li>Maintain or support the Services continuously,</li>
            <li>Provide any corrections, bug fixes, updates, or releases for the Services.</li>
          </ul>
          <Text>
            By using the Services, you accept that service interruptions may occur, and we are not
            responsible for any adverse effects caused by such interruptions or changes.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>16. GOVERNING LAW</Title>
          <Text>
            These Legal Terms and your use of the Services will be governed by and interpreted in
            accordance with the laws of the State of Wyoming, without regard to its conflict of law
            principles. Any disputes or claims arising out of or relating to these Legal Terms or
            your use of the Services shall be exclusively subject to the jurisdiction of the state
            and federal courts located in the State of Wyoming.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>17. DISPUTE RESOLUTION</Title>
          <Title order={3}>Binding Arbitration</Title>
          <Text>
            If informal negotiations fail to resolve any disputes between you and us (except for
            disputes expressly excluded below), such disputes will be resolved exclusively through
            binding arbitration. By agreeing to arbitration, you waive your right to file a lawsuit
            in court or have a jury trial. Arbitration will follow the Commercial Arbitration Rules
            of the American Arbitration Association (AAA) and, where applicable, the AAA&apos;s
            Supplementary Procedures for Consumer Related Disputes (AAA Consumer Rules). These rules
            can be found on the AAA&apos;s website.
          </Text>
          <Text>
            Arbitration fees and arbitrator compensation will be governed by, and where applicable,
            limited by, the AAA Consumer Rules. The arbitration may occur in person, via document
            submission, by phone, or online. The arbitrator will issue a written decision, but is
            not required to provide an explanation unless requested by either party. The arbitrator
            must apply applicable law, and any arbitration award can be contested if the arbitrator
            fails to do so.
          </Text>
          <Text>
            Unless otherwise required by the AAA rules or applicable law, arbitration will take
            place in Sheridan County, Wyoming. Either party may, however, seek to enforce
            arbitration, stay court proceedings, or challenge an arbitration award in court as
            permitted under law.
          </Text>

          <Title order={3}>Court Proceedings</Title>
          <Text>
            If, for any reason, a dispute proceeds in court rather than through arbitration, it must
            be filed in the state or federal courts located in Sheridan County, Wyoming. Both
            parties consent to the exclusive jurisdiction of these courts and waive any defense
            related to lack of personal jurisdiction or inconvenient forum. The United Nations
            Convention on Contracts for the International Sale of Goods (CISG) and the Uniform
            Computer Information Transaction Act (UCITA) are expressly excluded from these Legal
            Terms.
          </Text>

          <Title order={3}>Time Limit</Title>
          <Text>
            All claims and disputes related to the Services must be initiated within one (1) year
            after the cause of action arises. If this time limit is not met, the claim is
            permanently barred. If any part of this provision is found to be illegal or
            unenforceable, that portion will be handled by a court with proper jurisdiction, and the
            remaining parts of this provision will remain in effect.
          </Text>

          <Title order={3}>Restrictions</Title>
          <Text>
            Arbitration will be limited to disputes between you and us individually. To the fullest
            extent permitted by law:
          </Text>
          <ul>
            <li>No arbitration will be combined with any other proceedings;</li>
            <li>
              Disputes cannot be arbitrated on a class-action basis or as part of a class-action
              proceeding;
            </li>
            <li>
              Disputes cannot be brought in a representative capacity on behalf of the public or
              other individuals.
            </li>
          </ul>

          <Title order={3}>Exceptions to Arbitration</Title>
          <Text>
            The following disputes are excluded from binding arbitration and may be brought in
            court:
          </Text>
          <ul>
            <li>Disputes seeking to enforce or protect intellectual property rights;</li>
            <li>Disputes related to theft, piracy, invasion of privacy, or unauthorized use;</li>
            <li>Claims for injunctive relief.</li>
          </ul>
          <Text>
            If any part of this arbitration provision is found to be illegal or unenforceable, the
            remaining portions will still apply, and disputes not subject to arbitration will be
            resolved in the courts specified above, with both parties agreeing to submit to that
            {"court's"} jurisdiction.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>18. CORRECTIONS</Title>
          <Text>
            The Services may contain typographical errors, inaccuracies, or omissions, including but
            not limited to descriptions, pricing, availability, and other information. We reserve
            the right to correct any errors, inaccuracies, or omissions and to modify or update the
            information on the Services at any time, without prior notice. We do not guarantee the
            accuracy, completeness, or timeliness of any information on the Services and are not
            liable for any resulting inaccuracies.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>19. DISCLAIMER</Title>
          <Text>
            {`THE SERVICES ARE PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS.
            YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. TO THE FULLEST EXTENT
            PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
            INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. WE MAKE NO REPRESENTATIONS OR WARRANTIES REGARDING
            THE ACCURACY, COMPLETENESS, OR RELIABILITY OF THE CONTENT ON THE
            SERVICES OR ANY WEBSITES, MOBILE APPLICATIONS, OR THIRD-PARTY
            PLATFORMS LINKED TO THE SERVICES.`}
          </Text>
          <Text>WE WILL NOT BE LIABLE FOR ANY:</Text>
          <ol>
            <li>ERRORS, MISTAKES, OR INACCURACIES IN CONTENT OR MATERIALS;</li>
            <li>
              PERSONAL INJURY OR PROPERTY DAMAGE RESULTING FROM YOUR ACCESS TO OR USE OF THE
              SERVICES;
            </li>
            <li>
              UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY PERSONAL OR FINANCIAL
              INFORMATION STORED THEREIN;
            </li>
            <li>INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES;</li>
            <li>
              BUGS, VIRUSES, TROJAN HORSES, OR SIMILAR HARMFUL MATERIALS TRANSMITTED TO OR THROUGH
              THE SERVICES BY ANY THIRD PARTY;
            </li>
            <li>
              ERRORS OR OMISSIONS IN CONTENT OR MATERIALS, OR ANY LOSS OR DAMAGE INCURRED AS A
              RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA
              THE SERVICES.
            </li>
          </ol>
          <Text>
            WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR
            SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED
            WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER
            ADVERTISING. WE ARE NOT A PARTY TO OR RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN
            YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH ANY PURCHASE OF A
            PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST
            JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>20. INDEMNIFICATION</Title>
          <Text>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries,
            affiliates, and all of our respective officers, agents, partners, and employees, from
            and against any loss, damage, liability, claim, or demand, including reasonable
            {"attorneys'"} fees and expenses, made by any third party due to or arising out of:
          </Text>
          <ul>
            <li>Your use of the Services.</li>
            <li>Any breach of these Legal Terms.</li>
            <li>
              Any breach of your representations and warranties set forth in these Legal Terms.
            </li>
            <li>
              Your violation of the rights of a third party, including but not limited to
              intellectual property rights.
            </li>
            <li>
              Any overt harmful act toward any other user of the Services with whom you connected
              via the Services.
            </li>
          </ul>
          <Text>
            Notwithstanding the foregoing, we reserve the right, at your expense, to assume the
            exclusive defense and control of any matter for which you are required to indemnify us,
            and you agree to cooperate, at your expense, with our defense of such claims. We will
            use reasonable efforts to notify you of any such claim, action, or proceeding which is
            subject to this indemnification upon becoming aware of it.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>21. USER DATA</Title>
          <Text>
            {`We collect and store certain data that you transmit to the Services
            for the purpose of operating, maintaining, and improving the
            Services, as well as data related to your use of the Services. This
            includes, but is not limited to, personal information (such as your
            age, sex, and country of residence), image, video, audio and text you
            upload, and interactions within the "Club". We also collect data for analytical
            purposes.`}
          </Text>
          <Text>
            While we implement regular routine backups of data, you are solely responsible for
            maintaining copies of any data or images or videos that you upload or otherwise transmit
            through the Services. We will not be liable for any loss, corruption, or deletion of
            data, images, videos, or other content you provide. By using the Services, you waive any
            claims against us arising from any such loss, corruption, or destruction of this data.
          </Text>
          <Text>
            To the extent permitted by applicable law, you agree that we are not responsible for
            ensuring the ongoing availability, integrity, or accuracy of any data you have
            transmitted via the Services. If required by law, we will notify you of any significant
            data breaches affecting your personal information.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>22. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</Title>
          <Text>
            By accessing and using the Services, sending us emails, submitting online forms, or
            interacting with the platform in any way, you consent to receive communications from us
            electronically. These communications may include, but are not limited to, agreements,
            notices, disclosures, updates, and other important information. You agree that all such
            communications, whether delivered via email or made available through the Services,
            satisfy any legal requirement that such communications be in writing.
          </Text>
          <Text>
            {`YOU HEREBY CONSENT TO THE USE OF ELECTRONIC SIGNATURES AND
            ELECTRONIC RECORDS FOR ALL AGREEMENTS, CONTRACTS, ORDERS, AND
            TRANSACTIONS ENTERED INTO THROUGH THE SERVICES. This includes, but
            is not limited to, any documents related to your use of the
            platform, membership in the "Club," financial transactions, and the delivery of related
            notices and policies.`}
          </Text>
          <Text>
            You expressly waive any rights or requirements under applicable laws, rules, or
            regulations in any jurisdiction that may require an original (non-electronic) signature,
            the delivery of non-electronic records, or payments to be made through non-electronic
            means, to the fullest extent permitted by law.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>23. CALIFORNIA USERS AND RESIDENTS</Title>
          <Text>
            If any complaint with us is not satisfactorily resolved, you can contact the Complaint
            Assistance Unit of the Division of Consumer Services of the California Department of
            Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento,
            California 95834, or by telephone at (800) 952-5210 or (916) 445-1254.
          </Text>
        </Stack>
        <Stack>
          <Title order={2}>24. MISCELLANEOUS</Title>
          <Text>
            These Legal Terms, along with any policies or operating rules posted by us on the
            Services or in relation to the Services, constitute the entire agreement and
            understanding between you and us. Our failure to exercise or enforce any right or
            provision of these Legal Terms shall not be considered a waiver of that right or
            provision. These Legal Terms will be enforced to the fullest extent permitted by law.
          </Text>
          <Text>
            We may assign any or all of our rights and obligations to others at any time without
            prior notice to you. We will not be liable for any loss, damage, delay, or failure to
            act due to causes beyond our reasonable control.
          </Text>
          <Text>
            If any provision or part of a provision of these Legal Terms is found to be unlawful,
            void, or unenforceable, that provision or part shall be deemed severable from these
            Legal Terms and will not affect the validity and enforceability of the remaining
            provisions.
          </Text>
          <Text>
            No joint venture, partnership, employment, or agency relationship is created between you
            and us as a result of these Legal Terms or your use of the Services. You agree that
            these Legal Terms will not be construed against us merely because we drafted them.
          </Text>
          <Text>
            You hereby waive any and all defenses you may have based on the electronic form of these
            Legal Terms and the absence of physical signing by the parties to execute these Legal
            Terms.
          </Text>
        </Stack>
        <Stack style={{ marginBottom: rem(48) }}>
          <Title order={2}>25. CONTACT US</Title>
          <Text>
            To resolve a complaint regarding the Services or to receive further information about
            their use, please contact us at:
          </Text>
          <Text>Bettermax LLC, 30 N Gould St. Sheridan, Wyoming 82801, United States</Text>
          <Text>info@muxout.com</Text>
        </Stack>
      </Stack>
    </>
  );
}
