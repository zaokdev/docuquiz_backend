function tienenLosMismosElementos(arr1, arr2) {
  if (!arr1 || !arr2) {
    return false;
  }
  return (
    arr1.length === arr2.length &&
    arr1.every((elemento) => arr2.includes(elemento))
  );
}

module.exports = tienenLosMismosElementos;
