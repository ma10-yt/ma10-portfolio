import React from 'react';

const paths = {
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  leetcode: 'M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z',
};

export function BrandIcon({ name, className = '' }) {
  if (name === 'linkedin') {
    return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" /></svg>;
  }
  if (name === 'email') {
    return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 5h18a2 2 0 0 1 2 2v.4l-11 7.2L1 7.4V7a2 2 0 0 1 2-2Zm-2 4.8 10.45 6.83a1 1 0 0 0 1.1 0L23 9.8V19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9.8Z" /></svg>;
  }
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}

const socialProfiles = [
  { name: 'GitHub', icon: 'github', href: 'https://github.com/ma10-yt' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/ma10-yt' },
  { name: 'LeetCode', icon: 'leetcode', href: 'https://leetcode.com/u/ma10-yt' },
];

export function SocialLinks({ className = '' }) {
  return (
    <nav className={`social-links ${className}`.trim()} aria-label="Social links">
      {socialProfiles.map((profile) => (
        <a key={profile.name} href={profile.href} target="_blank" rel="noreferrer" aria-label={`${profile.name} profile`} title={profile.name}>
          <BrandIcon name={profile.icon} />
        </a>
      ))}
      <a href="mailto:mehranmushtaq599@gmail.com" aria-label="Email Mehran Mushtaq" title="Email">
        <BrandIcon name="email" />
      </a>
    </nav>
  );
}
