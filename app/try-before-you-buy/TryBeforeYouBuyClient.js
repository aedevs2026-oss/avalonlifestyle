"use client";

import Image from "next/image";
import PageHero, { CTABanner } from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { FAQSection } from "@/components/sections/FAQSection";
import { assets } from "@/lib/assets";
import { faqItems } from "@/lib/site";

const benefits = [
  { icon: assets.tryBeforeYouBuy.bed, title: "Experience Real Comfort", description: "Feel the actual support and softness." },
  { icon: assets.tryBeforeYouBuy.users, title: "Get Expert Guidance", description: "Our sleep experts help you choose the right fit." },
  { icon: assets.tryBeforeYouBuy.tick, title: "No Obligation", description: "Explore at your own pace with no pressure." },
  { icon: assets.listing.heart, title: "Find Your Perfect Match", description: "Because the right mattress feels different for everyone." },
];

const steps = [
  { num: 1, icon: assets.tryBeforeYouBuy.bed, title: "Visit", description: "Walk into an authorized Avalon dealer near you." },
  { num: 2, icon: assets.tryBeforeYouBuy.usersAlt, title: "Try", description: "Sit, lie down and experience the comfort." },
  { num: 3, icon: assets.tryBeforeYouBuy.tick, title: "Get Guidance", description: "Our experts help you choose the best mattress for your needs." },
];

const tryFaq = [
  { question: "Is there a cost to try the mattress?", answer: "No. Trying mattresses at our authorized dealers is completely free with no obligation to purchase." },
  { question: "How long can I try the mattress at the store?", answer: "Take as much time as you need. Our dealers encourage you to lie down and experience the comfort properly." },
  { question: "Do I need to book an appointment?", answer: "Walk-ins are welcome, but booking an appointment ensures dedicated expert attention." },
  { question: "Can I try different mattress models?", answer: "Absolutely. We encourage you to compare different models to find your perfect match." },
  { question: "Will I get expert advice during my visit?", answer: "Yes, our trained sleep experts are available at every dealer to guide you to the right mattress." },
  { question: "Can I purchase the mattress on the same day?", answer: "Yes, once you've found the right fit, our dealers can process your purchase on the spot." },
];

export default function TryBeforeYouBuyClient() {
  function handleSubmit(e) {
    e.preventDefault();
    alert("Your experience has been booked! Our team will confirm shortly.");
  }

  return (
    <>
      <PageHero
        label="TRY BEFORE YOU BUY"
        title="Feel the Difference"
        highlight="Before You Decide."
        description="Because great sleep is personal. Visit an Avalon experience center or schedule a home trial to feel the comfort, support and quality for yourself."
        footnote="TRY TODAY. SLEEP BETTER TOMORROW."
        image={assets.tryBeforeYouBuy.hero}
        imageAlt="Customer trying an Avalon mattress in showroom"
        bakedDiagonal
        priority
      />

      <section className="border-y border-avalon-border bg-white">
        <div className="container-avalon py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-avalon-border">
          {benefits.map((item) => (
            <div key={item.title} className="flex flex-col items-center px-6 py-4 text-center lg:py-0">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Image src={item.icon} alt="" width={22} height={22} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-avalon grid lg:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <Image src={assets.tryBeforeYouBuy.showroom} alt="Avalon mattress showroom interior" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>

            <div className="rounded-2xl border border-avalon-border bg-avalon-soft p-6 lg:p-8">
              <h2 className="font-serif text-2xl mb-6">What to Expect?</h2>
              <div className="grid grid-cols-3 gap-2">
                {steps.map((step, i) => (
                  <div key={step.num} className="relative flex flex-col items-center text-center">
                    <div className="relative flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-avalon-red text-white text-xs font-bold">
                        {step.num}
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-avalon-border">
                        <Image src={step.icon} alt="" width={20} height={20} />
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-full w-6 sm:w-8 border-t border-dashed border-avalon-red"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-600 leading-snug">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-avalon-border">
            <span className="label-red">SCHEDULE YOUR VISIT</span>
            <h2 className="font-serif text-2xl mt-3 mb-2">Book a Try Before You Buy Experience</h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill in your details and we&apos;ll help you schedule a visit to your nearest Avalon dealer or experience center.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Your Name" name="name" required placeholder="Enter your name" />
                <FormField label="Mobile Number" name="phone" type="tel" required placeholder="Enter your mobile number" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  label="City"
                  name="city"
                  as="select"
                  required
                  placeholder="Select your city"
                  options={["Dharmapuri", "Salem", "Chennai", "Bengaluru", "Coimbatore", "Hosur"]}
                />
                <FormField label="Preferred Date" name="date" type="date" placeholder="Select a date" />
              </div>
              <FormField
                label="Preferred Time"
                name="time"
                as="select"
                placeholder="Select a time"
                options={["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"]}
              />
              <FormField label="Additional Notes (Optional)" name="notes" as="textarea" placeholder="Let us know if you have any specific requirements" rows={3} />
              <Button type="submit" className="w-full">Book My Experience</Button>
            </form>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-avalon grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading
              title="A Small Step Towards"
              highlight="Better Sleep."
              description="Try our mattresses, explore different comfort levels, and make an informed decision with confidence."
            />
            <Button href="/find-a-dealer" variant="outline" className="mt-6">Find a Dealer Near You</Button>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={assets.tryBeforeYouBuy.bedroom} alt="Serene bedroom with Avalon mattress" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <p className="absolute bottom-4 right-4 font-serif italic text-white text-lg drop-shadow-lg">Real Comfort. Real Life.</p>
          </div>
        </div>
      </section>

      <FAQSection
        label="FREQUENTLY ASKED QUESTIONS"
        title="Your Questions, Answered"
        description="Find quick answers about our Try Before You Buy experience."
        items={tryFaq}
        buttonHref="/resources"
      />

      <CTABanner
        title="Better Sleep. A Brighter Tomorrow."
        description="Visit a nearby dealer and experience the Avalon difference today."
        buttonLabel="Find a Dealer"
        buttonHref="/find-a-dealer"
        backgroundImage={assets.tryBeforeYouBuy.bedroom}
      />
    </>
  );
}