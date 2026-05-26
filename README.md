# GazaPharma Link — SCRUM-8

## Task
**SCRUM-8: تصميم واجهة عرض نتائج البحث وتفاصيل توفر الدواء في الصيدليات**

## Assignee
**سجى — Frontend Developer**

## Description
This feature implements a professional multi-screen frontend flow for the medicine search results task in the GazaPharma Link project.

The interface includes:
- Medicine search screen.
- Search results screen.
- Available medicine details screen.
- Unavailable medicine request screen.
- Offline data notice.
- Availability status badges.
- Pharmacy contact action.
- Stale data warning.

## User Flow

```text
Search Screen
   ↓
Results Screen
   ↓
Available Medicine → Details Screen
Unavailable Medicine → Medicine Wanted Request Screen
```

## Main Files

```text
src/pages/SearchResultsPage.jsx
src/pages/SearchResultsPage.css
src/App.jsx
```

## How to Run

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Dependencies

```bash
npm install lucide-react
```

## Acceptance Criteria

- The user can search for a medicine by name.
- The system displays matching pharmacies.
- Each result displays medicine name, strength, dosage form, availability status, pharmacy name, area, last update time, and contact action.
- Available medicines open a details screen.
- Unavailable medicines open a request screen.
- Stale data is clearly marked.
- The UI is responsive and suitable for mobile and desktop.

## Notes
This is a frontend implementation using mock data. Backend API integration can later replace the local `pharmacies` array.
