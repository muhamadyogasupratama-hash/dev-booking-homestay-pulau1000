function formatRupiah(number) {
  return Number(number).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  })
}

module.exports = { formatRupiah }