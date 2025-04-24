import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Feedback from "@/components/Feedback";
import FadeIn from "@/components/FadeIn";

interface RouteParams {
  params: { id: string };
}

const FeedbackPage = async ({ params }: RouteParams) => {
  const user = await getCurrentUser();
  const paramID = await params.id;
  const interview = await getInterviewById(paramID);
  const feedback = await getFeedbackByInterviewId({
    interviewId: paramID,
    userId: user?.id!,
  });

  console.log("Params ID: ",paramID);
  console.log("Interview ID:",interview?.id)
  return (
    <FadeIn duration={100}>
      <Feedback feedback={feedback} interview={interview} paramID={paramID} />
    </FadeIn>
  );
};

export default FeedbackPage;
