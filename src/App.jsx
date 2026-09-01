import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const skills = [
  'C',
  'C++',
  'Python',
  'HTML',
  'CSS',
  'JavaScript',
  'Git',
  'GitHub',
  'SQL',
];

const projects = [
  {
    number: '01',
    title: 'AR Writing',
    category: 'COMPUTER VISION',
    tech: 'Python · Hand Tracking',
    description:
      'An augmented-reality writing experiment that tracks hand movement and translates different gestures into writing and commands.',
    github: 'https://github.com/ma10-yt/AR-Writing',
  },
  {
   number: '02',
   category: 'AI / ML',
   title: 'AI Recipe Generator',
   tech: 'Python · Streamlit',
   description:
    'An AI-powered recipe generator built with Python and Streamlit.',
   github:
    'https://github.com/ma10-yt/ai-recipe-generator',
  },
  {
    number: '03',
    title: 'Friday',
    category: 'VOICE ASSISTANT',
    tech: 'Python · Automation',
    description:
      'A personal voice assistant built to interact with the computer through voice commands and perform useful tasks.',
    github: null,
  },
];

function App() {
  const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) =>
      observer.observe(element)
    );

    const visual = document.querySelector('.hero-visual');

    const handlePointerMove = (event) => {
      if (!visual) return;

      const rect = visual.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      visual.style.setProperty('--mouse-x', `${x}`);
      visual.style.setProperty('--mouse-y', `${y}`);
    };

    const handlePointerLeave = () => {
      if (!visual) return;

      visual.style.setProperty('--mouse-x', '0');
      visual.style.setProperty('--mouse-y', '0');
    };

    if (visual) {
      visual.addEventListener(
        'pointermove',
        handlePointerMove
      );

      visual.addEventListener(
        'pointerleave',
        handlePointerLeave
      );
    }

    return () => {
      observer.disconnect();

      if (visual) {
        visual.removeEventListener(
          'pointermove',
          handlePointerMove
        );

        visual.removeEventListener(
          'pointerleave',
          handlePointerLeave
        );
      }
    };
  }, []);

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="grid-overlay" />
      <div className="noise-overlay" />

      {/* NAVIGATION */}
      <header className="nav container">
        <Link
          className="brand"
          to="/"
          aria-label="MA10 home"
        >
          <span className="brand-mark">MA</span>
          <span>10</span>
        </Link>

        <nav
  className="nav-links"
  aria-label="Primary navigation"
>
  <a
    href="#about"
    onClick={(event) => {
      event.preventDefault();
      scrollToSection('about');
    }}
  >
    About
  </a>

  <a
    href="#stack"
    onClick={(event) => {
      event.preventDefault();
      scrollToSection('stack');
    }}
  >
    Stack
  </a>

  <a
    href="#projects"
    onClick={(event) => {
      event.preventDefault();
      scrollToSection('projects');
    }}
  >
    Projects
  </a>

  <a
    href="#contact"
    onClick={(event) => {
      event.preventDefault();
      scrollToSection('contact');
    }}
  >
    Contact
  </a>

  <Link to="/blog">
    Blog
  </Link>
</nav>
      </header>

      <main id="top">

        {/* HERO */}
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow hero-reveal">
              <span className="status-dot" />
              Available to learn & build
            </div>

            <p className="kicker hero-reveal hero-reveal-delay-1">
              MEHRAN
              <br />
              MUSHTAQ
            </p>

            <div className="hero-role hero-reveal hero-reveal-delay-2">
              <span>CS Student</span>
              <i>·</i>
              <span>Python Developer</span>
              <i>·</i>
              <span>AI/ML Enthusiast</span>
            </div>

            <p className="hero-text hero-reveal hero-reveal-delay-3">
              Building things, learning how they work, and turning ideas
              into code.
            </p>

            <div className="hero-actions hero-reveal hero-reveal-delay-4">
  <a
    className="btn btn-primary"
    href="#projects"
    onClick={(event) => {
      event.preventDefault();
      scrollToSection('projects');
    }}
  >
    Explore my work
    <span>↗</span>
  </a>

  <a
    className="btn btn-ghost"
    href="https://github.com/ma10-yt"
    target="_blank"
    rel="noreferrer"
  >
    GitHub
    <span>↗</span>
  </a>
