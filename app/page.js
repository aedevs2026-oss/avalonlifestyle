import HomeHero from "@/components/home/HomeHero";
import HomeTrustBar from "@/components/home/HomeTrustBar";
import HomeRange from "@/components/home/HomeRange";
import HomeExploreRange from "@/components/home/HomeExploreRange";
import HomeMattressValue from "@/components/home/HomeMattressValue";
import HomeStory from "@/components/home/HomeStory";
import HomeShowroom from "@/components/home/HomeShowroom";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import HomeInsights from "@/components/home/HomeInsights";
import HomeCTA from "@/components/home/HomeCTA";

export const metadata = {
  title: "Home",
  description:
    "Better Sleep. A Brighter Tomorrow. Premium mattresses and furniture for deeper sleep and brighter days.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeTrustBar />
      <HomeRange />
      <HomeExploreRange />
      <HomeMattressValue />
      <HomeStory />
      <HomeShowroom />
      <HomeTestimonials />
      <HomeInsights />
      <HomeCTA />
    </>
  );
}
