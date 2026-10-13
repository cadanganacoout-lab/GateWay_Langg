import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ArrowDown, ArrowUpRight, MapPin, MoveUpRight } from "lucide-react";

const destinations = [
  {
    number: "01",
    title: "Portfolio",
    description: "A closer look at my work, ideas, and things I've made.",
    url: "https://gilangfaid.vercel.app/",
    mark: "PF",
    tone: "lavender",
  },
  {
    number: "02",
    title: "Website Kelas",
    description: "A digital home for our class and everything we share.",
    url: "https://11rplsterida.vercel.app/",
    mark: "WK",
    tone: "mint",
  },
  {
    number: "03",
    title: "Aplikasi Flutter",
    description: "Explore and download my Flutter application.",
    url: "https://download-landing-page.vercel.app/",
    mark: "FL",
    tone: "peach",
  },
  {
    number: "04",
    title: "Website Lomba ITX",
    description: "A web experience made for the ITX competition.",
    url: "https://itx-2026-web-dev-coppy-paste-smk-pg.vercel.app/",
    mark: "IT",
    tone: "blue",
  },
] as const;

function Intro({ closing }: { closing: boolean }) {
  return (
    <div
      aria-label="Welcome to GF Portals"
      aria-live="polite"
      className={`intro-screen${closing ? " intro-screen--closing" : ""}`}
      role="status"
    >
      <div className="intro-content">
        <span className="intro-welcome">WELCOME</span>
        <h1>
          Opening the <em>GF</em>
        </h1>
        <div className="intro-loading">
          <div className="intro-track"><span /></div>
          <span>Loading..</span>
          <span className="intro-year">2026</span>
        </div>
      </div>
      <span className="intro-corner">GF&nbsp; / &nbsp;PORTALS</span>
    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [closingIntro, setClosingIntro] = useState(false);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setShowIntro(false);
      return;
    }

    const closeTimer = window.setTimeout(() => setClosingIntro(true), 2050);
    const removeTimer = window.setTimeout(() => setShowIntro(false), 2600);
    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".destination-card");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }
    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  function moveGateway(event: MouseEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    visualRef.current?.style.setProperty("--shift-x", `${x * 14}px`);
    visualRef.current?.style.setProperty("--shift-y", `${y * 14}px`);
  }

  function resetGateway() {
    visualRef.current?.style.setProperty("--shift-x", "0px");
    visualRef.current?.style.setProperty("--shift-y", "0px");
  }

  return (
    <div className="site-shell">
      {showIntro && <Intro closing={closingIntro} />}

      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="GF Portals, home">
          <span className="brand-monogram">GF</span>
          <span className="brand-copy">
            <strong>GILANG Portals</strong>
            <span>Student / 2026</span>
          </span>
        </a>
        <div className="header-right">
          <span className="header-edition">GILANG&apos;S <i /> 2026</span>
          <a className="header-link" href="#destinations">
            Explore <ArrowDown size={13} />
          </a>
        </div>
      </header>

      <main id="top">
        <section
          className="hero-section"
          aria-labelledby="hero-title"
          onMouseMove={moveGateway}
          onMouseLeave={resetGateway}
        >
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="status-pulse" />
              YOUR PORTAL TO MY WORK
            </div>
            <h1 className="hero-title" id="hero-title">
              <span className="hero-title-line">Gilang&apos;s</span>
              <span className="hero-title-accent">Information</span>
              <span className="hero-title-accent hero-title-last">Portals<span className="title-period">.</span></span>
            </h1>
            <p className="hero-description">
              Satu ruang untuk menjelajahi semua karya, eksperimen, dan proyek digital yang kubangun.
            </p>
            <div className="hero-meta">
              <span className="location">
                <MapPin size={13} strokeWidth={1.7} />
                PONOROGO, JAWA TIMUR — INDONESIA
              </span>
              <span className="portal-id">PORTAL <b>/</b> 01</span>
            </div>
            <a className="scroll-cue" href="#destinations">
              <span className="scroll-cue-icon"><ArrowDown size={14} /></span>
              <span>SCROLL TO EXPLORE</span>
            </a>
          </div>

          <div className="gateway-stage" ref={visualRef} aria-hidden="true">
            <div className="gateway-glow" />
            <div className="gateway-stars">
              <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
            <div className="gateway-orbit gateway-orbit-outer" />
            <div className="gateway-orbit gateway-orbit-middle" />
            <div className="gateway-orbit gateway-orbit-inner" />
            <div className="gateway-arch">
              <div className="gateway-arch-rim" />
              <div className="gateway-core">
                <span className="core-cross core-cross-horizontal" />
                <span className="core-cross core-cross-vertical" />
                <span className="core-mark">GF</span>
                <span className="core-caption">A SPACE TO EXPLORE</span>
              </div>
            </div>
            <div className="gateway-base" />
            <span className="gateway-coordinate coordinate-top">06° 35&apos; 00.0&quot; S</span>
            <span className="gateway-coordinate coordinate-bottom">111° 02&apos; 00.0&quot; E</span>
            <span className="gateway-annotation">FIG. 01 <b>—</b> PERSONAL DIGITAL GATEWAY</span>
          </div>

          <div className="hero-bottom-line">
            <span>INDEPENDENTLY BUILT <i /> OPEN TO EXPLORE</span>
            <span>SCROLL DOWN <ArrowDown size={12} /></span>
          </div>
        </section>

        <section className="destinations-section" id="destinations" aria-labelledby="destinations-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow section-eyebrow">THE COLLECTION</span>
              <h2 id="destinations-title">Select a <em>destination.</em></h2>
            </div>
            <div className="connection-count">
              <span className="connection-indicator" />
              <span>04 CONNECTIONS</span>
            </div>
          </div>

          <div className="destination-grid">
            {destinations.map((destination) => (
              <article
                className={`destination-card destination-${destination.tone}`}
                key={destination.number}
              >
                <a
                  className="destination-link"
                  href={destination.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kunjungi ${destination.title}, terbuka di tab baru`}
                >
                  <div className="card-topline">
                    <span className="card-number">{destination.number} <i /> DESTINATION</span>
                    <span className="card-arrow"><ArrowUpRight size={16} /></span>
                  </div>
                  <div className="card-symbol" aria-hidden="true">
                    <span>{destination.mark}</span>
                    <MoveUpRight className="symbol-arrow" size={17} strokeWidth={1.4} />
                  </div>
                  <div className="card-copy">
                    <h3>{destination.title}</h3>
                    <p>{destination.description}</p>
                  </div>
                  <div className="card-bottom">
                    <span>KUNJUNGI</span>
                    <span className="card-visit"><ArrowUpRight size={14} /></span>
                  </div>
                </a>
              </article>
            ))}
          </div>
          <div className="destinations-footnote">
            <span>ALL DESTINATIONS <i /> EXTERNAL LINKS</span>
            <span>CHOOSE YOUR NEXT STOP <ArrowUpRight size={12} /></span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#top" aria-label="Back to top">GF<span>.</span></a>
        <p>Made with intention in <strong>Ponorogo, Indonesia.</strong></p>
        <span className="footer-copy">© 2026 GILANG NUR MAULIDA FAID</span>
      </footer>
    </div>
  );
}

export default App;
