// Generates order IDs like "TECT-20260812-4F82K"
const generateOrderId = () => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TECT-${datePart}-${randomPart}`;
};

module.exports = generateOrderId;
