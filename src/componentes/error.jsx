export default function Error({ mensaje }) {
  return (
    <div style={{ padding: '20px', margin: '20px', background: '#ffebee', color: '#c62828', borderRadius: '8px', border: '1px solid #ef9a9a', fontFamily: 'sans-serif' }}>
      <h3>⚠️ Hubo un problema</h3>
      <p>{mensaje}</p>
    </div>
  );
}