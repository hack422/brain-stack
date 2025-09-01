# Brainstack Education Platform

A comprehensive educational content management system built with Next.js, featuring file uploads, user authentication, and content organization.

## Features

- **User Authentication**: Google OAuth integration for secure login
- **Content Management**: Upload and organize study materials by branch, semester, and subject
- **File Support**: Upload PDFs, documents, images, and other file types with unlimited size
- **Content Categories**: Organize content into notes, PYQs, e-books, formulas, timetables, assignments, and events
- **Admin Panel**: Comprehensive admin interface for content management
- **Responsive Design**: Modern, mobile-friendly UI with dark theme

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB with Mongoose
- **Authentication**: Google OAuth 2.0
- **Storage**: Cloudflare R2 for unlimited file storage
- **Database**: MongoDB for metadata storage
- **Deployment**: Vercel-ready configuration

## Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Google OAuth credentials
- Cloudflare R2 account and bucket

## Environment Variables

Create a `.env.local` file with:

```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_r2_secret_access_key
CLOUDFLARE_BUCKET_NAME=your_r2_bucket_name

# Email Service (optional)
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
```

## Setup Instructions

### 1. Cloudflare R2 Setup
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Create a new bucket named `brainstack-uploads`
4. Set bucket to **Public** for direct file access
5. Create API token with **Object Read**, **Object Write**, **Object Delete** permissions
6. Copy your Account ID, Access Key ID, and Secret Access Key

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`

### 3. Installation
```bash
# Clone repository
git clone <your-repo-url>
cd brainstack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

## Usage

### Admin Panel
- Access `/admin` after Google login
- Upload files with automatic R2 storage
- Organize content by branch, semester, subject, and type
- Manage existing content with delete functionality

### File Upload
- **Unlimited file sizes** via Cloudflare R2
- **Progress tracking** for all uploads
- **Bulk upload** support for multiple files
- **Automatic organization** by content type

### Content Organization
- **Branch**: CSE, CSE-AIML
- **Semester**: 1-6
- **Subject**: Dynamic based on branch/semester
- **Content Type**: Notes, PYQ, E-Books, Formulas, Timetable, Assignments, Events

## Deployment

### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- `MONGODB_URI`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ACCESS_KEY_ID`
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `CLOUDFLARE_BUCKET_NAME`

## Architecture

- **Frontend**: React components with TypeScript
- **API Routes**: Next.js API endpoints for authentication and content management
- **Database**: MongoDB with Mongoose schemas
- **Storage**: Cloudflare R2 with presigned URLs for direct uploads
- **Authentication**: Session-based auth with Google OAuth

## File Structure

```
brainstack/
├── components/          # React components
├── lib/                # Utility libraries (R2, MongoDB, Auth)
├── models/             # Mongoose schemas
├── pages/              # Next.js pages and API routes
├── public/             # Static assets
└── styles/             # Global CSS
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

