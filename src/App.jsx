import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandIcon, SocialLinks } from './components/SocialLinks';
import { SiteHeader } from './components/SiteChrome';
import { supabase } from './supabase';

const projects = [
  { number: '01', title: 'ReceiptPocket', category: 'PYTHON · OCR · LOCAL AI', description: 'A local-first expense manager that uses Tesseract and Qwen2.5 through Ollama to extract receipt details and save them in SQLite.', tags: ['Python', 'Streamlit', 'Tesseract', 'Ollama', 'SQLite'], href: 'https://github.com/ma10-yt/ReceiptPocket', art: 'receipt' },
  { number: '02', title: 'AI Recipe Generator', category: 'PYTHON · AI', description: 'Add ingredients by hand or from an image, then get recipe ideas and step-by-step instructions.', tags: ['Python', 'Streamlit', 'OpenRouter'], href: 'https://github.com/ma10-yt/ai-recipe-generator', art: 'recipe' },
  { number: '03', title: 'Friday', category: 'PYTHON · VOICE ASSISTANT', description: 'A Python voice assistant that listens for “Friday” and responds to commands for searches, media, and everyday information.', tags: ['Python', 'SpeechRecognition', 'pyttsx3'], href: 'https://github.com/ma10-yt/friday', art: 'friday' },
  { number: '04', title: 'AR Writing', category: 'COMPUTER VISION', description: 'An augmented-reality writing experiment that tracks hand movement and translates gestures into writing and commands.', tags: ['Python', 'Hand tracking'], href: 'https://github.com/ma10-yt/AR-Writing', art: 'ar' },
];

function ProjectArtwork({ type }) {
  if (type === 'receipt') return <div className="project-artwork artwork-receipt" aria-hidden="true"><div className="receipt-sheet"><b>RECEIPT</b><i/><i/><i/><strong>OCR</strong></div><span className="scan-corner"/></div>;
  if (type === 'recipe') return <div className="project-artwork artwork-recipe" aria-hidden="true"><i/><i/><i/><b>INGREDIENTS<br/>→ IDEAS</b></div>;
  if (type === 'friday') return <div className="project-artwork artwork-friday" aria-hidden="true"><div className="voice-orb">F</div><div className="voice-wave">{[18,35,23,52,32,66,41,76,34,58,26,46,18].map((height, index) => <i key={index} style={{ '--bar-height': `${height}%` }} />)}</div></div>;
  return <div className="project-artwork artwork-ar" aria-hidden="true"><svg viewBox="0 0 320 180"><path d="M22 144 C62 132 66 39 104 46s23 106 58 85 24-99 57-79 37 88 78-9"/><circle cx="297" cy="43" r="7"/></svg><span>GESTURE → INK</span></div>;
}

