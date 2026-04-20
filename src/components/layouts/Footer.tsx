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

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-5"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                  className="max-h-6 dark:invert"
                  alt="CineTube Logo"
                />
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter text-white font-outfit">
                CineTube
              </span>
            </Link>
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
                href="#"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                Terms of Service
              </Link>
              <Link
                href="#"
                className="font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="h-px w-3 bg-primary/0 hover:bg-primary transition-all"></span>{" "}
                Privacy Policy
              </Link>
              <Link
                href="#"
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
              href="https://www.facebook.com/fajla.rabby.305400"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-[#1877F2] hover:bg-white/10 hover:scale-110 transition-all border border-transparent hover:border-[#1877F2]/30"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
