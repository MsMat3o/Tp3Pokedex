import { Link } from 'react-router-dom';

const COLORES_TIPO = {
  fire: '#FF6B35', water: '#4FC3F7', grass: '#66BB6A', electric: '#FFCA28',
  psychic: '#AB47BC', ice: '#80DEEA', dragon: '#5C6BC0', dark: '#546E7A',
  fairy: '#F48FB1', normal: '#BDBDBD', fighting: '#EF5350', flying: '#90CAF9',
  poison: '#CE93D8', ground: '#FFCC80', rock: '#BCAAA4', bug: '#AED581',
  ghost: '#7E57C2', steel: '#B0BEC5',
};

export default function CartaPoke({ id, nombre, foto, tipo }) {
  const color = COLORES_TIPO[tipo] || '#BDBDBD';

  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: '15px', padding: '20px', textAlign: 'center',
      backgroundColor: `${color}22`,  // color con 13% opacidad
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)', fontFamily: 'sans-serif',
    }}>
      <span style={{ color: '#888', fontWeight: 'bold', fontSize: '13px' }}>#{String(id).padStart(3, '0')}</span>
      <img src={foto} alt={nombre} style={{ width: '120px', height: '120px', display: 'block', margin: '5px auto' }} />
      <h3 style={{ textTransform: 'capitalize', margin: '10px 0', color: '#333' }}>{nombre}</h3>
      {tipo && (
        <span style={{ display: 'inline-block', background: color, color: 'white', borderRadius: '12px', padding: '3px 12px', fontSize: '13px', textTransform: 'capitalize', marginBottom: '10px' }}>
          {tipo}
        </span>
      )}
      <br />
      <Link to={`/pokemon/${id}`} style={{ display: 'inline-block', padding: '8px 18px', background: '#3b4cca', color: 'white', borderRadius: '20px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}>
        Ver Info
      </Link>
    </div>
  );
}
