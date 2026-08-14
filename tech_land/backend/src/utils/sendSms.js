/**
 * Placeholder SMS sender. Plug in a real provider (Twilio, local BD gateway
 * like SSL Wireless/Alpha SMS, etc.) by filling in the fetch/SDK call below.
 * Until then, it logs to the console so payment-OTP flows are testable.
 */
const sendSms = async ({ to, message }) => {
  const providerConfigured = process.env.SMS_PROVIDER_API_KEY;

  if (!providerConfigured) {
    console.log("📱 [DEV MODE - no SMS provider configured] SMS would be sent:");
    console.log(`   To: ${to}\n   Message: ${message}`);
    return { simulated: true };
  }

  // Example integration point:
  // await axios.post('https://sms-provider.com/api/send', { to, message, apiKey: process.env.SMS_PROVIDER_API_KEY });

  return { simulated: false };
};

module.exports = sendSms;
