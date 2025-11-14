const formatPrice = (price) => {
  if (!price) return parseFloat(0).toLocaleString('en-IN');
  return parseFloat(price).toLocaleString('en-IN');
};

export { formatPrice };
