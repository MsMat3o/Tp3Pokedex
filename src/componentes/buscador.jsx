export default function Buscador({ valor, alCambiar }) {
  return (
    <div style={{ marginBottom: '25px' }}>
      <input 
        type="text" 
        placeholder="Buscar Pokémon por nombre o número..." 
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        style={{ padding: '12px 20px', width: '100%', maxWidth: '400px', fontSize: '16px', borderRadius: '25px', border: '2px solid #ccc', outline: 'none' }}
      />
    </div>
  );
}