import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Cargando from '../componentes/cargando';
import Error from '../componentes/error';

// Colores por tipo de Pokémon (power-up: fondo según tipo principal)
const COLORES_TIPO = {
  fire: '#FF6B35', water: '#4FC3F7', grass: '#66BB6A', electric: '#FFCA28',
  psychic: '#AB47BC', ice: '#80DEEA', dragon: '#5C6BC0', dark: '#546E7A',
  fairy: '#F48FB1', normal: '#BDBDBD', fighting: '#EF5350', flying: '#90CAF9',
  poison: '#CE93D8', ground: '#FFCC80', rock: '#BCAAA4', bug: '#AED581',
  ghost: '#7E57C2', steel: '#B0BEC5',
};

// Nombres de estadísticas en español
const NOMBRE_STAT = {
  hp: 'HP', attack: 'Ataque', defense: 'Defensa',
  'special-attack': 'At. Especial', 'special-defense': 'Def. Especial', speed: 'Velocidad',
};

export default function Detalles() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sonandoCry, setSonandoCry] = useState(false);

  useEffect(() => {
    const traerDetalle = async () => {
      try {
        setCargando(true);
        // Endpoint 2: detalle individual del Pokémon
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(res.data);
        setError(null);
      } catch {
        setError('No se encontró ese Pokémon. Verificá el ID o nombre.');
      } finally {
        setCargando(false);
      }
    };
    traerDetalle();
  }, [id]);

  // Power-up: reproducir el cry (sonido) del Pokémon
  const reproducirCry = () => {
    if (!pokemon?.cries?.latest) return;
    const audio = new Audio(pokemon.cries.latest);
    setSonandoCry(true);
    audio.play();
    audio.onended = () => setSonandoCry(false);
  };

  if (cargando) return <Cargando />;
  if (error) return <Error mensaje={error} />;
  if (!pokemon) return null;

  const tipoPrincipal = pokemon.types[0]?.type.name;
  const colorFondo = COLORES_TIPO[tipoPrincipal] || '#BDBDBD';

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '30px', maxWidth: '700px', margin: '0 auto' }}>

      {/* Cabecera con color según tipo */}
      <div style={{ background: colorFondo, borderRadius: '20px', padding: '30px', textAlign: 'center', color: 'white', marginBottom: '25px' }}>
        <span style={{ fontSize: '14px', opacity: 0.85 }}>#{String(pokemon.id).padStart(3, '0')}</span>
        <h1 style={{ textTransform: 'capitalize', margin: '8px 0', fontSize: '2.2rem' }}>{pokemon.name}</h1>

        {/* Sprite oficial */}
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          style={{ width: '200px', height: '200px', filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.3))' }}
        />

        {/* Tipos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          {pokemon.types.map(t => (
            <span key={t.type.name} style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '20px', padding: '4px 16px', fontWeight: 'bold', textTransform: 'capitalize' }}>
              {t.type.name}
            </span>
          ))}
        </div>

        {/* Power-up: botón cry */}
        {pokemon.cries?.latest && (
          <button onClick={reproducirCry} disabled={sonandoCry}
            style={{ marginTop: '15px', padding: '8px 20px', borderRadius: '20px', border: 'none', background: 'rgba(255,255,255,0.25)', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            {sonandoCry ? '🔊 Reproduciendo...' : '🔊 Escuchar cry'}
          </button>
        )}
      </div>

      {/* Habilidades */}
      <div style={{ background: '#f9f9f9', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>Habilidades</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {pokemon.abilities.map(a => (
            <span key={a.ability.name} style={{ background: '#e3f2fd', borderRadius: '10px', padding: '6px 14px', textTransform: 'capitalize', color: '#1565c0' }}>
              {a.ability.name} {a.is_hidden && <em>(oculta)</em>}
            </span>
          ))}
        </div>
      </div>

      {/* Estadísticas base */}
      <div style={{ background: '#f9f9f9', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>Estadísticas base</h2>
        {pokemon.stats.map(s => {
          const porcentaje = Math.min((s.base_stat / 255) * 100, 100);
          return (
            <div key={s.stat.name} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#555' }}>{NOMBRE_STAT[s.stat.name] || s.stat.name}</span>
                <span style={{ color: '#333' }}>{s.base_stat}</span>
              </div>
              <div style={{ background: '#e0e0e0', borderRadius: '10px', height: '10px' }}>
                <div style={{ width: `${porcentaje}%`, background: colorFondo, borderRadius: '10px', height: '100%', transition: 'width 0.5s' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navegación */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link to="/" style={{ padding: '10px 24px', background: '#757575', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver
        </Link>
        <Link to={`/pokemon/${id}/evolucion`} style={{ padding: '10px 24px', background: colorFondo, color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
          Ver evoluciones →
        </Link>
      </div>
    </div>
  );
}
