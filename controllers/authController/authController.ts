import type { Context } from "hono";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function adminLogin(c: Context) {
    const { password } = await c.req.json();

    if (!password) {
        return c.json({ success: false, message: "Пароль обов'язковий" }, 400);
    }

    try {
        const adminPassword = process.env.ADMIN_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;

        if (!adminPassword || !jwtSecret) {
            return c.json({ success: false, message: "Помилка конфігурації сервера" }, 500);
        }

        const isValid = await bcrypt.compare(password, adminPassword);

        if (!isValid) {
            return c.json({ success: false, message: "Невірний пароль" }, 401);
        }

        const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "24h" });

        return c.json({ success: true, token });
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
