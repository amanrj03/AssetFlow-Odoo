# AssetFlow Postman Testing Guide

This guide contains the method, endpoint path, description, headers, query/path parameters, and sample request body payloads for testing every single API endpoint in AssetFlow.

---

## Environment Variables
In Postman, set a collection variable `host` with value:
`http://localhost:5000`

---

## 1. Authentication (`/api/auth`)

### Signup User
*   **Method**: `POST`
*   **Path**: `/api/auth/signup`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "email": "jane.doe@assetflow.com",
      "password": "SecurePassword123!",
      "name": "Jane Doe",
      "employeeCode": "EMP010"
    }
    ```

### Login User
*   **Method**: `POST`
*   **Path**: `/api/auth/login`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "email": "admin@assetflow.com",
      "password": "password123"
    }
    ```
*   **Note**: Once logged in successfully, a HTTP-only cookie named `token` is set in the client's cookiejar. Subsequent calls automatically send this cookie.

### Get Current User Profile
*   **Method**: `GET`
*   **Path**: `/api/auth/me`
*   **Headers**: *Cookie authentication (handled automatically)*

### Logout User
*   **Method**: `POST`
*   **Path**: `/api/auth/logout`

---

## 2. Departments (`/api/departments`)

### List Departments
*   **Method**: `GET`
*   **Path**: `/api/departments`

### Get Department by ID
*   **Method**: `GET`
*   **Path**: `/api/departments/:id` (Replace `:id` with target Department UUID)

### Create Department
*   **Method**: `POST`
*   **Path**: `/api/departments`
*   **Role Required**: `ADMIN`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "name": "Quality Assurance",
      "description": "Software manual and automated testing division",
      "parentDepartmentId": "PARENT_DEPT_UUID_OPTIONAL"
    }
    ```

### Update Department
*   **Method**: `PUT`
*   **Path**: `/api/departments/:id`
*   **Role Required**: `ADMIN`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "name": "QA & Quality Control",
      "description": "Product testing division",
      "headId": "EMPLOYEE_UUID_OF_DEPARTMENT_HEAD"
    }
    ```

### Delete Department (Soft Delete)
*   **Method**: `DELETE`
*   **Path**: `/api/departments/:id`
*   **Role Required**: `ADMIN`

---

## 3. Categories (`/api/categories`)

### List Categories
*   **Method**: `GET`
*   **Path**: `/api/categories`

### Get Category by ID
*   **Method**: `GET`
*   **Path**: `/api/categories/:id`

### Create Category
*   **Method**: `POST`
*   **Path**: `/api/categories`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "name": "Tablet Computers",
      "description": "iOS and Android mobile tablets"
    }
    ```

### Update Category
*   **Method**: `PUT`
*   **Path**: `/api/categories/:id`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "name": "Handheld Devices",
      "description": "Updated tablets and mobile testing phones"
    }
    ```

### Delete Category
*   **Method**: `DELETE`
*   **Path**: `/api/categories/:id`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

---

## 4. Employees / User Directory (`/api/employees`)

### List Employees
*   **Method**: `GET`
*   **Path**: `/api/employees`
*   **Queries**: `page=1&limit=10` (Optional)

### Get Employee Details
*   **Method**: `GET`
*   **Path**: `/api/employees/:id`

### Update Profile Details
*   **Method**: `PUT`
*   **Path**: `/api/employees/:id`
*   **Role Required**: `ADMIN` (Or Employee updating their own account)
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "name": "Jane Smith Updated",
      "phone": "+1234567890"
    }
    ```

### Promote Employee Role
*   **Method**: `PATCH`
*   **Path**: `/api/employees/promote`
*   **Role Required**: `ADMIN`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "userId": "EMPLOYEE_UUID_TO_PROMOTE",
      "role": "ASSET_MANAGER"
    }
    ```

### Update Employee Status
*   **Method**: `PATCH`
*   **Path**: `/api/employees/status`
*   **Role Required**: `ADMIN`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "userId": "EMPLOYEE_UUID_TO_CHANGE",
      "status": "INACTIVE"
    }
    ```

### Transfer Employee Department
*   **Method**: `PATCH`
*   **Path**: `/api/employees/department`
*   **Role Required**: `ADMIN`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "userId": "EMPLOYEE_UUID_TO_TRANSFER",
      "departmentId": "TARGET_DEPARTMENT_UUID"
    }
    ```

