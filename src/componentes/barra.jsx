import { Link } from 'react-router-dom';

export default function Barra() {
  return (
    <nav style={{ padding: '15px', background: '#ef5350', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
         Pokédex
      </Link>
    </nav>
  );
}