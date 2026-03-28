# WaitLess - Component Documentation

## 🎨 Design System

### Colors
- **Primary (Teal)**: `#1A6B7C` - Used for primary actions and branding
- **CTA (Orange)**: `#C94F1E` - Used for call-to-action buttons
- **Background**: `#F6F5F0` - Cream background
- **Text**: `#1A1924` - Dark text color

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body Text**: Outfit (sans-serif)

## 📦 Reusable Components

### 1. Button (`/src/app/components/Button.tsx`)
Multi-variant button component supporting three styles.

**Props:**
- `variant`: `'primary' | 'outline' | 'accent'`
- `size`: `'sm' | 'md' | 'lg'`
- Standard HTML button props

**Usage:**
```tsx
import { Button } from './components/Button';

<Button variant="primary" size="md">
  Click Me
</Button>

<Button variant="accent" size="lg">
  List Your Clinic
</Button>
```

### 2. Input (`/src/app/components/Input.tsx`)
Form input field with label, error states, and password toggle.

**Props:**
- `label`: Optional label text
- `error`: Error message to display
- `showPasswordToggle`: Show/hide password toggle for password fields
- Standard HTML input props

**Usage:**
```tsx
import { Input } from './components/Input';

<Input
  label="USERNAME"
  placeholder="Enter your username"
  required
/>

<Input
  label="PASSWORD"
  type="password"
  showPasswordToggle
  error="Password is required"
/>
```

### 3. Dropdown (`/src/app/components/Dropdown.tsx`)
Custom select dropdown with consistent styling.

**Props:**
- `label`: Optional label text
- `options`: Array of `{ value: string; label: string }`
- `placeholder`: Placeholder text
- Standard HTML select props

**Usage:**
```tsx
import { Dropdown } from './components/Dropdown';

<Dropdown
  label="SPECIALIZATION"
  options={[
    { value: 'general', label: 'General Physician' },
    { value: 'ent', label: 'ENT Specialist' }
  ]}
  placeholder="Select..."
/>
```

### 4. Tag (`/src/app/components/Tag.tsx`)
Status badges and category tags with multiple variants.

**Props:**
- `variant`: `'success' | 'warning' | 'info' | 'default' | 'specialty' | 'location'`
- `icon`: Optional icon element
- `children`: Tag content

**Usage:**
```tsx
import { Tag } from './components/Tag';
import { MapPin } from 'lucide-react';

<Tag variant="success">No queue</Tag>
<Tag variant="location" icon={<MapPin size={12} />}>
  Powai
</Tag>
```

### 5. Navbar (`/src/app/components/Navbar.tsx`)
Main navigation bar with logo and navigation links.

**Features:**
- Sticky positioning
- Responsive design
- React Router integration

**Usage:**
```tsx
import { Navbar } from './components/Navbar';

<Navbar />
```

### 6. ClinicCard (`/src/app/components/ClinicCard.tsx`)
Displays clinic information in a card format.

**Props:**
```typescript
interface ClinicCardProps {
  id: string;
  name: string;
  doctor: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  waiting: number;
  queueStatus: 'open' | 'closed';
  workingDays?: string;
}
```

**Usage:**
```tsx
import { ClinicCard } from './components/ClinicCard';

<ClinicCard
  id="1"
  name="Powai Paediatrics"
  doctor="Dr. Nisha Iyer"
  specialty="Pediatrician"
  location="Powai"
  rating={4.9}
  reviewCount={311}
  verified={true}
  waiting={0}
  queueStatus="open"
  workingDays="Mon–Sat"
/>
```

### 7. QueueListItem (`/src/app/components/QueueListItem.tsx`)
Individual queue item showing token and status.

**Props:**
```typescript
interface QueueListItemProps {
  tokenNumber: string;
  patientName?: string;
  status: 'waiting' | 'current' | 'completed' | 'skipped';
  estimatedTime?: string;
  className?: string;
}
```

