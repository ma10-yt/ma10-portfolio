import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import {
  supabase,
  getAnonymousSession,
} from '../supabase';

import {
  Turnstile,
} from '@marsidev/react-turnstile';

const reactionTypes = [
  {
    type: 'like',
    label: '👍',
  },
  {
    type: 'love',
    label: '❤️',
  },
  {
    type: 'laugh',
    label: '😂',
  },
  {
    type: 'fire',
    label: '🔥',
  },
];

function BlogPost() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    laugh: 0,
    fire: 0,
  });

  const [myReaction, setMyReaction] = useState(null);

  const [comments, setComments] = useState([]);

  const [session, setSession] = useState(null);

  const [displayName, setDisplayName] = useState('');

  const [nameEditing, setNameEditing] = useState(false);

  const [newName, setNewName] = useState('');

  const [commentText, setCommentText] = useState('');

  const [replyTo, setReplyTo] = useState(null);

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [nameLoading, setNameLoading] =
    useState(false);

  const [commentMessage, setCommentMessage] =
    useState('');

  const [nameMessage, setNameMessage] =
    useState('');

    const [
  captchaToken,
  setCaptchaToken,
] = useState(null);

const [
  captchaError,
  setCaptchaError,
] = useState('');

  /*
   * ================================================
   * LOAD POST
   * ================================================
   */

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from('posts')
        .select(
          'id, title, slug, content, created_at, updated_at'
        )
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error || !data) {
        console.error(error);

        setNotFound(true);
        setLoading(false);

        return;
      }

      setPost(data);
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  /*
   * ================================================
   * ANONYMOUS VISITOR
   * ================================================
   */

  useEffect(() => {
  if (!captchaToken) {
    return;
  }

  const setupVisitor = async () => {
    try {
      const visitorSession =
        await getAnonymousSession(
          captchaToken
        );

      if (!visitorSession) {
        return;
      }

      setSession(visitorSession);

      const {
        data,
        error,
      } = await supabase
        .from('visitor_profiles')
        .select('display_name')
        .eq(
          'id',
          visitorSession.user.id
        )
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data?.display_name) {
        setDisplayName(
          data.display_name
        );
      }
    } catch (error) {
      console.error(
        'Anonymous visitor setup failed:',
        error
      );

      setCaptchaError(
        error.message ||
          'CAPTCHA verification failed.'
      );
    }
  };

  setupVisitor();
}, [captchaToken]);

  /*
   * ================================================
   * LOAD COMMENTS / REACTIONS
   * ================================================
   */

  useEffect(() => {
    if (!post || !session) {
      return;
    }

    loadReactions();
    loadComments();
  }, [post, session]);

  /*
   * ================================================
   * REACTIONS
   * ================================================
   */

  const loadReactions = async () => {
    if (!post || !session) {
      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from('reactions')
      .select(
        'reaction_type, user_id'
      )
      .eq(
        'post_id',
        post.id
      );

    if (error) {
      console.error(error);
      return;
    }

    const counts = {
      like: 0,
      love: 0,
      laugh: 0,
      fire: 0,
    };

    let currentReaction = null;

    data.forEach((reaction) => {
      counts[
        reaction.reaction_type
      ] += 1;

      if (
        reaction.user_id ===
        session.user.id
      ) {
        currentReaction =
          reaction.reaction_type;
      }
    });

    setReactions(counts);
    setMyReaction(currentReaction);
  };

  const handleReaction = async (
    reactionType
  ) => {
    if (!post || !session) {
      return;
    }

    /*
     * Clicking the currently selected
     * reaction removes it.
     */
    if (
      myReaction ===
      reactionType
    ) {
      const {
        error,
      } = await supabase
        .from('reactions')
        .delete()
        .eq(
          'post_id',
          post.id
        )
        .eq(
          'user_id',
          session.user.id
        );

      if (error) {
        console.error(error);
        return;
      }

      await loadReactions();
      return;
    }

    /*
     * Remove any previous reaction.
     */
    const {
      error: deleteError,
    } = await supabase
      .from('reactions')
      .delete()
      .eq(
        'post_id',
        post.id
      )
      .eq(
        'user_id',
        session.user.id
      );

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    /*
     * Add the new reaction.
     */
    const {
      error,
    } = await supabase
      .from('reactions')
      .insert({
        post_id: post.id,
        user_id:
          session.user.id,
        reaction_type:
          reactionType,
      });

    if (error) {
      console.error(error);
      return;
    }

    await loadReactions();
  };

  /*
   * ================================================
   * COMMENTS
   * ================================================
   */

  const loadComments = async () => {
    if (!post) {
      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from('comments')
      .select(
  'id, parent_id, display_name, content, created_at, is_author'
)
      .eq(
        'post_id',
        post.id
      )
      .eq(
        'approved',
        true
      )
      .order(
        'created_at',
        {
          ascending: true,
        }
      );

    if (error) {
      console.error(error);
      return;
    }

    setComments(
      data || []
    );
  };

  /*
   * ================================================
   * SET INITIAL NAME
   * ================================================
   */

  const ensureDisplayName =
    async () => {
      if (
        !session ||
        displayName.trim()
      ) {
        return displayName.trim();
      }

      const {
        data,
        error,
      } = await supabase.rpc(
        'set_initial_display_name',
        {
          requested_name:
            newName.trim(),
        }
      );

      if (error) {
        console.error(error);

        return null;
      }

      setDisplayName(data);

      return data;
    };

  /*
   * ================================================
   * CHANGE NAME GLOBALLY
   * ================================================
   */

  const handleChangeName =
    async () => {
      if (!session) {
        return;
      }

      const cleanName =
        newName.trim();

      if (!cleanName) {
        setNameMessage(
          'Please enter a name.'
        );

        return;
      }

      if (
        cleanName.length >
        40
      ) {
        setNameMessage(
          'Name must be 40 characters or less.'
        );

        return;
      }

      setNameLoading(true);
      setNameMessage('');

      const {
        data,
        error,
      } = await supabase.rpc(
        'change_display_name',
        {
          new_name:
            cleanName,
        }
      );

      if (error) {
        console.error(error);

        setNameMessage(
          error.message ||
            'Unable to change your name.'
        );

        setNameLoading(false);

        return;
      }

      setDisplayName(data);
      setNewName('');
      setNameEditing(false);

      setNameMessage(
        'Your name has been updated everywhere.'
      );

      await loadComments();

      setNameLoading(false);
    };

  /*
   * ================================================
   * COMMENT SUBMIT
   * ================================================
   */

  const handleCommentSubmit =
    async (event) => {
      event.preventDefault();

      setCommentMessage('');

      if (!session) {
        setCommentMessage(
          'Please wait a moment and try again.'
        );

        return;
      }

      let currentName =
        displayName.trim();

      /*
       * If this visitor has never chosen a name,
       * use Guest + anonymous ID.
       */
      if (!currentName) {
        const {
          data,
          error,
        } = await supabase.rpc(
          'set_initial_display_name',
          {
            requested_name:
              'Guest-' +
              session.user.id
                .replaceAll(
                  '-',
                  ''
                )
                .slice(
                  0,
                  6
                )
                .toUpperCase(),
          }
        );

        if (error) {
          console.error(error);

          setCommentMessage(
            'Unable to set your display name.'
          );

          return;
        }

        currentName =
          data;

        setDisplayName(
          data
        );
      }

      const cleanComment =
        commentText.trim();

      if (!cleanComment) {
        setCommentMessage(
          'Please write something.'
        );

        return;
      }

      if (
        cleanComment.length >
        1000
      ) {
        setCommentMessage(
          'Comment must be 1000 characters or less.'
        );

        return;
      }

      setCommentLoading(
        true
      );

      const {
        error,
      } = await supabase
        .from('comments')
        .insert({
          post_id:
            post.id,

          user_id:
            session.user.id,

          display_name:
            currentName,

          content:
            cleanComment,

          parent_id:
            replyTo
              ? replyTo.id
              : null,

          approved:
            false,
        });

      if (error) {
        console.error(error);

        setCommentMessage(
          error.message ||
            'Unable to submit your comment right now.'
        );

        setCommentLoading(
          false
        );

        return;
      }

      setCommentText('');
      setReplyTo(null);

      setCommentMessage(
        'Comment submitted successfully.'
      );

      await loadComments();

      setCommentLoading(
        false
      );
    };

  /*
   * ================================================
   * REPLY
   * ================================================
   */

  const handleReply =
    (comment) => {
      setReplyTo(comment);
      setCommentMessage('');

      document
        .querySelector(
          '.comment-form'
        )
        ?.scrollIntoView({
          behavior:
            'smooth',
          block:
            'center',
        });
    };

  const cancelReply =
    () => {
      setReplyTo(null);
    };

  /*
   * ================================================
   * HELPERS
   * ================================================
   */

  const formatDateTime =
    (date) => {
      return new Date(
        date
      ).toLocaleString(
        'en-US',
        {
          year:
            'numeric',
          month:
            'long',
          day:
            'numeric',
          hour:
            'numeric',
          minute:
            '2-digit',
        }
      );
    };

  const formatCommentDate =
    (date) => {
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

  const topLevelComments =
    comments.filter(
      (comment) =>
        !comment.parent_id
    );

  const getReplies =
    (commentId) => {
      return comments.filter(
        (comment) =>
          comment.parent_id ===
          commentId
      );
    };

  const renderComment =
    (
      comment,
      depth = 0
    ) => {
      const replies =
        getReplies(
          comment.id
        );

      return (
        <article
          className={`comment-card ${
            depth > 0
              ? 'comment-reply'
              : ''
          }`}
          key={
            comment.id
          }
        >
          <div className="comment-header">
  <strong className="comment-author-name">
    {comment.display_name}

    {comment.is_author && (
      <span className="comment-author-badge">
        ✓ ADMIN
      </span>
    )}
  </strong>

  <span>
    {formatCommentDate(
      comment.created_at
    )}
  </span>
</div>

          <p>
            {
              comment.content
            }
          </p>

          <button
            type="button"
            className="reply-button"
            onClick={() =>
              handleReply(
                comment
              )
            }
          >
            Reply
          </button>

          {replies.length >
            0 && (
            <div className="comment-replies">
              {replies.map(
                (reply) =>
                  renderComment(
                    reply,
                    depth + 1
                  )
              )}
            </div>
          )}
        </article>
      );
    };

  /*
   * ================================================
   * LOADING
   * ================================================
   */

  if (loading) {
    return (
      <div className="site-shell">
        <main className="blog-post-loading">
          Loading article...
        </main>
      </div>
    );
  }

  if (
    notFound ||
    !post
  ) {
    return (
      <div className="site-shell">
        <main className="blog-post-loading">
          <h1>
            Article not found.
          </h1>

          <Link
            className="blog-read"
            to="/blog"
          >
            ← Back to blog
          </Link>
        </main>
      </div>
    );
  }

  /*
   * ================================================
   * PAGE
   * ================================================
   */

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
        >
          <span className="brand-mark">
            MA
          </span>

          <span>
            10
          </span>
        </Link>

        <nav
          className="nav-links"
          aria-label="Article navigation"
        >
          <Link to="/blog">
            Blog
          </Link>

          <Link to="/">
            Home
          </Link>
        </nav>
      </header>

      <main>
        <article className="container blog-post-page">

          <div className="blog-post-top">
            <Link
              className="blog-back"
              to="/blog"
            >
              ← Back to blog
            </Link>

            <div className="blog-post-label">
              ARTICLE
            </div>
          </div>

          <header className="blog-post-header">
            <h1>
              {post.title}
            </h1>

            <div className="blog-post-meta">
              <span>
                {formatDateTime(
                  post.created_at
                )}
              </span>

              {post.updated_at !==
                post.created_at && (
                <>
                  <span>
                    ·
                  </span>

                  <span>
                    Updated{' '}
                    {formatDateTime(
                      post.updated_at
                    )}
                  </span>
                </>
              )}
            </div>
          </header>

          <div
  className="blog-post-content"
  dangerouslySetInnerHTML={{
    __html: post.content,
  }}
/>

          {/* REACTIONS */}

          <section className="article-engagement">
            <div className="article-section-label">
              REACT
            </div>

            <div className="reaction-row">
              {reactionTypes.map(
                (reaction) => {
                  const active =
                    myReaction ===
                    reaction.type;

                  return (
                    <button
                      key={
                        reaction.type
                      }
                      type="button"
                      className={`reaction-button ${
                        active
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        handleReaction(
                          reaction.type
                        )
                      }
                      disabled={!session || !captchaToken}
                    >
                      <span>
                        {
                          reaction.label
                        }
                      </span>

                      <strong>
                        {
                          reactions[
                            reaction.type
                          ]
                        }
                      </strong>
                    </button>
                  );
                }
              )}
            </div>

            <p className="reaction-help">
              One reaction per article.
              Tap your current reaction again
              to remove it.
            </p>
          </section>

          {/* COMMENTS */}

          <section className="comments-section">
            <div className="article-section-label">
              COMMENTS
            </div>

            <h2>
              Join the conversation.
            </h2>

            {/* DISPLAY NAME */}

            <div className="visitor-name-card">
              <div>
                <span className="visitor-name-label">
                  YOUR DISPLAY NAME
                </span>

                {!nameEditing ? (
                  <strong>
                    {
                      displayName ||
                      'Guest'
                    }
                  </strong>
                ) : (
                  <input
                    className="visitor-name-input"
                    type="text"
                    value={
                      newName
                    }
                    onChange={(
                      event
                    ) =>
                      setNewName(
                        event.target
                          .value
                      )
                    }
                    maxLength={
                      40
                    }
                    autoFocus
                  />
                )}
              </div>

              {!nameEditing ? (
                <button
                  type="button"
                  className="change-name-button"
                  onClick={() => {
                    setNewName(
                      displayName
                    );

                    setNameMessage(
                      ''
                    );

                    setNameEditing(
                      true
                    );
                  }}
                >
                  Change name
                </button>
              ) : (
                <div className="name-edit-actions">
                  <button
                    type="button"
                    className="save-name-button"
                    disabled={
                      nameLoading
                    }
                    onClick={
                      handleChangeName
                    }
                  >
                    {nameLoading
                      ? 'Saving...'
                      : 'Save'}
                  </button>

                  <button
                    type="button"
                    className="cancel-name-button"
                    onClick={() => {
                      setNameEditing(
                        false
                      );

                      setNewName(
                        ''
                      );

                      setNameMessage(
                        ''
                      );
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {nameMessage && (
              <p className="name-message">
                {
                  nameMessage
                }
              </p>
            )}

            {replyTo && (
              <div className="reply-context">
                <div>
                  Replying to{' '}
                  <strong>
                    {
                      replyTo.display_name
                    }
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={
                    cancelReply
                  }
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="comment-captcha">
  <Turnstile
    siteKey={
      import.meta.env
        .VITE_TURNSTILE_SITE_KEY
    }
    onSuccess={(token) => {
      setCaptchaError('');
      setCaptchaToken(token);
    }}
    onError={() => {
      setCaptchaToken(null);
      setCaptchaError(
        'CAPTCHA verification failed. Please try again.'
      );
    }}
    onExpire={() => {
      setCaptchaToken(null);
    }}
  />

  {captchaError && (
    <p className="comment-captcha-error">
      {captchaError}
    </p>
  )}
</div>

            <form
              className="comment-form"
              onSubmit={
                handleCommentSubmit
              }
            >
              <label>
                {replyTo
                  ? 'Reply'
                  : 'Comment'}

                <textarea
                  value={
                    commentText
                  }
                  onChange={(
                    event
                  ) =>
                    setCommentText(
                      event.target
                        .value
                    )
                  }
                  placeholder={
                    replyTo
                      ? `Reply to ${replyTo.display_name}...`
                      : 'Write something...'
                  }
                  rows={5}
                  maxLength={
                    1000
                  }
                />
              </label>

              {commentMessage && (
                <p className="comment-message">
                  {
                    commentMessage
                  }
                </p>
              )}

              <button
                className="comment-submit"
                type="submit"
                disabled={
  commentLoading ||
  !session ||
  !captchaToken
}
              >
                {commentLoading
                  ? 'Submitting...'
                  : replyTo
                    ? 'Post reply'
                    : 'Post comment'}
              </button>
            </form>

            <div className="comments-list">
              {topLevelComments.length ===
                0 && (
                <div className="no-comments">
                  No approved comments yet.
                  Be the first.
                </div>
              )}

              {topLevelComments.map(
                (comment) =>
                  renderComment(
                    comment
                  )
              )}
            </div>
          </section>
        </article>
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

export default BlogPost;