import Link from "next/link";

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.02-5.11-2.881-6.974-1.862-1.863-4.337-2.887-6.971-2.888-5.442 0-9.87 4.42-9.874 9.86-.001 1.75.483 3.42 1.4 4.932l-.991 3.616 3.702-.971zm11.367-7.46c-.327-.164-1.938-.956-2.239-1.065-.301-.11-.522-.164-.74.164-.217.328-.844 1.066-1.035 1.285-.19.22-.38.247-.708.082-.327-.164-1.383-.51-2.637-1.63-1.01-.902-1.69-2.016-1.887-2.343-.197-.329-.022-.507.142-.671.148-.148.328-.382.492-.574.164-.19.219-.328.328-.546.11-.22.055-.41-.027-.574-.082-.164-.74-1.782-1.014-2.44-.267-.643-.561-.555-.74-.564-.176-.01-.38-.012-.584-.012-.204 0-.535.077-.814.383-.28.307-1.07 1.047-1.07 2.553 0 1.506 1.096 2.962 1.246 3.162.15.2 2.157 3.295 5.225 4.617.729.315 1.3.504 1.743.645.733.232 1.399.2 1.926.12.587-.087 1.938-.792 2.21-1.558.272-.764.272-1.42.19-1.558-.08-.137-.301-.22-.628-.384z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-16">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-6 max-w-sm">
            {/* Logo / Brand */}
            <div className="flex h-20 items-center border-b border-white/5 px-8 pt-2">
              <Link href={`/`} className="group flex items-center gap-2">
                <div className="size-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-transform">
                  <span className="text-lg font-black italic text-white tracking-tighter">
                    CT
                  </span>
                </div>
                <span className="text-xl font-black italic text-white tracking-tighter uppercase group-hover:text-red-500 transition-colors">
                  CineTube
                </span>
              </Link>
            </div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed text-center md:text-left">
              Your ultimate destination for endless entertainment. Stream
              movies, TV shows, and exclusive content anytime, anywhere in
              stunning quality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-16 text-sm text-slate-300">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-black mb-2 uppercase tracking-widest text-xs">
                Explore
              </h4>
              <Link
                href="/media"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                Movies
              </Link>
              <Link
                href="/media"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                TV Shows
              </Link>
              <Link
                href="/pricing"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                Pricing
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-black mb-2 uppercase tracking-widest text-xs">
                Legal
              </h4>
              <Link
                href="/terms"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                Terms of Service
              </Link>
              <Link
                href="/terms"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Separator, Copyright & Socials */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} CineTube. All rights reserved.
          </p>

          {/* Social Icons with target="_blank" functionality */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/FajlaRabby24"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all border border-transparent hover:border-white/10"
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/fajlarabby24"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-[#0A66C2] hover:bg-white/10 hover:scale-110 transition-all border border-transparent hover:border-[#0A66C2]/30"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://wa.me/8801307495864"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-[#25D366] hover:bg-white/10 hover:scale-110 transition-all border border-transparent hover:border-[#25D366]/30"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
