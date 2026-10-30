
# Alpha Male – E-commerce Platform

A full-stack e-commerce platform built with **Next.js, NestJS, and MongoDB**. The application provides a customer shopping experience, product campaign landing pages, order management, payment processing, and an admin dashboard for managing store operations.

---

## 1. Project Overview

Alpha Male is an e-commerce platform designed to manage the complete shopping lifecycle:

- Product browsing and discovery
- Guest and authenticated customer shopping
- Cart management
- Checkout and payment processing
- Order creation and management
- Shipment tracking
- Customer support tickets
- Admin dashboard and analytics
- Product-specific campaign landing pages

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.4.2 |
| Frontend Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | NestJS |
| Backend Language | TypeScript |
| Database | MongoDB |
| ODM | Mongoose |
| Payments | Razorpay, Cashfree, Easebuzz |
| Shipment Tracking | Shiprocket |
| Frontend Hosting | Vercel |
| Backend Hosting | AWS Elastic Beanstalk |
| API Testing | Postman |
| Version Control | Git / GitHub |

---

## 2. System Architecture

The application follows a frontend-backend architecture.

```text
                 CUSTOMER / ADMIN
                        |
                        |
                 Next.js Frontend
                        |
                 HTTP REST APIs
                        |
                   NestJS Backend
                        |
             -----------------------
             |          |          |
          MongoDB    Payment    Shiprocket
                     Gateways     APIs
             |          |          |
             -----------------------
                        |
                 API Responses
                        |
                 Next.js Frontend
```

### Application URLs

| Component | URL |
|---|---|
| Frontend | https://ecommerce-frontend-umber-alpha.vercel.app |
| Backend | http://property-env.eba-dhsg3mry.ap-south-1.elasticbeanstalk.com |
| Local Frontend | http://localhost:3000 |
| Local Backend | http://localhost:4000 |

---

## 3. Customer Application Flow

### 3.1 Product Browsing

1. Customer visits the website.
2. Frontend requests product data from the NestJS backend.
3. Backend retrieves products from MongoDB.
4. Product information is returned to the frontend.
5. Customer browses product listings and product details.

```text
Customer
   |
   v
Next.js Product Page
   |
   v
GET Product API
   |
   v
NestJS Product Controller
   |
   v
Product Service
   |
   v
MongoDB
   |
   v
Product Response
```

### 3.2 Cart Management

The platform supports both authenticated customers and guest customers.

**Authenticated customer flow:**

1. Customer logs in.
2. Frontend stores the customer access token.
3. Cart requests include the access token.
4. Backend identifies the customer.
5. Cart data is retrieved or updated.

**Guest customer flow:**

1. Guest visits the website.
2. A guest ID is maintained on the frontend.
3. Cart requests include the guest ID.
4. Backend identifies the guest cart.
5. Cart items can be added, updated, or removed.

```text
                  Customer
                     |
              ----------------
              |              |
           Logged In        Guest
              |              |
         Access Token      Guest ID
              |              |
              ----------------
                     |
                  Cart API
                     |
                NestJS Backend
                     |
                  MongoDB
```

### 3.3 Checkout and Payment Flow

The platform integrates multiple payment gateways:

- Razorpay
- Cashfree
- Easebuzz

The payment integration supports the checkout process and payment status handling.

```text
Customer
   |
   v
Shopping Cart
   |
   v
Checkout
   |
   v
Backend Payment API
   |
   v
Payment Gateway
   |
   v
Payment Result / Verification
   |
   v
Order Processing
   |
   v
MongoDB
   |
   v
Order Confirmation
```

**Note:** Exact gateway-specific verification, webhook, and order-creation sequences depend on their respective backend implementations.

### 3.4 Order Management

After checkout, customers can view their orders.

Order-related functionality includes:

- Order listing
- Order details
- Order status
- Payment information
- Shipment information

```text
Customer
   |
   v
My Orders
   |
   v
Orders API
   |
   v
NestJS Backend
   |
   v
MongoDB
   |
   v
Order Details
```

### 3.5 Shipment Tracking

The application integrates Shiprocket for shipment tracking.

```text
Customer
   |
   v
Order Details
   |
   v
Tracking Request
   |
   v
NestJS Backend
   |
   v
Shiprocket Tracking API
   |
   v
Tracking Information
   |
   v
Frontend Tracking Page
```

Customers can use the tracking functionality to check shipment progress.

### 3.6 Support Ticket Management

Customers can raise support tickets for assistance.

The platform supports:

- Authenticated customer tickets
- Guest customer tickets
- Ticket categories
- Ticket priorities
- Ticket status management
- Customer and admin conversations

**Customer flow:**

```text
Customer
   |
   v
Raise Support Ticket
   |
   v
Support Ticket API
   |
   v
NestJS Backend
   |
   v
MongoDB
```

**Admin flow:**

```text
Admin Dashboard
   |
   v
View All Tickets
   |
   v
Open Ticket Details
   |
   v
Read Conversation
   |
   v
Reply to Customer
   |
   v
Update Status / Priority
   |
   v
Resolve / Close / Reopen
```

---

## 4. Admin Dashboard Flow

The admin dashboard provides centralized management of the e-commerce platform.

Admin functionality includes:

- Product management
- Order management
- Campaign management
- Landing page management
- Support ticket management
- Sales and order analytics

### 4.1 Campaign and Landing Page Management

Admins can create product-specific campaign landing pages.

Campaign management includes:

- Select an existing product
- Set campaign title
- Configure URL slug
- Add headings and descriptions
- Configure CTA text and links
- Add hero and banner images
- Add highlights and benefits
- Configure SEO metadata
- Publish or unpublish campaigns
- Edit and delete campaigns

