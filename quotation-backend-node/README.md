# Quotation Backend (Node.js + Express + MongoDB)

Business quotation/invoice management system backend API.

## Features

- 🔐 JWT Authentication
- 👥 User Management
- 📋 Customer Management
- 👔 Employee Management
- 📦 Product/Item Management with Categories
- 🧾 Order/Quotation Management with line items
- 💰 GST Calculation (18%)
- ✅ Request Validation
- 🧪 Unit & Integration Tests
- 🔒 Security with Helmet
- 📊 Logging with Morgan

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Testing**: Jest + Supertest

## Project Structure

```
quotation-backend-node/
├── src/
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   ├── utils/           # Helper utilities
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── __tests__/           # Test files
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Installation

### 1. Clone and Install Dependencies

```bash
cd quotation-backend-node
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quotation_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

```bash
# If using local MongoDB
mongod
```

### 4. Run the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Customers

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/customers` | List all customers (with search) | Yes |
| GET | `/api/customers/:id` | Get customer by ID | Yes |
| POST | `/api/customers` | Create customer | Yes |
| PUT | `/api/customers/:id` | Update customer | Yes |
| DELETE | `/api/customers/:id` | Delete customer | Yes |

### Employees

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/employees` | List all employees | Yes |
| GET | `/api/employees/:id` | Get employee by ID | Yes |
| POST | `/api/employees` | Create employee | Yes |
| PUT | `/api/employees/:id` | Update employee | Yes |
| DELETE | `/api/employees/:id` | Delete employee | Yes |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | List all categories | Yes |
| POST | `/api/categories` | Create category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

### Items (Products)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/items` | List items (search & filter by category) | Yes |
| GET | `/api/items/:id` | Get item by ID | Yes |
| POST | `/api/items` | Create item | Yes |
| PUT | `/api/items/:id` | Update item | Yes |
| DELETE | `/api/items/:id` | Delete item | Yes |

### Orders (Quotations)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | List all orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| POST | `/api/orders` | Create order | Yes |
| PUT | `/api/orders/:id` | Update order status | Yes |
| DELETE | `/api/orders/:id` | Delete order | Yes |

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

View coverage:
```bash
npm test -- --coverage
```

## API Examples

### Register User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Customer (with JWT token)

```bash
POST http://localhost:5000/api/customers
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Acme Corp",
  "phone": "9876543210",
  "gst": "27AABCU9603R1ZM",
  "address": "123 Business St, Mumbai"
}
```

### Create Order

```bash
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "customerId": "65abc123def456",
  "employeeId": "65abc789ghi012",
  "items": [
    { "itemId": "65def345jkl678", "quantity": 2, "price": 1500 },
    { "itemId": "65def901mno234", "quantity": 1, "price": 2500 }
  ],
  "gstEnabled": true,
  "notes": "Urgent order"
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "details": []
}
```

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Helmet for security headers
- CORS configured
- Input validation with express-validator
- MongoDB injection prevention via Mongoose

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quotation_system
JWT_SECRET=use_a_strong_random_secret_here
PORT=5000
```

### Deploy to Services

- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **DigitalOcean App Platform**: Connect GitHub repo

## License

MIT
