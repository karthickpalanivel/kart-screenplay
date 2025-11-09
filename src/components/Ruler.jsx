export default function Ruler() {
  // Generate ruler marks (every 10mm)
  const marks = [];
  const totalWidth = 190; // 190mm writing area width
  const markInterval = 10; // 10mm intervals

  for (let i = 0; i <= totalWidth; i += markInterval) {
    marks.push(i);
  }

  return (
    <div className="ruler">
      <div style={{ 
        display: 'flex', 
        position: 'relative', 
        width: '100%',
        height: '100%',
        alignItems: 'flex-end'
      }}>
        {marks.map((mm, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${(mm / totalWidth) * 100}%`,
              height: index % 5 === 0 ? '20px' : '10px',
              borderLeft: '1px solid #999',
              fontSize: '8px',
              paddingLeft: '2px',
              color: '#666'
            }}
          >
            {index % 5 === 0 && mm}
          </div>
        ))}
      </div>
    </div>
  );
}

