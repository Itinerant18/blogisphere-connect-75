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

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project"
3. Enter a project name (e.g., "Blogisphere Connect")
4. Enable Google Analytics if desired (recommended)
5. Click "Create project"

### 2. Set Up Firebase Services

#### Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in production mode or test mode (you can change this later)
4. Choose a location closest to your users
5. Click "Enable"

#### Set Up Firebase Storage

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Accept the default security rules or modify them
4. Choose a location closest to your users
5. Click "Done"

### 3. Configure Firebase in Your Project

1. In the Firebase console, click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" section
3. If you haven't added an app yet, click on the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "Blogisphere Web")
5. Copy the firebaseConfig object

### 4. Set Up Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example`)
2. Fill in the Firebase configuration values from the previous step:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Migrate Data from Supabase to Firebase

1. Make sure both Supabase and Firebase configurations are set up
2. Navigate to `/admin/migration` in your application
3. Select "Firebase" as the target database
4. Click "Migrate to Firebase" to start the migration process
5. Wait for the migration to complete

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
