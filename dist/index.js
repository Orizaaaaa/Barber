"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const barber_routes_1 = __importDefault(require("./routes/barber.routes"));
const serviceCatalog_routes_1 = __importDefault(require("./routes/serviceCatalog.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const payroll_routes_1 = __importDefault(require("./routes/payroll.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const promo_routes_1 = __importDefault(require("./routes/promo.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const businessSettings_routes_1 = __importDefault(require("./routes/businessSettings.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
    res.json({ message: 'Barbershop API', version: '1.0.0' });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/barbers', barber_routes_1.default);
app.use('/api/services', serviceCatalog_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/resources', resource_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/payrolls', payroll_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/promos', promo_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/settings', businessSettings_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});
if (!process.env.VERCEL) {
    const PORT = Number(env_1.ENV.PORT) || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map