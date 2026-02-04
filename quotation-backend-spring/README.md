# Quotation Backend (Spring Boot + PostgreSQL)

Business quotation/invoice management system backend API built with Spring Boot.

## Features

- 🔐 JWT Authentication with Spring Security
- 👥 User Management
- 📋 Customer Management
- 👔 Employee Management
- 📦 Product/Item Management with Categories
- 🧾 Order/Quotation Management with line items
- 💰 GST Calculation (18%)
- ✅ Bean Validation
- 🧪 Unit & Integration Tests (JUnit 5, Mockito)
- 🔒 Security Best Practices
- 📊 PostgreSQL Database

## Tech Stack

- **Java**: 17+
- **Framework**: Spring Boot 3.2.1
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **Validation**: Bean Validation (JSR-380)
- **Build**: Maven
- **Testing**: JUnit 5, Mockito, Spring Boot Test

## Project Structure

```
quotation-backend-spring/
├── src/
│   ├── main/
│   │   ├── java/com/quotation/
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── repository/      # Spring Data repositories
│   │   │   ├── service/         # Business logic
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── security/        # Security configuration
│   │   │   ├── exception/       # Exception handling
│   │   │   └── QuotationApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/quotation/  # Test classes
├── pom.xml
└── README.md
```

## Installation

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 14+

### 1. Install PostgreSQL

**Windows (with Chocolatey):**
```bash
choco install postgresql
```

**Or download from:** https://www.postgresql.org/download/

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE quotation_system;
\q
```

### 3. Configure Application

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/quotation_system
spring.datasource.username=postgres
spring.datasource.password=your_password

jwt.secret=your_super_secret_jwt_key_minimum_256_bits
```

### 4. Build and Run

**Build the project:**
```bash
mvn clean install
```

**Run the application:**
```bash
mvn spring-boot:run
```

**Or run the JAR:**
```bash
java -jar target/quotation-backend-spring-1.0.0.jar
```

Server will run on `http://localhost:8080`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers (with search) |
| GET | `/api/customers/{id}` | Get customer by ID |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/{id}` | Update customer |
| DELETE | `/api/customers/{id}` | Delete customer |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

### Items (Products)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List items (search & filter) |
| GET | `/api/items/{id}` | Get item by ID |
| POST | `/api/items` | Create item |
| PUT | `/api/items/{id}` | Update item |
| DELETE | `/api/items/{id}` | Delete item |

### Orders (Quotations)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/{id}` | Update order |
| DELETE | `/api/orders/{id}` | Delete order |

## Testing

Run all tests:
```bash
mvn test
```

Run tests with coverage:
```bash
mvn test jacoco:report
```

Run specific test class:
```bash
mvn test -Dtest=AuthControllerTest
```

## API Examples

### Register User

```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "email": "john@example.com",
  "name": "John Doe"
}
```

### Create Customer (with JWT)

```bash
POST http://localhost:8080/api/customers
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
POST http://localhost:8080/api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "customerId": 1,
  "employeeId": 1,
  "items": [
    {
      "itemId": 1,
      "quantity": 2,
      "price": 1500.00
    }
  ],
  "gstEnabled": true,
  "notes": "Urgent delivery"
}
```

## Security

- Passwords encrypted with BCrypt
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- CORS configuration
- Input validation
- SQL injection prevention via JPA

## Deployment

### Package for Production

```bash
mvn clean package -DskipTests
```

### Deploy to Cloud

**Heroku:**
```bash
heroku create quotation-api
heroku addons:create heroku-postgresql
git push heroku main
```

**AWS Elastic Beanstalk:**
- Package as JAR
- Upload to Elastic Beanstalk
- Configure RDS PostgreSQL

**Docker:**
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## License

MIT
