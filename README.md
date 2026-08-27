# MA10 Portfolio

My personal portfolio website and blog.

A modern portfolio built with React and Vite, with a custom blog system powered by Supabase. The site includes interactive projects, a rich-text blog editor, comments, replies, reactions, CAPTCHA protection, image uploads, and an admin dashboard.

## Live Website

https://ma10-yt.github.io/ma10-portfolio/

## Features

- Personal portfolio and introduction
- About, Stack, Projects, and Contact sections
- Blog with published articles
- Rich-text blog editor
- Headings, formatting, lists, quotes, and code blocks
- Blog image uploads
- Automatic cleanup of unused blog images
- Anonymous comments
- Replies to comments
- Anonymous reactions
- Persistent visitor display names
- Globally unique display names
- First-time comment moderation
- Admin comment approval and deletion
- Admin-only blog management
- Cloudflare Turnstile CAPTCHA protection
- Supabase backend
- GitHub Actions deployment to GitHub Pages
- Responsive design

## Tech Stack

- React
- Vite
- React Router
- Supabase
- Tiptap
- Cloudflare Turnstile
- GitHub Pages
- GitHub Actions

## Project Structure

```text
src/
├── components/
│   └── RichTextEditor.jsx
├── pages/
│   ├── Admin.jsx
│   ├── Blog.jsx
│   └── BlogPost.jsx
├── App.jsx
├── main.jsx
├── styles.css
└── supabase.js
```

## Run Locally

Clone the repository:

```bash
git clone https://github.com/ma10-yt/ma10-portfolio.git
cd ma10-portfolio
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

Start the development server:

```bash
npm run dev
```

## Build

Create a production build with:

```bash
npm run build
```

## Deployment

The project uses GitHub Actions for deployment.

Push changes to the `main` branch:

```bash
git add .
git commit -m "Update website"
git push origin main
```

GitHub Actions automatically builds and deploys the site to GitHub Pages.

## Environment Variables

The following frontend environment variables are required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_TURNSTILE_SITE_KEY`

Do not commit `.env.local` or any secret keys to the repository.

## Author

**Mehran Mushtaq**

GitHub:  
https://github.com/ma10-yt

LinkedIn:
https://www.linkedin.com/in/ma10-yt

---

Built with React, curiosity, and a questionable number of debugging sessions. 😂