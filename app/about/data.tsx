import { Stack, Text } from "@mantine/core";

export const data = [
  {
    question: "What is Muxout?",
    answer: (
      <Text>
        Muxout is a platform where people maximize their appearance with self-improvement routines
        and help others do the same.
      </Text>
    ),
  },
  {
    question: "How does it work?",
    answer: (
      <Stack>
        <Text>First, you scan yourself to get feedback on your appearance from our AI.</Text>
        <Text>
          After you get your feedback and a list of potential concerns you can start creating your
          routines. You can create routines manually by adding individual tasks or use our
          'Improvement Coach' to create a routine for the whole week.
        </Text>
        <Text>After you have your routines you can start completing the tasks in them.</Text>
        <Text>
          When you complete a task you can upload a video or image as proof. Uploading proofs is not
          required, but is important, especially if you plan to monetize your routines.
        </Text>
        <Text>
          Each week you rescan yourself to record your improvement and identify new concerns. All of
          your scans are privately stored on your results page.
        </Text>
        <Text>
          After you make visible progress you may choose to turn your profile public to inspire
          others. When you make your profile public other people can see your before-afters, which
          can motivate them to see your routines.
        </Text>
        <Text>
          If someone wants to see your routines they will have to buy the 'Peek License'. The Peek
          License will let them see and copy your routines for attaining similar results.
        </Text>
        <Text>
          When someone buys the Peek License and follows you you will get a comission from their
          subscription payments on a daily basis for as long as they follow you.
        </Text>
        <Text>
          Lastly, if you consistently complete your tasks you may also get achievements ('Streaks')
          that allow you to claim rewards.
        </Text>
        <Text>To see the description and amounts of the rewards check out the Rewards page.</Text>
      </Stack>
    ),
  },
  {
    question: "Is Muxout free?",
    answer: (
      <Stack>
        <Text>Muxout is entirely free.</Text>
        <Text>
          But it has optional paid addons such as the 'Improvement Coach' - the AI that creates
          personal routines for you, and the 'Advisor Coach' - the AI that answers your questions
          about the tasks, products, activities, and the person you follow.
        </Text>
        <Text>
          There is also the 'Peek License' that allows you to follow public users to see and steal
          their routines.
        </Text>
        <Text>
          These addons can speed up your results and save you time on research, but you don't have
          to buy them to use the platform.
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
          1. You can create an effective routine, and complete its tasks to improve your appearance.
          You can then make your profile public to let other people see your before-afters and
          follow you to access your routines. You will earn a 50% comission from each follower's
          subscription payment.
        </Text>
        <Text>
          2. You can complete your tasks and earn achievements ('Streaks'). When you have the
          necessary achievements you can claim the rewards on the Rewards page.
        </Text>
      </Stack>
    ),
  },
  {
    question: "How can I withdraw my earnings?",
    answer: (
      <Stack>
        <Text>
          To withdraw your earnings you have to join the 'Club'. Joining the Club is free and it
          doesn't make your data public.
        </Text>
        <Text>
          During the onboarding process you provide the legally required information about you and
          add your bank account.
        </Text>
        <Text>
          After your information is verified you can withdraw your balance at any time on your Club
          page.
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
          our payment processor you won't be able to earn and withdraw your rewards.
        </Text>
        <Text>
          You can learn if your country is not supported for payments when you add your bank during
          the Club onboarding.
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
          If you are mistakenly blocked by our software as underage, please contact us at
          support@muxout.com
        </Text>
      </Stack>
    ),
  },
  {
    question: "Can I delete my data?",
    answer: (
      <Text>
        Yes, you can delete your content at any time by clicking the trash button near your uploaded
        data. You can also delete your account in the settings.
      </Text>
    ),
  },
  {
    question: "What is food scan for?",
    answer: (
      <Text>
        Food scan lets you easily control the amount of calories you consume. This is useful for
        users who need to lose or gain weight. Just take a picture of your plate and our AI will
        tell you how much of it you can eat to stay within your calorie goal.
      </Text>
    ),
  },
  {
    question: "How can I contact you?",
    answer: <Text>Send your emails to info@muxout.com</Text>,
  },
];
