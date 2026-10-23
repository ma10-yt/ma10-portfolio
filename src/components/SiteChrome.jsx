import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandIcon, SocialLinks } from './SocialLinks';

const homeSections = [
  ['About', 'about'],
  ['Work', 'projects'],
  ['Skills', 'skills'],
  ['Contact', 'contact'],
];

export function SiteHeader({ current = 'blog' }) {
  const isHome = current === 'home';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const scrollTo = (event, id) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    setMenuOpen(false);
  };

  return (
    <header className={`site-header container ${isHome ? 'home-nav' : 'editorial-header'}`}>
      <Link className="site-wordmark" to="/" aria-label="MA10 home">
        <strong>MA10</strong>
      </Link>
      <button
        className="site-menu-toggle"
        ref={menuButton}
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
        <span className="menu-toggle-icon" aria-hidden="true"><i /><i /></span>
      </button>
      <nav id="site-navigation" className={`${isHome ? 'home-navigation' : 'editorial-navigation'}${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
        {isHome ? homeSections.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={(event) => scrollTo(event, id)}>{label}</a>
        )) : <Link to="/">Home</Link>}
        <Link to="/blog" aria-current={current === 'blog' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>Blog</Link>
        {isHome ? (
          <a className="nav-github" href="https://github.com/ma10-yt" target="_blank" rel="noreferrer" aria-label="GitHub profile"><BrandIcon name="github" /></a>
        ) : (
          <a className="editorial-contact-link" href="mailto:mehranmushtaq599@gmail.com"><BrandIcon name="email" /><span>Say hello</span></a>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="editorial-footer">
      <div className="container editorial-footer-inner">
        <div className="editorial-footer-note"><Link className="site-wordmark" to="/" aria-label="MA10 home"><strong>MA10</strong></Link><p>Mehran Mushtaq<br />Learning, building, writing.</p></div>
        <Link className="editorial-footer-blog" to="/blog">Blog</Link>
        <SocialLinks className="editorial-socials" />
        <Link className="editorial-admin-link" to="/admin">Admin <span aria-hidden="true">↗</span></Link>
      </div>
    </footer>
  );
}