**Campaign creation flow:**

```text
Admin Dashboard
      |
      v
Create Campaign
      |
      v
Select Product
      |
      v
Configure Campaign Content
      |
      v
Configure SEO
      |
      v
Save Campaign
      |
      v
NestJS Backend
      |
      v
MongoDB
      |
      v
Campaign Landing Page
```

Public campaign URLs follow this structure:

```text
/campaign/{slug}
```

Example:

```text
/campaign/summer-sale
```

### 4.2 Support Ticket Administration

Admins can:

- View all support tickets
- Search and filter tickets
- View customer information
- Read ticket descriptions
- View conversation history
- Send replies
- Update ticket priority
- Update ticket status
- Resolve, close, or reopen tickets

### 4.3 Analytics Dashboard

The admin analytics module provides an overview of store performance.

Analytics include:

- Total orders
- Total sales and revenue
- Average order value
- Discounts and shipping
- Order status breakdown
- Payment method breakdown
- Returns information
- Sales chart
- Top products

The frontend retrieves analytics data from the backend statistics API.

---

## 5. Authentication and Authorization

The frontend uses separate authentication contexts for customers and administrators.

| User Type | Token Storage |
|---|---|
| Customer | `accessToken` |
| Admin | `adminaccesstoken` |
| Guest | `guestId` |

Authenticated API requests include a Bearer token:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The backend uses authentication guards to protect routes according to the user's role.

Guest-specific endpoints allow supported operations without requiring customer login.

---

## 6. Frontend Project Structure

Illustrative structure based on the current application modules:

```text
frontend/
│
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       ├── analytics/
│   │       └── support-tickets/
│   │
│   ├── campaign/
│   │   └── [slug]/
│   │
│   ├── products/
│   ├── orders/
│   │   └── [orderId]/
│   │
│   ├── track-order/
│   └── ...
│
├── components/
│   ├── Navbar
│   ├── CartDrawer
│   └── ...
│
├── hooks/
│   └── useCart.ts
│
├── public/
│
├── package.json
└── next.config.ts
```

---

## 7. Backend Project Structure

Illustrative NestJS module organization:

```text
backend/
│
├── src/
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── payment/
│   ├── support-ticket/
│   ├── landing-page/
│   ├── stats/
│   ├── ship-rocket/
│   │
│   ├── database/
│   ├── common/
│   ├── app.module.ts
│   └── main.ts
│
├── package.json
└── tsconfig.json
```

Actual folder and module names may differ depending on the backend repository.

---

## 8. Environment Configuration

### Frontend

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production, configure the appropriate production API URL in Vercel.

### Backend

Configure backend environment variables in the deployment environment.

Typical configuration categories:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret

EASEBUZZ_KEY=your_easebuzz_key
EASEBUZZ_SALT=your_easebuzz_salt

SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
```

These are configuration examples. Use the exact variable names required by the existing backend implementation.

**Never commit actual secrets or production credentials to GitHub.**

---

## 9. Local Development Setup

### Frontend Setup

```bash
# Clone the frontend repository
git clone YOUR_FRONTEND_REPOSITORY_URL

# Navigate to the project
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend:

```text
http://localhost:3000
```

### Backend Setup

```bash
# Clone the backend repository
git clone YOUR_BACKEND_REPOSITORY_URL

# Navigate to the project
cd backend

# Install dependencies
npm install

# Start development server
npm run start:dev
```

Backend:

```text
http://localhost:4000
```

Ensure MongoDB and all required third-party integrations are configured before testing their respective features.

---

## 10. Deployment Architecture

### Frontend – Vercel

The Next.js frontend is deployed on Vercel.

Deployment flow:

```text
GitHub Repository
       |
       v
Vercel Build
       |
       v
Next.js Production Build
       |
       v
Frontend Deployment
```

Configure production environment variables in Vercel.

### Backend – AWS Elastic Beanstalk

The NestJS backend is deployed using the existing AWS Elastic Beanstalk environment:

```text
Property-env
```

Backend deployment flow:

```text
Backend Source Code
       |
       v
Build Application
       |
       v
Deploy to AWS Elastic Beanstalk
       |
       v
Property-env
       |
       v
NestJS API
```

Production backend:

```text
http://property-env.eba-dhsg3mry.ap-south-1.elasticbeanstalk.com
```

---

## 11. Important Security Considerations

- Keep API secrets and database credentials in environment variables.
- Never expose payment gateway secret keys in frontend code.
- Validate payment status on the backend.
- Verify payment gateway webhooks.
- Protect admin endpoints using admin authentication guards.
- Validate incoming API request payloads.
- Apply appropriate authorization checks for customer orders and tickets.
- Restrict CORS to trusted frontend origins.
- Use HTTPS for production API communication.
- Avoid logging passwords, tokens, or sensitive payment information.

---

## 12. Future Improvements

Potential areas for further development:

- Redis caching for frequently accessed data
- Improved product search and filtering
- Automated inventory management
- Advanced sales reporting
- Email and notification automation
- Improved order lifecycle management
- Payment reconciliation automation
- Performance monitoring and API logging
- Automated backend and frontend testing

---

## 13. Project Summary

Alpha Male is a full-stack e-commerce platform built using Next.js, NestJS, and MongoDB.

The platform brings together customer shopping, guest cart management, multi-gateway payments, order processing, shipment tracking, campaign landing pages, customer support, and admin analytics.

Its architecture separates the frontend and backend, allowing each application to be developed, deployed, and maintained independently.
