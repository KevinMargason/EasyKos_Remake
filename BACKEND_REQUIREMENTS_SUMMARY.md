# 🔴 Backend Requirements Summary - CRITICAL

**Date:** March 23, 2026  
**Status:** Frontend Complete - Waiting for Backend Implementation  
**Frontend Build:** ✅ Passing (All 16 routes prerendered successfully)  
**Backend Base URL:** `https://easykosbackend-production.up.railway.app/api`

---

## 📋 Critical Missing Features

### 1. 🔴 **CRITICAL - Payment Methods Management** (`/payment-methods`)

**Status:** ❌ NOT IMPLEMENTED  
**Blocking:** Owner financial management & payment verification  
**Priority:** P0 - HIGH

#### Endpoints Required

| Method   | Endpoint                | Purpose                                      |
| -------- | ----------------------- | -------------------------------------------- |
| `GET`    | `/payment-methods`      | Fetch all payment methods for current owner  |
| `POST`   | `/payment-methods`      | Create new payment method (bank or e-wallet) |
| `PUT`    | `/payment-methods/{id}` | Update existing payment method               |
| `DELETE` | `/payment-methods/{id}` | Delete payment method                        |

#### Request Body - Create Bank Transfer

```json
{
  "type": "bank",
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_holder": "Budi Santoso",
  "is_primary": false
}
```

#### Request Body - Create E-Wallet

```json
{
  "type": "ewallet",
  "ewallet_type": "gopay",
  "phone_number": "08123456789",
  "account_holder": "Budi Santoso",
  "is_primary": false
}
```

#### Expected Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "bank",
  "bank_name": "BCA",
  "account_number": "****7890",
  "account_holder": "Budi Santoso",
  "is_primary": false,
  "created_at": "2026-03-23T10:30:00Z",
  "updated_at": "2026-03-23T10:30:00Z"
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "bank_name": "Bank name is required",
    "account_number": "Invalid account number format"
  }
}
```

#### Database Schema Required

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('bank', 'ewallet') NOT NULL,

  -- Bank fields
  bank_name VARCHAR(100),
  account_number VARCHAR(50),

  -- E-Wallet fields
  ewallet_type VARCHAR(50),
  phone_number VARCHAR(20),

  -- Common fields
  account_holder VARCHAR(100) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_is_primary (is_primary)
);
```

#### Validation Rules

| Field            | Rules                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `bank_name`      | Required when type='bank'; Must be from predefined list (BCA, Mandiri, BNI, BRI, CIMB, Danamon, Permata, Maybank) |
| `account_number` | Required when type='bank'; Must be 8-16 digits                                                                    |
| `ewallet_type`   | Required when type='ewallet'; Must be one of: gopay, ovo, dana, linkaja                                           |
| `phone_number`   | Required when type='ewallet'; Must be 10-13 digits, start with 08                                                 |
| `account_holder` | Required; Max 100 characters                                                                                      |
| `is_primary`     | Only one payment method per user can have is_primary=true                                                         |

#### Business Logic Requirements

1. **Only Owners Can Use:** This endpoint is restricted to role='owner' only
2. **User Isolation:** Users can only access/modify their own payment methods
3. **Primary Payment:** When creating with is_primary=true, set all other methods to is_primary=false
4. **Account Number Masking:** Always return masked account number (show only last 4 digits) in response
5. **Soft Delete Option:** Consider soft delete instead of hard delete for audit trail

---

### 2. 🟡 **HIGH - Deactivate Account** (`/auth/deactivate`)

**Status:** ❌ NOT IMPLEMENTED  
**Blocking:** User account management & privacy compliance  
**Priority:** P1 - HIGH

#### Endpoint Required

| Method | Endpoint                      | Purpose                                   |
| ------ | ----------------------------- | ----------------------------------------- |
| `POST` | `/auth/deactivate`            | Soft-deactivate user account (audit-safe) |
| `POST` | `/auth/reactivate` (optional) | Reactivate previously deactivated account |

#### Request Body - Deactivate Account

```json
{
  "password": "currentPassword123",
  "reason": "tidak lagi membutuhkan"
}
```

**Acceptable Reasons:**

- "tidak lagi membutuhkan"
- "privacy_concerns"
- "moving_to_other_service"
- "temporary_break"
- "other"

#### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Akun berhasil dinonaktifkan",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "deactivated",
    "deactivated_at": "2026-03-23T10:30:00Z",
    "can_reactivate_until": "2027-03-23T10:30:00Z"
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid password",
  "errors": {
    "password": "Password tidak sesuai"
  }
}
```

#### Database Schema Changes Required

```sql
-- Alter users table to add deactivation fields
ALTER TABLE users ADD COLUMN (
  status ENUM('active', 'deactivated', 'suspended') DEFAULT 'active',
  deactivated_at TIMESTAMP NULL,
  deactivated_reason VARCHAR(255) NULL,
  can_reactivate_until TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_deactivated_at (deactivated_at)
);
```

#### Validation Rules

| Field      | Rules                                                                     |
| ---------- | ------------------------------------------------------------------------- |
| `password` | Required; Must match user's current password (verify before deactivating) |
| `reason`   | Required; Must be one of predefined options                               |

#### Business Logic Requirements

1. **Password Verification:** Always verify current password before deactivating
2. **Soft Delete (No Data Loss):** Keep all user data intact in database
3. **Account Lock:** User cannot login with deactivated account
4. **Reactivation Window:** Allow reactivation for 1 year (365 days) after deactivation
5. **Data Anonymization (Optional):** Consider anonymizing sensitive user data after X days
6. **Logout All Sessions:** Invalidate all active tokens/sessions immediately
7. **Audit Trail:** Log deactivation event with timestamp, reason, and IP address

#### Security Considerations

- Require password verification (prevent unauthorized deactivation)
- Clear all active sessions/tokens after deactivation
- Send confirmation email to user's registered email
- Implement rate limiting (prevent abuse)
- Log all deactivation attempts

---

## 📊 Frontend Integration Status

### Payment Methods Hook

**File:** `core/hooks/usePayments.js`  
**Status:** ✅ Ready (waiting for backend)  
**Usage:**

```javascript
const {
  paymentMethods, // Array of payment methods
  isLoading, // Loading state
  error, // Error message
  fetchPaymentMethods, // Fetch all methods
  createPaymentMethod, // Add new method
  updatePaymentMethod, // Edit existing
  deletePaymentMethod, // Delete method
} = usePayments();

