import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { setCookie, deleteCookie } from 'hono/cookie';
import isAdminMiddleware from '../../middlewares/isAdminMiddleware.js';
const adminRoute = new Hono();
adminRoute.post('/login', async (c) => {
    try {
        const { password } = await c.req.json();
        if (!password) {
            return c.json({ success: false, message: 'Пароль не надано' }, 400);
        }
        const adminPassword = process.env.ADMIN_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;
        if (!adminPassword || !jwtSecret) {
            return c.json({ success: false, message: 'Конфігурація сервера не завершена' }, 500);
        }
        const isPasswordValid = await bcrypt.compare(password, adminPassword);
        if (!isPasswordValid) {
            return c.json({ success: false, message: 'Невірний пароль' }, 401);
        }
        const token = jwt.sign({ isAdmin: true }, jwtSecret, { expiresIn: '24h' });
        setCookie(c, 'admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 86400, // 24 hours
            path: '/'
        });
        return c.json({
            success: true,
            message: 'Успішний вхід'
        });
    }
    catch (error) {
        console.error('Помилка при логіні:', error);
        return c.json({ success: false, message: 'Помилка сервера' }, 500);
    }
});
adminRoute.post('/logout', isAdminMiddleware, async (c) => {
    deleteCookie(c, 'admin_token', { path: '/' });
    return c.json({
        success: true,
        message: 'Успішний вихід'
    });
});
adminRoute.get('/verify', isAdminMiddleware, async (c) => {
    return c.json({
        success: true,
        message: 'Токен дійсний',
        //@ts-ignore
        user: c.get('user')
    });
});
export default adminRoute;