function IsometricArt() {
  return <div className="hero-art" role="img" aria-label="Original isometric illustration of code, data, and machine learning">
    <div className="hero-art-grid" />
    <div className="hero-photo-frame">
      <svg className="hero-workspace" viewBox="0 0 580 900" role="presentation" aria-hidden="true">
        <defs>
          <pattern id="desk-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#67808a" strokeOpacity=".12" strokeWidth="1"/></pattern>
          <linearGradient id="desk-floor" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dfe9e8"/><stop offset="1" stopColor="#bcced0"/></linearGradient>
        </defs>
        <rect width="580" height="900" fill="#e8eff0"/><rect width="580" height="900" fill="url(#desk-grid)"/>
        <path d="M0 574 580 425v475H0Z" fill="url(#desk-floor)"/>
        <path d="m0 574 580-149M0 660l580-150M0 754l580-150M0 850l580-150" fill="none" stroke="#93a8a9" strokeOpacity=".35"/>
        <path d="M58 70h462v178H58z" fill="#f8faf8" stroke="#9eafb1" strokeWidth="2"/>
        <path className="hero-code-lines" d="M82 103h130M82 129h92M82 155h174M82 181h121M82 207h154" stroke="#7391a0" strokeWidth="5" strokeLinecap="round"/>
        <path className="hero-code-lines hero-code-lines--blue" d="M279 103h202M279 129h156M279 155h188M279 181h145M279 207h174" stroke="#2e78bb" strokeWidth="5" strokeLinecap="round" opacity=".82"/>
        <circle className="hero-status-light hero-status-light--red" cx="504" cy="91" r="7" fill="#e85739"/><circle className="hero-status-light hero-status-light--yellow" cx="482" cy="91" r="7" fill="#efb72c"/><circle className="hero-status-light hero-status-light--green" cx="460" cy="91" r="7" fill="#54a878"/>
        <g aria-hidden="true">
          <path d="M102 505v-94a66 66 0 0 1 132 0v94" fill="#f3b928"/><circle cx="168" cy="399" r="44" fill="#bf805a"/><path d="M124 397c-2-56 83-72 91-7l-15-12-12 8-20-15-21 23z" fill="#172f45"/>
          <path d="m99 504 17-41 46-19 48 22 23 38-19 98H107z" fill="#e75435"/><path d="m125 470-53 47-31 99 28 11 63-91m78-55 53 37 33 79-26 15-64-72" fill="#bf805a" stroke="#172f45" strokeWidth="7" strokeLinejoin="round"/>
          <path d="m73 614-15 176m157-174 22 174" stroke="#253d50" strokeWidth="19" strokeLinecap="round"/><path d="m50 792 49 7m123-7 39 6" stroke="#253d50" strokeWidth="13" strokeLinecap="round"/>
        </g>
        <g transform="translate(205 472)">
          <path d="M0 0h200v137H0z" fill="#253d50"/><path d="M12 13h176v105H12z" fill="#f8faf8"/>
          <path className="hero-terminal-lines" d="M27 35h66m-66 18h108m-108 18h82m-82 18h119" stroke="#4e8cbd" strokeWidth="5" strokeLinecap="round"/>
          <path d="m-18 137 236 0 42 55H-57z" fill="#bdc9c9" stroke="#253d50" strokeWidth="3"/><path d="M67 151h72l10 13H57z" fill="#819396"/>
        </g>
        <g transform="translate(408 338)">
          <circle cx="54" cy="40" r="32" fill="#c28a67"/><path d="M24 38c0-50 63-56 75-4l-19-12-19 9-14-10z" fill="#30475a"/>
          <path d="m11 77 86-2 45 112H0z" fill="#2876bd"/><path d="m7 104-33 82m117-86 60 58" stroke="#c28a67" strokeWidth="17" strokeLinecap="round"/>
          <path d="M-38 196h198v95H-38z" fill="#253d50"/><path d="M-25 207h172v67H-25z" fill="#f8faf8"/>
          <path className="hero-terminal-lines hero-terminal-lines--green" d="M-13 222h70m-70 17h112m-112 17h92" stroke="#54a878" strokeWidth="4" strokeLinecap="round"/>
        </g>
        <path d="M283 650h224v15H283zm-22 34h176v13H261z" fill="#f8faf8" opacity=".86"/>
        <text x="35" y="858" fill="#253d50" fontFamily="monospace" fontSize="15" letterSpacing="3">MA10 / LEARN · BUILD · SHARE</text>
      </svg>
      <svg className="iso-cluster" viewBox="0 0 390 250" role="presentation" aria-hidden="true">
        <g className="assembly-float assembly-float--coral"><g className="assembly-part assembly-part--coral"><g className="iso-block block-coral" transform="translate(26 78)"><path className="block-top" d="m0 37 62-36 62 36-62 37z"/><path className="block-left" d="M0 37v67l62 38V74z"/><path className="block-right" d="M124 37v67l-62 38V74z"/><text x="46" y="102">Py</text></g></g></g>
        <g className="assembly-float assembly-float--yellow"><g className="assembly-part assembly-part--yellow"><g className="iso-block block-yellow" transform="translate(202 18)"><path className="block-top" d="m0 37 62-36 62 36-62 37z"/><path className="block-left" d="M0 37v67l62 38V74z"/><path className="block-right" d="M124 37v67l-62 38V74z"/><text x="40" y="102">AI</text></g></g></g>
        <g className="assembly-float assembly-float--blue"><g className="assembly-part assembly-part--blue"><g className="iso-block block-blue" transform="translate(140 116)"><path className="block-top" d="m0 37 62-36 62 36-62 37z"/><path className="block-left" d="M0 37v67l62 38V74z"/><path className="block-right" d="M124 37v67l-62 38V74z"/><text x="29" y="102">DATA</text></g></g></g>
      </svg>
    </div>
    <span className="hero-orbit orbit-one"/><span className="hero-orbit orbit-two"/><span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✳</span>
  </div>;
}

