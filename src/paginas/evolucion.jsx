import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Cargando from '../componentes/cargando';
import Error from '../componentes/error';

const COLORES_TIPO = {
  fire: '#FF6B35', water: '#4FC3F7', grass: '#66BB6A', electric: '#FFCA28',
  psychic: '#AB47BC', ice: '#80DEEA', dragon: '#5C6BC0', dark: '#546E7A',
  fairy: '#F48FB1', normal: '#BDBDBD', fighting: '#EF5350', flying: '#90CAF9',
  poison: '#CE93D8', ground: '#FFCC80', rock: '#BCAAA4', bug: '#AED581',
  ghost: '#7E57C2', steel: '#B0BEC5',
};

export default function Evolucion() {
  const { id } = useParams();
  const [cadena, setCadena] = useState([]);
  const [tipoPrincipal, setTipoPrincipal] = useState('normal');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const traerEvoluciones = async () => {
      try {
        setCargando(true);

        // Paso 1: traer datos del Pokémon para obtener su especie y tipo
        const resPoke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const tipo = resPoke.data.types[0]?.type.name || 'normal';
        setTipoPrincipal(tipo);

        // Paso 2: traer la especie para obtener la cadena evolutiva
        const resEspecie = await axios.get(resPoke.data.species.url);

        // Paso 3: Endpoint 3 - cadena de evolución
        const resEvol = await axios.get(resEspecie.data.evolution_chain.url);

        // Paso 4: recorrer la cadena de evolución (estructura anidada de la API)
        const pasos = [];
        let eslabonActual = resEvol.data.chain;

        while (eslabonActual) {
          const nombre = eslabonActual.species.name;
          // Traer el sprite de cada Pokémon en la cadena
          const resDetalle = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
          pasos.push({
            nombre,
            id: resDetalle.data.id,
            foto: resDetalle.data.sprites.other['official-artwork'].front_default || resDetalle.data.sprites.front_default,
          });
          eslabonActual = eslabonActual.evolves_to[0] || null;
        }

        setCadena(pasos);
        setError(null);
      } catch {
        setError('No se pudo cargar la cadena de evolución.');
      } finally {
        setCargando(false);
      }
    };

    traerEvoluciones();
  }, [id]);

  if (cargando) return <Cargando />;
  if (error) return <Error mensaje={error} />;

  const color = COLORES_TIPO[tipoPrincipal] || '#BDBDBD';

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Cadena de evolución</h1>

      {cadena.length <= 1 ? (
        <p style={{ textAlign: 'center', color: '#777', fontSize: '18px' }}>
          Este Pokémon no tiene evoluciones.
        </p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
          {cadena.map((poke, index) => (
            <div key={poke.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Flecha entre evoluciones */}
              {index > 0 && (
                <span style={{ fontSize: '2rem', color: color }}>→</span>
              )}

              {/* Tarjeta de cada eslabón */}
              <Link to={`/pokemon/${poke.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  border: `3px solid ${poke.id.toString() === id ? color : '#e0e0e0'}`,
                  borderRadius: '15px', padding: '20px', textAlign: 'center',
                  background: poke.id.toString() === id ? `${color}22` : 'white',
                  minWidth: '140px', transition: 'transform 0.2s',
                }}>
                  <span style={{ color: '#aaa', fontSize: '13px' }}>#{String(poke.id).padStart(3, '0')}</span>
                  <img src={poke.foto} alt={poke.nombre} style={{ width: '110px', height: '110px', display: 'block', margin: '5px auto' }} />
                  <p style={{ textTransform: 'capitalize', margin: 0, fontWeight: 'bold', color: '#333' }}>{poke.nombre}</p>
                  {poke.id.toString() === id && (
                    <span style={{ fontSize: '12px', color: color, fontWeight: 'bold' }}>← actual</span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Navegación */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        <Link to={`/pokemon/${id}`} style={{ padding: '10px 24px', background: color, color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Ver detalles
        </Link>
        <Link to="/" style={{ padding: '10px 24px', background: '#757575', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
          🏠 Inicio
        </Link>
      </div>
    </div>
  );
}