**Usage:**
```tsx
import { QueueListItem } from './components/QueueListItem';

<QueueListItem
  tokenNumber="A1"
  patientName="John Doe"
  status="current"
  estimatedTime="Now"
/>
```

## 📄 Pages

### 1. HomePage (`/src/app/pages/HomePage.tsx`)
Landing page with hero section, search, and "How it works" section.

**Route:** `/`

**Features:**
- Hero section with search filters
- How WaitLess works for patients and clinics
- CTA section for clinic registration

### 2. BrowsePage (`/src/app/pages/BrowsePage.tsx`)
Browse and filter clinics.

**Route:** `/browse`

**Features:**
- Search by clinic/doctor name
- Filter by area and specialization
- Sort by wait time, rating, or reviews
- Grid of clinic cards

### 3. StaffLoginPage (`/src/app/pages/StaffLoginPage.tsx`)
Staff authentication page.

**Route:** `/staff-login`

**Features:**
- Username/password login form
- Password visibility toggle
- Demo credentials display

### 4. RegisterClinicPage (`/src/app/pages/RegisterClinicPage.tsx`)
Multi-step clinic registration form.

**Route:** `/register-clinic`

**Features:**
- 4-step registration wizard
- Progress indicator
- Form validation
- Steps: Clinic Details, Location & Contact, Staff Login, Working Hours

### 5. ClinicDetailPage (`/src/app/pages/ClinicDetailPage.tsx`)
Individual clinic page with queue management.

**Route:** `/clinic/:id`

**Features:**
- Clinic information display
- Live queue view
- Join queue functionality
- Token confirmation modal

### 6. HowItWorksPage (`/src/app/pages/HowItWorksPage.tsx`)
Detailed explanation of platform features.

**Route:** `/how-it-works`

**Features:**
- Separate sections for patients and clinics
- Step-by-step guides
- CTA for clinic registration

## 🗂️ Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tag.tsx
│   │   ├── Navbar.tsx
│   │   ├── ClinicCard.tsx
│   │   └── QueueListItem.tsx
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── BrowsePage.tsx
│   │   ├── StaffLoginPage.tsx
│   │   ├── RegisterClinicPage.tsx
│   │   ├── ClinicDetailPage.tsx
│   │   └── HowItWorksPage.tsx
│   ├── layouts/            # Layout components
│   │   └── RootLayout.tsx
│   ├── routes.tsx          # React Router configuration
│   └── App.tsx             # Main app component
├── data/
│   └── mockClinics.ts      # Mock clinic data
├── lib/
│   └── utils.ts            # Utility functions (cn helper)
└── styles/
    ├── fonts.css           # Font imports
    └── theme.css           # Theme variables and base styles
```

## 🎯 Data Models

### Clinic Interface
```typescript
interface Clinic {
  id: string;
  name: string;
  doctor: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  waiting: number;
  queueStatus: 'open' | 'closed';
  workingDays?: string;
}
```

## 🛠️ Utility Functions

### `cn()` - Class Name Merger
Located in `/src/lib/utils.ts`

Merges Tailwind CSS classes intelligently using `clsx` and `tailwind-merge`.

**Usage:**
```tsx
import { cn } from '../../lib/utils';

<div className={cn(
  'base-class',
  condition && 'conditional-class',
  className
)} />
```

## 🎨 Styling Guidelines

1. **Use the design system colors** - Reference CSS variables from theme.css
2. **Font families** - Headings use Cormorant Garamond, body uses Outfit
3. **Consistent spacing** - Use Tailwind spacing scale
4. **Border radius** - Standard is `rounded-lg` or `rounded-xl`
5. **Shadows** - Use for hover states and elevated components
6. **Transitions** - Add smooth transitions for interactive elements

## 📱 Responsive Design

All components and pages are responsive and work on:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

Key breakpoints use Tailwind's `md:` and `lg:` prefixes.
