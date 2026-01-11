# Admin Dashboard

This directory contains the admin dashboard for the SCIPI Medical Society website.

## Structure

```
admin/
├── layout.tsx                    # Main admin layout with sidebar
├── login/
│   └── page.tsx                 # Admin login page
├── page.tsx                     # Dashboard home page
├── partners/
│   └── page.tsx                 # Partners management (placeholder)
├── projects/
│   └── page.tsx                 # Projects management (placeholder)
├── events/
│   └── page.tsx                 # Events management (placeholder)
├── resources/
│   └── page.tsx                 # Resources management (placeholder)
└── contact-submissions/
    └── page.tsx                 # Contact submissions (placeholder)
```

## Features

### Authentication
- **Login Page**: `/admin/login` - Email/password authentication
- **Protected Routes**: All admin routes require authentication
- **Session Management**: JWT-based sessions with 7-day expiry
- **Auto-redirect**: Authenticated users are redirected from login to dashboard

### Dashboard Layout
- **Responsive Sidebar**: Collapsible sidebar navigation using shadcn/ui
- **Navigation Items**:
  - Dashboard (home)
  - Parteneri (Partners)
  - Proiecte (Projects)
  - Evenimente (Events)
  - Resurse (Resources)
  - Mesaje Contact (Contact Submissions)
- **User Profile**: Shows admin name and email in sidebar footer
- **Logout**: Easy logout button in sidebar footer

### Dashboard Home
- **Statistics Cards**: Overview of all content types
  - Total partners
  - Total projects
  - Total events
  - Total resources
  - Unread contact messages
- **Quick Actions**: Direct links to management pages
- **Responsive Design**: Mobile-first approach

## Components

### AdminSidebar (`/components/admin/admin-sidebar.tsx`)
- Client component for sidebar navigation
- Active route highlighting
- Responsive mobile menu
- User profile display
- Logout functionality

## Authentication Flow

1. User visits `/admin/*` route
2. Middleware checks for `auth-token` cookie
3. If no token or invalid token, redirect to `/admin/login`
4. User enters credentials
5. API validates credentials and creates session
6. Token stored in HTTP-only cookie
7. User redirected to `/admin` dashboard
8. All subsequent requests include token for validation

## Middleware Protection

The middleware (`/middleware.ts`) protects:
- All `/admin/*` routes (except `/admin/login`)
- Admin API routes (`/api/partners`, `/api/projects`, etc.)

## Next Steps

The following pages need full CRUD implementation:
- [ ] Partners management
- [ ] Projects management
- [ ] Events management
- [ ] Resources management
- [ ] Contact submissions viewer

## Usage

### Starting the Dev Server
```bash
npm run dev
```

### Default Admin Credentials
After running `npm run db:seed`, use:
- Email: `admin@scipi.ro`
- Password: `admin123` (change in production!)

### Accessing the Admin Panel
Navigate to: `http://localhost:3000/admin/login`

