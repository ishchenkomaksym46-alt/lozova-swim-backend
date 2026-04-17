import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { getCookie } from "hono/cookie";

interface JWTPayload {
    isAdmin: boolean;
    iat?: number;
    exp?: number;
}

export default async function isAdminMiddleware(c: Context, next: Next) {
    try {
        let token: string | undefined;

        // Спочатку перевіряємо cookie
        token = getCookie(c, 'admin_token');

        // Якщо немає в cookie, перевіряємо Authorization header
        if (!token) {
            const authHeader = c.req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return c.json({ success: false, message: 'Токен не надано' }, 401);
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET не налаштовано');
        }

        const decoded = jwt.verify(token, secret) as JWTPayload;

        if (!decoded.isAdmin) {
            return c.json({ success: false, message: 'Доступ заборонено' }, 403);
        }

        c.set('user', decoded);

        return next();
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return c.json({ success: false, message: 'Невірний токен' }, 401);
        }
        if (e instanceof jwt.TokenExpiredError) {
            return c.json({ success: false, message: 'Токен прострочено' }, 401);
        }
        return c.json({ success: false, message: 'Помилка аутентифікації' }, 500);
    }
}