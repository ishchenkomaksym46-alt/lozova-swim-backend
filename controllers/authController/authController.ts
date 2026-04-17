import type { Context } from "hono";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function adminLogin(c: Context) {
    try {
        const { password } = await c.req.json();

        if (!password) {
            return c.json({ success: false, message: 'Пароль обов\'язковий' }, 400);
        }

        const adminPassword = process.env.ADMIN_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;

        if (!adminPassword || !jwtSecret) {
            throw new Error('ADMIN_PASSWORD або JWT_SECRET не налаштовано');
        }

        const isPasswordValid = await bcrypt.compare(password, adminPassword);

        if (!isPasswordValid) {
            return c.json({ success: false, message: 'Невірний пароль' }, 401);
        }

        const token = jwt.sign(
            { isAdmin: true },
            jwtSecret,
            { expiresIn: '12h' }
        );

        return c.json({
            success: true,
            token,
            message: 'Успішна авторизація'
        });

    } catch (e) {
        console.error('Помилка при логині:', e);
        return c.json({ success: false, message: 'Помилка сервера' }, 500);
    }
}
