import { useState, useEffect } from 'react';
import axios from 'axios';
import Buscador from '../componentes/buscador';
import CartaPoke from '../componentes/cartapoke';
import Cargando from '../componentes/cargando';
import Error from '../componentes/error';

const POKEMONS_POR_PAGINA = 20;

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    const traerPokemons = async () => {
      try {
        setCargando(true);
        const offset = pagina * POKEMONS_POR_PAGINA;
        // Endpoint 1: listado paginado de Pokémon
        const respuesta = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${POKEMONS_POR_PAGINA}&offset=${offset}`
        );

        setTotalPaginas(Math.ceil(respuesta.data.count / POKEMONS_POR_PAGINA));

        // Traemos detalles de cada Pokémon para tener foto y tipo
        const promesas = respuesta.data.results.map(poke => axios.get(poke.url));
        const resultados = await Promise.all(promesas);

        const infoMapeada = resultados.map(res => ({
          id: res.data.id,
          nombre: res.data.name,
          foto: res.data.sprites.other['official-artwork'].front_default || res.data.sprites.front_default,
          tipo: res.data.types[0]?.type.name || 'normal',
        }));

        setPokemons(infoMapeada);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con la PokeAPI.');
      } finally {
        setCargando(false);
      }
    };

    traerPokemons();
  }, [pagina]);

  // Filtrado: si hay búsqueda activa filtra en la página actual
  const pokemonsFiltrados = pokemons.filter(poke =>
    poke.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    poke.id.toString() === busqueda.trim()
  );

  if (cargando) return <Cargando />;
  if (error) return <Error mensaje={error} />;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>¡Bienvenido a la Pokédex!</h2>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Buscador valor={busqueda} alCambiar={(val) => { setBusqueda(val); }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {pokemonsFiltrados.map(poke => (
          <CartaPoke
            key={poke.id}
            id={poke.id}
            nombre={poke.nombre}
            foto={poke.foto}
            tipo={poke.tipo}
          />
        ))}
      </div>

      {/* Paginación — solo se muestra si no hay búsqueda activa */}
      {!busqueda && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '35px' }}>
          <button
            onClick={() => setPagina(p => p - 1)}
            disabled={pagina === 0}
            style={{ padding: '10px 22px', borderRadius: '20px', border: 'none', background: pagina === 0 ? '#ccc' : '#3b4cca', color: 'white', cursor: pagina === 0 ? 'default' : 'pointer', fontWeight: 'bold' }}>
            ← Anterior
          </button>

          <span style={{ fontWeight: 'bold', color: '#555' }}>
            Página {pagina + 1} de {totalPaginas}
          </span>

          <button
            onClick={() => setPagina(p => p + 1)}
            disabled={pagina >= totalPaginas - 1}
            style={{ padding: '10px 22px', borderRadius: '20px', border: 'none', background: pagina >= totalPaginas - 1 ? '#ccc' : '#3b4cca', color: 'white', cursor: pagina >= totalPaginas - 1 ? 'default' : 'pointer', fontWeight: 'bold' }}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
