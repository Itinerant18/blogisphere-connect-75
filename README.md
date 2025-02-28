# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/168655db-3d84-4a9b-89d4-9ac0543d8bae

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/168655db-3d84-4a9b-89d4-9ac0543d8bae) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment Guide

### Deploying to Netlify

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to Netlify and create a new site from Git
3. Select your repository and configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Environment Variables

Make sure to set the following environment variables in your Netlify dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Production Setup

1. **Clerk Authentication**: Replace the development key in `src/main.tsx` with a production key from your Clerk dashboard to remove the development warning.

2. **Supabase Database**: Ensure your Supabase database has the correct schema:
   - The `blogs` table should have a `user_id` column with the UUID data type
   - Other required columns: `title`, `content`, `image_url`

## Troubleshooting

### Common Issues

1. **404 Errors for Images**: Make sure all image paths are correct and the images exist in your public directory. Use placeholder images as fallbacks.

2. **UUID Format Errors**: The application now generates UUIDs for the user_id field to ensure compatibility with Supabase's UUID column type.

3. **Clerk Development Keys Warning**: This is just a warning and doesn't affect functionality. Replace with production keys when ready.

4. **Failed to Load Resources**: Check that all paths in your code are correct and resources exist.

### Database Issues

If you're experiencing issues with database operations:

1. Check your Supabase table schema to ensure it matches what your application expects
2. Verify that your RLS (Row Level Security) policies are correctly configured
3. Test database operations directly in the Supabase dashboard to isolate issues

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/168655db-3d84-4a9b-89d4-9ac0543d8bae) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## License

MIT
