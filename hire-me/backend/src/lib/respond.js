/** Every successful response has the same envelope: { success: true, data, message? } */
export function ok(res, data = null, message, status = 200) {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
}
