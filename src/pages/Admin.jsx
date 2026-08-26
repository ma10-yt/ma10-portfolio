import React, {
  useEffect,
  useState,
} from 'react';

import { supabase } from '../supabase';

import { Turnstile } from '@marsidev/react-turnstile';

import RichTextEditor from '../components/RichTextEditor';

const ADMIN_EMAIL =
  'mehranmushtaq599@gmail.com';

function Admin() {
  /* ==================================================
     AUTH
  ================================================== */

  const [session, setSession] =
    useState(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [authError, setAuthError] =
    useState('');

  const [loggingIn, setLoggingIn] =
    useState(false);

  const [captchaToken, setCaptchaToken] =
    useState(null);

  const [captchaError, setCaptchaError] =
    useState('');

  /* ==================================================
     POSTS
  ================================================== */

  const [posts, setPosts] =
    useState([]);

  const [loadingPosts, setLoadingPosts] =
    useState(false);

  const [title, setTitle] =
    useState('');

  const [slug, setSlug] =
    useState('');

  const [content, setContent] =
    useState('');

  const [published, setPublished] =
    useState(true);

  const [savingPost, setSavingPost] =
    useState(false);

  const [postMessage, setPostMessage] =
    useState('');

  const [editingPostId, setEditingPostId] =
    useState(null);

  /* ==================================================
     COMMENTS
  ================================================== */

  const [comments, setComments] =
    useState([]);

  const [loadingComments, setLoadingComments] =
    useState(false);

  const [commentMessage, setCommentMessage] =
    useState('');

  /*
   * This controls the initial dashboard loading
   * screen so we never briefly show 0 posts / 0 comments.
   */
  const [loadingDashboard, setLoadingDashboard] =
    useState(true);

  /* ==================================================
     AUTH SESSION
  ================================================== */

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          'Unable to get session:',
          error
        );
      }

      setSession(
        data.session
      );

      setCheckingAuth(false);
    };

    loadSession();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          newSession
        ) => {
          if (!mounted) {
            return;
          }

          setSession(
            newSession
          );
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* ==================================================
     LOAD ADMIN DATA
  ================================================== */

  useEffect(() => {
    if (!session) {
      setLoadingDashboard(false);
      return;
    }

    let cancelled = false;

    const loadAdminDashboard =
      async () => {
        setLoadingDashboard(true);

        /*
         * Load both datasets in parallel.
         * The dashboard remains in its loading state
         * until both requests have completed.
         */
        await Promise.all([
          loadPosts(),
          loadComments(),
        ]);

        if (!cancelled) {
          setLoadingDashboard(false);
        }
      };

    loadAdminDashboard();

    return () => {
      cancelled = true;
    };
  }, [session]);

  /* ==================================================
     LOAD POSTS
  ================================================== */

  const loadPosts = async () => {
    setLoadingPosts(true);

    const {
      data,
      error,
    } =
      await supabase
        .from('posts')
        .select(
          'id, title, slug, content, published, created_at, updated_at'
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        );

    if (error) {
      console.error(
        'Unable to load posts:',
        error
      );

      setPostMessage(
        error.message ||
          'Could not load your posts.'
      );

      setLoadingPosts(false);

      return;
    }

    setPosts(
      data || []
    );

    setLoadingPosts(false);
  };

  /* ==================================================
     LOAD COMMENTS
  ================================================== */

  const loadComments = async () => {
    setLoadingComments(true);
    setCommentMessage('');

    const {
      data,
      error,
    } =
      await supabase.rpc(
        'admin_get_comments'
      );

    if (error) {
      console.error(
        'Unable to load admin comments:',
        error
      );

      setCommentMessage(
        error.message ||
          'Could not load comments.'
      );

      setLoadingComments(false);

      return;
    }

    /*
     * Supabase normally returns a boolean here.
     * This also safely handles "true"/"false"
     * if the returned value is ever stringified.
     */
    setComments(
      (data || []).map(
        (comment) => ({
          ...comment,
          approved:
            comment.approved === true ||
            comment.approved ===
              'true',
        })
      )
    );

    setLoadingComments(false);
  };

  /* ==================================================
     LOGIN
  ================================================== */

  const handleLogin = async (
    event
  ) => {
    event.preventDefault();

    setAuthError('');
    setCaptchaError('');

    if (!captchaToken) {
      setCaptchaError(
        'Please complete the CAPTCHA first.'
      );

      return;
    }

    setLoggingIn(true);

    const {
      data,
      error,
    } =
      await supabase.auth
        .signInWithPassword({
          email,
          password,
          options: {
            captchaToken,
          },
        });

    if (error) {
      console.error(
        'Admin login failed:',
        error
      );

      setAuthError(
        error.message
      );

      setLoggingIn(false);

      return;
    }

    if (
      data.user?.email !==
      ADMIN_EMAIL
    ) {
      await supabase.auth.signOut(
        {
          scope: 'local',
        }
      );

      setAuthError(
        'This account is not authorized to access the admin area.'
      );

      setLoggingIn(false);

      return;
    }

    /*
     * Start a fresh dashboard load after login.
     */
    setLoadingDashboard(true);
    setLoggingIn(false);
  };

  /* ==================================================
     LOGOUT
  ================================================== */

  const handleLogout = async () => {
    await supabase.auth.signOut({
      scope: 'local',
    });

    setPosts([]);
    setComments([]);

    setEditingPostId(null);

    setLoadingDashboard(true);

    resetEditor();
  };

  /* ==================================================
     SLUG
  ================================================== */

  const createSlug = (
    value
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ''
      )
      .replace(
        /\s+/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      );
  };

  const handleTitleChange = (
    value
  ) => {
    setTitle(value);

    if (!editingPostId) {
      setSlug(
        createSlug(value)
      );
    }
  };

  /* ==================================================
     RESET EDITOR
  ================================================== */

  const resetEditor = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setPublished(true);

    setEditingPostId(
      null
    );

    setPostMessage('');
  };

  /* ==================================================
     SAVE POST
  ================================================== */

  const handleSavePost =
    async (event) => {
      event.preventDefault();

      setSavingPost(true);
      setPostMessage('');

      if (!title.trim()) {
        setPostMessage(
          'Please enter a title.'
        );

        setSavingPost(false);

        return;
      }

      if (!slug.trim()) {
        setPostMessage(
          'Please enter a slug.'
        );

        setSavingPost(false);

        return;
      }

      if (!content.trim()) {
        setPostMessage(
          'Please write some content.'
        );

        setSavingPost(false);

        return;
      }

      const payload = {
        title:
          title.trim(),

        slug:
          slug.trim(),

        content:
          content.trim(),

        published,
      };

      let result;

      if (
        editingPostId
      ) {
        result =
          await supabase
            .from('posts')
            .update(
              payload
            )
            .eq(
              'id',
              editingPostId
            );
      } else {
        result =
          await supabase
            .from('posts')
            .insert({
              ...payload,

              author_id:
                session.user.id,
            });
      }

      if (result.error) {
        console.error(
          result.error
        );

        if (
          result.error.code ===
          '23505'
        ) {
          setPostMessage(
            'That slug is already being used.'
          );
        } else {
          setPostMessage(
            result.error.message ||
              'Something went wrong while saving the post.'
          );
        }

        setSavingPost(false);

        return;
      }

      setPostMessage(
        editingPostId
          ? 'Post updated successfully.'
          : 'Post created successfully.'
      );

      resetEditor();

      await loadPosts();

      setSavingPost(false);
    };

  /* ==================================================
     EDIT POST
  ================================================== */

  const handleEdit = (
    post
  ) => {
    setEditingPostId(
      post.id
    );

    setTitle(
      post.title
    );

    setSlug(
      post.slug
    );

    setContent(
      post.content
    );

    setPublished(
      post.published
    );

    window.scrollTo({
      top: 0,
      behavior:
        'smooth',
    });
  };

  /* ==================================================
     DELETE POST
  ================================================== */

  const handleDelete = async (
    postId
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this post?'
      );

    if (!confirmed) {
      return;
    }

    const {
      error,
    } =
      await supabase
        .from('posts')
        .delete()
        .eq(
          'id',
          postId
        );

    if (error) {
      console.error(error);

      setPostMessage(
        'Could not delete the post.'
      );

      return;
    }

    if (
      editingPostId ===
      postId
    ) {
      resetEditor();
    }

    setPostMessage(
      'Post deleted successfully.'
    );

    await Promise.all([
      loadPosts(),
      loadComments(),
    ]);
  };

  /* ==================================================
     APPROVE COMMENT
  ================================================== */

  const handleApproveComment =
    async (
      commentId
    ) => {
      setCommentMessage('');

      const {
        error,
      } =
        await supabase.rpc(
          'admin_set_comment_approval',
          {
            comment_id:
              commentId,

            approval_state:
              true,
          }
        );

      if (error) {
        console.error(
          'Unable to approve comment:',
          error
        );

        setCommentMessage(
          error.message ||
            'Unable to approve this comment.'
        );

        return;
      }

      setCommentMessage(
        'Comment approved.'
      );

      await loadComments();
    };

  /* ==================================================
     DELETE COMMENT
  ================================================== */

  const handleDeleteComment =
    async (
      commentId
    ) => {
      const confirmed =
        window.confirm(
          'Delete this comment? Replies to it will also be removed.'
        );

      if (!confirmed) {
        return;
      }

      const {
        error,
      } =
        await supabase.rpc(
          'admin_delete_comment',
          {
            comment_id:
              commentId,
          }
        );

      if (error) {
        console.error(
          'Unable to delete comment:',
          error
        );

        setCommentMessage(
          error.message ||
            'Unable to delete this comment.'
        );

        return;
      }

      setCommentMessage(
        'Comment deleted.'
      );

      await loadComments();
    };

  /* ==================================================
     COMMENT HELPERS
  ================================================== */

  const getPostTitle = (
    postId
  ) => {
    const found =
      posts.find(
        (post) =>
          post.id ===
          postId
      );

    return (
      found?.title ||
      'Unknown post'
    );
  };

  const formatCommentDate = (
    date
  ) => {
    return new Date(
      date
    ).toLocaleString(
      'en-US',
      {
        year:
          'numeric',

        month:
          'short',

        day:
          'numeric',

        hour:
          'numeric',

        minute:
          '2-digit',
      }
    );
  };

  const getReplies = (
    commentId
  ) => {
    return comments.filter(
      (comment) =>
        comment.parent_id ===
        commentId
    );
  };

  const renderComment = (
    comment,
    depth = 0
  ) => {
    const replies =
      getReplies(
        comment.id
      );

    return (
      <div
        className={`admin-comment ${
          depth > 0
            ? 'admin-comment-reply'
            : ''
        }`}
        key={
          comment.id
        }
      >
        <div className="admin-comment-header">
          <div>
            <strong>
              {
                comment.display_name
              }
            </strong>

            <span>
              {formatCommentDate(
                comment.created_at
              )}
            </span>
          </div>

          <span
            className={`admin-comment-status ${
              comment.approved
                ? 'approved'
                : 'pending'
            }`}
          >
            {comment.approved
              ? 'Approved'
              : 'Pending'}
          </span>
        </div>

        <p className="admin-comment-content">
          {
            comment.content
          }
        </p>

        <div className="admin-comment-post">
          {getPostTitle(
            comment.post_id
          )}
        </div>

        <div className="admin-comment-actions">
          {!comment.approved && (
            <button
              type="button"
              className="approve-comment"
              onClick={() =>
                handleApproveComment(
                  comment.id
                )
              }
            >
              Approve
            </button>
          )}

          <button
            type="button"
            className="delete-comment"
            onClick={() =>
              handleDeleteComment(
                comment.id
              )
            }
          >
            Delete
          </button>
        </div>

        {replies.length >
          0 && (
          <div className="admin-comment-replies">
            {replies.map(
              (reply) =>
                renderComment(
                  reply,
                  depth + 1
                )
            )}
          </div>
        )}
      </div>
    );
  };

  const pendingComments =
    comments.filter(
      (comment) =>
        comment.approved !==
        true
    );

  const approvedComments =
    comments.filter(
      (comment) =>
        comment.approved ===
        true
    );

  /* ==================================================
     AUTH LOADING
  ================================================== */

  if (checkingAuth) {
    return (
      <div className="admin-loading">
        Checking authentication...
      </div>
    );
  }

  /* ==================================================
     LOGIN
  ================================================== */

  if (!session) {
    return (
      <div className="site-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="grid-overlay" />
        <div className="noise-overlay" />

        <main className="admin-auth-page">
          <div className="admin-auth-card">
            <div className="admin-small-label">
              MA10 / ADMIN
            </div>

            <h1>
              Welcome back.
              <span>
                Admin access.
              </span>
            </h1>

            <p className="admin-auth-description">
              Sign in to create, edit, and manage
              your blog and comments.
            </p>

            <form
              className="admin-form"
              onSubmit={
                handleLogin
              }
            >
              <label>
                Email

                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Password

                <input
                  type="password"
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </label>

              {authError && (
                <p className="admin-error">
                  {
                    authError
                  }
                </p>
              )}

              <div className="admin-captcha">
                <Turnstile
                  siteKey={
                    import.meta.env
                      .VITE_TURNSTILE_SITE_KEY
                  }
                  onSuccess={(
                    token
                  ) => {
                    setCaptchaError('');
                    setCaptchaToken(
                      token
                    );
                  }}
                  onError={() => {
                    setCaptchaToken(
                      null
                    );

                    setCaptchaError(
                      'CAPTCHA verification failed. Please try again.'
                    );
                  }}
                  onExpire={() => {
                    setCaptchaToken(
                      null
                    );
                  }}
                />

                {captchaError && (
                  <p className="admin-error">
                    {
                      captchaError
                    }
                  </p>
                )}
              </div>

              <button
                className="admin-primary-button"
                type="submit"
                disabled={
                  loggingIn ||
                  !captchaToken
                }
              >
                {loggingIn
                  ? 'Signing in...'
                  : 'Sign in'}
              </button>
            </form>

            <a
              className="admin-back-link"
              href="#/"
            >
              ← Back to portfolio
            </a>
          </div>
        </main>
      </div>
    );
  }

  /* ==================================================
     DASHBOARD INITIAL LOADING
  ================================================== */

  if (loadingDashboard) {
    return (
      <div className="site-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        <div className="grid-overlay" />
        <div className="noise-overlay" />

        <main className="admin-dashboard-loading">
          <div className="admin-dashboard-loading-inner">
            <div className="admin-loading-mark">
              MA10
            </div>

            <p>
              Loading your dashboard...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* ==================================================
     DASHBOARD
  ================================================== */

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="grid-overlay" />
      <div className="noise-overlay" />

      <header className="nav container admin-nav">
        <a
          className="brand"
          href="#/"
        >
          <span className="brand-mark">
            MA
          </span>

          <span>
            10
          </span>
        </a>

        <div className="admin-nav-right">
          <span className="admin-nav-email">
            {
              session.user.email
            }
          </span>

          <button
            className="admin-logout-button"
            type="button"
            onClick={
              handleLogout
            }
          >
            Log out
          </button>
        </div>
      </header>

      <main className="section container admin-page">

        {/* HEADING */}

        <div className="admin-heading">
          <div className="section-label">
            ADMIN / CONTROL
          </div>

          <h1>
            Write something.
            <span>
              Your space, your rules.
            </span>
          </h1>

          <p>
            Create posts and manage conversations
            on your blog.
          </p>
        </div>

        {/* POST EDITOR */}

        <div className="admin-layout">

          <section className="admin-editor-card">
            <div className="admin-card-header">
              <span>
                {editingPostId
                  ? 'EDIT POST'
                  : 'NEW POST'}
              </span>

              {editingPostId && (
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={
                    resetEditor
                  }
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form
              className="admin-editor-form"
              onSubmit={
                handleSavePost
              }
            >
              <label>
                Title

                <input
                  type="text"
                  value={
                    title
                  }
                  onChange={(
                    event
                  ) =>
                    handleTitleChange(
                      event.target
                        .value
                    )
                  }
                  placeholder="My first blog post"
                  required
                />
              </label>

              <label>
                Slug

                <input
                  type="text"
                  value={
                    slug
                  }
                  onChange={(
                    event
                  ) =>
                    setSlug(
                      createSlug(
                        event.target
                          .value
                      )
                    )
                  }
                  placeholder="my-first-blog-post"
                  required
                />

                <small>
                  This becomes the article URL.
                </small>
              </label>

              <div className="admin-editor-field">
  <div className="admin-editor-field-label">
    Content
  </div>

  <RichTextEditor
    value={content}
    onChange={setContent}
  />
</div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={
                    published
                  }
                  onChange={(
                    event
                  ) =>
                    setPublished(
                      event.target
                        .checked
                    )
                  }
                />

                <span>
                  Publish immediately
                </span>
              </label>

              {postMessage && (
                <p className="admin-message">
                  {
                    postMessage
                  }
                </p>
              )}

              <button
                className="admin-primary-button"
                type="submit"
                disabled={
                  savingPost
                }
              >
                {savingPost
                  ? 'Saving...'
                  : editingPostId
                    ? 'Update post'
                    : 'Publish post'}
              </button>
            </form>
          </section>

          {/* POSTS */}

          <aside className="admin-posts-card">
            <div className="admin-card-header">
              <span>
                YOUR POSTS
              </span>

              <span className="admin-post-count">
                {
                  posts.length
                }
              </span>
            </div>

            {loadingPosts && (
              <div className="admin-empty-state">
                Loading posts...
              </div>
            )}

            {!loadingPosts &&
              posts.length ===
                0 && (
                <div className="admin-empty-state">
                  <strong>
                    No posts yet.
                  </strong>

                  <p>
                    Your first post will appear here.
                  </p>
                </div>
              )}

            {!loadingPosts &&
              posts.length >
                0 && (
                <div className="admin-post-list">
                  {posts.map(
                    (post) => (
                      <article
                        className="admin-post-row"
                        key={
                          post.id
                        }
                      >
                        <div>
                          <h3>
                            {
                              post.title
                            }
                          </h3>

                          <div className="admin-post-meta">
                            <span>
                              {post.published
                                ? 'Published'
                                : 'Draft'}
                            </span>

                            <span>
                              ·
                            </span>

                            <span>
                              {new Date(
                                post.created_at
                              ).toLocaleDateString(
                                'en-US',
                                {
                                  year:
                                    'numeric',
                                  month:
                                    'short',
                                  day:
                                    'numeric',
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="admin-post-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                post
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              handleDelete(
                                post.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
          </aside>
        </div>

        {/* COMMENTS */}

        <section className="admin-comments-section">

          <div className="admin-comments-heading">
            <div>
              <div className="section-label">
                COMMENTS
              </div>

              <h2>
                Manage the conversation.
              </h2>

              <p>
                Approve first-time commenters, remove
                spam, and keep discussions clean.
              </p>
            </div>

            <div className="admin-comment-counts">
              <div>
                <strong>
                  {
                    pendingComments.length
                  }
                </strong>

                <span>
                  Pending
                </span>
              </div>

              <div>
                <strong>
                  {
                    approvedComments.length
                  }
                </strong>

                <span>
                  Approved
                </span>
              </div>
            </div>
          </div>

          {commentMessage && (
            <div className="admin-comment-message">
              {
                commentMessage
              }
            </div>
          )}

          {/* PENDING */}

          <div className="admin-comments-group">
            <div className="admin-comments-group-title">
              PENDING
            </div>

            {loadingComments && (
              <div className="admin-empty-state">
                Loading comments...
              </div>
            )}

            {!loadingComments &&
              pendingComments.length ===
                0 && (
                <div className="admin-empty-state">
                  <strong>
                    Nothing waiting.
                  </strong>

                  <p>
                    New first-time comments will appear
                    here.
                  </p>
                </div>
              )}

            {!loadingComments &&
              pendingComments.length >
                0 && (
                <div className="admin-comment-list">
                  {pendingComments
                    .filter(
                        (comment) =>
                            !comment.parent_id
                    )
                    .map(
                        (comment) =>
                            renderComment(
                                comment
                        )
  )}
                </div>
              )}
          </div>

          {/* APPROVED */}

          <div className="admin-comments-group">
            <div className="admin-comments-group-title">
              APPROVED
            </div>

            {!loadingComments &&
              approvedComments.length ===
                0 && (
                <div className="admin-empty-state">
                  <strong>
                    No approved comments yet.
                  </strong>

                  <p>
                    Approved conversations will appear
                    here.
                  </p>
                </div>
              )}

            {!loadingComments &&
              approvedComments.length >
                0 && (
                <div className="admin-comment-list">
                  {approvedComments
  .filter(
    (comment) =>
      !comment.parent_id
  )
  .map(
    (comment) =>
      renderComment(
        comment
      )
  )}
                </div>
              )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;