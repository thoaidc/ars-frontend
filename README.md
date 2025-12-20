# ARS Frontend

Angular-based frontend application for the ARS (Auto Recharge System) platform.

## 📚 Documentation

### API Documentation
- **[API Documentation (Vietnamese)](./API_DOCUMENTATION.md)** - Tài liệu chi tiết về vị trí và cách sử dụng API calls trong dự án
- **[API Documentation (English)](./API_DOCUMENTATION_EN.md)** - Detailed documentation about API call locations and usage

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.18.2
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Production Build

```bash
npm run webapp:prod
```

## 📁 Project Structure

```
src/
├── app/
│   ├── constants/          # API constants and other app constants
│   │   └── api.constants.ts   # All API endpoint definitions
│   ├── core/
│   │   ├── config/         # Configuration services
│   │   ├── guards/         # Route guards
│   │   ├── interceptors/   # HTTP interceptors
│   │   ├── models/         # Data models
│   │   ├── services/       # API services (where HTTP calls are made)
│   │   └── utils/          # Utility functions
│   ├── pages/              # Application pages/components
│   └── shared/             # Shared components and utilities
├── assets/                 # Static assets
└── environments/           # Environment configurations
```

## 🔧 Key Technologies

- **Angular 18.2** - Frontend framework
- **RxJS 7.8** - Reactive programming
- **Bootstrap 5.3** - UI framework
- **Chart.js 4.4** - Data visualization
- **NgBootstrap** - Bootstrap components for Angular

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint:css` - Lint CSS/SCSS files
- `npm run lint:css:fix` - Fix CSS/SCSS linting issues

## 🔍 Finding API Calls

All API calls are organized in the service layer. To find where a specific API is called:

1. Check `src/app/constants/api.constants.ts` for the endpoint constant
2. Search for that constant in the codebase
3. Find the corresponding service in `src/app/core/services/`

For detailed information, see the [API Documentation](./API_DOCUMENTATION.md).

## 📦 Main Services

- **auth.service.ts** - Authentication and authorization
- **product.service.ts** - Product management
- **order.service.ts** - Order processing
- **payment.service.ts** - Payment handling
- **shop.service.ts** - Shop management
- **users.service.ts** - User management

See complete list in the [API Documentation](./API_DOCUMENTATION.md).

## 🌐 Environment Configuration

Configure the backend API URL in:
- `src/environments/environment.ts` (Development)
- `src/environments/environment.prod.ts` (Production)

```typescript
export const environment = {
  production: false,
  SERVER_API_URL: "http://localhost:8080"
};
```

## 📄 License

UNLICENSED - Private project
