// With `output: 'static'` configured:
// TODO: Fix this
export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const rol = formData.get("rol")?.toString();
    const empresa_id = formData.get("empresa_id")?.toString();
    const user_id = formData.get("user_id")?.toString();

    if (!rol || !empresa_id || !user_id) {
        return new Response("Campos obligatorios", { status: 400 });
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

    const { data, error } = await supabase.from("empresas").insert([{

    }]).select();
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    return redirect("/app/members");
};