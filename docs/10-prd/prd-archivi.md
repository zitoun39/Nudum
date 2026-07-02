---
title: "PRD-001 — Archivi Enterprise Document Management"
status: Draft
owner: Abdelhak Zitoun
last-updated: 2026-07-02
category: Product
references:
  - docs/03-domain/bounded-contexts.md
  - docs/03-domain/module-boundaries.md
  - docs/03-domain/domain-model.md
---

# PRD-001 — Archivi Enterprise Document Management (MVP)

## 1. Bounded Context & Scope

The **Archivi Context** (`BUS-003`) handles secure enterprise record-keeping, folder hierarchy management, document version control, and formal correspondence log tracking for water utility organizations.

### Key Boundaries

- All files are physically managed via a core-level object storage wrapper client (e.g. MinIO/S3 compatible storage). Archivi stores file metadata, references (`file_key`), and version trees.
- Other business modules (Mahattati, Jawdati) reference files via loose `file_id` parameters; they do not write to Archivi's tables directly.
- The context runs isolated inside each tenant's schema (`tenant_[org_id]`).

---

## 2. Aggregates & Entity Design

### 📂 Folder (Aggregate)

Represents a directory in the hierarchical document repository.

- `id` (UUID, Primary Key)
- `name` (String, max 100 chars)
- `parent_id` (UUID, nullable, Self-Referential Foreign Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 📄 Document (Aggregate Root)

Represents a managed file container. Contains version history.

- `id` (UUID, Primary Key)
- `title` (String, max 255 chars)
- `description` (Text, nullable)
- `folder_id` (UUID, nullable, Foreign Key)
- `current_version_id` (UUID, nullable, Foreign Key targeting latest Version)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 🔄 Version (Entity)

Represents a immutable file upload iteration.

- `id` (UUID, Primary Key)
- `document_id` (UUID, Foreign Key)
- `version_number` (Integer, auto-incrementing per document)
- `file_key` (String, path pointer to MinIO bucket)
- `file_size` (Integer, bytes)
- `mime_type` (String)
- `uploaded_by` (UUID, referencing global User)
- `created_at` (Timestamp)

### ✉️ Correspondence (Aggregate Root)

Tracks formal letters exchanged with external bodies.

- `id` (UUID, Primary Key)
- `type` (Enum: `incoming` | `outgoing`)
- `reference_number` (String, unique business tracker)
- `sender` (String, max 255 chars)
- `recipient` (String, max 255 chars)
- `subject` (String, max 255 chars)
- `status` (Enum: `draft` | `pending_review` | `approved` | `rejected`)
- `document_id` (UUID, nullable, Foreign Key targeting attachment Document)
- `received_sent_at` (Timestamp)
- `created_at` (Timestamp)

### 🏷️ Tag (Entity)

Simple labeling entity shared by documents.

- `id` (UUID, Primary Key)
- `name` (String, max 50 chars, unique)

---

## 3. User Stories

| ID         | As a...            | I want to...                                          | So that I can...                                          |
| ---------- | ------------------ | ----------------------------------------------------- | --------------------------------------------------------- |
| **US-101** | Operator / Staff   | Create, rename, and nest Folders                      | Maintain a clear, logical directory layout.               |
| **US-102** | Operator / Staff   | Upload a new Document to a folder                     | Store files securely in the cloud.                        |
| **US-103** | Operator / Staff   | Upload a new Version of a document                    | Track revisions without duplicating document records.     |
| **US-104** | Clerk / Secretary  | Register incoming and outgoing Correspondence         | Log official letters with metadata and attachments.       |
| **US-105** | Manager / Approver | Approve or Reject correspondences                     | Route official incoming/outgoing letters through reviews. |
| **US-106** | All Users          | Categorize documents with Tags and filter by metadata | Search and retrieve records quickly.                      |

---

## 4. REST APIs & Endpoints

### Folders

- `GET /api/folders` - Retrieve folder tree layout.
- `POST /api/folders` - Create a folder.
- `PUT /api/folders/:id` - Rename or move a folder.
- `DELETE /api/folders/:id` - Delete folder (fails if not empty).

### Documents

- `GET /api/documents` - Paginated filterable documents list.
- `POST /api/documents` - Register a document (metadata).
- `GET /api/documents/:id` - Get metadata & versions.
- `POST /api/documents/:id/versions` - Upload a new file version.
- `GET /api/documents/:id/versions/:versionId/download` - Get presigned download URL.
- `DELETE /api/documents/:id` - Soft delete document.

### Correspondences

- `GET /api/correspondences` - Filterable correspondence register.
- `POST /api/correspondences` - Register letter log.
- `PUT /api/correspondences/:id/status` - Transition review status (`draft` -> `pending_review` -> `approved` / `rejected`).

### Tags

- `GET /api/tags` - List all tags.
- `POST /api/tags` - Create a tag.

---

## 5. Security & Permissions

Archivi enforces these granular permissions (to be mapped in the RBAC roles):

- `archivi:folder:read` - View folder hierarchy.
- `archivi:folder:write` - Create/edit/delete folder tree.
- `archivi:document:read` - Search and download documents.
- `archivi:document:write` - Upload documents/versions.
- `archivi:document:delete` - Soft-delete files.
- `archivi:correspondence:read` - Read correspondence log.
- `archivi:correspondence:write` - Create/edit correspondence.
- `archivi:correspondence:approve` - Transition review state to approved/rejected.

---

## 6. Implementation Milestones

1. **Milestone 4.1**: Database schema & TypeORM entity models creation (tenant isolated).
2. **Milestone 4.2**: Core service layer implementation (Folder structures & Tag associations).
3. **Milestone 4.3**: Document versioning & MinIO object storage connection wrapper.
4. **Milestone 4.4**: Correspondence review workflow engine and HTTP REST controllers.
5. **Milestone 4.5**: Verification and integration testing.
