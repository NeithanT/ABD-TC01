import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import type { Estrella } from '../types';
import '../App.css';
import { readEstrellas, createEstrella, updateEstrella, deleteEstrella } from '../Api';

function StarSky() {
  const auth = useAuth();
  const [estrellas, setEstrellas] = useState<Estrella[]>([]);
  const [hoveredStar, setHoveredStar] = useState<Estrella | null>(null);

  const [popup, setPopup] = useState<{
    mode: 'create' | 'edit';
    x: number;
    y: number;
    id?: number;
  } | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    masa: 20,
    color: 16711680,
    cord_x: 0,
    cord_y: 0,
  });

  const [status, setStatus] = useState<string>('');

  const fetchEstrellas = async () => {
    const data = await readEstrellas();
    if (Array.isArray(data)) {
      setEstrellas(data);
    }
  };

  useEffect(() => {
    fetchEstrellas();
  }, []);

  const handleStarClick = (e: React.MouseEvent, estrella: Estrella) => {
    e.stopPropagation();
    setHoveredStar(null);
    setPopup({
      mode: 'edit',
      x: Math.min(window.innerWidth - 220, Math.max(10, estrella.cord_x + 20)),
      y: Math.min(window.innerHeight - 250, Math.max(10, estrella.cord_y)),
      id: estrella.id,
    });
    setForm({
      nombre: estrella.nombre,
      masa: estrella.masa,
      color: estrella.color,
      cord_x: estrella.cord_x,
      cord_y: estrella.cord_y,
    });
  };

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    setPopup({
      mode: 'create',
      x: Math.min(window.innerWidth - 220, Math.max(10, clickX)),
      y: Math.min(window.innerHeight - 250, Math.max(10, clickY)),
    });
    setForm({
      nombre: '',
      masa: 20,
      color: 16711680,
      cord_x: clickX,
      cord_y: clickY,
    });
  };

  const handleCreate = async () => {
    const res = await createEstrella(
      {
        nombre: form.nombre,
        masa: Number(form.masa),
        color: Number(form.color),
        cord_x: Number(form.cord_x),
        cord_y: Number(form.cord_y),
      },
      auth.user?.access_token
    );

    if (res && 'mensajeError' in res) {
      setStatus(`Error: ${res.mensajeError}`);
    } else {
      setStatus('Estrella creada (POST)');
      setPopup(null);
      fetchEstrellas();
    }
  };

  const handleUpdate = async () => {
    if (!popup?.id) return;
    const res = await updateEstrella(
      popup.id,
      {
        nombre: form.nombre,
        masa: Number(form.masa),
        color: Number(form.color),
        cord_x: Number(form.cord_x),
        cord_y: Number(form.cord_y),
      },
      auth.user?.access_token
    );

    if (res && 'mensajeError' in res) {
      setStatus(`Error: ${res.mensajeError}`);
    } else {
      setStatus('Estrella actualizada (PUT)');
      setPopup(null);
      fetchEstrellas();
    }
  };

  const handleDelete = async () => {
    if (!popup?.id) return;
    const res = await deleteEstrella(popup.id, auth.user?.access_token);

    if (res && typeof res === 'object' && 'mensajeError' in res) {
      setStatus(`Error: ${res.mensajeError}`);
    } else {
      setStatus('Estrella eliminada (DELETE)');
      setPopup(null);
      fetchEstrellas();
    }
  };

  return (
    <div
      onClick={handleSkyClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#060813',
        overflow: 'hidden',
        cursor: 'crosshair',
      }}
    >
      {hoveredStar && !popup && (
        <div
          className="star-tooltip"
          style={{
            left: hoveredStar.cord_x + 15,
            top: Math.max(10, hoveredStar.cord_y - 30),
          }}
        >
          <strong>{hoveredStar.nombre}</strong> (ID: {hoveredStar.id})<br />
          Masa: {hoveredStar.masa} | Color: {hoveredStar.color}<br />
          Pos: ({hoveredStar.cord_x}, {hoveredStar.cord_y})<br />
          {hoveredStar.usuario_creador && <>Creador: {hoveredStar.usuario_creador}<br /></>}
          <em>Clic para editar / borrar</em>
        </div>
      )}

      {estrellas.map((estrella, index) => {
        const hexColor =
          '#' +
          Math.max(0, Math.min(16777215, Math.floor(estrella.color || 0)))
            .toString(16)
            .padStart(6, '0');
        const isEditing = popup?.id === estrella.id;
        return (
          <div
            key={estrella.id ?? index}
            className="estrella"
            onClick={(e) => handleStarClick(e, estrella)}
            onMouseEnter={() => !popup && setHoveredStar(estrella)}
            onMouseLeave={() => setHoveredStar(null)}
            style={{
              width: estrella.masa,
              height: estrella.masa,
              left: estrella.cord_x,
              top: estrella.cord_y,
              backgroundColor: hexColor,
              outline: isEditing ? '2px solid yellow' : undefined,
            }}
          />
        );
      })}

      {popup && (
        <div
          className="star-popup"
          onClick={(e) => e.stopPropagation()}
          style={{
            left: popup.x,
            top: popup.y,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{popup.mode === 'create' ? 'Nueva (POST)' : `Editar #${popup.id}`}</strong>
            <button
              onClick={() => setPopup(null)}
              style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px' }}
            >
              ✕
            </button>
          </div>

          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre"
            autoFocus
          />

          <input
            type="number"
            value={form.masa}
            onChange={(e) => setForm({ ...form, masa: Number(e.target.value) })}
            placeholder="Masa"
          />

          <input
            type="number"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: Number(e.target.value) })}
            placeholder="Color"
          />

          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              value={form.cord_x}
              onChange={(e) => setForm({ ...form, cord_x: Number(e.target.value) })}
              style={{ width: '50%' }}
              placeholder="X"
            />
            <input
              type="number"
              value={form.cord_y}
              onChange={(e) => setForm({ ...form, cord_y: Number(e.target.value) })}
              style={{ width: '50%' }}
              placeholder="Y"
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {popup.mode === 'create' ? (
              <button
                type="button"
                onClick={handleCreate}
                style={{ background: '#2563eb', color: '#fff', flex: 1 }}
              >
                POST (Crear)
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleUpdate}
                  style={{ background: '#2563eb', color: '#fff', flex: 1 }}
                >
                  PUT (Guardar)
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{ background: '#dc2626', color: '#fff' }}
                >
                  DELETE (Borrar)
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {status && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}

export default StarSky;


