# GazaPharma Link – Map Component Task

## Member Name
Kamal

## Task Name
Design and Display Map — Map Component

## Task Description
This task involves implementing the map component for GazaPharma Link to show pharmacy locations. Users can navigate from the medication availability results to the map screen, view a selected pharmacy's location, and see essential details.

## Task Objective
Provide a clear, user-friendly map component to help users locate pharmacies with available medication. Stock status is visually represented using colored markers.

## Completed Work
- Designed and implemented the Map Component on the frontend.
- Displayed pharmacy markers on the map according to stock availability.
- Linked the "View Medication Details & Map" button so the map appears only when clicked.
- Maintained proper screen flow: Search → Availability → Map & Details.

## Implemented Changes
- Created the Map Component UI.
- Added markers for all pharmacies with color-coded stock status.
- Added a professional legend explaining each marker color.
- Displayed details of the selected pharmacy alongside the map.
- Map appears only after clicking the designated button.
- Removed unused left-side blank space on the results page.

## Map Color Legend
- **Green:** Medication available.
- **Orange:** Low stock (contact pharmacy before visiting).
- **Red:** Medication not available.
- **Gray:** Data may be outdated.

## Files Modified
- `src/components/MapComponent.jsx`
- `src/components/MapComponent.css`
- `src/pages/SearchResultsPage.jsx`
- `src/pages/SearchResultsPage.css`

## Acceptance Criteria
- Map displays only after clicking the "View Medication Details & Map" button.
- Pharmacy markers show correct colors according to stock status.
- Selecting a pharmacy marker shows its details.
- Color legend clearly explains each marker color.
- No unused empty space on the results page.
- Interface supports RTL for Arabic.

## Test Cases
1. Map does not show on results page by default.
2. Clicking "View Medication Details & Map" opens the map screen.
3. Selecting a pharmacy marker displays its details panel.
4. Green marker appears for available stock.
5. Orange marker for low stock.
6. Red marker for unavailable medication.
7. Gray marker for outdated data.
8. Back button returns user to results.

## Notes
- Task implemented using mock data.
- Backend integration or real-time API can be added later.

## Task Status
Completed and ready for review.


## Running the Project
1. Clone the repository.
2. Install dependencies:

```bash
npm install