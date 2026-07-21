function FormattedNumber({ number, currency = "USD", maximumFractionDigits = 0 }) {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(number);

  return <span>{formattedNumber}</span>;
}

export default FormattedNumber;