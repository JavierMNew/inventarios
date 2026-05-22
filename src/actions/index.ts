import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { getSupabase } from '../lib/supabase';

export const server = {
    createCompany: defineAction({
        accept: 'form',
        input: z.object({
            nombre: z.string().min(3, "El nombre de la empresa debe tener al menos 3 caracteres"),
            logo_url: z.string().optional(),
            config_visual: z.string().optional(),
            email_contacto: z.string().email("Debe ser un correo electrónico válido"),
            telefono: z.string().min(5, "El teléfono es obligatorio y debe tener al menos 5 dígitos"),
            horarios: z.string().optional(),
        }),
        handler: async (input, context) => {
            const supabaseClient = await getSupabase(context.cookies);
            
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
            if (authError || !user) {
                throw new Error("No autorizado");
            }
            
            const slug = input.nombre
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
                
            const { error } = await supabaseClient.from("empresas").insert([{
                dueño_id: user.id,
                nombre: input.nombre,
                logo_url: input.logo_url || null,
                config_visual: input.config_visual ? { color: input.config_visual } : null,
                email_contacto: input.email_contacto,
                telefono: input.telefono,
                horarios: input.horarios ? { info: input.horarios } : null,
                slug,
            }]);
            
            if (error) {
                throw new Error(`Error de base de datos: ${error.message}`);
            }
            
            return { success: true, slug };
        }
    }),
    
    createMember: defineAction({
        accept: 'form',
        input: z.object({
            email: z.string().email("Debe ser un correo electrónico válido"),
            rol: z.enum(['owner', 'admin', 'contador', 'ayudante'], {
                errorMap: () => ({ message: "El rol seleccionado no es válido" })
            }),
            empresa_id: z.string().uuid("Debe seleccionar una empresa válida"),
        }),
        handler: async (input, context) => {
            const supabaseClient = await getSupabase(context.cookies);
            
            // 1. Verificar autenticación
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
            if (authError || !user) {
                throw new Error("No autorizado. Inicia sesión de nuevo.");
            }
            
            // 2. Verificar que el usuario tenga rol de owner o admin en la empresa
            const { data: membership, error: membershipError } = await supabaseClient
                .from("miembros_empresa")
                .select("rol")
                .eq("empresa_id", input.empresa_id)
                .eq("user_id", user.id)
                .maybeSingle();
                
            // Nota: Si es el dueño directo (empresas.dueño_id = user.id), también debe ser permitido.
            // Dado que el trigger handle_new_owner inserta al dueño en miembros_empresa al crear la empresa,
            // verificar miembros_empresa es suficiente y correcto.
            if (membershipError || !membership || !['owner', 'admin'].includes(membership.rol)) {
                throw new Error("No tienes permisos suficientes para agregar miembros a esta empresa.");
            }
            
            // 3. Buscar el perfil por el correo exacto
            const { data: profile, error: profileError } = await supabaseClient
                .from("profiles")
                .select("id")
                .eq("email", input.email.trim().toLowerCase())
                .maybeSingle();
                
            if (profileError) {
                throw new Error(`Error al buscar el perfil: ${profileError.message}`);
            }
            
            if (!profile) {
                throw new Error(`El usuario con el correo "${input.email}" no está registrado en el sistema. Pídele que se registre primero.`);
            }
            
            // 4. Verificar si el usuario ya es miembro de esta empresa
            const { data: existingMember } = await supabaseClient
                .from("miembros_empresa")
                .select("id")
                .eq("empresa_id", input.empresa_id)
                .eq("user_id", profile.id)
                .maybeSingle();
                
            if (existingMember) {
                throw new Error("El usuario ya es miembro de esta empresa.");
            }
            
            // 5. Insertar la membresía
            const { error: insertError } = await supabaseClient
                .from("miembros_empresa")
                .insert([{
                    id: crypto.randomUUID(),
                    user_id: profile.id,
                    empresa_id: input.empresa_id,
                    rol: input.rol,
                }]);
                
            if (insertError) {
                throw new Error(`No se pudo agregar al miembro: ${insertError.message}`);
            }
            
            return { success: true };
        }
    }),
    
    deleteMember: defineAction({
        accept: 'json',
        input: z.object({
            user_id: z.string().uuid(),
            empresa_id: z.string().uuid(),
        }),
        handler: async (input, context) => {
            const supabaseClient = await getSupabase(context.cookies);
            
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
            if (authError || !user) {
                throw new Error("No autorizado");
            }
            
            if (user.id === input.user_id) {
                throw new Error("No puedes eliminarte a ti mismo de la empresa");
            }
            
            const { data: membership, error: membershipError } = await supabaseClient
                .from("miembros_empresa")
                .select("rol")
                .eq("empresa_id", input.empresa_id)
                .eq("user_id", user.id)
                .maybeSingle();
                
            if (membershipError || !membership || !['owner', 'admin'].includes(membership.rol)) {
                throw new Error("No tienes permisos para eliminar miembros");
            }
            
            const { error: deleteError } = await supabaseClient
                .from("miembros_empresa")
                .delete()
                .eq("empresa_id", input.empresa_id)
                .eq("user_id", input.user_id);
                
            if (deleteError) {
                throw new Error(`Error de base de datos: ${deleteError.message}`);
            }
            
            return { success: true };
        }
    }),
    
    updateMemberRole: defineAction({
        accept: 'json',
        input: z.object({
            user_id: z.string().uuid(),
            empresa_id: z.string().uuid(),
            rol: z.enum(['owner', 'admin', 'contador', 'ayudante']),
        }),
        handler: async (input, context) => {
            const supabaseClient = await getSupabase(context.cookies);
            
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
            if (authError || !user) {
                throw new Error("No autorizado");
            }
            
            const { data: membership, error: membershipError } = await supabaseClient
                .from("miembros_empresa")
                .select("rol")
                .eq("empresa_id", input.empresa_id)
                .eq("user_id", user.id)
                .maybeSingle();
                
            if (membershipError || !membership || !['owner', 'admin'].includes(membership.rol)) {
                throw new Error("No tienes permisos para modificar roles de miembros");
            }
            
            if (user.id === input.user_id && input.rol !== 'owner') {
                const { data: otherOwners, error: ownersError } = await supabaseClient
                    .from("miembros_empresa")
                    .select("id")
                    .eq("empresa_id", input.empresa_id)
                    .eq("rol", "owner")
                    .neq("user_id", user.id);
                    
                if (ownersError || !otherOwners || otherOwners.length === 0) {
                    throw new Error("Debe haber al menos un Owner en la empresa. No puedes cambiar tu propio rol.");
                }
            }
            
            const { error: updateError } = await supabaseClient
                .from("miembros_empresa")
                .update({ rol: input.rol })
                .eq("empresa_id", input.empresa_id)
                .eq("user_id", input.user_id);
                
            if (updateError) {
                throw new Error(`Error de base de datos: ${updateError.message}`);
            }
            
            return { success: true };
        }
    })
};