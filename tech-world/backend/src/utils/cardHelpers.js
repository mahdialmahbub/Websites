// Detects card network from the card number prefix (basic IIN ranges)
const detectCardNetwork = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, "");
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return "Mastercard";
  if (/^3[47]/.test(num)) return "American Express";
  if (/^6(?:011|5)/.test(num)) return "Discover";
  return "Unknown";
};

// Returns only "**** **** **** 1234" — the last 4 digits, nothing else usable
const maskCardNumber = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, "");
  const last4 = num.slice(-4);
  return `**** **** **** ${last4}`;
};

module.exports = { detectCardNetwork, maskCardNumber };
