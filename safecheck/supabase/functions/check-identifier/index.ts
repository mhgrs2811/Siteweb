// Edge Function : point d'entrée HTTP public pour la vérification.
//
// Rôle : façade au-dessus de la RPC `check_identifier`, destinée à
//  - l'API publique / B2B (clé d'API, quotas par client),
//  - l'agrégation future de sources externes (listes anti-phishing, etc.).
// L'application mobile appelle la RPC directement ; cette fonction n'est pas
// encore utilisée par le client et sert de socle pour la v2.
//
// Déploiement : `supabase functions deploy check-identifier`

import { createClient } from 'npm:@supabase/supabase-js@2';

type Kind = 'phone' | 'email' | 'website';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let body: { kind?: Kind; value?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'validation' }, 400);
  }
  if (!body.kind || !['phone', 'email', 'website'].includes(body.kind) || !body.value) {
    return json({ error: 'validation' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
  );

  const { data, error } = await supabase.rpc('check_identifier', { p_kind: body.kind, p_value: body.value });
  if (error) {
    const status = error.message.includes('rate_limited') ? 429 : error.message.includes('validation') ? 400 : 500;
    return json({ error: error.message }, status);
  }
  return json(data, 200);
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
