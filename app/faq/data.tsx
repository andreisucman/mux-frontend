import Link from "next/link";
import { Stack, Text } from "@mantine/core";

export const data = [
  {
    question: "What is Muxout?",
    answer: (
      <Text>
        Muxout is a place where you can create routines for improving your appearance and share them
        to inspire and earn.
      </Text>
    ),
  },
  {
    question: "How does it work?",
    answer: (
      <Stack>
        <Text>
          First, you choose the concerns you&apos;re aiming to improve and scan your appearance to
          get the feedback from our system.
        </Text>
        <Text>
          After you get your feedback you create a routine for improving your concerns. You can
          either create a routine you already know or use our free routine suggestion service that
          will suggest you a routine based on your appearance analysis.
        </Text>
        <Text>After you have created your routine you can start completing its tasks.</Text>
        <Text>
          When you complete a task you can upload a video or image as proof. Uploading proofs is not
          required, but is important, especially if you plan to monetize your routines.
        </Text>
        <Text>
          Each week you rescan yourself to record your progress and identify new concerns. All of
          your scans are privately stored on your results page.
        </Text>
        <Text>
          After you make visible progress you may choose to publish your routines to help others
          achieve a similar transformation. When you do that your before-after images will appear on
          the home page.
        </Text>
        <Text>
          After you publish your routine you can enable monetization. With monetization enabled you
          will be earning cash each time somebody views your routine, diary, progress or proofs.
        </Text>
        <Text>
          In addition, you can also earn rewards for consistently working on improving your
          appearance. Visit the rewards page for more information.
        </Text>
      </Stack>
    ),
  },
  {
    question: "Is Muxout free?",
    answer: (
      <Stack>
        <Text>Muxout is entirely free.</Text>
      </Stack>
    ),
  },
  {
    question: "How can I earn on Muxout?",
    answer: (
      <Stack>
        <Text>You can earn on Muxout in 2 ways.</Text>
        <Text>
          1. You can create effective routines and complete their tasks to improve your appearance.
          You can then publish your routines and enable monetization to help other people have a
          similar transformation.
        </Text>
        <Text>2. You can complete the tasks listed on the rewards page.</Text>
      </Stack>
    ),
  },
  {
    question: "Do you have an app?",
    answer: (
      <Stack>
        <Text>
          You can use Muxout as a native app. To install the app open the menu of your browser and
          click the 'Add to home screen' or 'Install app' button. We recommend doing this using
          Google Chrome.
        </Text>
      </Stack>
    ),
  },
  {
    question: "Will my images be listed on the home page?",
    answer: (
      <Stack>
        <Text>None of your images is listed automatically when you start using Muxout.</Text>
        <Text>
          To display your before-afters on the home page you will have to join the Club and publish
          your routins. Only accounts that explicitly published their routines are publicly
          displayed on the home page.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I monetize my routines?",
    answer: (
      <Stack>
        <Text>
          To be able to publish your routines you have to join the Club. The Club is a free opt-in
          service that lets you share your progress and routines with others.
        </Text>
        <Text>
          After joining the Club click "Publish routines" and then the "Publish" button at the
          relevant routine row. After publishing your routine you can also enable monetization by
          clicking the "Monetize" button.
        </Text>
        <Text>
          To enable monetization you have to have at least 1 set of before-after images with some
          improvement between them. This means that you&apos;ll have to follow your routine for at
          least one week and it will have to be at least somewhat effective before you can monetize
          it.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I withdraw my earnings?",
    answer: (
      <Stack>
        <Text>
          Withdraws are processed automatically every day subject to your country's minimum payout
          amount. It might take up to 7 days for your reward to arrive to your bank account.
        </Text>
        <Text>
          Muxout supports payouts to debit cards and bank accounts including Wise, Payoneer and
          others. Paypal is not supported.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I hide my eyes when publishing the routine?",
    answer: (
      <Stack>
        <Text>
          To hide your identifiable features (such as eyes or mouth) from progress images you can
          click the &apos;Blur features&apos; checkbox at the top left of the scan page.
        </Text>
        <Text>
          This will allow you to drag and drop shapes on your image to blur the underlying areas.
        </Text>
        <Text>
          You can also do it later on the &apos;My results&apos; page by clicking the blur icon at
          the top left of the image card.
        </Text>
      </Stack>
    ),
  },
  {
    question: "People from which countries can join?",
    answer: (
      <Stack>
        <Text>
          Muxout is available globally. However, at the moment monetization is available from the
          users with the bank accounts in United States, Canada, United Kingdom and Australia. If
          you live in another country you can use Wise, Payoneer or similar services to open a
          virtual USD bank account for receiving your payouts.
        </Text>
      </Stack>
    ),
  },
  {
    question: "What is the minimum age?",
    answer: (
      <Stack>
        <Text>
          Our platform is for users over 18 years old. We determine the age from the uploaded images
          and block the users who we believe are under 18. We also verify age when you join the
          Club.
        </Text>
        <Text>
          If you are blocked by our software as underage, you won&apos;t be able to use the
          platform.
        </Text>
      </Stack>
    ),
  },
  {
    question: "Can I delete my data?",
    answer: (
      <Text>
        You can delete your content at any time by clicking the trash button near your uploaded
        content. You can also delete your account in the settings. Please note that while your
        information dissappears from the public view immediately, the deletion of your data from our
        servers may take time as outlined in our{" "}
        <Link href="/legal/terms" style={{ textDecoration: "underline" }}>
          Terms of Service
        </Link>
        .
      </Text>
    ),
  },
  {
    question: "How can I contact you?",
    answer: <Text>Send an email to info@muxout.com.</Text>,
  },
  {
    question: "Attributions",
    answer: (
      <Text>
        Avatar design by{" "}
        <Link style={{ textDecoration: "underline" }} href="https://dribbble.com/micahlanier">
          Micah Lanier
        </Link>
        .
      </Text>
    ),
  },
];
