# StorageYield Design System: Facility Operating Layer

## Core Visual Motif: Facility Operating Layer

StorageYield's proprietary visual system combines physical storage facilities with software operating layers. Every interface shows "an operating layer above a physical storage facility."

### Visual Composition
- **Base Layer**: Physical facility (corridor, unit grid, garagebox row, container yard)
- **Operating Layer**: Overlayed software UI (booking signals, payment status, access controls, revenue decisions)
- **Status Signals**: Live data overlays (occupancy, revenue leakage, booking queue)
- **Decision Memos**: Operator action panels and recommendations

### Design Philosophy
- **Not a dashboard**: An operating layer above real storage operations
- **Concrete context**: Every screen shows physical storage reality
- **Operator workflow**: Focus on decisions, actions, and outcomes
- **Revenue intelligence**: Visual emphasis on money, occupancy, and optimization

## Color System

### Primary Palette
- **Background**: `#FAFAFA` (cool off-white) / `#FFFFFF` (pure white)
- **Text Primary**: `#0F172A` (deep navy)
- **Text Secondary**: `#475569` (slate)
- **Accent**: `#2563EB` (strong blue)
- **Success**: `#059669` (controlled green)
- **Warning**: `#D97706` (amber)
- **Error**: `#DC2626` (red)

### Status Colors
- **Live**: `#059669` (green)
- **Pilot**: `#D97706` (amber)
- **Roadmap**: `#6B7280` (gray)

### Dark Panels
- **Background**: `#0F172A` (deep navy)
- **Text**: `#F1F5F9` (light slate)
- **Accent**: `#3B82F6` (bright blue)
- **Contrast**: Minimum 7:1 ratio

## Typography

### Hierarchy
- **H1**: 48px/56px, 600 weight, concrete operator language
- **H2**: 32px/40px, 600 weight, specific feature names
- **H3**: 24px/32px, 600 weight, section headers
- **Body Large**: 18px/28px, 400 weight
- **Body**: 16px/24px, 400 weight
- **Small**: 14px/20px, 400 weight
- **Caption**: 12px/16px, 400 weight

### Rules
- No vague headings ("Powerful Platform")
- No huge empty heroes with abstract text
- Use concrete operator language ("Revenue leakage per unit", "Booking conversion pipeline")
- Editorial headings only for specific content

## Shape System

### Geometry Mix
- **Product Frames**: Browser-like frames for software UI
- **Mobile Frames**: Phone mockups for booking flows
- **Tables**: Data tables for pricing, units, bookings
- **Timeline Rails**: Horizontal workflow timelines
- **Facility Maps**: Grid-based facility layouts
- **Unit Grids**: Storage unit matrices
- **Checkout Panels**: Payment and contract forms
- **Invoice Panels**: Billing document layouts
- **Access Logs**: Security event timelines
- **Decision Memos**: Action recommendation cards
- **Comparison Matrices**: Feature comparison tables

### Border Radius Control
- **Sharp**: 0px (tables, data panels)
- **Subtle**: 4px (buttons, inputs)
- **Rounded**: 8px (cards, panels)
- **Pill**: 24px (status badges, tags)
- **Avoid**: Over-rounded cards (16px+ everywhere)

## Component Patterns

### Product Scenes
Every major section must include one of:
1. Storage facility visual (corridor, garagebox row, container yard)
2. Realistic StorageYield interface screenshot
3. Operator workflow panel
4. Revenue/booking/access decision visualization
5. Concrete business outcome display

### Interactive Modules
- **Tabbed Interfaces**: Product feature exploration
- **Calculator Previews**: Revenue tools
- **Workflow Timelines**: Process visualization
- **Status Matrices**: Feature availability grids
- **Comparison Tables**: Competitor analysis

### Visual Assets
If real images unavailable, use CSS-rendered scenes:
- Storage corridor perspective
- Garagebox row with doors
- Container yard layout
- Access gate/keypad interface
- Facility map with unit status
- Unit grid with occupancy overlay

## Layout Principles

### Density Control
- **Dense but clean**: Professional SaaS hierarchy
- **No excessive whitespace**: Purposeful spacing
- **Content-driven**: Layout serves product storytelling
- **Mobile-first**: Responsive but desktop-optimized

### Section Structure
1. **Concrete Hero**: Specific value proposition
2. **Immersive Scene**: Product in context
3. **Operator Pain**: Real problems
4. **Workflow Transformation**: Before/after
5. **Interactive Module**: Product exploration
6. **Honesty Section**: Live/pilot/roadmap status
7. **Strong CTA**: Clear next action
8. **SEO Links**: Internal navigation

## Forbidden Patterns

### Do Not Use
- Generic split layouts (text left, card right)
- Rounded card grids everywhere
- "Product preview" labels
- Dark UI cards with icons
- Abstract journey cards
- Huge whitespace sections
- Repeated templates across pages
- Single-icon feature cards
- Empty CTA panels
- Same hero on every page

### Replace With
- Immersive product scenes
- Physical storage visuals
- Realistic software screenshots
- Operator workflow panels
- Product tabs and modules
- Interactive tools
- Dense product UI
- Comparison matrices
- Calculators and simulators
- Proprietary visual systems

## Implementation Notes

### CSS Architecture
- Utility-first with Tailwind
- Custom component classes for Facility Operating Layer
- Consistent spacing scale
- Responsive breakpoint system

### Asset Strategy
- SVG icons for UI elements
- CSS-rendered facility scenes
- High-quality placeholder images
- Consistent illustration style

### Quality Gates
- Every page must have distinct product scene
- No generic card-based layouts
- Physical storage context in every section
- Realistic product UI appearance
- Professional SaaS density and hierarchy