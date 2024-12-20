import React, { useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { SubmitAboutResponseType } from "../types";
import QuestionSlide from "./QuestionSlide";

type Props = {
  questions: { asking: string; question: string }[];
  submitResponse: (args: SubmitAboutResponseType) => Promise<void>;
};

export default function QuestionsCarousel({ questions, submitResponse }: Props) {
  const slides = useMemo(
    () =>
      questions.map((question, index) => {
        return (
          <Carousel.Slide key={index}>
            <QuestionSlide key={index} question={question} submitResponse={submitResponse} />
          </Carousel.Slide>
        );
      }),
    [questions?.length]
  );

  return (
    <Carousel
      slideSize={{ base: "100%" }}
      align="start"
      withControls={false}
      slideGap={16}
      slidesToScroll={1}
    >
      {slides}
    </Carousel>
  );
}
