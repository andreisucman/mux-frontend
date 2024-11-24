import { UserSubscriptionsType } from "@/types/global";

export default function checkSubscriptionActivity(
  keys: string[],
  subscriptions?: UserSubscriptionsType | null
) {
  try {
    if (!subscriptions)
      return {
        isTrialUsed: false,
        isSubscriptionActive: false,
      };

    const relevantSubcriptions = keys.map(
      (subscriptionKey) => subscriptions[subscriptionKey as keyof UserSubscriptionsType]
    );

    const isTrialUsed = relevantSubcriptions.some((subscription) => subscription.isTrialUsed);

    const isSubscriptionActive = relevantSubcriptions.some(
      (subscription) => new Date(subscription?.validUntil || 0) > new Date()
    );

    return {
      isTrialUsed,
      isSubscriptionActive,
    };
  } catch (err) {
    console.log("Error in checkSubscriptionActivity: ", err);
    return {
      isTrialUsed: false,
      isSubscriptionActive: false,
    };
  }
}
