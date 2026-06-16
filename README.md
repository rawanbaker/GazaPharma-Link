# Sprint 3: Inventory Management Implementation Report

**Project Name:** GazaPharma Link ( MedFinder )
**Course:** Software Engineering Project
**Phase:** Sprint 3 Advanced Deliverables — Inventory Management Epic (SCRUM-19 to SCRUM-25)

**Under the Supervision of:**
- Dr. Walaa Medhat
- Eng. Belal Abu Shawish

**Date:** 20 June 2026

---

## 1. Software Architecture

Building on the 3-Tier Layered Architecture established in Sprint 2, Sprint 3 extends the system to support full pharmacist-side inventory control. This phase corresponds to the Inventory Management for Pharmacists epic, where pharmacists are no longer limited to viewing inventory but can securely add, edit, and delete medication records through a dedicated dashboard, with every change enforced by a new authorization and access-control layer.

### 1.1 Architectural Layers — Sprint 3 Additions

- **Presentation Layer (Client Tier):** Introduces the Pharmacist Dashboard UI (SCRUM-20), a secured interface accessible only after authentication, and the Inventory Management Interface (SCRUM-21), which provides Add, Edit, and Delete controls for medication records. Both screens reuse the lightweight, low-bandwidth design principles defined in earlier sprints, so the new CRUD forms remain responsive on weak connections.

- **Application / Business Logic Layer (Server Tier):** Expanded with the Inventory CRUD API (SCRUM-22), which processes add, edit, and delete requests and propagates real-time stock changes to all patient-facing search results. A new Dashboard Authorization and Access Control module (SCRUM-23) verifies that a pharmacist can only manage inventory belonging to their own registered pharmacy, rejecting and logging any unauthorized modification attempt.

- **Data Layer (Data Tier):** The Inventory table schema was revised (SCRUM-19) to support the full CRUD lifecycle and accountability. In addition to the existing `pharmacy_id`, `medicine_id`, `status`, and `price` fields, the schema now records a precise `quantity` value and an `updated_by` reference linking each change to the authenticated pharmacist account that performed it, enabling auditability for the new access-control layer.

### 1.2 System Architecture Component Diagram

![Updated System Architecture Component Diagram](architecture_diagram.png)

*Updated Component Diagram — Inventory Management Epic (SCRUM-19, SCRUM-20, SCRUM-21, SCRUM-22, SCRUM-23)*

---

## 2. Use Case Diagram Specification

Sprint 3 extends the Use Case model defined in Sprint 2 by detailing the Pharmacist actor's inventory management capabilities in full, replacing the single high-level "Update Stock Status" interaction with distinct, secured Add / Edit / Delete use cases.

### 2.1 System Actors (Updated)

1. **Patient / User:** Searches for medications, reviews scientific alternatives, locates pharmacies on maps, and posts open requests for unavailable drugs. *(Unchanged from Sprint 2.)*
2. **Pharmacist:** Logs into a secured dashboard to add new medication records, edit stock quantity, price, and status, and delete records no longer carried by the pharmacy — with all actions restricted to their own pharmacy's inventory.
3. **Admin:** Validates new pharmacy registrations and manages the verified global medicine catalog. *(Unchanged from Sprint 2.)*

### 2.2 Textual Use Case Specifications

#### Use Case 3: Manage Inventory Records (Add / Edit / Delete)

- **Actor:** Pharmacist
- **Description:** Allows an authenticated pharmacist to fully manage their pharmacy's medication records — creating new entries, editing existing stock details, or removing discontinued items — with all changes reflected instantly across the platform.
- **Pre-conditions:** The Pharmacist is logged into the secured dashboard and has been authorized for their specific pharmacy.

**Basic Flow:**
1. The Pharmacist opens the Inventory Management Interface from the dashboard.
2. The Pharmacist selects Add, Edit, or Delete on a medicine record.
3. The system validates the request against the Dashboard Authorization and Access Control module to confirm ownership of the pharmacy.
4. The Inventory CRUD API processes the request and commits the change to the Inventory table.
5. The system updates search results and pharmacy listings for all patients in real time.

**Alternative Flow (Unauthorized Modification Attempt):**
1. If a pharmacist account attempts to modify inventory belonging to a different pharmacy, the access-control module rejects the request before it reaches the database.
2. The system returns an access-denied response and logs the attempt for security review.

