export async function buildcontext(_authHeader?: string) {
  return { authHeader: _authHeader ?? null };
}
