class LibroExel {
  async generarYDescargarExcel(datos , arrayAtributos , nombre) {
    const dataMatrix = datos.map(objeto => Object.values(objeto));
    const ws = XLSX.utils.aoa_to_sheet([arrayAtributos, ...dataMatrix]);
    const columnWidths = {};
    dataMatrix.forEach(row => {
      row.forEach((value, columnIndex) => {
        const columnKey = XLSX.utils.encode_col(columnIndex);
        const cellLength = String(value).length;
        columnWidths[columnKey] = Math.max(columnWidths[columnKey] || 0, cellLength);
      });
    });
    ws['!cols'] = Object.keys(columnWidths).map(col => ({
      wch: columnWidths[col]
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export default LibroExel;