</div>

            <div className="hero-meta hero-reveal hero-reveal-delay-5">
              <span>University of Kashmir</span>
              <span>·</span>
              <span>BCA · 2027</span>
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label="MA10 artwork"
          >
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-glow" />

            <div className="avatar-frame">
              <div className="avatar-inner">
                <img
                  src={`${import.meta.env.BASE_URL}ma10-avatar.png`}
                  alt="MA10 artwork"
                />
              </div>

              <div className="avatar-overlay" />
              <div className="avatar-border" />

              <div className="scan-line" />

              <div className="corner corner-tl" />
              <div className="corner corner-tr" />
              <div className="corner corner-bl" />
              <div className="corner corner-br" />
            </div>

            <div className="hud-card hud-top">
              <span className="hud-dot" />
              MA10 / IDENTITY
            </div>

            <div className="hud-card hud-bottom">
              PYTHON
              <span>→</span>
              DATA
              <span>→</span>
              AI
            </div>

            <div className="floating-label label-one">
              <span>01</span>
              BUILD
            </div>

            <div className="floating-label label-two">
              <span>02</span>
              LEARN
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="section container about-section reveal"
        >
          <div className="section-label">
            01 / ABOUT
          </div>

          <div className="about-content">
            <div className="about-main">
              <p className="about-eyebrow">
                A LITTLE ABOUT ME
              </p>

              <h2>
                Curious about how things work.
                <span>Driven to build them.</span>
              </h2>

              <p className="section-copy">
                I'm Mehran Mushtaq, a BCA student at the University
                of Kashmir with a growing interest in Artificial
                Intelligence and Machine Learning.
              </p>

              <p className="section-copy">
                I'm currently strengthening my foundation in Python,
                Data Science and software development while building
                projects that turn ideas into working applications.
              </p>
            </div>

            <div className="learning-card">
              <div className="learning-card-top">
                <span className="learning-status">
                  <span className="status-dot small" />
                  CURRENTLY LEARNING
                </span>

                <span className="learning-year">
                  2026
                </span>
              </div>

              <div className="learning-flow">
                <div className="learning-item active">
                  <span className="learning-number">
                    01
                  </span>

                  <div>
                    <strong>Python</strong>

                    <small>
                      Programming foundation
                    </small>
                  </div>
                </div>

                <div className="learning-line" />

                <div className="learning-item active">
                  <span className="learning-number">
                    02
                  </span>

                  <div>
                    <strong>Data Science</strong>

                    <small>
                      Working with data & analysis
                    </small>
                  </div>
                </div>

                <div className="learning-line" />

                <div className="learning-item future">
                  <span className="learning-number">
                    03
                  </span>

                  <div>
                    <strong>Machine Learning</strong>

                    <small>
                      Next major focus
                    </small>
                  </div>
                </div>

                <div className="learning-line" />

                <div className="learning-item future">
                  <span className="learning-number">
                    04
                  </span>

                  <div>
                    <strong>AI Engineering</strong>

                    <small>
                      Long-term direction
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STACK */}
        <section
          id="stack"
          className="section container reveal"
        >
          <div className="section-heading-row">
            <div className="section-label">
              02 / STACK
            </div>

            <p className="section-mini-copy">
              Technologies I use, practice, and build with.
            </p>
          </div>

          <div className="stack-grid">
            {skills.map((skill, index) => (
              <div
                className="stack-card"
                key={skill}
              >
                <div className="stack-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <span className="stack-name">
                  {skill}
                </span>

                <span className="stack-arrow">
                  ↗
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="section container reveal"
        >
          <div className="section-heading-row">
            <div className="section-label">
              03 / PROJECTS
            </div>

            <p className="section-mini-copy">
              A few things I've built while learning.
            </p>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article
                className="project-card"
                key={project.title}
              >
                <div className="project-top">
                  <span className="project-index">
                    PROJECT / {project.number}
                  </span>

                  <span className="project-category">
                    {project.category}
                  </span>
                </div>

                <div className="project-body">
                  <h3>{project.title}</h3>

                  <p className="project-tech">
                    {project.tech}
                  </p>

                  <p className="project-description">
                    {project.description}
                  </p>
                </div>

                <div className="project-bottom">
                  {project.github ? (
                    <a
                      className="project-github"
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on GitHub
                      <span className="project-arrow">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <>
                      <span>
                        GitHub link coming soon
                      </span>

                      <span className="project-arrow">
                        ↗
                      </span>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="more-projects">
            <span className="more-projects-line" />

            <p>
              More experiments and small projects will
              appear here as I keep building.
            </p>

            <span className="more-projects-line" />
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="section container contact-section reveal"
        >
          <div className="contact-main">
            <div className="section-label">
              04 / CONTACT
            </div>

            <p className="contact-eyebrow">
              HAVE AN IDEA?
            </p>

            <h2>
              Let's build something
              <span>worth shipping.</span>
            </h2>

            <a
              className="contact-email"
              href="mailto:mehranmushtaq599@gmail.com"
            >
              mehranmushtaq599@gmail.com
              <span>↗</span>
            </a>
          </div>

          <div className="contact-links">
            <a
              href="https://github.com/ma10-yt"
              target="_blank"
              rel="noreferrer"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>

            {/* Keep your existing correct LinkedIn URL here */}
            <a
              href="https://www.linkedin.com/in/ma10-yt"
              target="_blank"
              rel="noreferrer"
            >
              <span>LinkedIn</span>
              <span>↗</span>
            </a>

            <a
              href="https://leetcode.com/u/ma10-yt"
              target="_blank"
              rel="noreferrer"
            >
              <span>LeetCode</span>
              <span>↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer container">
  <span>
    © 2026 Mehran Mushtaq / MA10
  </span>

  <div className="footer-right">
    <span>Built while learning.</span>

    <Link
      className="footer-admin-link"
      to="/admin"
    >
      Admin
    </Link>
  </div>
</footer>
    </div>
  );
}

export default App;