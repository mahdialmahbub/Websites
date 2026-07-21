// lib/filterProperties.js

// "Under $100K", "$100K - $300K" এই টেক্সট চিপগুলোর সাথে price মেলানো
function matchesBudget(price, budgetLabel) {
  if (!budgetLabel) return true;

  switch (budgetLabel) {
    case "Under $100K":
      return price < 100000;
    case "$100K - $300K":
      return price >= 100000 && price <= 300000;
    case "$300K - $500K":
      return price > 300000 && price <= 500000;
    case "$500K - $1M":
      return price > 500000 && price <= 1000000;
    case "$1M+":
      return price > 1000000;
    default:
      return true;
  }
}

/**
 * @param {Array} properties - পুরো property array (data/properties.js)
 * @param {Object} filters - { location, propertyType, budget }
 * @returns filtered array
 */
export function filterProperties(properties, filters) {
  const { location = "", propertyType = "", budget = "" } = filters;

  return properties.filter((property) => {
    const locationMatch = location.trim()
      ? property.location.toLowerCase().includes(location.trim().toLowerCase())
      : true;

    const typeMatch = propertyType ? property.type === propertyType : true;

    const budgetMatch = matchesBudget(property.price, budget);

    return locationMatch && typeMatch && budgetMatch;
  });
}
