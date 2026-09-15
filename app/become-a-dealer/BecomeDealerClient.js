"use client";

import { useState } from "react";
import Image from "next/image";
import PageHero, { CTABanner } from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import FAQAccordion from "@/components/sections/FAQSection";
import { assets } from "@/lib/assets";

const benefits = [
  { icon: assets.becomeDealer.trophy, title: "Trusted Brand", description: "Be associated with a fast-growing and reliable brand" },
  { icon: assets.becomeDealer.diamond, title: "Quality Products", description: "Offer premium mattresses and furniture" },
  { icon: assets.becomeDealer.graph, title: "Marketing Support", description: "Get promotional and digital support" },
  { icon: assets.becomeDealer.trending, title: "Growing Demand", description: "Tap into the increasing demand for better sleep" },
];

const processSteps = [
  { num: 1, icon: assets.becomeDealer.mail, title: "Send Enquiry", description: "Fill in the application form" },
  { num: 2, icon: assets.becomeDealer.service, title: "Discussion", description: "Team will get in touch to understand your business" },
  { num: 3, icon: assets.becomeDealer.document, title: "Review & Approve", description: "Reviewing the application" },
  { num: 4, icon: assets.becomeDealer.handshake, title: "Start Partnering", description: "Access dealer benefits" },
];

const dealerFaq = [
  { question: "What are the requirements to become a dealer?", answer: "You need a retail space, business registration, and a commitment to representing the Avalon brand with excellence." },
  { question: "Is there a minimum investment?", answer: "Investment requirements vary by location and store size. Our team will discuss specifics during the application review." },
  { question: "What support does Avalon provide?", answer: "We provide marketing materials, product training, digital support, and ongoing business guidance." },
  { question: "How long does the approval process take?", answer: "Typically 2-4 weeks from enquiry submission to approval, depending on documentation and location assessment." },
  { question: "Can I sell both mattresses and furniture?", answer: "Yes. Authorized dealers can offer the complete Avalon product range including mattresses and furniture." },
];

export default function BecomeDealerClient() {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/dealer-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          email: data.get("email"),
          phone: data.get("phone"),
          city: data.get("city"),
          businessType: data.get("businessType"),
          message: data.get("message"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to submit enquiry.");
      setFeedback({
        type: "success",
        text: "Thank you for your enquiry! Our partnership team will contact you within 48 hours.",
      });
      form.reset();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Please try again or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        label="BECOME A DEALER"
        title="Partner for a"
        highlight="Brighter Tomorrow."
        description="Join the Avalon dealer network and bring premium sleep solutions to your community. Real partnership. Real growth."
        footnote="REAL PARTNERSHIP. REAL GROWTH."
        image={assets.becomeDealer.hero}
        imageAlt="Avalon premium mattress showroom for dealers"
        bakedDiagonal={false}
        priority
      />

      <section className="border-b border-avalon-border bg-white">
        <div className="container-avalon grid grid-cols-2 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div key={item.title} className="px-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Image src={item.icon} alt="" width={26} height={26} />
              </div>
              <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-avalon grid lg:grid-cols-2 gap-12">
          <div>
            <span className="label-red">DEALER ENQUIRY</span>
            <h2 className="font-serif text-3xl mt-3 mb-6">Let&apos;s Grow Together</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {feedback ? (
                <p
                  className={`rounded-lg px-3 py-2 text-sm ${
                    feedback.type === "success"
                      ? "border border-green-200 bg-green-50 text-green-900"
                      : "border border-red-200 bg-red-50 text-red-900"
                  }`}
                  role="status"
                >
                  {feedback.text}
                </p>
              ) : null}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Your Name" name="name" required placeholder="Full name" />
                <FormField label="Business Name" name="business" required placeholder="Company name" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Email Address" name="email" type="email" required placeholder="email@business.com" />
                <FormField label="Phone Number" name="phone" type="tel" required placeholder="+91 98765 43210" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="City" name="city" required placeholder="Your city" />
                <FormField
                  label="Type of Business"
                  name="businessType"
                  as="select"
                  required
                  placeholder="Select type"
                  options={["Retail Store", "Furniture Showroom", "Mattress Store", "Multi-brand Outlet", "Other"]}
                />
              </div>
              <FormField label="Tell Us More (Optional)" name="message" as="textarea" placeholder="Share details about your business..." />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Enquiry"}
              </Button>
            </form>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-avalon-warm">
            <div className="relative aspect-[4/3]">
              <Image
                src={assets.becomeDealer.handshakePhoto}
                alt="Avalon partnership handshake in a branded showroom"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-4 bg-white p-6">
              {[
                { icon: assets.becomeDealer.trophyBold, title: "Trusted Brand", description: "Proven quality and customer trust" },
                { icon: assets.becomeDealer.service, title: "Dealer Support", description: "Dedicated assistance at every step" },
                { icon: assets.becomeDealer.graph, title: "Business Growth", description: "Grow with a brand that cares" },
                { icon: assets.becomeDealer.handshake, title: "Long-Term Partnership", description: "Built on trust and mutual success" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <Image src={item.icon} alt="" width={20} height={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-avalon-warm">
        <div className="container-avalon">
          <SectionHeading label="HOW IT WORKS" title="A Simple Process to Get Started" align="center" className="mx-auto mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <div key={step.num} className="text-center relative">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-avalon-red text-white font-bold mb-4">
                  {step.num}
                </div>
                <Image src={step.icon} alt="" width={24} height={24} className="mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-600">{step.description}</p>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] border-t border-dashed border-avalon-red" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-avalon grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHeading label="OUR DEALERS SPEAK" title="Trusted by Our Partners" />
            <blockquote className="mt-8 bg-avalon-soft rounded-2xl p-8 border border-avalon-border">
              <p className="text-gray-700 italic mb-6">&ldquo;Partnering with Avalon has been the best business decision we made. The brand reputation and product quality speak for themselves.&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-avalon-red/10 flex items-center justify-center font-bold text-avalon-red">RK</div>
                <div>
                  <p className="font-semibold text-sm">Ramesh Kumar</p>
                  <p className="text-xs text-gray-500">Dealer, Coimbatore</p>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image key={i} src={assets.singleProduct.star} alt="" width={14} height={14} />
                ))}
              </div>
            </blockquote>
          </div>
          <div>
            <span className="label-red">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="font-serif text-3xl mt-3 mb-6 text-avalon-black">Your Questions, Answered.</h2>
            <FAQAccordion items={dealerFaq} />
          </div>
        </div>
      </section>

      <CTABanner
        title="Be a Part of A Brighter Tomorrow."
        description="Partner with Avalon and bring the joy of better sleep to more homes."
        buttonLabel="Become a Dealer"
        buttonHref="/become-a-dealer"
        backgroundImage={assets.singleProduct.lifestyle}
      />
    </>
  );
}
