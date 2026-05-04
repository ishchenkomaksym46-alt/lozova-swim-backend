import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { setCookie, deleteCookie } from 'hono/cookie';
import isAdminMiddleware from '../../middlewares/isAdminMiddleware.js';
const adminRoute = new Hono();
function getAdminCookieOptions(c) {
    const requestUrl = new URL(c.req.url);
    const forwardedProto = c.req.header('x-forwarded-proto')?.split(',')[0]?.trim();
    const protocol = forwardedProto || requestUrl.protocol.replace(':', '');
    const apiOrigin = `${protocol}://${requestUrl.host}`;
    const requestOrigin = c.req.header('origin');
    const isCrossOriginRequest = Boolean(requestOrigin && requestOrigin !== apiOrigin);
    const isHttpsRequest = protocol === 'https';
    return {
        httpOnly: true,
        secure: isHttpsRequest,
        sameSite: (isCrossOriginRequest && isHttpsRequest ? 'None' : 'Lax'),
        maxAge: 86400,
        path: '/'
    };
}
adminRoute.post('/login', async (c) => {
    try {
        const { password } = await c.req.json();
        if (!password) {
            return c.json({ success: false, message: 'РџР°СЂРѕР»СЊ РЅРµ РЅР°РґР°РЅРѕ' }, 400);
        }
        const adminPassword = process.env.ADMIN_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;
        if (!adminPassword || !jwtSecret) {
            return c.json({ success: false, message: 'РљРѕРЅС„С–РіСѓСЂР°С†С–СЏ СЃРµСЂРІРµСЂР° РЅРµ Р·Р°РІРµСЂС€РµРЅР°' }, 500);
        }
        const isPasswordValid = await bcrypt.compare(password, adminPassword);
        if (!isPasswordValid) {
            return c.json({ success: false, message: 'РќРµРІС–СЂРЅРёР№ РїР°СЂРѕР»СЊ' }, 401);
        }
        const token = jwt.sign({ isAdmin: true }, jwtSecret, { expiresIn: '24h' });
        setCookie(c, 'admin_token', token, getAdminCookieOptions(c));
        return c.json({
            success: true,
            message: 'РЈСЃРїС–С€РЅРёР№ РІС…С–Рґ',
            token
        });
    }
    catch (error) {
        console.error('РџРѕРјРёР»РєР° РїСЂРё Р»РѕРіС–РЅС–:', error);
        return c.json({ success: false, message: 'РџРѕРјРёР»РєР° СЃРµСЂРІРµСЂР°' }, 500);
    }
});
adminRoute.post('/logout', isAdminMiddleware, async (c) => {
    deleteCookie(c, 'admin_token', {
        path: '/',
        secure: getAdminCookieOptions(c).secure,
        sameSite: getAdminCookieOptions(c).sameSite
    });
    return c.json({
        success: true,
        message: 'РЈСЃРїС–С€РЅРёР№ РІРёС…С–Рґ'
    });
});
adminRoute.get('/verify', isAdminMiddleware, async (c) => {
    return c.json({
        success: true,
        message: 'РўРѕРєРµРЅ РґС–Р№СЃРЅРёР№',
        //@ts-ignore
        user: c.get('user')
    });
});
export default adminRoute;