// Example: Fetch payment methods
useEffect(() => {
  fetchPaymentMethods();
}, [fetchPaymentMethods]);

// Example: Create new payment method
const handleAddBank = async (bankData) => {
  await createPaymentMethod({
    type: "bank",
    bank_name: "BCA",
    account_number: "1234567890",
    account_holder: "Budi Santoso",
    is_primary: false,
  });
};
```

### Payment Methods API Service

**File:** `core/services/api.js`  
**Status:** ✅ Ready (waiting for backend)  
**Available Methods:**

```javascript
import { paymentMethods } from "@/core/services/api";

// Fetch all
const response = await paymentMethods.getAll();

// Create
const newMethod = await paymentMethods.create({
  type: "bank",
  bank_name: "BCA",
  account_number: "1234567890",
  account_holder: "Budi Santoso",
  is_primary: false,
});

// Update
const updated = await paymentMethods.update(id, {
  is_primary: true,
});

// Delete
await paymentMethods.delete(id);
```

### Owner Profile Component

**File:** `component/shared/pages/ProfileContent.tsx`  
**Component Sections:**

- User Info (Name, Email, Phone) - ✅ Working
- Profile Picture - ✅ Working
- Reset Password - ✅ Working
- Payment Methods - ❌ **Waiting for backend** (UI ready, hooks ready, API ready)

---

## ✅ Already Implemented (Reference)

These endpoints are already working and can be used:

### Authentication & User

- ✅ `POST /auth/register` - Register new user
- ✅ `POST /auth/login` - Login user
- ✅ `POST /auth/logout` - Logout user
- ✅ `POST /auth/refresh` - Refresh access token

### Kos & Rooms

- ✅ `GET /kos` - Get all kos listings
- ✅ `GET /kos/{id}` - Get specific kos
- ✅ `POST /kos` - Create new kos (owner only)
- ✅ `PUT /kos/{id}` - Update kos
- ✅ `DELETE /kos/{id}` - Delete kos

### Rooms

- ✅ `GET /rooms` - Get all rooms
- ✅ `GET /rooms/{id}` - Get specific room
- ✅ `POST /rooms` - Create room
- ✅ `PUT /rooms/{id}` - Update room
- ✅ `DELETE /rooms/{id}` - Delete room

### Facilities & Rules

- ✅ `GET /fasilitas` - Get facilities
- ✅ `POST /fasilitas` - Create facility
- ✅ `GET /aturan` - Get house rules

### Payments

- ✅ `GET /payments` - Get all invoices
- ✅ `GET /payments/{id}` - Get specific invoice
- ✅ `POST /payments` - Create invoice
- ✅ `POST /payments/{id}/pay` - Process payment

### Pet (Tupai)

- ✅ `GET /tupai` - Get all pets
- ✅ `GET /tupai/{id}` - Get specific pet
- ✅ `POST /tupai/adopt` - Adopt new pet
- ✅ `POST /tupai/{id}/feed` - Feed pet
- ✅ `POST /tupai/{id}/sleep` - Pet sleep

### Wallet & Missions

- ✅ `GET /wallet/balance` - Get wallet balance
- ✅ `GET /missions` - Get all missions
- ✅ `POST /missions/{id}/claim` - Claim reward
- ✅ `POST /daily-login/claim` - Daily login reward

### Vouchers

- ✅ `GET /vouchers` - Get all vouchers
- ✅ `POST /vouchers` - Create voucher
- ✅ `POST /rewards/redeem` - Redeem voucher

---

## 🚀 Implementation Priority

### Phase 1 (P0 - CRITICAL)

- [ ] Implement `/payment-methods` CRUD endpoints
- [ ] Add database schema for payment_methods table
- [ ] Test all CRUD operations

### Phase 2 (P1 - HIGH)

- [ ] Implement `/auth/deactivate` endpoint
- [ ] Add deactivation & reactivation logic
- [ ] Add user status tracking (active/deactivated)
- [ ] Implement session invalidation on deactivate
- [ ] Implement payment method validation rules
- [ ] Add account number masking logic
- [ ] Add primary payment method logic

### Phase 3 (P2 - NORMAL)

- [ ] Add soft delete for payment methods (optional)
- [ ] Add audit logging for payment method changes (optional)
- [ ] Add audit logging for account deactivation (optional)
- [ ] Implement data anonymization after X days (optional)

---

## 📞 Contact & Questions

**Frontend Status:** ✅ Ready for prod  
**Backend Status:** ⏳ Waiting for backend implementation  
**Expected Timeline:** Implement payment-methods endpoints in next sprint

---

**Last Updated:** March 23, 2026  
**By:** Frontend Team (EasyKos)
