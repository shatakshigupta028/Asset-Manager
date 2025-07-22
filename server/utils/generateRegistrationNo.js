function generateRegistrationNo(type) {
  const typeMap = {
    Laptop: "LPT",
    Server: "SRV",
    PC: "PC",
    Printer: "PRT",
    Switch: "SWT",
    Router: "RTR",
    Display: "DSP"
  };

  const shortCode = typeMap[type] || type.toUpperCase().slice(0, 3); // fallback
  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  return `${shortCode}-REG-${yyyymmdd}-${random}`;
}

module.exports = generateRegistrationNo;
