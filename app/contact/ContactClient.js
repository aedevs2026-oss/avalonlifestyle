"use client";

import Image from "next/image";
import PageHero, { CTABanner } from "@/components/sections/PageHero";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { FAQSection } from "@/components/sections/FAQSection";
import { assets } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

const contactCards = [
  {
    icon: assets.findDealer.phone,
    title: "Call Us",
    value: siteConfig.phone,
    note: "Mon – Sat, 9 AM – 6 PM",
  },
  {
    icon: assets.findDealer.email,
    title: "Email Us",
    value: siteConfig.email,
    note: "We reply within 24 hours",
  },
  {
    icon: assets.findDealer.location,
    title: "Visit Us",
    value: siteConfig.address,
    note: "Our office location",
  },
  {
    icon: assets.contact.messageDots,
    title: "Live Support",
    value: "Chat with our team",
    note: "Mon – Sat, 9 AM – 6 PM",
  },
];

const officeBenefits = [
  {
    icon: assets.findDealer.location,
    title: "Easy Access",
    description: "Well connected by road",
  },
  {
    icon: assets.listing.support,
    title: "Customer Support",
    description: "Friendly and knowledgeable team",
  },
  {
    icon: assets.findDealer.shop,
    title: "Product Experience",
    description: "See and feel our mattresses and furniture",
  },
];

const contactFaq = [
  {
    question: "What are your working hours?",
    answer:
      "Our team is available Monday to Saturday, 9 AM to 6 PM IST.",
  },
  {
    question: "Do you have a showroom?",
    answer:
      "Yes. Visit an authorized Avalon dealer or our office in Velapanchavadi, Chennai to experience products in person.",
  },
  {
    question: "Can I get product brochures?",
    answer:
      "Yes. Download catalogues from the Resources page, or request printed materials through this form.",
  },
  {
    question: "Do you offer custom sizes?",
    answer:
      "Yes. Contact our team or visit a dealer to discuss custom dimensions for your bed frame.",
  },
  {
    question: "How can I find a dealer near me?",
    answer:
      "Use the Find a Dealer page to search by city, area or pincode across our authorized network.",
  },
];

export default function ContactClient() {
  function handleSubmit(e) {
    e.preventDefault();
    alert(
      "Thank you for your message. Our team will get back to you within 24 hours.",
    );
  }

  return (
    <>
      <PageHero
        label="CONTACT US"
        title="We're Here for a Better"
        highlight="Tomorrow."
        description="Have questions, need advice, or want to know more about our mattresses and furniture? We'd love to hear from you. Our team is here to help you sleep better, live better."
        footnote={"REAL PEOPLE.\nREAL SUPPORT."}
        image={assets.contact.hero}
        imageAlt="Avalon office reception with branded wall and welcome desk"
        bakedDiagonal
        priority
      />

      {/* Contact channels */}
      <section className="border-b border-avalon-border bg-white">
        <div className="container-avalon grid grid-cols-1 divide-y divide-avalon-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {contactCards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center px-6 py-8 text-center lg:py-10"
            >
              <div
                className="
                  mb-3 flex h-12 w-12 items-center justify-center rounded-full
                  border border-avalon-red/15 bg-white shadow-[0_0_0_1px_rgba(237,28,36,0.06)]
                "
              >
                <Image
                  src={card.icon}
                  alt=""
                  width={22}
                  height={22}
                  className="icon-avalon-red"
                />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-avalon-black">
                {card.title}
              </h3>
              <p className="text-sm font-medium text-avalon-black">{card.value}</p>
              <p className="mt-1 text-xs text-gray-500">{card.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + office — light gray band */}
      <section className="bg-avalon-soft section-padding">
        <div className="container-avalon grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <span className="label-red">SEND US A MESSAGE</span>
            <h2 className="mt-3 mb-6 font-serif text-3xl text-avalon-black">
              Get in Touch
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Your Name"
                  name="name"
                  required
                  placeholder="Enter your name"
                />
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                />
                <FormField label="City" name="city" placeholder="Enter your city" />
              </div>
              <FormField
                label="Subject"
                name="subject"
                as="select"
                required
                placeholder="Select a subject"
                options={[
                  { value: "general", label: "General Inquiry" },
                  { value: "product", label: "Product Information" },
                  { value: "warranty", label: "Warranty & Support" },
                  { value: "dealer", label: "Dealer Inquiry" },
                ]}
              />
              <FormField
                label="Your Message"
                name="message"
                as="textarea"
                required
                placeholder="How can we help you?"
              />
              <Button type="submit" className="mt-2 w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-avalon-border bg-white p-5 shadow-sm sm:p-6">
              <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,148px)]">
                <h2 className="font-serif text-xl leading-snug text-avalon-black md:text-2xl">
                  Better Conversations
                  <br />
                  Build a Brighter Tomorrow.
                </h2>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={assets.contact.office}
                    alt="Avalon Premium Mattress office exterior"
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              </div>
              <div className="mt-6 border-t border-avalon-border pt-6">
                <h3 className="mb-1 text-sm font-semibold text-avalon-black">
                  Visit Our Office
                </h3>
                <p className="text-sm text-gray-600">{siteConfig.name}</p>
                <p className="text-sm text-gray-600">{siteConfig.address}</p>
                <Button
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapEmbedQuery)}`}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Get Directions
                </Button>
              </div>
            </div>

            <ul className="grid gap-4 rounded-2xl border border-avalon-border bg-white p-5 shadow-sm sm:grid-cols-3 sm:gap-3 sm:p-6">
              {officeBenefits.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f0]">
                    <Image
                      src={item.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="icon-avalon-red"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-avalon-black">
                      {item.title}
                    </p>
                    <p className="text-xs leading-snug text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div
              className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-avalon-border bg-white shadow-sm sm:min-h-[260px]"
            >
              <iframe
                title="Avalon office — Velapanchavadi, Chennai"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapEmbedQuery)}&z=14&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        label="FREQUENTLY ASKED QUESTIONS"
        title="Quick Answers"
        description="Find answers to common questions. Still need help? Contact us directly."
        items={contactFaq}
        buttonHref="/resources"
        buttonLabel="View All FAQs"
      />

      <CTABanner
        title="Better Sleep. A Brighter Tomorrow."
        description="Have a specific requirement? Talk to our experts for personalised recommendations."
        buttonLabel="Request a Callback"
        buttonHref="/contact"
        backgroundImage={assets.contact.ctaBedroom}
      />
    </>
  );
}
