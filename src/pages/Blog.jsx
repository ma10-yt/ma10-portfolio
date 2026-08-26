import React, {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import { supabase } from '../supabase';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      const {
        data,
        error,
      } = await supabase
        .from('posts')
        .select(
          'id, title, slug, content, created_at, updated_at'
        )
        .eq('published', true)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.error(
          'Unable to load posts:',
          error
        );

        setError(
          'Unable to load blog posts right now.'
        );

        setLoading(false);

        return;
      }

      setPosts(data || []);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    );
  };

  const getExcerpt = (content) => {
  const temporaryElement =
    document.createElement('div');

  temporaryElement.innerHTML = content;

  const cleaned =
    temporaryElement.textContent
      .replace(/\s+/g, ' ')
      .trim();

  if (cleaned.length <= 220) {
    return cleaned;
  }

  return `${cleaned.slice(0, 220)}...`;
};

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="grid-overlay" />
      <div className="noise-overlay" />

      <header className="nav container">
        <Link
          className="brand"
          to="/"
          aria-label="MA10 home"
        >
          <span className="brand-mark">
            MA
          </span>
          <span>10</span>
        </Link>

        <nav
          className="nav-links"
          aria-label="Blog navigation"
        >
          <Link to="/">
            Home
          </Link>

          <Link to="/blog">
            Blog
          </Link>
        </nav>
      </header>

      <main id="top">
        <section className="section container blog-page">
          <div className="blog-heading">
            <div className="section-label">
              BLOG
            </div>

            <h1>
              Thoughts, experiments
              <span>
                & things I'm learning.
              </span>
            </h1>

            <p>
              A place where I write about programming,
              projects, AI/ML, things I've learned,
              and whatever interesting idea I'm
              exploring.
            </p>
          </div>

          {loading && (
            <div className="blog-status">
              Loading posts...
            </div>
          )}

          {!loading && error && (
            <div className="blog-status blog-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            posts.length === 0 && (
              <div className="blog-empty">
                <div className="blog-empty-number">
                  001
                </div>

                <h2>
                  No posts yet.
                </h2>

                <p>
                  I'm still preparing the first one.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            posts.length > 0 && (
              <div className="blog-list">
                {posts.map((post) => (
                  <article
                    className="blog-card"
                    key={post.id}
                  >
                    <div className="blog-card-date">
                      {formatDateTime(
                        post.created_at
                      )}
                    </div>

                    <div>
                      <h2>
                        {post.title}
                      </h2>

                      <p>
                        {getExcerpt(
                          post.content
                        )}
                      </p>

                      <Link
                        className="blog-read"
                        to={`/blog/${post.slug}`}
                      >
                        Read article
                        <span>↗</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>

      <footer className="footer container">
        <span>
          © 2026 Mehran Mushtaq / MA10
        </span>

        <div className="footer-right">
          <span>
            Built while learning.
          </span>

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

export default Blog;