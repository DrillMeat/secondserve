# Second Serve E-commerce Platform

A modern, full-stack e-commerce platform that connects consumers with shop owners. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### For Consumers
- **Browse Products**: Search and filter products by category, price, and more
- **Shopping Cart**: Add items to cart and manage quantities
- **Secure Checkout**: Multiple payment methods with secure transactions
- **Order Tracking**: Track your orders from purchase to delivery
- **User Profiles**: Manage personal information and addresses
- **Product Reviews**: Rate and review products

### For Shop Owners
- **Product Management**: Add, edit, and delete products with rich details
- **Inventory Control**: Track stock levels and manage inventory
- **Order Management**: Process orders, update status, and manage shipping
- **Sales Analytics**: View sales statistics and revenue reports
- **Shop Dashboard**: Comprehensive dashboard for business insights

### Platform Features
- **User Authentication**: Secure login/registration with JWT
- **Role-based Access**: Different interfaces for consumers and shop owners
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live inventory and order status updates
- **Search & Filtering**: Advanced product search and filtering
- **Payment Integration**: Multiple payment method support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secondserve-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/secondserve-ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create the database and collections

5. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 3000).

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client
```

### Production Build
```bash
# Build the frontend
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
secondserve-ecommerce/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # App entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (shop owners)
- `PUT /api/products/:id` - Update product (shop owners)
- `DELETE /api/products/:id` - Delete product (shop owners)

### Orders
- `POST /api/orders` - Create order (consumers)
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/shop/my-orders` - Get shop orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/shop-owners` - Get shop owners list

## 👥 User Roles

### Consumer
- Browse and search products
- Add items to cart
- Place orders
- Track order status
- Manage profile

### Shop Owner
- All consumer features
- Manage products
- Process orders
- View analytics
- Manage shop settings

### Admin (Future)
- User management
- Platform analytics
- Content moderation
- System settings

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:
- Modifying `client/tailwind.config.js`
- Updating color schemes in `client/src/index.css`
- Creating custom components in `client/src/components/`

### Configuration
- Database connection: Update `MONGODB_URI` in server `.env`
- API URL: Update `REACT_APP_API_URL` in client `.env`
- JWT Secret: Update `JWT_SECRET` in server `.env`

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Set environment variables in your deployment platform
4. Update the frontend API URL to point to your deployed backend

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to platforms like:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@secondserve.com

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Real-time chat between buyers and sellers
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced search with AI
- [ ] Social media integration
- [ ] Email notifications
- [ ] Push notifications
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Bulk order management
- [ ] Shipping calculator
- [ ] Tax calculation
- [ ] Discount and coupon system

---

**Second Serve** - Empowering commerce through technology 🚀 