export function Legend() {
  const items = [
    { color: '#3B82F6', icon: '🎮', label: 'Controller' },
    { color: '#22C55E', icon: '⚡', label: 'Command' },
    { color: '#A855F7', icon: '❓', label: 'Query' },
    { color: '#F97316', icon: '📢', label: 'Event' },
    { color: '#14B8A6', icon: '👂', label: 'Handler' },
  ];

  return (
    <div className="legend">
      <div className="legend-title">Legend</div>
      {items.map((item) => (
        <div key={item.label} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: item.color }} />
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
