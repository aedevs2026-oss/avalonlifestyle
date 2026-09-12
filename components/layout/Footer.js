import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import {
  siteConfig,
  footerQuickLinks,
  footerSupportLinks,
  socialLinks,
} from "@/lib/site";
import { assets } from "@/lib/assets";

const socialIcons = {
  instagram: assets.findDealer.instagram,
  facebook: assets.findDealer.facebook,
  youtube: assets.findDealer.youtube,
  linkedin: assets.findDealer.linkedin,
};

function FooterColumn({ children, className = "", withDivider = false }) {
  return (
    <div
      className={`
        flex flex-col items-center py-8 text-center
        first:pt-0 last:pb-0
        sm:py-0
        ${withDivider ? "lg:border-l lg:border-[#e5e5e5] lg:pl-8 xl:pl-10" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="container-avalon px-4 py-12 sm:px-6 lg:py-14 xl:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5 lg:gap-0 lg:gap-y-0">
          <FooterColumn className="lg:pr-6">
            <Logo variant="footer" className="mx-auto" />
            <p className="mt-4 font-serif text-[1.2rem] leading-[1.35] text-avalon-navy sm:mt-5 sm:text-[1.3rem]">
              Better Sleep.
              <br />
              A Brighter Tomorrow.
            </p>
          </FooterColumn>

          <FooterColumn withDivider>
            <h3 className="mb-4 text-sm font-bold text-avalon-black">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-avalon-red"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn withDivider>
            <h3 className="mb-4 text-sm font-bold text-avalon-black">Support</h3>
            <ul className="space-y-2.5">
              {footerSupportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-avalon-red"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn withDivider>
            <h3 className="mb-4 text-sm font-bold text-avalon-black">
              Contact Us
            </h3>
            <ul className="mx-auto w-full max-w-xs space-y-3.5">
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="flex items-start justify-center gap-2.5 text-sm text-gray-600 transition-colors hover:text-avalon-red"
                >
                  <Image
                    src={assets.findDealer.phone}
                    alt=""
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 opacity-80"
                  />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start justify-center gap-2.5 text-sm text-gray-600 transition-colors hover:text-avalon-red break-all"
                >
                  <Image
                    src={assets.findDealer.email}
                    alt=""
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 opacity-80"
                  />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start justify-center gap-2.5 text-sm text-gray-600">
                <Image
                  src={assets.findDealer.location}
                  alt=""
                  width={18}
                  height={18}
                  className="mt-0.5 shrink-0 opacity-80"
                />
                <span>{siteConfig.address}</span>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn withDivider>
            <h3 className="mb-4 text-sm font-bold text-avalon-black">
              Follow Us
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-85 transition-opacity hover:opacity-100"
                  aria-label={social.label}
                >
                  <Image
                    src={socialIcons[social.icon]}
                    alt=""
                    width={20}
                    height={20}
                  />
                </a>
              ))}
            </div>
          </FooterColumn>
        </div>

        <div
          className="
            mt-10 flex flex-col items-center gap-3 border-t border-[#e5e5e5] pt-6
            text-center text-xs text-gray-400
          "
        >
          <p>{siteConfig.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/resources"
              className="transition-colors hover:text-gray-600"
            >
              Terms &amp; Conditions
            </Link>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <Link
              href="/resources"
              className="transition-colors hover:text-gray-600"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
