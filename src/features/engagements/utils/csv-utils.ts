// Utility: Parse CSV string to array of objects
export function csvToArray<T = any>(csv: string): T[] {
  const [headerLine, ...lines] = csv.trim().split('\n');
  const headers = headerLine.split(',').map(h => h.replace(/^"|"$/g, ''));
  return lines.map(line => {
    const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));
    const obj: any = {};
    headers.forEach((h, i) => { obj[h] = values[i]; });
    return obj as T;
  });
}

// Utility: Convert array of objects to CSV string
export function arrayToCSV<T extends object>(data: T[]): string {
  if (!data.length) return '';
  const keys = Object.keys(data[0] as object);
  const csvRows = [
    keys.join(','), // header
    ...data.map(row => keys.map(k => JSON.stringify((row as any)[k] ?? '')).join(','))
  ];
  return csvRows.join('\n');
}

// Utility: Download a string as a file
export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
} 