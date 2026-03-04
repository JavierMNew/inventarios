// With `output: 'static'` configured:
export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const first_name = formData.get("first_name")?.toString();
    const last_name = formData.get("last_name")?.toString();
    const phone = formData.get("phone")?.toString();

    if (!email || !password || !first_name || !last_name) {
        return new Response("Los campos de email, contraseña, nombre y apellido son requeridos", { status: 400 });
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name,
                last_name,
                phone,
            },
        },
    });

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    return redirect("/signin");
};