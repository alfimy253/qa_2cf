// Never pass request bodies, identities, cookies, hashes or raw errors to logs.
// The two generated runtimes label the same credential sources differently:
// the Cloudflare Worker calls the deployment variables "worker secrets", the
// Vercel function calls them "environment". Both labels are allowlisted, so a
// log always says where the owner credential came from. A label outside this
// list is dropped rather than logged verbatim.
const AUTH_TRACE_SOURCES = [
  'database',
  'environment',
  'environment-repaired',
  'worker-secrets',
  'worker-secrets-repaired'
];

export function createAuthTrace(flow) {
  const requestId = globalThis.crypto.randomUUID();
  const started = Date.now();
  return (stage, details = {}) => {
    const safe = {};
    for (const key of ['status', 'configured', 'valid', 'source', 'accountCreated']) {
      if (typeof details[key] === 'boolean' || typeof details[key] === 'number') safe[key] = details[key];
    }
    if (AUTH_TRACE_SOURCES.includes(details.source)) safe.source = details.source;
    if (/^[0-9A-Z]{5}$/.test(details.code || '')) safe.code = details.code;
    console.log('[auth]', { requestId, flow, stage, elapsedMs: Date.now() - started, ...safe });
  };
}

export function registrationConflict(cause) {
  if (cause?.code !== '23505') return null;
  // Match the schema's actual keys, not every error mentioning the table.
  const constraint = String(cause.constraint || cause.message || '');
  if (/\b(?:tele_)?client_accounts_site_id_email_key\b/.test(constraint)) return 'account-email';
  if (/\btele_sites_email_unique_idx\b/.test(constraint)) return 'site-email';
  return null;
}
