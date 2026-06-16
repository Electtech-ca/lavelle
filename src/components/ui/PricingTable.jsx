export default function PricingTable({ title, columns, headers, rows = [], note }) {
  const cols = headers || columns || ['Service', 'Price']
  const isMultiCol = cols.length > 2
  return (
    <div style={{ marginBottom: 'var(--space-2xl)' }}>
      {title && <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-md)' }}>{title}</h3>}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
        <table className="pricing-table" style={{ minWidth: isMultiCol ? '500px' : '100%' }}>
          <thead>
            <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {Array.isArray(row)
                  ? row.map((cell, j) => <td key={j}>{cell}</td>)
                  : Object.values(row).map((cell, j) => <td key={j}>{cell}</td>)
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: 'var(--space-sm)', fontStyle: 'italic' }}>{note}</p>}
    </div>
  )
}