function FeatureDiagram() {
  return <div className="ecosystem-art" aria-hidden="true">
    <div className="eco-grid" />
    <svg viewBox="0 0 560 430" role="presentation">
      <path className="iso-wire" d="M25 232 282 85l248 143-248 144zM25 232v-74L282 10l248 148v70M282 372v-74M25 158l257 149 248-149M282 10v75" />
      <g className="assembly-float assembly-float--coral"><g className="iso-tile tile-coral assembly-part assembly-part--coral"><path d="m145 173 78-45 79 45-78 46z"/><path d="m145 173v54l79 46v-54z"/><path d="m302 173v54l-78 46v-54z"/><path d="M182 152v53m39-75v54"/></g></g>
      <g className="assembly-float assembly-float--green"><g className="iso-tile tile-green assembly-part assembly-part--green"><path d="m57 245 72-42 72 42-72 42z"/><path d="m57 245v41l72 42v-41z"/><path d="m201 245v41l-72 42v-41z"/><circle cx="129" cy="244" r="20"/></g></g>
      <g className="assembly-float assembly-float--blue"><g className="iso-tile tile-blue assembly-part assembly-part--blue"><path d="m278 253 77-45 77 45-77 45z"/><path d="m278 253v45l77 45v-45z"/><path d="m432 253v45l-77 45v-45z"/><path d="M319 253h38m-19-21v43"/></g></g>
      <g className="assembly-float assembly-float--yellow"><g className="iso-tile tile-yellow assembly-part assembly-part--yellow"><path d="m190 325 59-35 59 35-59 35z"/><path d="m190 325v32l59 35v-32z"/><path d="m308 325v32l-59 35v-32z"/><path d="M226 325h48"/></g></g>
      <path className="data-connector" d="M282 86v39m-98 58 40-25m144 85-21 12"/>
      <circle className="iso-node assembly-pin assembly-pin--one" cx="282" cy="85" r="9"/><circle className="iso-node assembly-pin assembly-pin--two" cx="224" cy="158" r="8"/>
    </svg>
    <span className="eco-art-label">IDEA / CODE / DATA</span>
  </div>;
}

