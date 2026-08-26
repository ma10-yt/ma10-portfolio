import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase environment variables are missing.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

let anonymousSessionPromise = null;

export const getAnonymousSession =
  async (captchaToken) => {
    const {
      data: {
        session,
      },
    } =
      await supabase.auth.getSession();

    if (session) {
      return session;
    }

    if (!captchaToken) {
      throw new Error(
        'CAPTCHA verification is required.'
      );
    }

    if (!anonymousSessionPromise) {
      anonymousSessionPromise =
        supabase.auth
          .signInAnonymously({
            options: {
              captchaToken,
            },
          })
          .then(({ data, error }) => {
            if (error) {
              throw error;
            }

            return data.session;
          })
          .finally(() => {
            anonymousSessionPromise = null;
          });
    }

    return anonymousSessionPromise;
  };