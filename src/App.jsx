import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './paginas/home';
import Detalles from './paginas/detalles';
import Evolucion from './paginas/evolucion';
import Barra from './componentes/barra';

export function App() {
  return (
    <Router>
      {}
      <Barra /> 

      <Routes>
        {/* Vista 1: Pantalla principal con buscador y listado */}
        <Route path="/" element={<Home />} />

        {/* Vista 2: Detalle del Pokémon por ID */}
        <Route path="/pokemon/:id" element={<Detalles />} />

        {/* Vista 3: Evoluciones */}
        <Route path="/pokemon/:id/evolucion" element={<Evolucion />} />
      </Routes>
    </Router>
  );
}

export default App;