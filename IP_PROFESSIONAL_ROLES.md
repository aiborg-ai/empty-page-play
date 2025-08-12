# IP Professional Roles Classification

This file defines the professional role categories and titles used for filtering and categorizing contacts in the Collab Hub.

## Patent Professionals

### Core Patent Roles
- Patent Attorney (US: Patent Agent)
- European Patent Attorney (EPA)
- Chartered Patent Attorney (CPA/UK)
- Trainee Patent Attorney
- Part-Qualified Patent Attorney
- Patent Counsel (In-house)
- Senior Patent Specialist
- Patent Knowledge Lawyer

## Trademark Professionals

### Core Trademark Roles
- Trade Mark Attorney (UK/EU)
- Trademark Attorney (US)
- Chartered Trade Mark Attorney (CTMA)
- Trainee Trade Mark Attorney
- Trade Mark Counsel
- Brand Protection Attorney

## General IP Legal Roles

### IP Legal Positions
- IP Solicitor
- IP Barrister
- IP Litigator
- Copyright Attorney
- Intellectual Property Attorney
- IP Legal Counsel (In-house)
- IP Legal Director

## Management & Strategy Roles

### Executive Level
- Chief Intellectual Property Officer (CIPO)
- Head of Intellectual Property
- Director of Intellectual Property
- VP Intellectual Property
- IP Portfolio Director

### Management Level
- IP Manager
- Patent Manager
- Trade Mark Manager
- IP Portfolio Manager
- Senior IP Manager
- IP Operations Manager
- Brand Protection Manager

## Technical & Analytical Roles

### Patent Technical Roles
- Patent Engineer
- Patent Analyst
- Patent Searcher
- Prior Art Searcher
- Patent Examiner (Government)
- Patent Specialist
- Technical Specialist - Patents

### Analytics & Research
- IP Analyst
- Competitive Intelligence Analyst
- Patent Analytics Specialist
- IP Research Analyst
- Freedom to Operate Analyst
- Patent Landscape Analyst

## Support & Administrative Roles

### Paralegal & Administration
- Patent Paralegal
- Trade Mark Paralegal
- IP Paralegal
- Patent Administrator
- Trade Mark Administrator
- IP Administrator
- Formalities Officer
- Renewals Specialist

## Usage Notes

These role categories are used for:
1. **Filtering**: Users can filter their network contacts by professional role
2. **Profile Attributes**: Each contact card displays the person's professional role
3. **Search**: Professional roles are searchable terms
4. **Analytics**: Role distribution analytics in the network

## Category Mapping

For filtering purposes, roles are grouped into main categories:

- **Patent Professionals**: All patent-specific roles
- **Trademark Professionals**: All trademark-specific roles
- **IP Legal**: General IP legal roles
- **IP Management**: Executive and management positions
- **Technical & Analytics**: Technical, research, and analytical roles
- **Support & Admin**: Paralegal and administrative positions

## Implementation Structure

```typescript
interface ProfessionalRole {
  id: string;
  title: string;
  category: 'patent' | 'trademark' | 'legal' | 'management' | 'technical' | 'support';
  level?: 'executive' | 'senior' | 'mid' | 'junior' | 'trainee';
  specialization?: string[];
}
```

## Adding New Roles

To add new professional roles:
1. Add the role title under the appropriate section
2. Ensure it follows the naming convention
3. Consider the category and level classification
4. Update the implementation if adding new categories