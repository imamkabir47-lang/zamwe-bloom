// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const allowedAdmins = new Set([
  "opeyemizahraa29@gmail.com",
  "faridamusag@gmail.com",
  "faizaaminu760@gmail.com",
]);

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { user_id, email } = await req.json();

    if (!user_id || !email) {
      return new Response(JSON.stringify({ error: "user_id and email are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify provided user_id belongs to an allowed admin email
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (userErr || !userRes?.user?.email) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const actualEmail = String(userRes.user.email).toLowerCase();
    if (!allowedAdmins.has(actualEmail)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upsert admin role (idempotent)
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });

    // If unique constraint violation (already assigned), treat as success
    if (error && !String(error?.message || "").includes("duplicate key")) {
      return new Response(JSON.stringify({ error: error.message || String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
