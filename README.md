# FinTrack

FinTrack is a personal finance management application that helps users track their budgets, transactions, and financial reports efficiently. The platform enables users to set budgets, categorize expenses, and generate financial insights.

Here are additional features you can include in your README:  

## 🚀 Features  

- **User Budget Management**: Create and compare budgets with actual expenses.  
- **Category Management**: Assign transactions to categories and track spending.  
- **Transaction Tracking**: Add, update, and delete financial transactions.  
- **Financial Insights**: Get summaries of balances, income, expenses, and monthly transactions.  
- **User Identification**: Each user is identified using UUID.  
- **Budget vs Actual Comparison**: Analyze actual expenses against the planned budget.  
- **Monthly Reports**: Generate detailed financial reports for better financial planning.  
- **Cross-Platform Support**: Accessible on both web and mobile devices.  
- **Dark Mode Support**: UI adapts to user preferences for a better experience.  
- **RESTful API**: Well-structured API for seamless integration with other applications.  
- **Cloud Deployment**: Hosted on Netlify (frontend) and Render (backend) for scalability.  



## 📌 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/surajgsn07/fintrack.git
cd fintrack
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables (`.env`)
Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 🛠 API Routes

### **Budget Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/budget/create` | Create a new budget |
| `POST` | `/budget/comparison` | Compare budget vs actual expenses |

### **Category Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/category/all/:userId` | Get all categories for a user |
| `POST` | `/category/add-default/:userId` | Add default categories for a user |
| `GET` | `/category/budget/:userId` | Get all categories with assigned budgets |

### **Transaction Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/transaction/add` | Add a new transaction |
| `GET` | `/transaction/all/:userId` | Get all transactions for a user |
| `PUT` | `/transaction/update/:transactionId` | Update a transaction |
| `DELETE` | `/transaction/delete/:transactionId` | Delete a transaction |

### **Financial Summary Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/transaction/balance/:userId` | Get user balance |
| `GET` | `/transaction/income/:userId` | Get income for the current month |
| `GET` | `/transaction/expenses/:userId` | Get expenses for the current month |
| `GET` | `/transaction/monthly-transactions/:userId` | Get all transactions for the current month |
| `POST` | `/transaction/report` | Generate a monthly financial report |

---

## 📜 License
This project is licensed under the MIT License.

---
Sure! Here's a well-structured **Contact** section you can include in your README:  

## 📧 Contact  
For any issues, feature requests, or collaboration opportunities, feel free to reach out:  

- **LinkedIn**: [Suraj Singh](www.linkedin.com/in/suraj-singh-431010248)  
- **GitHub**: [Suraj Singh](https://github.com/surajgsn07)  
- **Email**: [surajgusain786786@gmail.com](mailto:surajgusain786786@gmail.com)  



