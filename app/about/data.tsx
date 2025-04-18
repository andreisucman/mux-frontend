import Link from "next/link";
import { Stack, Text } from "@mantine/core";

export const data = [
  {
    question: "What is Muxout?",
    answer: (
      <Text>
        Muxout is a place where you can create a routine to improve your appearance and share it to
        inspire and earn.
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
          create a routine manually by adding individual tasks or use our Improvement Coach - the AI
          addon that creates it for you based on your details.
        </Text>
        <Text>After you have your routine you can start completing the tasks in it.</Text>
        <Text>
          When you complete a task you can upload a video or image as proof. Uploading proofs is not
          required, but is important, especially if you plan to monetize your routines.
        </Text>
        <Text>
          Each week you rescan yourself to record your progress and identify new concerns. All of
          your scans are privately stored on your results page.
        </Text>
        <Text>
          After you make visible progress you may choose to sell your routine to help others achieve
          a similar transformation. When you do that your before-after images will appear on the
          home page.
        </Text>
        <Text>
          In addition to selling your routine, you can earn rewards for consistently working on
          improving your appearance.
        </Text>
        <Text>Visit the rewards page for more information.</Text>
      </Stack>
    ),
  },
  {
    question: "Is Muxout free?",
    answer: (
      <Stack>
        <Text>Muxout is entirely free.</Text>
        <Text>
          We have an optional paid addon - the &apos;Improvement Coach&apos; that creates personal
          routines for you based on your details.
        </Text>
        <Text>
          This addon can improve your experience and save you time on research, but you don&apos;t
          have to buy it to use the platform.
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
          To display your before-afters on the home page you will have to join &apos;the Club&apos;
          and list a routine for sale. Only accounts that explicitly listed their routines for sale
          are publicly displayed on the home page.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I earn on Muxout?",
    answer: (
      <Stack>
        <Text>You can earn on Muxout in 2 ways.</Text>
        <Text>
          1. You can create an effective routine and complete its tasks to improve your appearance.
          You can then list your routine for sale to help other people have a similar
          transformation.
        </Text>
        <Text>
          2. You can complete your tasks and earn achievements (&apos;Streaks&apos;). When you have
          the necessary achievements you can claim rewards on the Rewards page.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I publish my routine for sale?",
    answer: (
      <Stack>
        <Text>
          To be able to publish your routine for sale you have to join the Club. The Club is a free
          opt-in service that lets you buy or sell routines.
        </Text>
        <Text>
          Next, you have to have at least one set of before-after images taken via our platform.
          This means that you&apos;ll have to follow your routine for at least one week.
        </Text>
        <Text>
          Then, the routine you&apos;re publishing has to have at least 80% of proven task
          completions. This means that 80% of the tasks you&apos;ve completed within the routine
          must have either an image or video proof.
        </Text>
        <Text>
          Lastly, you have to have at least 10 points of improvement between your before and after
          images, i.e. you can only publish for sale effective routines.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I withdraw my earnings?",
    answer: (
      <Stack>
        <Text>
          To be able to withdraw your rewards you have to join the Club. Joining the Club is free
          and it doesn&apos;t make your data public (unless you publish your routines for sale).
        </Text>
        <Text>
          During the onboarding you provide the legally required information and your bank account.
        </Text>
        <Text>
          After your information is verified your earnings will be automatically sent to your bank
          account after the processing period of 7 days.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I hide my eyes when publishing the routine?",
    answer: (
      <Stack>
        <Text>
          To hide your features from progress scans you can click the &apos;Blur features&apos;
          checkbox at the top left.
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
          Muxout is available globally. However, our payment processing partners may have their own
          restrictions with respect to jurisdictions. Therefore, if your country is not supported by
          our payment processor you won&apos;t be able to earn or withdraw your rewards.
        </Text>
        <Text>
          You will see if your country is not supported when you add your bank account on your Club
          profile page.
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
        servers may take some time as outlined in our{" "}
        <Link href="/legal/terms" style={{ textDecoration: "underline" }}>
          Terms of Service
        </Link>
        .
      </Text>
    ),
  },

  {
    question: "How can I contact you?",
    answer: <Text>Send your emails to info@muxout.com</Text>,
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
