import React from "react";
import Link from "next/link";
import { Stack, Text, Title } from "@mantine/core";

type Props = {
  addTitle?: boolean;
};

export default function TermsLegalBody({ addTitle }: Props) {
  return (
    <>
      {addTitle && <Title order={1}>Terms of Service</Title>}
      <Text size="sm" c="dimmed">
        Last updated: 5 May, 2025
      </Text>
      <Stack>
        <Text mt={0}>
          Muxout is a self-improvement platform focused on skin and hair care. These Terms of
          Service (“Terms”) form a legal agreement between you (the user of our Services) and
          Bettermax LLC (referred to as “Company,” “we,” “us,” or “our”), the owner and operator of
          the website muxout.com (the “Site”). Bettermax LLC is a company registered in Wyoming, USA
          (address: 30 N Gould St, Sheridan, WY 82801). If you have any questions about these Terms,
          you can contact us at info@muxout.com or by mail at the above address.
        </Text>
        <Text>
          By accessing or using Muxout (including any related services, mobile or web applications,
          or programs we offer), you acknowledge that you have read, understood, and agree to be
          bound by these Terms and our{" "}
          <Link href="/legal/privacy" style={{ textDecoration: "underline" }}>
            Privacy Policy
          </Link>
          . This includes consent to the collection and processing of your images and personal data
          as described in these Terms and in our Privacy Policy. If you do not agree with any part
          of these Terms or our Privacy Policy, you must not use the Site or Services. Your use of
          Muxout signifies acceptance of these Terms.
        </Text>
        <Text>
          We may update these Terms from time to time. If we make changes, we will update the “Last
          Updated” date and provide notice as required by law. Your continued use of Muxout after
          any update means you accept the revised Terms. It is your responsibility to periodically
          review these Terms for changes.
        </Text>
        <Text>
          Important: Muxout&apos;s Services are intended for adults 18 years of age or older. No one
          under 18 may register for an account or use our Services in any way.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Eligibility and User Accounts</Title>
        <ul>
          <li>
            <b>Age Requirement:</b> You must be at least 18 years old (or the age of legal majority
            in your jurisdiction, if higher) to create an account or use Muxout. By using our
            Services, you represent and warrant that you meet this age requirement and are legally
            capable of entering into this agreement. We do not knowingly collect data from or allow
            use of the Services by any person under 18.
          </li>
          <li>
            <b>Account Setup:</b> To access certain features of Muxout, you will need to create a
            user account. You agree to provide accurate, current, and complete information during
            registration and to keep your information updated (for example, if you change your email
            address or payment details). You are responsible for maintaining the confidentiality of
            your account login credentials and for all activities that occur under your account. If
            you suspect any unauthorized use of your account, you must notify us immediately. We are
            not liable for any loss or damage resulting from your failure to safeguard your account
            information.
          </li>
          <li>
            <b>Personal Use Only:</b> Muxout is for your personal, non-commercial use. You must not
            share your account with anyone or use another person&apos;s account without permission.
            Automated access (such as bots or scripts) is prohibited - you may use the platform only
            as an individual human user. You agree to use the Services only for lawful purposes and
            in compliance with all applicable laws. This means you will not engage in any illegal
            activity through Muxout, and you will not violate the rights of others (for example, do
            not upload content that infringes someone else&apos;s intellectual property or privacy
            rights).
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>Services Overview</Title>
        <Text>
          Muxout provides tools and features to help users improve skin or hair concerns through
          personalized analysis, recommendations, and progress tracking. Key features of our
          Services include:
        </Text>
        <ul>
          <li>
            <b>Personalized Analysis:</b> You can select a particular skin or hair concern (e.g.,
            acne, wrinkles, hyperpigmentation) and securely upload photos of the affected area. Our
            system uses artificial intelligence (AI) to analyze your images and provide a severity
            score (on a scale of 0 to 100) for your chosen concern. This score is intended to help
            you understand the current status of your skin or hair condition. Note: This analysis is
            for informational and tracking purposes only and is not medical or professional advice.
            The AI results are generated by proprietary algorithms and are not reviewed or approved
            by medical professionals.
          </li>
          <li>
            <b>Personalized Routines:</b> Based on your input and analysis results, Muxout may
            suggest a customized set of tasks, tips, or product recommendations tailored to you.
            This routine is intended to help address your selected concern over time (for example, a
            step-by-step skincare regimen or hair care routine). Suggestions might include
            over-the-counter products or lifestyle changes. These recommendations are general
            wellness and self-improvement suggestions, not medical prescriptions or treatments.
          </li>
          <li>
            <b>Progress Tracking:</b> After following your routine for a period of time (we require
            at least one week before re-scanning to allow for noticeable changes), you can upload
            new photos to monitor your progress. Muxout&apos;s AI will rescore your updated photos
            so you can compare results over time. This helps you see if your skin or hair
            concern&apos;s severity score is improving. Progress tracking is a key part of our
            Service, intended to keep you informed and motivated.
          </li>
          <li>
            <b>Community and “Club” Program:</b> Muxout offers an optional community feature called
            the Club (detailed later in these Terms). In the Club, users who have achieved
            improvements can choose to share their before-and-after photos and detailed routines
            with other users. You can publish your routine for others to purchase access to,
            potentially earning income through a revenue-sharing program. Participation in the Club
            is entirely voluntary - if you do not join the Club, your personal routines and photos
            remain private to you.
          </li>
        </ul>
        <Text>
          <b>Global Availability:</b> We aim to make Muxout available to users worldwide. However,
          we do not guarantee that all features of the Service (for example, certain product
          recommendations or the Club program) will be available in every region or at all times. If
          you access the Services from outside the United States, you do so at your own risk, and
          you are responsible for complying with any local laws that apply to your use of Muxout.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>No Medical or Professional Advice</Title>
        <Text>
          Muxout is not a medical or healthcare service. The information and AI assessments provided
          through our platform are for general informational and self-improvement purposes only.
          They are not intended to diagnose, treat, cure, or prevent any disease or medical
          condition. We are not healthcare professionals, and our AI-generated severity scores or
          routine suggestions do not constitute medical advice. You should always consult a
          qualified healthcare provider (such as a dermatologist or physician) for any medical or
          health-related concerns - especially before trying any new product or regimen, or if you
          have any underlying health conditions.
        </Text>
        <Text>By using Muxout, you acknowledge and agree to the following:</Text>
        <ul>
          <li>
            <b>No Doctor-Patient Relationship:</b> Using our Services does not create any
            doctor-patient or other health professional relationship between you and Muxout (or
            Bettermax LLC).
          </li>
          <li>
            <b>Consult Professionals:</b> Muxout is not a substitute for professional medical advice
            or treatment. If you have any health-related questions, concerns, or if your condition
            worsens, you will seek advice from a licensed healthcare professional. Do not rely on
            information from Muxout as your sole source of guidance for medical decisions.
          </li>
          <li>
            <b>Personal Responsibility:</b> Any actions you take based on information or
            recommendations provided by Muxout are at your own risk. We make no guarantee that
            following suggested routines or using recommended products will achieve your desired
            results. Similarly, the AI-generated scores may not be completely accurate or
            appropriate for your specific situation. You are responsible for using your own judgment
            and, when in doubt, seeking professional advice.
          </li>
        </ul>
        <Text>
          Muxout expressly disclaims any liability for outcomes related to the use of our Services
          for medical or health purposes. (See the Disclaimers of Warranties and Limitation of
          Liability sections below for additional details.)
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Privacy and Data Protection</Title>
        <Text>
          Protecting your privacy and personal data is extremely important to us. Muxout collects
          and uses your information in accordance with our Privacy Policy (which is incorporated
          into these Terms by reference). This section provides an overview of how we handle your
          data and highlights your rights as a user. We comply with applicable data protection laws,
          including the EU General Data Protection Regulation (GDPR), the California Consumer
          Privacy Act (CCPA), and laws regarding biometric data (which may treat facial images and
          scans as sensitive personal information).
        </Text>
        <Text>
          <b>Data We Collect:</b> When you use Muxout, we may collect various types of personal
          data, including:
        </Text>
        <ul>
          <li>
            <b>Profile Information:</b> Information you provide about yourself, such as your email
            address, and other account registration details.
          </li>
          <li>
            <b>Appearance Data (Biometric Data):</b> Photos or videos of your skin, hair, or body
            that you upload to the platform. These images may contain biometric identifiers (for
            example, your facial features) and are considered sensitive personal data under laws
            like the GDPR. We use these images only to analyze your stated concern (e.g., to measure
            acne severity) and to provide the Services to you (including showing you comparisons
            over time in your account).
          </li>
          <li>
            <b>Descriptions and Other Inputs:</b> Any textual information you provide about your
            concerns (such as descriptions of your skin/hair issues or the routines you follow) and
            any data we derive from your content (for example, notes on your skin type or the
            products you use).
          </li>
          <li>
            <b>Audio Data:</b> Any voice notes or audio recordings you submit (for example, verbally
            describing your routine or progress).
          </li>
          <li>
            <b>Usage Data:</b> Information about how you use Muxout, such as features you interact
            with, pages or screens you visit, and clicks or actions within the app. We collect this
            to understand usage patterns and improve the Service.
          </li>
          <li>
            <b>Device Data:</b> Technical information from the devices and browsers you use to
            access Muxout, such as your IP address, browser type, device type, operating system, and
            time zone. This information helps with security, troubleshooting, and optimizing our
            Services.
          </li>
        </ul>
        <Text>
          <b>Use of Data:</b> We use your personal data solely to operate and improve Muxout's
          Services for you. We do not sell your personal data to third parties for their own
          marketing or profit. For example, we may use your information to personalize your
          experience, to improve our AI algorithms using aggregated data, or to provide customer
          support. We may analyze user data in an aggregated or de-identified form (stripped of
          personal identifiers) to improve our services and understand trends, but we will not share
          your identifiable photos, videos, audio, or contact information with advertisers or other
          third parties without your explicit consent. If we suggest third-party skincare or hair
          products to you within the Service, those suggestions are based on your data and our
          analysis, and we do not give your personal data to those third-party product providers
          without your permission.
        </Text>
        <Text>
          <b>Consent to Data Processing:</b> By using Muxout and uploading sensitive personal data
          (such as your photos or other biometric information), you are giving us your explicit
          consent to collect, analyze, store, and process this data for the purposes of providing
          our Services as described in these Terms and in our Privacy Policy. This includes
          processing your images with AI tools to generate scores, storing your data in our
          databases, and - if you choose to share content via optional features like the Club -
          displaying your content to others with your further permission. We will only make your
          sensitive data visible to other users if you actively opt-in to such sharing (for example,
          by joining the Club and publishing content). If you are uncomfortable with our analysis or
          data practices, do not upload sensitive photos or use features that involve such data.
        </Text>
        <Text>
          You have the right to withdraw your consent to our processing of your personal data at any
          time (to the extent provided by laws like GDPR). Withdrawal of consent will not affect the
          legality of any processing we carried out prior to withdrawal, but once you withdraw
          consent we will stop processing your data going forward and will take appropriate steps
          regarding your data (such as deletion or anonymization, as described in the “Data Deletion
          and Account Closure” section below). Please be aware that if you withdraw consent for
          essential data processing (for example, if you no longer allow us to analyze your images),
          we may not be able to continue providing Services to you.
        </Text>
        <Text>
          <b>Your Privacy Rights:</b> Depending on your jurisdiction, you may have some or all of
          the following rights regarding your personal data:
        </Text>
        <ul>
          <li>
            <b>Access and Portability:</b> You may have the right to request a copy of the personal
            information we hold about you, and to receive it in a commonly used, machine-readable
            format (so you can port it to another service if you wish).
          </li>
          <li>
            <b>Correction:</b> You have the right to ask us to correct or update any of your
            personal information that is inaccurate or incomplete. (You can also correct basic
            account information yourself at any time via your profile settings.)
          </li>
          <li>
            <b>Deletion:</b> You have the right to request deletion of the personal information we
            have collected from you. (See the “Data Deletion and Account Closure” section of these
            Terms for details on how deletion works, particularly with regard to photos you have
            uploaded.)
          </li>
          <li>
            <b>Opt-Out of Sale of Personal Information:</b> We do not sell personal data to third
            parties in the traditional sense. If you are a California resident and exercising your
            rights under the CCPA to request an “opt-out” of the sale of personal information, we
            confirm that we do not sell your personal data. The only time data may be transferred to
            other users is when you choose to share it (for example, by participating in the Club
            program), which is considered a disclosure authorized by you, not a sale by us. If our
            practices change in the future, we will provide a mechanism for you to opt out as
            required by law.
          </li>
          <li>
            <b>Limit Use of Sensitive Data:</b> If applicable law (for instance, the California
            Privacy Rights Act) grants you the right to limit the use or disclosure of sensitive
            personal information, please note that we already limit our use of your sensitive data
            to what is necessary to provide the services you signed up for. We do not use your
            sensitive data (like photos or biometric data) for purposes such as cross-context
            behavioral advertising without your consent. If you still wish to request further
            limitations, you may contact us to discuss how we can accommodate your request.
          </li>
          <li>
            <b>Non-Discrimination:</b> We will not discriminate against you for exercising any of
            your privacy rights. This means we will not deny you the Service, provide you a
            different level or quality of Service, or charge you different prices or fees simply
            because you exercised your rights. (However, please note that if the exercise of your
            rights prevents us from processing data necessary for certain features, those features
            may become unavailable to you as a result. For example, if you request deletion of all
            your data, you will no longer be able to use features that rely on that data.)
          </li>
        </ul>
        <Text>
          To exercise any of your privacy rights, you can contact us at privacy@muxout.com or follow
          the instructions in our Privacy Policy. We will need to verify your identity before
          fulfilling certain requests (to protect your information from unauthorized access). We
          will respond to your request as required by applicable law. Keep in mind that these rights
          may be subject to legal exceptions; for example, we might retain certain data if required
          by law (like records of purchases for tax purposes), or we might decline to provide data
          that would violate another person&apos;s privacy or safety.
        </Text>
        <Text>
          <b>Data Security:</b> We take reasonable measures to secure your personal data and protect
          it from unauthorized access, alteration, disclosure, or destruction. This includes using
          technical, administrative, and physical safeguards appropriate to the sensitivity of the
          data. However, no system can be 100% secure. We therefore cannot guarantee absolute
          security of your information. You should also do your part by using a strong password and
          keeping your account credentials confidential. If we become aware of a data breach that
          compromises your personal data, we will notify you and any applicable regulatory
          authorities as required by law (for example, certain breaches under GDPR must be reported
          to authorities within 72 hours).
        </Text>
        <Text>
          For full details on how we handle your data, please refer to our{" "}
          <Link href="/legal/privacy" style={{ textDecoration: "underline" }}>
            Privacy Policy
          </Link>
          . By agreeing to these Terms, you confirm that you have read and understood our Privacy
          Policy.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Your Content and Contributions</Title>
        <Text>
          Muxout allows you to upload, post, and create content as part of using the Service - for
          example, photos, videos, audio clips, progress updates, personal routines, task records,
          “proof” snapshots, and diary notes. We will refer to all of this content collectively as
          your “User Content” or “Contributions.” This section explains your rights and
          responsibilities regarding the content you provide, and how we may use that content.
        </Text>
        <Text>
          <b>Ownership:</b> You retain ownership of all User Content that you create or upload on
          Muxout. Your photos, videos, routine details, and any other materials you submit remain
          yours. We do not claim ownership of your personal content.
        </Text>
        <Text>
          <b>License to Muxout:</b> In order for us to provide the Service, we need certain
          permissions from you regarding your User Content. By uploading or submitting content on
          Muxout, you grant Bettermax LLC a license to use your content for the purpose of
          operating, improving, and promoting the Muxout platform and Services. This license is
          worldwide, non-exclusive, royalty-free, and includes the right for us to sublicense the
          content to our service providers or affiliates solely for those purposes. In plain terms,
          this license allows us to host, store, reproduce, modify, create derivative works from,
          display, and distribute your content within the Muxout Service as needed to run the
          Service. For example:
        </Text>
        <ul>
          <li>
            We may store your photos on our servers and display them to you through your account
            (including side-by-side before-and-after comparisons).
          </li>
          <li>
            We may process your images through our AI algorithm to generate analysis results and
            create derivative works like cropped thumbnails or graphical overlays indicating skin
            areas or scores.
          </li>
          <li>
            If you choose to share content with others (for instance, by posting a public review or
            joining the Club program to share your routine), we will distribute and display that
            content to the audience you authorize (such as other users who purchase access to your
            routine in the Club).
          </li>
        </ul>
        <Text>
          This license to us is necessary solely to operate and provide the Muxout Services. We will
          not use your content for unrelated purposes without your consent. For example, we will not
          sell your photos or personal content to third parties, and we will not use your images in
          our external marketing materials unless you have given us permission to do so. (If we ever
          wanted to use your content for marketing, we would obtain your consent separately.)
        </Text>
        <Text>
          The license you grant to us is non-exclusive (meaning you are free to use your content
          elsewhere or allow others to use it), royalty-free (meaning we do not owe you fees for
          using it within the Service), and sublicensable (but only to third parties working on our
          behalf, such as cloud storage providers or content delivery networks, and always under
          protections consistent with these Terms and our Privacy Policy).
        </Text>
        <Text>
          Content Removal and License Termination: If you delete any of your User Content from
          Muxout or if you delete your account entirely, the license you granted us for that content
          will generally end for future use of the content. However, please note the following
          exceptions:
        </Text>
        <ul>
          <li>
            We may retain copies of your content on our backup servers or archives for a brief
            period of time, to the extent permitted by law. These backups exist for disaster
            recovery and are usually deleted on a rolling basis. During this interim, your content
            would not be available to other users, but might still exist in secure storage until the
            backups are updated.
          </li>
          <li>
            We may retain content as necessary to comply with legal obligations or resolve disputes.
            For example, if your account was suspended or terminated for violating our Terms, we
            might keep a record of the offending content to demonstrate the violation. Similarly, if
            there's an ongoing legal issue (like a subpoena or a dispute involving your content), we
            may retain relevant content until it is resolved.
          </li>
          <li>
            If you have shared your content with others through the Service, those individuals may
            still have access to your content in accordance with the permissions you granted. For
            example, if you sold access to a routine in the Club program, users who purchased it
            will retain access for the period they paid for (typically 365 days), even if you delete
            your account in the meantime. (See the “The Club Program” section for more details.)
          </li>
          <li>
            Once content is fully deleted from our active systems, it will no longer be accessible
            through Muxout. However, you understand that removal from our live database does not
            obligate us to prevent all possible archival or residual uses outside the Service (for
            instance, if a user who had access to your content took a screenshot while it was
            available, we cannot erase that).
          </li>
        </ul>
        <Text>
          Your Responsibilities (Content Guidelines): You are solely responsible for all content
          that you upload, post, or share on Muxout. By submitting content, you agree that your
          content and your conduct on the platform will comply with the following guidelines:
        </Text>
        <ul>
          <li>
            <b>Rights to Content:</b> You must own the content you upload or have obtained all
            necessary rights and permissions to use it and to allow us to use it as described in
            these Terms. Do not upload content that you do not have the right to use. For example,
            do not upload photographs of other people without their consent, and do not copy someone
            else&apos;s copyrighted text or images into your posts unless you have permission.
          </li>
          <li>
            <b>No Infringement of Others&apos; Rights:</b> Your content must not infringe upon or
            misappropriate the intellectual property or privacy rights of any other person or
            entity. This includes copyright, trademark, trade secret, privacy, publicity, or any
            other proprietary rights. If your content includes personal data or images of anyone
            other than yourself, you must have a lawful basis (such as their explicit consent) to
            include it.
          </li>
          <li>
            <b>Lawful and Appropriate Use:</b> Do not post content that is illegal, harmful, or
            offensive. Examples of prohibited content include, but are not limited to:
            <ul>
              <li>
                Content that is obscene, pornographic, or sexually explicit (especially if it
                exploits or endangers anyone).
              </li>
              <li>
                Hate speech, harassment, or content that advocates violence or discrimination
                against any individual or group.
              </li>
              <li>
                Content that is defamatory or fraudulent, or that promotes illegal activities.
              </li>
              <li>Any material that would violate any applicable law or regulation.</li>
            </ul>
          </li>
          <li>
            <b>No Health or Medical Misinformation:</b> Because Muxout involves health and wellness
            topics, do not share false or misleading health information. For example, do not claim
            that an unproven product or routine will cure a medical condition, and do not provide
            medical advice if you are not qualified to do so. All advice or claims you share should
            be truthful and responsible.
          </li>
          <li>
            <b>Authenticity and Honesty:</b> Only share content (including reviews or routine
            results) that reflects your genuine experience. Do not impersonate others or
            misrepresent yourself. If you participate in the Club program or provide testimonials,
            you must present your results and content honestly. Fabricating results or posting
            content that is intentionally deceptive is prohibited.
          </li>
          <li>
            <b>No Spam or Unauthorized Promotion:</b> Muxout is not a platform for unsolicited
            advertising or promotional content unrelated to the purpose of the Service. You should
            not post content primarily aimed at promoting a business, product, or service that is
            not relevant to skin/hair improvement or that is unrelated to sharing your personal
            routine. For example, do not use your routine description or posts to advertise an
            unrelated product or website without our permission. (Legitimate discussions of products
            as part of your routine or experience are fine, but constant self-promotion or posting
            referral links for personal gain is not allowed.)
          </li>
        </ul>
        <Text>
          We reserve the right to remove or moderate any User Content that violates these guidelines
          or any other provision of these Terms, or for any other reason in our sole discretion. We
          may also suspend or terminate your account if you repeatedly or egregiously violate these
          content standards (see the Termination and Suspension section below for more details).
          However, note that we do not pre-screen all user content, and we are not responsible for
          what users post. If you encounter content on Muxout that you believe violates these Terms
          or is otherwise inappropriate, please report it to us so we can review and take action as
          necessary.
        </Text>
        <Text>
          <b>License to Other Users (Club Content):</b> If you choose to participate in the Club
          program (explained later) and sell access to your routine and results, you are granting
          each purchaser a limited license to view and use your shared content for their personal,
          non-commercial purposes during the access period (generally 365 days). Purchasers are not
          allowed to copy, redistribute, or use your content outside of the platform except as
          needed for personal use. All users who buy Club content are bound by these Terms, which
          prohibit misuse of your content. We will take action against users who violate those
          rules, but we cannot guarantee that misuse will never occur. (The{" "}
          <Link href="/legal/club" style={{ textDecoration: "underline" }}>
            Club Terms & Conditions
          </Link>
          will provide more specific details about buyers&apos; obligations.)
        </Text>
        <Text>
          <b>Feedback:</b> We welcome and appreciate feedback, ideas, and suggestions from users
          about how to improve Muxout. If you choose to submit feedback or suggestions to us, you
          agree that we are free to use them without any compensation to you. This means we may
          incorporate your ideas into Muxout or develop new features based on your suggestions, and
          we will own any resulting improvements or features. You waive any claim to intellectual
          property rights or compensation for any feedback or ideas that you provide to us.
        </Text>
        <Text>
          <b>User Liability:</b> You are responsible for any consequences (including legal
          consequences) that result from the content you share on Muxout. If your content causes
          harm to us or to any third party, you may be required to bear the costs or damages. (See
          the Indemnification section below, in which you agree to indemnify us for certain claims
          resulting from your content or use of the Service.)
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Purchases, Payments, and Subscriptions</Title>
        <Text>
          Some features of Muxout may require payment, such as lifting limitations or gaining access
          to certain content (including content shared by other users in the Club). This section
          outlines how purchases, payments, and subscriptions are handled.
        </Text>
        <ul>
          <li>
            <b>Pricing and Currency:</b> All prices for Services (whether for subscriptions,
            one-time purchases, or content access fees) are listed in United States Dollars (USD),
            unless explicitly stated otherwise. If you are using Muxout from outside the United
            States, be aware that your payment provider (such as your credit card issuer or bank)
            may convert charges into your local currency and might charge foreign transaction or
            conversion fees. You are responsible for any such fees. You are also responsible for any
            taxes applicable to your purchases. We will add any required taxes (e.g., sales tax or
            VAT) at checkout in accordance with applicable law.
          </li>
          <li>
            <b>Payment Methods:</b> We accept common payment methods, such as major credit cards,
            debit cards, and possibly third-party payment services, for processing transactions. By
            providing a payment method, you represent that you are authorized to use that payment
            method and you authorize us (and our designated payment processor) to charge the full
            amount of your purchase (including any applicable taxes) to that payment method. You
            agree to provide current, complete, and accurate billing information and to promptly
            update that information if it changes (for example, if your credit card expiration date
            or billing address changes). If your payment fails or is declined (e.g., due to
            expiration, insufficient funds, or other issues), we may suspend or cancel the
            transaction or your access to paid Services. You agree to resolve any payment issues
            promptly, and you acknowledge that we may suspend your access to paid features until
            payment is successfully processed.
          </li>
          <li>
            <b>Subscriptions:</b> Certain Services or content on Muxout may be offered on a
            subscription basis (for example, a monthly or annual subscription to access premium
            features or content libraries). If you enroll in a subscription, you will be charged the
            subscription fee at the interval stated (e.g., every month or every year) until you
            cancel. By starting a subscription, you expressly authorize us to charge your provided
            payment method automatically at the beginning of each subscription period, without
            additional notice, until you cancel. We will inform you of the subscription terms at the
            time of sign-up, including the billing cycle and price. If we later change the price of
            your subscription or materially change the subscribed Services, we will give you advance
            notice of the new price or changes (generally via email or via the Service) and the
            opportunity to cancel before the next billing. If you do not cancel, the new pricing
            will apply at the start of the next subscription term.
          </li>
          <li>
            <b>Order Acceptance and Right to Refuse Service:</b> When you make a purchase or
            commence a subscription through Muxout, your order is an offer to us to buy the Service
            or content. We reserve the right to accept or decline your order or request at our
            discretion. Confirmation of payment does not obligate us to provide the Service if we
            subsequently determine we must decline the order. For example, we might refuse or cancel
            a purchase if: (a) we suspect the order is fraudulent or unauthorized, (b) you are
            located in a territory where we are legally unable to offer the Service or content, or
            (c) there was an obvious error in pricing or description at the time of order. If we
            cancel an order after you have been charged, we will provide a prompt refund for any
            amounts paid for which you did not receive the corresponding Service.
          </li>
          <li>
            <b>No Refunds (All Sales Final):</b> All purchases and payments are final and
            non-refundable, except as required by law or expressly stated otherwise. This applies to
            subscription fees, one-time purchases, and fees to access content (such as buying
            another user&apos;s routine in the Club). Once you have been charged, you will not be
            refunded for that charge if you decide to stop using the Service or content, or if you
            are dissatisfied with it, except in extraordinary circumstances. We may, in our sole
            discretion, consider a refund or credit in cases of documented technical issues or
            serious failures on our part (for example, if the Service was unavailable for an
            extended period due to our fault, or if there was a billing error). Any such refund or
            credit will be on a case-by-case basis and should not be expected or relied upon.
          </li>
          <li>
            <b>Cancellation of Subscriptions:</b> You may cancel a recurring subscription at any
            time. If you cancel your subscription, you will continue to have access to the
            subscribed Services or content until the end of your current billing period (since you
            have already paid for that period). At the end of the current period, the subscription
            will terminate and will not automatically renew. To avoid being charged for the next
            period, make sure you cancel before your next billing date. Note: Simply uninstalling
            the app or stopping use of the Service will not cancel a subscription – you must follow
            the cancellation procedure (usually accessible through your account settings or by
            contacting support). If you have any issues canceling, you should contact us for
            assistance.
          </li>
          <li>
            <b>Changes to Services or Fees:</b> Muxout is an evolving service, and we may add,
            modify, or remove features and content over time. We reserve the right to change our
            Service offerings or adjust our pricing for any Services or content. We may, for
            example, introduce new features that are only available as part of a premium package or
            change the price of an existing subscription plan. If you are subscribed to a Service
            that we decide to change or discontinue, or if we plan to adjust its price, we will give
            you advance notice. If a change or price increase affects something you&apos;re already
            paying for, you will have the chance to cancel before the change takes effect. If you
            continue your subscription or usage after the change, it means you have accepted the new
            terms or pricing. In cases where we discontinue a service or feature entirely, and you
            have already paid for it, we will provide a prorated refund for any period of your
            subscription that you can no longer use.
          </li>
          <li>
            <b>Errors and Corrections:</b> We strive to ensure that all information on our Site and
            Services (including prices, descriptions, and availability of content) is accurate.
            However, errors can occur. We reserve the right to correct any errors or
            omissions—including pricing errors—at any time. If you have already initiated a purchase
            and we discover an error (for example, a price was listed incorrectly), we will contact
            you with the correct information. If the corrected information or price is not
            acceptable to you, we will cancel the order and (if you have already paid) issue you a
            refund. We also reserve the right to update information and rectify mistakes on the Site
            without prior notice.
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>The Club Program (Revenue Sharing)</Title>
        <Text>
          Muxout offers an optional program called the Club, which is a revenue-sharing platform for
          users who wish to monetize their successful routines and results. Participation in the
          Club is not required for general use of Muxout; it is an extra feature for those who
          choose to share content with others for compensation. Below are the key terms for the Club
          program for both content sellers (users sharing routines) and buyers (users purchasing
          access to those routines).
        </Text>
        <ul>
          <li>
            <b>What is the Club?</b> The Club is a community marketplace within Muxout where users
            who have achieved improvements using the platform can share their personal routines and
            results with others for a fee. If you have a routine that worked well for you (for
            example, a skincare regimen that significantly improved your acne), you can publish
            details of that routine, along with before-and-after photos and any commentary, in the
            Club section of Muxout. Other users can then purchase access to your shared content to
            learn from your experience. In return, you (as the sharing user) will earn a portion of
            the revenue from those purchases. The Club enables knowledgeable users to help others
            and potentially earn income from their success stories.
          </li>
          <li>
            <b>Joining the Club:</b> Joining the Club as a content provider is completely voluntary.
            If you want to participate and share your routine for sale, you must meet a few
            requirements:
            <ul>
              <li>
                <b>Eligibility:</b> You must have a Muxout account in good standing (i.e., no
                ongoing violations or suspensions) and, as with all users, you must be 18 or older.
              </li>
              <li>
                <b>Onboarding and Verification:</b> We may require additional steps before you can
                start selling content. This could include verifying your identity (to prevent fraud
                and ensure payouts go to the correct person) and providing payment or banking
                information so we can pay out your earnings. It is your responsibility to provide
                accurate and up-to-date information for payouts. We are not responsible for missed
                or failed payments if the information you provided is incorrect or not kept current.
              </li>
              <li>
                <b>Content Standards:</b> The content you plan to share in the Club (photos, routine
                details, notes, etc.) must comply with our content guidelines (see Your Content and
                Contributions above). Because Club content is something others will pay for, we may
                impose additional quality standards. We reserve the right to approve or reject your
                participation or any specific content you submit to the Club. This is to ensure that
                buyers have a good experience and that content offered in the Club is helpful,
                authentic, and in line with Muxout&apos;s standards.
              </li>
              <li></li>
            </ul>
          </li>
          <li>
            <b>Club Agreement:</b> When you opt into the Club, you will be required to agree to a
            separate Club Terms & Conditions document (the specific agreement for the
            revenue-sharing program). The Club Terms will provide detailed provisions regarding how
            revenue is split, how and when payments are made, any additional rules for content, and
            other program-specific requirements. You must agree to and abide by the Club Terms to
            participate in the program. (If there is ever a conflict between the Club Terms and
            these Terms of Service regarding the Club program, the Club Terms will generally govern
            for issues specific to the Club.)
          </li>
          <li>
            <b>Global Availability:</b> We strive to make the Club program accessible to users
            around the world. In general, you can join and earn through the Club from any country,
            provided that doing so is legal in your jurisdiction and that our payment processors
            support making payouts to your country. It is your responsibility to ensure that you
            comply with any local laws when earning income online. For example, you may need to
            report your earnings for tax purposes, or there might be restrictions on receiving
            payments from abroad. All payouts for the Club program will be made in U.S. Dollars
            (USD) (unless we explicitly support other currencies in the future). If your local
            currency is different, the amount you receive will depend on the exchange rate and any
            conversion fees your bank applies.
          </li>
          <li>
            <b>Earnings and Payouts:</b> As a Club content provider, you will earn a share of the
            revenue every time a user purchases access to your routine/content. The specific
            percentage or amount of the revenue share will be stated in the Club Terms & Conditions
            (for example, Muxout might take a commission, with the remainder going to you).
            Muxout&apos;s Club program is designed so that there is no minimum payout threshold -
            any earnings you accumulate will be paid out to you, even small amounts. Payouts are
            processed on a regular schedule (for example, daily or weekly) to the payment method or
            account you have provided. Keep in mind that third-party banking or payment fees (such
            as wire transfer fees or intermediary bank charges) may apply and are your
            responsibility. We are not liable for delays or failures in payment that are outside our
            control (for instance, issues caused by inaccurate information you provided or problems
            within the banking system). If you decide to stop participating in the Club or even
            delete your Muxout account, we will still send you any remaining earnings that you are
            owed, provided you have not violated the terms in a manner that would cause you to
            forfeit those earnings (see “Club Rules and Termination” below).
          </li>
          <li>
            <b>Club Content and License to Buyers:</b> By uploading content to the Club (for
            example, your routine details, photos, progress notes, etc.), you are giving Muxout
            permission to offer that content to other users for purchase and to display it to those
            users who buy access. This is effectively a specific extension of the license you grant
            us for your content, allowing us to show it to paying customers. Users who purchase
            access to your Club content (“buyers”) receive a personal, non-transferable license to
            view and use your content for their own personal benefit. Buyers are not permitted to
            copy, share, or redistribute your content outside of the Muxout platform. We implement
            technical measures (such as disabling downloads or watermarking images) to discourage
            and prevent unauthorized distribution of Club content, but no system is foolproof. If a
            buyer misuses your content in violation of these Terms (for instance, shares it publicly
            without permission), that user would be in breach of our Terms and could face
            consequences, but you acknowledge that Muxout is not able to guarantee absolute
            protection of your content once it is accessible to others.
          </li>
          <li>
            <b>Access Period for Buyers:</b> When a buyer purchases access to a Club routine or
            content, the buyer is guaranteed access to that content for at least 365 days (one year)
            from the date of purchase. We will maintain the content on the platform and accessible
            to the buyer for that period (subject to the content not being removed for a violation
            of Terms, etc.). After 365 days, continued access is not guaranteed. The content may be
            removed by the seller (the user who provided it) or by Muxout at any time after the
            one-year period. In other words, purchasing Club content should be viewed as a one-year
            subscription to that specific content, not a perpetual purchase. If we or the seller
            decide to remove the content after the guaranteed access period, we are not liable to
            the buyer (though if a buyer's access is cut short within the guaranteed period due to
            our action, we would provide an appropriate remedy such as a refund). We also reserve
            the right to discontinue or alter the Club program in the future; however, any such
            change would not retroactively shorten the access for content already purchased without
            providing compensation.
          </li>
          <li>
            <b>Leaving the Club or Removing Content:</b> As a content seller, you may choose to
            withdraw from the Club program or remove your content from the Club at any time. If you
            decide to stop offering a particular piece of content (such as your routine) for sale,
            new users will no longer be able to purchase it. However, any existing buyers who have
            already paid for access will retain access to that content for the remainder of their
            365-day access period.
          </li>
        </ul>
        <Text>
          If you choose to delete your entire Muxout account (or if your account is deleted or
          terminated for any reason) while you still have active buyers with remaining access
          periods, we will take steps to preserve your Club content for those buyers until their
          access periods expire. Specifically, as explained in the Data Deletion section, your
          content will be retained in a read-only state for up to 365 days from each purchase date,
          so that existing purchasers are not left without the content they paid for. After the last
          buyer&apos;s access expires, we will delete the Club content. If keeping the content
          available is not feasible (for example, due to legal reasons or a serious violation), we
          may choose to refund the buyers for the unused portion of their access period instead, in
          which case you may forfeit the equivalent earnings.
        </Text>
        <ul>
          <li>
            <b>Club Rules and Termination:</b> By participating in the Club, you are entering a
            business-like arrangement with other users; therefore, we expect a high level of
            integrity and compliance with our rules. All the rules in the Your Content and
            Contributions section apply fully to Club content. In addition, if you are selling
            content in the Club, you must ensure that your content is truthful and not misleading,
            as people are paying based on the expectation that your routine yielded genuine results
            for you. If you violate our Terms or the Club agreement in connection with the Club
            program, we may take action including, but not limited to: removing or un-publishing
            your content, revoking your rights to participate in the Club, withholding or forfeiting
            your earnings, and suspending or terminating your Muxout account. For example,
            violations that could lead to such actions include (but are not limited to) posting
            someone else&apos;s photos as if they were your own, falsifying your results, providing
            content that is fraudulent or dangerous, repeatedly receiving user complaints of
            scam-like behavior, or engaging in any illegal activity through the platform. In severe
            cases (such as fraud, theft, or other illegal conduct), we reserve the right to escalate
            the matter by informing law enforcement authorities. If you are removed from the Club
            due to a breach of terms, you may forfeit any pending or future earnings from the Club.
            We might use those funds to refund affected users or as compensation for any harm done
            to the platform or its users. We might also temporarily hold payouts if we are
            investigating potential misconduct, until the investigation is resolved.
          </li>
          <li>
            <b>Relationship (Independent Content Creator):</b> Participating in the Club does not
            make you an employee, agent, or representative of Muxout or Bettermax LLC. You are
            acting as an independent content creator. You are solely responsible for reporting and
            paying any taxes or fees due on the earnings you receive from the Club program, in
            accordance with the laws in your jurisdiction. Nothing in the Club program is intended
            to create any partnership, joint venture, or employment relationship between you and the
            Company.
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>Data Deletion and Account Closure</Title>
        <Text>
          You have the right to stop using Muxout and to delete your account and personal data at
          any time. This section explains how you can delete your account and what happens to your
          data (especially your photos and other content) when you do so.
        </Text>
        <ul>
          <li>
            <b>How to Delete Your Account:</b> You can request deletion of your Muxout account (and
            associated personal data) at any time. The easiest method is through the Muxout platform
            itself: in your account settings, there is usually an option to delete your account.
            Initiating deletion through this interface will guide you through the process. If you
            are unable to delete your account via the settings (for example, if you no longer have
            access to the app), you may send a deletion request to us at support@muxout.com. For
            your security, we may require you to verify your identity or ownership of the account
            making the request (for instance, by contacting us from the email address registered to
            your account or providing other identifying information). Once we receive a verifiable
            deletion request, we will proceed with the deletion process.
          </li>
          <li>
            <b>Immediate Effects of Deletion:</b> When you confirm that you want to delete your
            account, we will deactivate your account promptly. Deactivation means you will no longer
            be able to log in, and your profile will no longer be visible to other users. We will
            then begin the process of removing your personal data and content from the active parts
            of our Service. Immediately upon account deletion:
            <ul>
              <li>
                Your profile information and presence on the platform will be removed from public
                view. Other users will not see your username or profile details anymore.
              </li>
              <li>
                Any content you have posted (photos, routines, updates, etc.) will be taken down
                from areas where other users can see it. For example, your contributions will not
                appear in any feeds, and other users&apos; access to your content will be restricted
                (with the limited exception noted below for Club content).
              </li>
              <li>
                Essentially, from a user perspective, it will be as if you are no longer active on
                Muxout.
              </li>
            </ul>
          </li>
          <li>
            <b>Content Visibility for Purchasers (Club Exception):</b> If you have been a
            participant in the Club program and have sold access to your content (your routines,
            before-and-after photos, etc.), there is an exception to the immediate removal of
            content. Users who have already purchased your Club content will continue to have access
            to that content for the duration that was promised to them (up to 365 days from their
            purchase). This means that even after you delete your account, the content they paid for
            will remain accessible to those specific users until their access periods expire, unless
            we decide to issue refunds to those users. During this period, your content is
            essentially put into a “read-only” state for those buyers: it remains available in their
            purchase history, but it is not visible to anyone who did not already have access. Your
            public profile will no longer appear, and no new sales of your content will occur, but
            we honor existing transactions by keeping the content available to purchasers. After the
            last buyer&apos;s access period ends, the content will be permanently deleted from our
            systems (as described below).
          </li>
          <li>
            <b>Permanent Deletion Timeline:</b> We aim to permanently delete or irreversibly
            anonymize your personal data from our active databases within approximately 7 days of
            your confirmed deletion request, with the exception of the Club content caveat mentioned
            above. In practice:
            <ul>
              <li>
                If you have not sold any content through the Club program, then typically all of
                your personal content (photos, routines, notes) and personal information will be
                removed from our production systems within about one week of your deletion request.
              </li>
              <li>
                If you have sold Club content, we will schedule the deletion of that content to
                occur shortly after the last purchaser&apos;s one-year access period concludes. For
                example, if your most recent sale was on January 1 (and thus the buyer&apos;s access
                would normally last until December 31 of that year), we will delete the content as
                soon as possible after December 31. During that interim, as noted, the content
                remains only for the existing buyer(s). We do this solely to fulfill our commitment
                to those who bought access; we do not use your content for any other purpose during
                this time.
              </li>
              <li>
                We will also remove any references to you in the Service (such as unfulfilled
                follower relationships, etc.), so that no data linked to your identity remains
                accessible.
              </li>
            </ul>
          </li>
          <li>
            <b>Retention of Certain Data:</b> In some cases, we may need or be obligated to retain
            certain information even after account deletion:
            <ul>
              <li>
                <b>Transactional Records:</b> If you made any purchases through Muxout or if you
                earned money through the Club, we may retain records of those transactions for
                financial reporting, tax, and accounting purposes. For instance, we may keep
                invoices, receipts, or payout records as required by law or financial regulations
                (often for a certain number of years as mandated by tax authorities).
              </li>
              <li>
                <b>Legal Compliance and Dispute Resolution:</b> We may retain information if needed
                to comply with legal obligations or to resolve or defend any disputes. For example,
                if we received a legal order (like a subpoena) related to your account, or if
                there&apos;s an ongoing issue such as a chargeback dispute or a claim that you
                violated these Terms, we might keep relevant data to address that issue. Similarly,
                if you were banned for violating our Terms, we might keep evidence of the misconduct
                and your communications with us regarding that issue.
              </li>
              <li>
                <b>Backup Systems:</b> Muxout&apos;s systems may include routine data backups. It is
                possible that some of your personal data could remain in encrypted backup files for
                a short period even after deletion from our active database. These backups are
                typically overwritten or deleted on a rolling basis. We have policies in place to
                ensure that deleted data in backups is not retained longer than necessary. Any such
                data in backups is not immediately accessible to others and is protected by our
                security measures. We do not use backup data except for restoration purposes in
                disaster recovery scenarios.
              </li>
              <li></li>
            </ul>
            Any data that we retain for the reasons above will continue to be protected under our
            Privacy Policy. We will not use it for any new or unrelated purposes once your account
            is deleted. For instance, if we retain a transaction record for tax purposes, we will
            not use that information to, say, market to you in the future.
          </li>
          <li>
            <b>Reopening an Account:</b> Account deletion is intended to be a permanent action. If
            you delete your account and later wish to rejoin Muxout, you will need to create a new
            account. Your old user name or data might not be available, and we generally cannot
            restore a deleted account or its content. (In rare cases, if you contact us immediately
            after deletion, we might be able to reverse it if the data hasn&apos;t been purged yet,
            but we cannot guarantee this.) We encourage you to be certain that you want to delete
            your account before confirming the deletion request.
          </li>
        </ul>
        <Text>
          We value your right to control your personal data and will assist you in the deletion
          process. If you have any questions or concerns about deleting your account or data, please
          contact our support team. We will provide information and support to ensure your request
          is handled properly, and we will confirm with you once your account deletion is completed.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Our Intellectual Property</Title>
        <Text>
          Muxout (including its software, design, and content provided by us) is protected by
          intellectual property laws. This section explains what we own and how you are allowed to
          use our materials.
        </Text>
        <Text>
          <b>Muxout Content and Brand:</b> All content provided by Muxout - including the software
          code, algorithms, design elements, text, graphics, logos, videos, and other materials we
          supply - is the property of Bettermax LLC or its licensors and is protected by copyright,
          trademark, and other intellectual property laws. For example:
        </Text>
        <ul>
          <li>The Muxout name and logo are trademarks of Bettermax LLC.</li>
          <li>
            The look and feel of our website and app (including layouts, color schemes, and graphics
            we created) are protected by copyright and other intellectual property rights.
          </li>
          <li>
            The software and AI algorithms that power Muxout are proprietary to us (or are used by
            us under license).
          </li>
        </ul>
        <Text>
          <b>License to Use Our Service:</b> We grant you a limited, non-exclusive,
          non-transferable, revocable license to access and use the Muxout Service and our content
          for your personal, non-commercial use, as intended by the normal functionality of the
          platform. This means you may use our app and site, view and interact with the content we
          make available to you, and print or download your own information from the Service for
          personal use. This license does not give you any ownership of our intellectual property,
          and it doesn&apos;t allow you to use our content outside of Muxout except as explicitly
          permitted.
        </Text>
        <Text>
          <b>Restrictions on Use:</b> You agree that you will not do any of the following without
          our prior written consent:
        </Text>
        <ul>
          <li>
            <b>Copy or Distribute Our Content:</b> Do not copy, reproduce, distribute, or publicly
            display any substantial portion of Muxout&apos;s content or Services (other than your
            own User Content). For example, you should not scrape or download content from our site
            to publish elsewhere, and you should not copy our training materials or code to create a
            competing service.
          </li>
          <li>
            <b>Modify or Reverse Engineer:</b> Do not modify, adapt, translate, reverse engineer,
            decompile, or create derivative works based on any part of the Muxout platform. (This
            prohibition does not apply to any open-source components we may use, which would be
            subject to their own licenses.)
          </li>
          <li>
            <b>Misuse Trademarks:</b> Do not use the name “Muxout,” our logos, or any of our
            trademarks in a way that could confuse people into thinking you are associated with us
            or that we endorse you or your content when that is not the case. For instance, you
            can&apos;t use our logo on your own website or product without permission. (You are
            allowed to make factual, nominative references to Muxout - like in a review or blog post
            - as long as it&apos;s clear you are not claiming any official affiliation.)
          </li>
          <li>
            <b>Commercial Exploitation:</b> Do not exploit or use any part of the Service or content
            for commercial purposes outside the scope of these Terms. For example, you are not
            allowed to resell access to Muxout, or use our platform or content to build a competing
            product or service.
          </li>
        </ul>
        <Text>
          Any unauthorized use of Muxout&apo;s intellectual property is a breach of these Terms and
          may also violate applicable law. We reserve the right to suspend or terminate any account
          involved in infringement or unauthorized use of our content. We may also take legal action
          to enforce our intellectual property rights if necessary.
        </Text>
        <Text>
          <b>Third-Party Content:</b> Sometimes, Muxout may display or use content that is owned by
          third parties (for example, a library or tool licensed for use in our app, or
          user-generated content from others). All such third-party content remains the property of
          its respective owners and may be subject to additional terms from those owners. You must
          respect any proprietary notices and usage rules set by the owners of third-party content.
          Additionally, our platform may contain links or references to third-party websites or
          services (explained more in the next section). Interacting with third-party content or
          sites is subject to those third parties&apos; terms and policies.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Third-Party Links and Services</Title>
        <Text>
          For convenience or to enhance your experience, Muxout may include links to third-party
          websites or services, or integrate third-party functionalities (for example, linking to
          purchase a recommended product on another site, or allowing you to log in via Google).
          Please note:
        </Text>
        <ul>
          <li>
            <b>No Endorsement or Control:</b> If we link to or integrate a third-party service, it
            does not mean we endorse or control that third party. We provide third-party links for
            reference or convenience. Clicking on a third-party link or using a third-party service
            is at your own risk, and that third party is responsible for its content and services.
          </li>
          <li>
            <b>Different Terms and Privacy Policies:</b> Once you leave the Muxout platform or
            engage with a third-party service, these Terms (and our Privacy Policy) no longer apply.
            The terms of use and privacy policy of the third party will govern your use of their
            services. For example, if you follow a link from Muxout to an external e-commerce site
            to buy a skincare product, the terms and policies of that external site (like Amazon or
            another retailer) apply to that purchase, not Muxout&apos;s. Likewise, if you use a
            feature that allows posting content to a third-party platform, that platform&apos;s
            rules apply to the content once it&apos;s posted there.
          </li>
          <li>
            <b>No Liability for Third-Party Actions:</b> Muxout is not responsible or liable for any
            third-party websites, services, products, or content. If you choose to provide personal
            information to a third-party site or to transact with a third party, you do so as an
            independent interaction between you and that third party. Any dispute or issue arising
            from a third-party interaction (for example, if you purchase a product through a link
            and it&apos;s defective, or a third-party site misuses your data) is between you and the
            third party. You agree that Muxout will not be held liable for any loss or damage of any
            sort incurred as a result of your dealings with third parties.
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>Termination and Suspension</Title>
        <Text>
          <b>Termination by You:</b> You are free to stop using Muxout at any time. If you want to
          terminate your account, you can simply discontinue use of the Services and/or delete your
          account (see Data Deletion and Account Closure above for instructions).
        </Text>
        <Text>
          <b>Termination or Suspension by Us:</b> We reserve the right to suspend or terminate your
          access to Muxout (in whole or in part) at our discretion, with or without notice, if you
          violate these Terms or if we suspect that your use of the Service could cause harm or
          liability to other users, us, or any third party. For example, if we discover that you are
          engaging in fraud, harassing others, uploading illicit content, or otherwise misusing the
          platform, we may disable or terminate your account. In serious cases of misconduct (such
          as illegal activity), we may do so immediately without advance warning.
        </Text>
        <Text>
          We may also suspend your account temporarily while investigating suspected violations of
          these Terms or suspicious activities. During such a suspension, you may not be able to
          access your account or content until the investigation is concluded (after which either
          your access will be restored or the account will be terminated, depending on the outcome).
        </Text>
        <ul>
          <li>
            <b>Effect of Termination:</b> If your account is terminated or suspended:
            <ul>
              <li>
                You will lose access to your account and all data associated with it (subject to the
                data retention policies described earlier). You will not be able to log in or use
                any services that require an account.
              </li>
              <li>
                Any rights or licenses granted to you under these Terms will immediately end. For
                example, your license to use our app or any premium content ceases upon termination.
              </li>
              <li>
                We may delete or deactivate your User Content from our live systems. We are not
                obligated to provide you with copies of your content upon termination (so please
                keep backups of any content you want to retain).
              </li>
              <li>
                If you were participating in the Club program, any unpaid earnings may be forfeited
                if your account is terminated due to a breach of these Terms. (For example, funds
                might be used to refund your buyers or cover potential liabilities caused by your
                actions.)
              </li>
              <li>
                We will not be liable to you for any compensation, reimbursement, or damages in
                connection with the termination of your access. This includes, for instance, any
                lost potential earnings, lost data, or other losses you might claim from being
                unable to use the Service.
              </li>
              <li>
                Certain provisions of these Terms will survive termination of your account. Any
                terms that by their nature should continue to apply after termination (such as
                intellectual property clauses, disclaimers, limitation of liability,
                indemnification, and dispute resolution provisions) will remain in effect.
              </li>
            </ul>
          </li>
        </ul>
        <Text>
          <b>Account Inactivity:</b> If an account is completely inactive for an extended period, we
          reserve the right to take action to manage our systems (for example, to free up your
          username or reduce unused storage). This could include deactivating or deleting an
          inactive account. If we choose to delete an account due to prolonged inactivity
          (typically, inactivity for a year or more), we will attempt to provide notice to the email
          associated with the account before deletion. No account will be deleted for inactivity
          without prior notice. (This does not mean we will delete your account simply because you
          take a break from using the Service; it&apos;s primarily to handle abandoned accounts.)
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Disclaimers of Warranties</Title>
        <Text>
          Muxout is provided to you on an “as is” and “as available” basis, without warranties of
          any kind. While we strive to provide a great service, we cannot promise that everything
          will always work perfectly or meet your expectations.{" "}
          <b>
            To the fullest extent permitted by law, we disclaim all warranties, express or implied,
            regarding Muxout and the Services.
          </b>{" "}
          In particular:
        </Text>
        <ul>
          <li>
            <b>No Guaranteed Results:</b> Muxout makes no guarantee that using the Services will
            yield any particular result for your skin, hair, or health. Every individual&apos;s
            results are different. Success stories or testimonials on our platform (including
            content in the Club) reflect individual experiences and are not promises of what you
            will experience. Any routines, products, or tips suggested by the Service may not be
            effective for you specifically.
          </li>
          <li>
            <b>Service Availability:</b> We do not warrant that Muxout will be uninterrupted,
            timely, secure, or error-free. There may be occasions when the Service is unavailable
            (for example, for maintenance or due to technical issues). We do not guarantee that the
            Service will be free from bugs, viruses, or that it will function without errors or
            delays at all times.
          </li>
          <li>
            <b>Information Accuracy:</b> We aim for accuracy in the information we provide, but
            Muxout&apos;s content (including AI-generated analysis, scores, recommendations, and
            user-contributed content) may contain errors or inaccuracies. For example, our AI might
            misclassify something, or a user&apos;s advice might not be applicable to you. We do not
            warrant that any information provided through the Service is complete, reliable, or
            accurate. Use the information at your own discretion and risk, and remember to consult
            professionals when appropriate (see No Medical Advice section above).
          </li>
          <li>
            <b>Implied Warranties:</b> We expressly disclaim any implied warranties, including (but
            not limited to) implied warranties of merchantability, fitness for a particular purpose,
            and non-infringement. This means, for example, we do not guarantee that the Service is
            fit for your specific needs, or that it will operate in an uninterrupted or error-free
            manner, or that using the Service will not infringe rights (though of course we do our
            best to respect others&apos; rights).
          </li>
          <li>
            <b>User and Third-Party Conduct:</b> We have no control over, and do not guarantee, the
            behavior of our users or third-party partners. Therefore, we make no warranty regarding
            the conduct of any other users or third parties you interact with through Muxout. We are
            not responsible for content posted by users – such content is the sole responsibility of
            the user who provided it. Any advice or information obtained from another user is theirs
            alone and not provided with any warranty from us. Additionally, if you interact with any
            third-party services (such as purchasing a product through a link, or logging in via
            another platform), we make no warranties regarding those third-party services.
          </li>
          <li>
            <b>Jurisdictional Limitations:</b> Some jurisdictions do not allow certain warranty
            disclaimers. If you live in an area that prohibits some of the warranty disclaimers
            above, those disclaimers may not fully apply to you. In such cases, Muxout&apos;s
            warranties will be limited to the extent permitted by law.
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>Limitation of Liability</Title>
        <Text>
          <b>Use Muxout at your own risk.</b> To the maximum extent permitted by law, Bettermax LLC
          and its owners, officers, employees, and agents will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits or
          revenues, whether incurred directly or indirectly, or any loss of data, goodwill, or other
          intangible losses, arising from or related to your use of (or inability to use) Muxout. In
          particular:
        </Text>
        <ul>
          <li>
            <b>No Indirect or Consequential Damages:</b> We are not responsible for any losses that
            are not a direct result of our actions. This includes losses like lost opportunities,
            lost profits, business interruption, or damage to your personal relationships or
            reputation. For example, if you spend money on products recommended by Muxout and they
            don&apos;t work for you, or if you have an adverse reaction and incur costs, we will not
            be liable for those costs or any related losses.
          </li>
          <li>
            <b>Third-Party and User Actions:</b> We are not liable for issues caused by other users
            or third parties. If another user misuses your content, harasses you, or otherwise
            violates your rights, any resulting dispute is between you and that user (though we
            encourage you to report such behavior to us so we can take appropriate action).
            Similarly, if you follow a suggestion to visit or buy from a third-party service and
            something goes wrong (for instance, the product is defective or causes harm), that is a
            matter between you and the third party, not Muxout.
          </li>
          <li>
            <b>Service Issues:</b> While we strive to maintain a reliable Service, we are not liable
            for damages resulting from service interruptions, technical failures, data loss,
            security breaches, or other issues inherent in operating a digital service, provided we
            have taken reasonable precautions. For example, if our Service is temporarily
            unavailable or if data you stored on Muxout is lost or compromised despite our security
            measures, we will work to fix the issue, but we will not owe you damages for any
            resulting inconvenience or losses.
          </li>
          <li>
            <b>Monetary Cap:</b> To the extent that we are found liable for anything despite the
            above disclaimers, our liability to you will be limited to USD $100. This cap on
            liability is cumulative – it applies to all claims combined, not per claim. Some
            jurisdictions do not allow the limitation of liability in this manner, so if you are in
            such a jurisdiction, this cap will apply to the fullest extent permitted by law.
          </li>
          <li>
            <b>No Liability for Health Outcomes:</b> Because Muxout deals with skin and hair health,
            it&apos;s important to note that we are not liable for any health issues or adverse
            effects that may occur from following advice or routines from our Service. Always use
            common sense and, if in doubt, consult a healthcare professional. For example, if you
            try a new product suggested by Muxout and experience an allergic reaction or other side
            effect, we are not responsible for that outcome. Always patch-test new products and
            follow the guidance of healthcare professionals for any serious conditions.
          </li>
        </ul>
        <Text>
          This allocation of risk is an essential part of our agreement. In jurisdictions that do
          not allow the exclusion or limitation of certain damages, our liability will be limited to
          the fullest extent permitted by law.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Indemnification (Your Responsibility)</Title>
        <Text>
          You agree to indemnify, defend, and hold harmless Bettermax LLC, its affiliates, and their
          officers, directors, employees, and agents, from and against any and all claims,
          liabilities, damages, losses, and expenses (including reasonable attorneys&apos; fees)
          that arise out of or relate to (a) your User Content, (b) your use of the Service, (c)
          your violation of these Terms, or (d) your participation in the Club program (including
          any content you sold or activities related to it).
        </Text>
        <Text>
          In simpler terms, if your actions or content cause someone else (or us) to sue or hold us
          responsible, you will cover the cost. For example:
        </Text>
        <ul>
          <li>
            If you upload content that infringes someone&apos;s copyright and we get sued because of
            it, you agree to pay for our defense and any resulting damages.
          </li>
          <li>
            If you misuse Muxout (say, by using it to harass someone or do something illegal) and we
            face a claim or investigation as a result, you will bear the costs.
          </li>
          <li>
            If you provided a routine in the Club and a buyer claims it caused them harm and takes
            action against us, you will be responsible for any costs or damages arising from that
            claim.
          </li>
        </ul>
        <Text>
          We reserve the right to assume control of our legal defense in any matter for which you
          have agreed to indemnify us, and you agree to cooperate with us in such cases. You also
          agree not to settle any such claim without our prior written consent, if the settlement
          would impose any obligation on Bettermax LLC or admit any fault on our behalf.
        </Text>
        <Text>
          Your indemnification obligations will survive the termination of your account or these
          Terms.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Governing Law</Title>
        <Text>
          These Terms and any dispute or claim arising out of or relating to these Terms or your use
          of Muxout will be governed by the laws of the State of Wyoming, USA, without regard to its
          conflict of law principles (meaning Wyoming law will apply even if you reside elsewhere).
        </Text>
        <Text>
          If you are a consumer residing in a jurisdiction with mandatory consumer protection laws
          (for example, in the European Union or other regions), you may be entitled to the
          protection of those laws in addition to the laws of Wyoming. Nothing in this section is
          intended to override any rights you have under your local law that cannot be waived by
          contract. However, to the extent permitted, any disputes will be resolved under Wyoming
          law.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>Dispute Resolution and Arbitration</Title>
        <Text>
          We hope any concerns can be resolved amicably by contacting us, but if there is a dispute
          that cannot be resolved informally, this section explains how we agree to resolve it.
        </Text>
        <ul>
          <li>
            <b>Initial Dispute Resolution:</b> Most issues can be resolved quickly by contacting our
            support team at info@muxout.com. You agree to try to resolve any dispute or claim
            against us by first contacting us and providing a brief written description of the issue
            along with your contact information. Both you and we agree to make a good-faith effort
            to resolve the dispute informally before pursuing other avenues.
          </li>
          <li>
            <b>Binding Arbitration Agreement:</b> If we cannot resolve a dispute informally, you and
            Muxout (Bettermax LLC) agree to resolve all disputes and claims between us through
            binding arbitration on an individual basis, not in court. This includes any claims
            arising out of or relating to these Terms or your use of the Service. Arbitration is a
            method of resolving disputes privately, without a judge or jury, where a neutral
            arbitrator&apos;s decision is final and binding. By agreeing to arbitration, both you
            and we are waiving the right to a jury trial and to participate in a class action.
          </li>
          <li>
            <b>Arbitration Procedure:</b> The arbitration will be administered by the American
            Arbitration Association (AAA) under its Consumer Arbitration Rules (or a similar set of
            rules if AAA is not available). The arbitration may take place in person in Wyoming,
            USA, or another mutually agreed location, or via teleconference/videoconference or
            written submissions if an in-person hearing is not practical. The arbitrator will have
            the authority to grant the same damages and relief as a court would (subject to the
            limitations and exclusions in these Terms). The arbitrator must follow these Terms and
            can award attorneys&apos; fees and costs if the law or applicable rules allow it. The
            arbitration will be in English, unless otherwise agreed.
          </li>
          <li>
            <b>Arbitration Fees:</b> Each party will pay its own attorneys&apos; fees and expenses.
            Arbitration filing fees and arbitrator&apos;s fees will be allocated as required by the
            AAA&apos;s rules. If required by law or the arbitration rules, we will pay certain costs
            that are our responsibility. Likewise, the arbitrator may require one party to cover all
            or a portion of the other&apos;s fees if the arbitrator determines that the party&apos;s
            claim or defense was frivolous or made in bad faith.
          </li>
          <li>
            <b>Exceptions:</b> Small Claims Option – Either party has the option to bring an
            individual claim in small claims court instead of proceeding with arbitration, for
            disputes that qualify for small claims court and so long as the matter remains in that
            court and on an individual (non-class) basis. Injunctive Relief – Notwithstanding the
            arbitration agreement, either party may seek temporary equitable relief (such as a
            preliminary injunction or temporary restraining order) in a court of competent
            jurisdiction to prevent immediate and irreparable harm, like stopping someone from
            misusing intellectual property or data. This type of request will not waive the right to
            arbitration for the underlying dispute (aside from the need for immediate action).
          </li>
          <li>
            <b>No Class Actions; Individual Relief Only:</b> You and Muxout agree that any
            arbitration (or, if arbitration is unenforceable, any court action) will be conducted
            only on an individual basis and not as a class, collective, or representative action.
            You further agree that the arbitrator (or court) may not consolidate or join the claims
            of other persons or parties who may be similarly situated, and may not otherwise preside
            over any form of a class, collective, or representative proceeding. You and Muxout
            expressly waive the right to a jury trial and the right to participate in a class action
            or class-wide arbitration.
          </li>
          <li>
            <b>Severability (Arbitration):</b> If any portion of this arbitration agreement is found
            to be invalid or unenforceable, it shall be severed, and the remaining provisions shall
            still be enforceable, except that if the class action waiver above is found
            unenforceable, then the entire arbitration agreement shall be null and void (but only in
            that specific case; the rest of these Terms will remain in effect). In the event the
            arbitration agreement is deemed unenforceable, you agree that disputes shall be resolved
            exclusively in a court of competent jurisdiction as described in the next paragraph.
          </li>
          <li>
            <b>Jurisdiction for Litigation:</b> In the unlikely event that a dispute arises and it
            is determined that arbitration is not applicable or enforceable, you agree that any
            litigation (court proceeding) shall be brought exclusively in the state or federal
            courts located in the State of Wyoming, USA. You and Muxout both consent to the personal
            jurisdiction of those courts. You also agree that those courts are a convenient forum
            and waive any objection to venue in those courts for any litigation of permitted
            disputes (such as claims not subject to arbitration).
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>Miscellaneous</Title>
        <ul>
          <li>
            <b>Entire Agreement:</b> These Terms (along with any additional terms we provide when
            you use certain features, and our Privacy Policy) constitute the entire agreement
            between you and Bettermax LLC regarding your use of Muxout. They supersede all prior
            agreements or communications (whether oral or written) between you and us related to
            Muxout. Any additional terms for specific services (like the Club Terms & Conditions)
            are incorporated by reference when you agree to them.
          </li>
          <li>
            <b>Severability:</b> If any provision of these Terms is held to be illegal, invalid, or
            unenforceable by a court or arbitrator, that provision will be severed from the Terms
            and the remaining provisions will remain in full effect. In other words, the invalid
            part will be removed, but the rest of the Terms will still apply.
          </li>
          <li>
            <b>No Waiver:</b> If we fail to enforce any part of these Terms or delay in enforcing
            it, that does not mean we waive our right to enforce it later. Any waiver of any
            provision of these Terms will be effective only if in writing and signed by an
            authorized representative of Bettermax LLC. Even if we waive a particular breach or
            provision, it does not mean we waive it for the future.
          </li>
          <li>
            <b>Assignment:</b> You may not assign or transfer your rights or obligations under these
            Terms to anyone else without our prior written consent. Any attempt to do so without
            consent is void. Bettermax LLC may assign or transfer its rights and obligations under
            these Terms (for example, in the event of a merger, acquisition, reorganization, or sale
            of assets, or by operation of law) to an affiliate or successor entity. These Terms will
            bind and benefit any permitted successors or assigns.
          </li>
          <li>
            <b>Force Majeure:</b> We will not be liable for any delay or failure to perform our
            obligations under these Terms if such delay or failure is caused by circumstances beyond
            our reasonable control. This includes events like natural disasters, acts of God, war,
            terrorism, riots, government actions, national or regional emergencies, pandemics,
            strikes or labor disputes, power or internet outages, or other events beyond our
            control. During such events, our obligations will be suspended to the extent affected by
            the event.
          </li>
          <li>
            <b>Relationship:</b> These Terms do not create any partnership, joint venture,
            employment, or agency relationship between you and Bettermax LLC. You are using Muxout
            as an independent user. Neither party has the authority to bind the other or act on the
            other&apos;s behalf in any way.
          </li>
          <li>
            <b>Headings:</b> Section headings in these Terms are provided for organization and
            convenience only and have no legal effect. They do not affect the meaning or
            interpretation of any provision of these Terms.
          </li>
          <li>
            <b>Contact Information:</b> If you have any questions, concerns, or feedback regarding
            these Terms or the Muxout Service, please contact us at info@muxout.com or by mail at
            Bettermax LLC, 30 N Gould St, Sheridan, WY 82801, USA. We will do our best to respond to
            your inquiries and address your concerns. Your satisfaction and trust are important to
            us, and we welcome communication from our users.
          </li>
        </ul>
      </Stack>
    </>
  );
}