function App() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const scrollToSection = (id) => (event) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    let active = true;
    supabase.from('posts').select('id,title,slug,created_at').eq('published', true)
      .order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => { if (active) { setRecentPosts(data || []); setPostsLoaded(true); } })
      .catch(() => { if (active) setPostsLoaded(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('.home-site [data-reveal]');
    const illustrations = document.querySelectorAll('.home-site .ecosystem-art');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      illustrations.forEach((art) => art.classList.add('is-built'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add(target.matches('.ecosystem-art') ? 'is-built' : 'is-visible');
        observer.unobserve(target);
      }
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    illustrations.forEach((art) => observer.observe(art));
    return () => observer.disconnect();
  }, []);

  return <div className="site-shell home-site">
    <SiteHeader current="home" />
    <main id="top">
      <section className="home-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="hero-kicker"><i/> MEHRAN MUSHTAQ / COMPUTER SCIENCE</p>
            <h1><span>The curious</span><br/>developer’s<br/>next idea<br/><b>starts here.</b></h1>
            <p className="hero-intro">I’m a computer science student and Python developer, learning through projects and exploring data science, AI, and machine learning.</p>
            <div className="hero-actions"><a className="hero-cta" href="#projects" onClick={scrollToSection('projects')}>Explore my projects <b aria-hidden="true">→</b></a><Link className="hero-secondary" to="/blog">Visit the Blog <span aria-hidden="true">↗</span></Link></div>
          </div>
          <IsometricArt />
          <span className="hero-scroll-cue">SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <section className="home-facts" aria-label="About my work"><div className="container fact-row"><div className="fact-lead">Made by curiosity.<br/>Growing through practice.</div><div><strong>04</strong><span>FEATURED PROJECTS</span></div><div><strong>Python</strong><span>MY MAIN TOOL</span></div><div><strong>AI / ML</strong><span>MY LEARNING FOCUS</span></div></div></section>

      <section className="home-promos" aria-label="Explore my portfolio"><div className="container promo-row"><a href="#projects" onClick={scrollToSection('projects')}><span className="promo-icon">01</span><span><b>Explore the projects</b><small>Small ideas, built into useful experiments.</small></span><strong aria-hidden="true">➜</strong></a><Link to="/blog"><span className="promo-icon">02</span><span><b>Read the Blog</b><small>Notes from learning and building.</small></span><strong aria-hidden="true">➜</strong></Link></div></section>

      <section id="about" className="ecosystem-section" data-reveal>
        <div className="container">
          <header className="ecosystem-heading"><p className="section-kicker">A STUDENT BUILDING WITH CURIOSITY</p><h2>Connecting ideas<br/>to <em>useful software.</em></h2><p>Discover the tools I’m learning and the projects that help me put them to use.</p></header>
          <div className="ecosystem-body"><div className="ecosystem-copy"><p>I’m Mehran, a computer science student at the University of Kashmir. Python was my starting point; projects have become a way to learn how software, data, and AI fit together.</p><p>I’m building stronger foundations in programming and data science while exploring machine learning. Each experiment gives me another question to work on.</p><p className="ecosystem-signoff">MEHRAN MUSHTAQ / MA10</p><SocialLinks className="ecosystem-socials" /></div><FeatureDiagram /></div>
        </div>
      </section>

      <section id="skills" className="learning-section" data-reveal>
        <div className="learning-grid" aria-hidden="true"/><div className="container learning-inner">
          <header className="learning-heading"><p className="section-kicker">A PRACTICAL LEARNING PATH</p><h2>Build, learn,<br/><em>and keep going.</em></h2><p>From a first Python script to projects shaped by new questions.</p></header>
          <div className="learning-content"><p className="learning-note">I learn best by making something, finding the rough edges, and trying again. Right now, I’m strengthening my programming and data foundations while exploring AI and machine learning.</p><div className="learning-links">
            <a href="#projects" onClick={scrollToSection('projects')}><span className="learning-icon">Py</span><span><b>Python development</b><small>Build practical tools and experiments.</small></span><strong aria-hidden="true">➜</strong></a>
            <a href="#projects" onClick={scrollToSection('projects')}><span className="learning-icon">∿</span><span><b>Data science</b><small>Learn to explore data and find patterns.</small></span><strong aria-hidden="true">➜</strong></a>
            <a href="#projects" onClick={scrollToSection('projects')}><span className="learning-icon">AI</span><span><b>AI and machine learning</b><small>Build understanding through practice.</small></span><strong aria-hidden="true">➜</strong></a>
          </div></div>
        </div>
      </section>

      <section className="home-editorial" data-reveal aria-labelledby="home-blog-title">
        <div className="container home-editorial-inner"><header className="home-editorial-heading"><div><p className="section-kicker">THE BLOG / FIELD NOTES</p><h2 id="home-blog-title">Ideas in<br/><em>progress.</em></h2></div><p>Writing about programming, projects, and things I learn along the way.</p></header>
          <div className="home-editorial-body"><div className="home-article-list">
            {recentPosts.length > 0 ? recentPosts.map((post, index) => <Link className="home-article" key={post.id} to={`/blog/${post.slug}`}><span className="home-article-number">0{index + 1}</span><span><small>{new Date(post.created_at).toLocaleDateString()}</small><strong>{post.title}</strong></span><b aria-hidden="true">↗</b></Link>) : <div className="home-editorial-empty"><span>MA10 / FIELD NOTES</span><strong>{postsLoaded ? 'The notebook is ready.' : 'Opening the notebook.'}</strong><p>{postsLoaded ? 'New posts will appear here when they’re published.' : 'Recent posts are loading.'}</p></div>}
            <Link className="editorial-cta" to="/blog">Visit the Blog <span aria-hidden="true">↗</span></Link>
          </div><div className="home-notebook-art" aria-hidden="true"><div className="notebook-sheet"><span>MA10 / FIELD NOTES</span><i/><i/><i/><i/><b>IDEA → PRACTICE → LEARN</b></div><svg viewBox="0 0 280 190"><path d="M35 150 140 90l105 60-105 60zM35 150V70L140 10l105 60v80M140 90V10"/><circle cx="35" cy="70" r="7"/><circle cx="245" cy="70" r="7"/><circle cx="140" cy="160" r="7"/></svg></div></div>
        </div>
      </section>

      <section id="projects" className="projects-section" data-reveal>
        <div className="container project-editorial"><header className="section-heading"><p className="section-kicker">A FEW THINGS I’VE MADE</p><h2>Projects to<br/><em>learn by doing.</em></h2><p>Each started with a question and gave me something new to figure out.</p></header>
          <article className="project-feature"><a className="project-visual project-feature-visual" href={projects[0].href} target="_blank" rel="noreferrer" aria-label="View ReceiptPocket repository"><span className="project-number">{projects[0].number} / FEATURED PROJECT</span><ProjectArtwork type={projects[0].art}/><span className="project-art-label">LOCAL FIRST / RECEIPTS / OCR</span></a><div className="project-info"><p className="project-category">{projects[0].category}</p><h3>{projects[0].title}</h3><p>{projects[0].description}</p><div className="project-tags">{projects[0].tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href={projects[0].href} target="_blank" rel="noreferrer" className="project-link"><BrandIcon name="github"/> View repository <b aria-hidden="true">↗</b></a></div></article>
          <div className="project-grid">{projects.slice(1).map((project, index) => <article className={`project-card project-card-${index + 1}`} key={project.title}><div className="project-visual"><span className="project-number">{project.number}</span><ProjectArtwork type={project.art}/></div><div className="project-info"><p className="project-category">{project.category}</p><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href={project.href} target="_blank" rel="noreferrer" className="project-link"><BrandIcon name="github"/> View repository <b aria-hidden="true">↗</b></a></div></article>)}</div>
        </div>
      </section>

      <section className="home-end-cta" data-reveal><div className="container end-cta-inner"><p className="section-kicker">MEHRAN MUSHTAQ / MA10</p><h2>Learn by building.<br/><em>Share what you find.</em></h2><p>Explore the projects, read the Blog, or get in touch.</p><a className="hero-cta" href="#contact" onClick={scrollToSection('contact')}>Say hello <b aria-hidden="true">→</b></a></div><svg className="end-cta-art" viewBox="0 0 250 180" aria-hidden="true"><path d="m20 125 95-55 115 65-95 55zM20 125V45l95-40 115 40v90M115 70V5"/><circle cx="20" cy="45" r="7"/><circle cx="230" cy="45" r="7"/><circle cx="135" cy="151" r="7"/></svg></section>

      <section id="contact" className="home-closing"><div className="container closing-layout"><div><p className="section-kicker">LET’S KEEP IN TOUCH</p><h2>Stay curious.</h2><p className="closing-intro">I’m a student, developer, and lifelong learner. I’d be glad to hear from you.</p></div><div className="closing-side"><a className="closing-email" href="mailto:mehranmushtaq599@gmail.com"><BrandIcon name="email"/> mehranmushtaq599@gmail.com <span aria-hidden="true">↗</span></a><SocialLinks className="closing-socials"/></div></div></section>
    </main>
      <footer className="home-footer"><div className="container footer-layout"><div className="footer-brand"><Link className="site-wordmark" to="/" aria-label="MA10 home"><strong>MA10</strong></Link><p>Mehran Mushtaq<br/>Computer science student<br/>Learning, building, writing.</p></div><div className="footer-column"><b>EXPLORE</b><a href="#about" onClick={scrollToSection('about')}>About</a><a href="#skills" onClick={scrollToSection('skills')}>Learning</a><a href="#projects" onClick={scrollToSection('projects')}>Projects</a><Link to="/blog">Blog</Link></div><div className="footer-column"><b>PROJECTS</b>{projects.map((project) => <a key={project.title} href={project.href} target="_blank" rel="noreferrer">{project.title}</a>)}</div><div className="footer-column"><b>CONNECT</b><SocialLinks className="footer-socials"/></div><div className="footer-legal"><span>© {new Date().getFullYear()} Mehran Mushtaq</span><Link className="admin-footer-link" to="/admin">Admin</Link></div></div></footer>
  </div>;
}

export default App;
