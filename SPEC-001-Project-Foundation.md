# SPEC-001: Project Foundation Setup

This is the implementation specification for Remote Jobs Hub foundation setup.

## Technical Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Supabase JS v2
- Framer Motion
- Lucide React
- clsx
- tailwind-merge

## Project Name
`remote-jobs-hub`

## Directory Structure
```
src/
├── assets/
├── components/
├── config/
├── constants/
├── features/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
├── stores/
├── styles/
├── types/
└── utils/
```
Each folder contains a `README.md` clarifying its purpose.

## Routing Requirements
Placeholder routes only:
- `/`
- `marketplace`
- `listing/:id`
- `about`
- `contact`
- `pricing`
- `community`
- `faq`
- `login`
- `register`
- `forgot-password`
- `dashboard`
- `seller`
- `admin`
- `404`

## Styling & Fonts
- Headings: Poppins
- Body: Inter
- Light / Dark theme support via CSS variables
- Responsive breakpoints from 320px to 1536px.