---

## 5. Assets (`/api/assets`)

### Register Asset (Create)
*   **Method**: `POST`
*   **Path**: `/api/assets`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: multipart/form-data`
*   **Body (Form Data)**:
    *   `name`: `Development Workstation Laptop`
    *   `categoryId`: `CATEGORY_UUID`
    *   `departmentId`: `DEPARTMENT_UUID`
    *   `serialNumber`: `SN99882211`
    *   `purchaseCost`: `1850`
    *   `location`: `HQ Room 402`
    *   `image`: *(Optional File Upload)*
    *   `documents`: *(Optional File Upload)*

### List Assets
*   **Method**: `GET`
*   **Path**: `/api/assets`
*   **Queries**: `search=Thinkpad&status=AVAILABLE&categoryId=CAT_UUID` (Optional)

### Get Asset Details
*   **Method**: `GET`
*   **Path**: `/api/assets/:id`

### Update Asset
*   **Method**: `PUT`
*   **Path**: `/api/assets/:id`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "name": "ThinkPad Workstation Gen 3",
      "location": "HQ Ground Floor",
      "condition": "GOOD"
    }
    ```

### Soft-Delete Asset (Disposed)
*   **Method**: `DELETE`
*   **Path**: `/api/assets/:id`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

---

## 6. Allocations (`/api/allocations`)

### Checkout Asset (Create Allocation)
*   **Method**: `POST`
*   **Path**: `/api/allocations`
*   **Role Required**: `ADMIN`, `ASSET_MANAGER`, or `DEPARTMENT_HEAD`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "assetId": "ASSET_UUID_TO_ALLOCATE",
      "employeeId": "EMPLOYEE_UUID_RECIPIENT",
      "notes": "Allocating primary workstation",
      "expectedReturnDate": "2026-12-31T23:59:59.000Z"
    }
    ```

### Return Asset (Complete Allocation)
*   **Method**: `PATCH`
*   **Path**: `/api/allocations/:id/return`
*   **Role Required**: `ADMIN`, `ASSET_MANAGER`, or `DEPARTMENT_HEAD`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "returnCondition": "GOOD",
      "remarks": "Returned in clean condition"
    }
    ```

### List Allocations
*   **Method**: `GET`
*   **Path**: `/api/allocations`

---

## 7. Transfers (`/api/transfers`)

### Request Asset Transfer
*   **Method**: `POST`
*   **Path**: `/api/transfers`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "assetId": "ASSET_UUID_TO_TRANSFER",
      "toEmployeeId": "TARGET_RECIPIENT_EMPLOYEE_UUID",
      "reason": "Team reassignment"
    }
    ```

### Approve Transfer Request
*   **Method**: `PATCH`
*   **Path**: `/api/transfers/:id/approve`
*   **Role Required**: `ADMIN`, `ASSET_MANAGER`, or `DEPARTMENT_HEAD`

### Reject Transfer Request
*   **Method**: `PATCH`
*   **Path**: `/api/transfers/:id/reject`
*   **Role Required**: `ADMIN`, `ASSET_MANAGER`, or `DEPARTMENT_HEAD`

---

## 8. Resource Bookings (`/api/bookings`)

### Create Booking (Conflict overlap checked)
*   **Method**: `POST`
*   **Path**: `/api/bookings`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "assetId": "BOOKABLE_ASSET_UUID",
      "startTime": "2026-08-15T09:00:00.000Z",
      "endTime": "2026-08-15T11:00:00.000Z",
      "purpose": "Sprint planning meeting"
    }
    ```

### Reschedule Booking
*   **Method**: `PUT`
*   **Path**: `/api/bookings/:id`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "startTime": "2026-08-15T10:00:00.000Z",
      "endTime": "2026-08-15T12:00:00.000Z"
    }
    ```

### Cancel Booking
*   **Method**: `PATCH`
*   **Path**: `/api/bookings/:id/cancel`

### Get Booking Calendar List
*   **Method**: `GET`
*   **Path**: `/api/bookings/calendar`
*   **Queries**: `start=2026-08-01&end=2026-08-31` (Optional)

---

## 9. Maintenance (`/api/maintenance`)

### Raise Maintenance Request
*   **Method**: `POST`
*   **Path**: `/api/maintenance`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "assetId": "ASSET_UUID_TO_REPAIR",
      "issue": "Workstation battery draining too fast",
      "priority": "HIGH"
    }
    ```

