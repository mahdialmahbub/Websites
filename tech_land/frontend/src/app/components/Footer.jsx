import Link from "next/link";
import {
  assets,
  contactInformations,
  legalLinks,
  quickLinks,
  shopByCategory,
  socialLinks,
} from "../assets/assets";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#1E1B4B]  rounded-[20px] p-space-8">
      <div className="p-space-8">
        <div className="flex justify-between">
          {/* Brand column */}
          <div>
            <Image src={assets.logo} alt="logo" className="h-[64px] w-auto" />
            <p className="mt-space-2 text-sm text-slate-400 max-w-xs">
              Your trusted destination for the latest tech gadgets, accessories,
              and smart devices at the best prices.
            </p>

            <div className="flex items-center gap-space-4 mt-[22px]">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  // <a
                  //   key={social.name}
                  //   href={social.link}
                  //   aria-label={social.name}
                  //   target="_blank"
                  //   rel="noopener noreferrer"
                  //   className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  // >
                  //   <Icon size={16} />
                  // </a>
                  <Link
                    key={social.name}
                    href={social.link}
                    aria-label={social.name}
                  >
                    <Image
                      alt={social.name}
                      src={social.icon}
                      className="w-auto h-5.5 hover:scale-110 transition-all duration-200"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className="text-size-h5 font-semibold tracking-wide text-foreground uppercase font-primary">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.link}
                    className="text-size-h6 text-placeholder hover:text-secondary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop by Category column */}
          <div>
            <h3 className="text-size-h5 font-semibold tracking-wide text-foreground uppercase font-primary">
              Shop by Category
            </h3>
            <ul className="mt-4 space-y-3">
              {shopByCategory.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.link}
                    className="text-size-h6 text-placeholder hover:text-secondary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-size-h5 font-semibold tracking-wide text-foreground uppercase font-primary">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-size-h6 text-placeholder *:hover:text-secondary transition-colors font-medium">
              <li className="hover:not-enabled:">
                {contactInformations.address}
              </li>
              <li>
                <a href={`tel:${contactInformations.phone}`}>
                  {contactInformations.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInformations.email}`}>
                  {contactInformations.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/40 mt-4.5 py-4.5 flex items-center justify-between gap-4">
          <p className="text-sm text-placeholder">
            © {new Date().getFullYear()} CozyNest. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6.5">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                className="text-sm text-placeholder hover:text-secondary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
