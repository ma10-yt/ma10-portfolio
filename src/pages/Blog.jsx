import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteFooter, SiteHeader } from '../components/SiteChrome';
import { supabase } from '../supabase';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      const { data, error: queryError } = await supabase
        .from('posts')
        .select('id, title, slug, content, created_at, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Unable to load posts:', queryError);
        setError('Unable to load blog posts right now. Please try again later.');
        setLoading(false);
        return;
      }

      setPosts(data || []);
      setLoading(false);
    };
    loadPosts();
  }, []);

  const formatDateTime = (date) => new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const getExcerpt = (content) => {
    const temporaryElement = document.createElement('div');
    temporaryElement.innerHTML = content;
    const cleaned = temporaryElement.textContent.replace(/\s+/g, ' ').trim();
    return cleaned.length <= 220 ? cleaned : `${cleaned.slice(0, 220)}...`;
  };

  return (
    <div className="site-shell editorial-site">
      <SiteHeader current="blog" />
      <main id="top" className="editorial-blog-main">
        <section className="container editorial-blog-hero">
          <div className="editorial-eyebrow"><span>MA10 / BLOG</span><i /></div>
          <div className="editorial-blog-hero-layout">
            <div>
              <p className="editorial-overline">A NOTEBOOK FROM THE BUILD</p>
              <h1>Thinking<br />in <span>progress.</span></h1>
            </div>
            <div className="editorial-blog-intro">
              <p>Notes on programming, projects, AI/ML, and the things I learn by trying to make them work.</p>
              <span className="editorial-hero-mark" aria-hidden="true">BLOG / 01</span>
            </div>
          </div>
          <div className="editorial-hero-bottom"><span>MEHRAN MUSHTAQ</span><span>STUDENT · DEVELOPER · ALWAYS LEARNING</span><span>SCROLL TO READ ↓</span></div>
        </section>

        <section className="container editorial-posts-section" aria-labelledby="latest-writing-title">
          <div className="editorial-list-heading"><div><span className="editorial-section-no">01 / THE NOTEBOOK</span><h2 id="latest-writing-title">Latest blog posts</h2></div><span className="editorial-list-rule" /></div>

          {loading && <div className="editorial-state editorial-loading" role="status"><span className="state-spinner" /><div><strong>Finding the latest notes.</strong><p>Loading articles from the notebook...</p></div></div>}
          {!loading && error && <div className="editorial-state editorial-error" role="alert"><span className="state-symbol">!</span><div><strong>Could not load the notebook.</strong><p>{error}</p></div></div>}
          {!loading && !error && posts.length === 0 && <div className="editorial-state editorial-empty"><span className="empty-index">00</span><div><span className="editorial-section-no">THE FIRST PAGE IS STILL AHEAD</span><h3>No posts yet.</h3><p>When there is something worth sharing, it will show up here.</p></div><span className="empty-spark" aria-hidden="true">✳</span></div>}

          {!loading && !error && posts.length > 0 && <div className="editorial-post-list">
            {posts.map((post, index) => (
              <article className={`editorial-post-card post-accent-${index % 3}`} key={post.id}>
                <div className="post-card-art" aria-hidden="true"><span className="post-art-index">{String(index + 1).padStart(2, '0')}</span><span className="post-art-sun" /><span className="post-art-line" /></div>
                <div className="post-card-content">
                  <div className="post-card-meta"><time dateTime={post.created_at}>{formatDateTime(post.created_at)}</time><span>FIELD NOTE / {String(index + 1).padStart(2, '0')}</span></div>
                  <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{getExcerpt(post.content)}</p>
                  <Link className="editorial-read-link" to={`/blog/${post.slug}`}>Read article <span aria-hidden="true">↗</span></Link>
                </div>
                <span className="post-card-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default Blog;