### Approve Request
*   **Method**: `PATCH`
*   **Path**: `/api/maintenance/:id/approve`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Reject Request
*   **Method**: `PATCH`
*   **Path**: `/api/maintenance/:id/reject`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Assign Technician
*   **Method**: `PATCH`
*   **Path**: `/api/maintenance/:id/assign`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "technician": "John Tech Specialist"
    }
    ```

### Start Repair Work (In Progress)
*   **Method**: `PATCH`
*   **Path**: `/api/maintenance/:id/start`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Resolve Maintenance Request
*   **Method**: `PATCH`
*   **Path**: `/api/maintenance/:id/resolve`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "cost": 120,
      "notes": "Replaced workstation internal battery successfully."
    }
    ```

---

## 10. Audits (`/api/audits`)

### Create Audit Cycle
*   **Method**: `POST`
*   **Path**: `/api/audits`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "title": "Q3 General Workplace Audit",
      "startDate": "2026-07-01T00:00:00.000Z",
      "endDate": "2026-07-31T23:59:59.000Z",
      "scope": "All laptops and workstations in HQ"
    }
    ```

### Assign Auditor to Assets
*   **Method**: `POST`
*   **Path**: `/api/audits/:id/assign`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "auditorId": "EMPLOYEE_UUID_TO_BE_AUDITOR",
      "assetIds": [
        "ASSET_UUID_1",
        "ASSET_UUID_2"
      ]
    }
    ```

### Verify Asset Findings
*   **Method**: `POST`
*   **Path**: `/api/audits/:id/verify`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "assetId": "ASSET_UUID_BEING_VERIFIED",
      "result": "MISSING",
      "remarks": "Could not be found at assignee workstation"
    }
    ```

### Close Audit Cycle (Missing assets -> LOST)
*   **Method**: `PATCH`
*   **Path**: `/api/audits/:id/close`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Get Discrepancy Findings Report
*   **Method**: `GET`
*   **Path**: `/api/audits/:id/report`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

---

## 11. Notifications (`/api/notifications`)

### List Notifications
*   **Method**: `GET`
*   **Path**: `/api/notifications`
*   **Queries**: `isRead=false` (Optional)

### Mark One Notification as Read
*   **Method**: `PATCH`
*   **Path**: `/api/notifications/:id/read`

### Mark All Notifications as Read
*   **Method**: `PATCH`
*   **Path**: `/api/notifications/read-all`

### Delete Notification
*   **Method**: `DELETE`
*   **Path**: `/api/notifications/:id`

---

## 12. Activity Logs (`/api/activity-logs`)

### List Logs
*   **Method**: `GET`
*   **Path**: `/api/activity-logs`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Get Single Log Detail
*   **Method**: `GET`
*   **Path**: `/api/activity-logs/:id`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

---

## 13. Dashboard (`/api/dashboard`)

### Fetch Dashboard summary (Aggregated by active user role)
*   **Method**: `GET`
*   **Path**: `/api/dashboard`

---

## 14. Reports & Analytics (`/api/reports`)

### Asset Utilization
*   **Method**: `GET`
*   **Path**: `/api/reports/asset-utilization`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Department Summary
*   **Method**: `GET`
*   **Path**: `/api/reports/department-summary`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Maintenance Metrics
*   **Method**: `GET`
*   **Path**: `/api/reports/maintenance`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Resource Bookings Summary
*   **Method**: `GET`
*   **Path**: `/api/reports/bookings`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Audit Results Summary
*   **Method**: `GET`
*   **Path**: `/api/reports/audit`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`

### Export CSV
*   **Method**: `GET`
*   **Path**: `/api/reports/export`
*   **Role Required**: `ADMIN` or `ASSET_MANAGER`
*   **Queries**: `type=assets` (Valid types: `assets`, `maintenance`, `bookings`, `departments`, `audits`)