#### Use Case 4: Secure Dashboard Login

- **Actor:** Pharmacist
- **Description:** Authenticates a pharmacist before granting access to inventory management features, ensuring only verified pharmacy accounts can view or modify stock data.
- **Pre-conditions:** The pharmacist has a registered, verified account.

**Basic Flow:**
1. The Pharmacist enters their credentials on the dashboard login screen.
2. The system verifies the credentials and retrieves the associated `pharmacy_id`.
3. Upon success, the system grants access scoped strictly to that pharmacy's inventory records.

---

## 3. Entity-Relationship Diagram (ERD) Specification

The Inventory table introduced in Sprint 2 is revised in Sprint 3 to support the full record lifecycle (create, update, delete) and to satisfy the new authorization and audit requirements introduced by the Pharmacist Dashboard.

### 3.1 Updated Entity: Inventory Table (SCRUM-19)

- **`inventory_id`** (Primary Key – INT): Unique stock record identification. *(Unchanged.)*
- **`pharmacy_id`** (Foreign Key referencing Pharmacies): Direct connection to the specific store. *(Unchanged.)*
- **`medicine_id`** (Foreign Key referencing Medicines): Direct connection to the specific medication. *(Unchanged.)*
- **`quantity`** (INT – New): Precise unit count in stock, replacing reliance on status alone and enabling accurate low-stock alerts.
- **`status`** (ENUM): Current availability ('Available', 'Out of Stock', 'Low Stock'); now derived from quantity thresholds where applicable.
- **`price`** (DECIMAL): Store-specific pricing for the medicine. *(Unchanged.)*
- **`updated_by`** (Foreign Key referencing Users – New): References the pharmacist account that performed the most recent add, edit, or delete action, supporting the audit requirements introduced by the Dashboard Authorization module (SCRUM-23).
- **`last_updated`** (TIMESTAMP): Logs the exact time of the last update to ensure instant data validity. *(Unchanged.)*

### 3.2 Updated Database Relationship Rules

- **Inventory to Users (Pharmacist Accounts) – New:** Many-to-One relationship. A single user account may perform many inventory updates over time, but each individual inventory row records exactly one responsible account at any given moment.
- **Medicines to Inventory:** One-to-Many relationship, unchanged from Sprint 2.
- **Pharmacies to Inventory:** One-to-Many relationship, unchanged from Sprint 2.
- **Delete Enforcement:** Delete operations on Inventory records are enforced at the application layer (SCRUM-22) and require pharmacy-ownership confirmation from the authorization module (SCRUM-23) before the corresponding row is removed from the database.

---

## 4. Software Testing Cases Specification

To enforce software stability and prevent runtime crashes following the introduction of full CRUD functionality and access control, the following testing matrix evaluates the new inventory management functions (corresponds to task SCRUM-24 for writing and executing test cases):

| Test Case ID | Test Scenario | Execution Steps | Expected System Result | Pass/Fail |
|---|---|---|---|---|
| TC-004 | Verify Add Medicine to Inventory | 1. Log in to the Pharmacist Dashboard.<br>2. Open the Inventory Management Interface.<br>3. Enter new medicine details and quantity.<br>4. Submit the form. | The new medicine record is created and instantly appears in the pharmacy's inventory list and in patient search results. | *[Pending Execution]* |
| TC-005 | Verify Edit Medicine Stock Details | 1. Select an existing medicine record.<br>2. Modify quantity, price, or status.<br>3. Save changes. | The record updates instantly, and the change reflects across patient-facing search and map results without delay. | *[Pending Execution]* |
| TC-006 | Verify Delete Medicine from Inventory | 1. Select a discontinued medicine record.<br>2. Trigger the delete action.<br>3. Confirm deletion. | The record is permanently removed from the pharmacy's inventory and no longer appears in any search results. | *[Pending Execution]* |
| TC-007 | Verify Unauthorized Access Prevention (Dashboard Security) | 1. Log in as a pharmacist from Pharmacy A.<br>2. Attempt to edit or delete an inventory record belonging to Pharmacy B (e.g., via a direct API request). | The system rejects the request with an access-denied response and logs the attempt; Pharmacy B's record remains unchanged. | *[Pending Execution]* |
