// With `output: 'static'` configured:
export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const nombre = formData.get("nombre")?.toString();
    const logo_url = formData.get("logo_url")?.toString();
    const config_visual = formData.get("config_visual")?.toString();
    const email_contacto = formData.get("email_contacto")?.toString();
    const telefono = formData.get("telefono")?.toString();
    const horarios = formData.get("horarios")?.toString();

    if (!nombre || !email_contacto || !telefono) {
        return new Response("Faltan campos obligatorios (nombre, email o teléfono)", { status: 400 });
    }

    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
        return new Response("No autorizado", { status: 401 });
    }

    await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const slug = nombre?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const { data, error } = await supabase.from("empresas").insert([{
        nombre,
        logo_url,
        config_visual: config_visual ? { color: config_visual } : null,
        email_contacto,
        telefono,
        horarios: horarios ? { info: horarios } : null,
        slug,
    }]).select();
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    return redirect("/app/" + slug);
};