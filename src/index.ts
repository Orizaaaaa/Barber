import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './config/env';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import barberRoutes from './routes/barber.routes';
import serviceCatalogRoutes from './routes/serviceCatalog.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import inventoryRoutes from './routes/inventory.routes';
import resourceRoutes from './routes/resource.routes';
import reportRoutes from './routes/report.routes';
import payrollRoutes from './routes/payroll.routes';
import customerRoutes from './routes/customer.routes';
import promoRoutes from './routes/promo.routes';
import notificationRoutes from './routes/notification.routes';
import businessSettingsRoutes from './routes/businessSettings.routes';
import reviewRoutes from './routes/review.routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({ message: 'Barbershop API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/services', serviceCatalogRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payrolls', payrollRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', businessSettingsRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = Number(ENV.PORT);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
