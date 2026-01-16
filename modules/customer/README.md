# Customer Module

Manages customer data and customer-related business operations.

## Overview

The Customer module is responsible for:

- Customer registration and profile management
- Customer contact information
- Customer due balance tracking
- Customer search and lookup

## Domain Concepts

### Customer

A customer represents a person or entity that does business with us.

**Attributes:**

- Name
- Email
- Phone
- Address (street, city, state, zip)

## Business Rules

- Each customer must have a unique email address
- Customer due balance is updated when invoices are added or payments are made
- Customers can be searched by name or email

## API

| Endpoint               | Description         |
| ---------------------- | ------------------- |
| `GET /customer`        | List all customers  |
| `GET /customer/:id`    | Get customer by ID  |
| `POST /customer`       | Create new customer |
| `PUT /customer/:id`    | Update customer     |
| `DELETE /customer/:id` | Remove customer     |

## Events

### Listens To

- `InvoiceAddedEvent` - Updates customer due balance when invoice is created

### Emits

- `CustomerCreatedEvent` - When a new customer is registered
- `CustomerUpdatedEvent` - When customer info changes

## Related Modules

- **Invoice** - Creates invoices for customers
- **Payment** - Processes payments from customers
