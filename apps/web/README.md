# is-a.software Frontend

A minimal, dark glass-themed frontend for the is-a.software subdomain service, built with Next.js and Tailwind CSS.

## Features

- 🎨 Dark glass morphism UI design
- 🚀 Fast and minimal interface
- 📱 Fully responsive
- 🔐 Authentication flows (Sign in/Sign up)
- 🌐 Domain management dashboard
- 🔗 Ready for backend integration via axios

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── layout.js           # Root layout
├── page.js            # Home page
├── claim/
│   └── page.js        # Domain claim page
├── signin/
│   └── page.js        # Sign in page
├── signup/
│   └── page.js        # Sign up page
├── dashboard/
│   └── page.js        # User dashboard
├── api/               # Backend API routes (placeholder)
└── globals.css        # Global styles

components/
├── Navbar.js          # Navigation bar
├── Hero.js            # Landing hero section
├── Features.js        # Features section
└── Footer.js          # Footer

lib/
├── api.js             # API utility functions
└── auth.js            # Authentication utilities

tailwind.config.js     # Tailwind CSS configuration
```

## Design System

### Colors

- **Dark Background**: `#020617` (dark-950)
- **Primary Accent**: `#2563eb` (blue-600)
- **Text Primary**: `#f1f5f9` (slate-100)
- **Text Secondary**: `#94a3b8` (slate-400)
- **Glass Effect**: `rgba(30, 41, 59, 0.8)` with blur

### Components

- `.glass` - Glass morphism container
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input-glass` - Glass input field

## Backend Integration

### Environment Variables

Update `.env.local` with your backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
```

### API Functions

All API functions are in `lib/api.js`. They're ready to be migrated to axios:

#### Domain API

```javascript
import { domainApi } from '@/lib/api';

// Check domain availability
await domainApi.checkAvailability('myproject');

// Get user domains
await domainApi.getUserDomains(token);

// Create domain
await domainApi.createDomain('newproject', token);

// Delete domain
await domainApi.deleteDomain(domainId, token);
```

#### Auth API

```javascript
import { authApi } from '@/lib/api';

// Sign up
await authApi.signup(username, email, password);

// Sign in
await authApi.signin(email, password);

// Get current user
await authApi.getUser(token);

// Sign out
await authApi.signout(token);
```

### Migration to Axios

To integrate with a backend using axios, follow these steps:

1. **Install axios**:
   ```bash
   npm install axios
   ```

2. **Update `lib/api.js`** to use axios instead of fetch:

   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // Add auth token to requests
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('is_a_software_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   export default api;
   ```

3. **Update API functions** to use axios instance:

   ```javascript
   import api from '@/lib/api';

   export const domainApi = {
     checkAvailability: async (domain) => {
       return api.post('/domains/check', { domain });
     },
     // ... etc
   };
   ```

4. **Update form submissions** to use the new API functions with proper error handling.

## Pages

### Home Page (`/`)
- Hero section with call-to-action
- Features showcase
- Navigation to claim and sign in

### Sign In (`/signin`)
- Email/password login
- GitHub OAuth option (placeholder)

### Sign Up (`/signup`)
- Create account form
- GitHub OAuth option (placeholder)

### Dashboard (`/dashboard`)
- User domain list
- Add new domain
- Account settings
- Sign out

## Styling Notes

- No purple gradients or unnecessary effects
- Minimal, clean design
- Dark theme with blue accents
- Glass morphism effects for depth
- Responsive on all devices

## Contributing

Feel free to modify the design and structure as needed for your backend.

## License

MIT
