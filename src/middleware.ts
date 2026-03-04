import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ cookies, redirect, url }, next) => {
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    const authPages = ["/signin", "/register"];
    const protectedPrefixes = ["/dashboard", "/app", "/create-company"];
    const hasSession = !!(accessToken && refreshToken);

    if (authPages.includes(url.pathname) && hasSession) {
        return redirect("/dashboard");
    }

    const isProtected = protectedPrefixes.some(path => url.pathname.startsWith(path));

    if (isProtected && !hasSession) {
        return redirect("/signin");
    }

    return next();
});
