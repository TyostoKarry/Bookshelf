import { type FC } from "react";
import { BookCardShowcase } from "./home/BookCardShowcase";
import { DemoBookshelf } from "./home/DemoBookshelf";
import { DetailShowcase } from "./home/DetailShowcase";
import { FeaturesGrid } from "./home/FeaturesGrid";
import { FinalCTASection } from "./home/FinalCTASection";
import { GithubSection } from "./home/GithubSection";
import { Hero } from "./home/Hero";

export const Home: FC = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <DemoBookshelf />
      <BookCardShowcase />
      <DetailShowcase />
      <FeaturesGrid />
      <FinalCTASection />
      <GithubSection />
    </div>
  );
};
