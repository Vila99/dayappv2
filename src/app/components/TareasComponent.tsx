"use client"

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, List, Grid, Repeat } from 'lucide-react'

interface Tarea {
  id: number;
  nombre: string;
  dia: string;
  completada: boolean;
  esRutina: boolean;
}

interface DiaInfo {
  nombre: string;
  fecha: Date;
}

export default function TareasComponent() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: 1, nombre: 'Lavar ropa', dia: 'Lunes', completada: false, esRutina: true },
    { id: 2, nombre: 'Hacer compras', dia: 'Martes', completada: false, esRutina: false },
    { id: 3, nombre: 'Limpiar baño', dia: 'Miércoles', completada: true, esRutina: true },
  ])
  const [nuevaTarea, setNuevaTarea] = useState('')
  const [diaSeleccionado, setDiaSeleccionado] = useState('')
  const [vista, setVista] = useState<'diaria' | 'semanal' | 'lista'>('diaria')
  const [filtro, setFiltro] = useState<'todas' | 'completadas' | 'pendientes'>('todas')
  const [esRutina, setEsRutina] = useState(false)
  const [diasSemana, setDiasSemana] = useState<DiaInfo[]>([])

  useEffect(() => {
    const hoy = new Date()
    const primerDiaSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1))
    const dias: DiaInfo[] = []

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(primerDiaSemana)
      fecha.setDate(primerDiaSemana.getDate() + i)
      dias.push({
        nombre: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][fecha.getDay()],
        fecha: fecha
      })
    }

    setDiasSemana(dias)
    setDiaSeleccionado(dias[new Date().getDay() - 1].nombre)
  }, [])

  const agregarTarea = () => {
    if (nuevaTarea.trim() && diaSeleccionado) {
      setTareas([...tareas, {
        id: Date.now(),
        nombre: nuevaTarea.trim(),
        dia: diaSeleccionado,
        completada: false,
        esRutina: esRutina
      }])
      setNuevaTarea('')
      setEsRutina(false)
    }
  }

  const toggleCompletada = (id: number) => {
    setTareas(tareas.map(tarea =>
      tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    ))
  }

  const eliminarTarea = (id: number) => {
    setTareas(tareas.filter(tarea => tarea.id !== id))
  }

  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === 'completadas') return tarea.completada
    if (filtro === 'pendientes') return !tarea.completada
    return true
  })

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">Tareas</h2>
      <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nueva tarea..."
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <select
          value={diaSeleccionado}
          onChange={(e) => setDiaSeleccionado(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {diasSemana.map(dia => (
            <option key={dia.nombre} value={dia.nombre}>
              {dia.nombre} {dia.fecha.getDate()}
            </option>
          ))}
        </select>
        <button
          onClick={() => setEsRutina(!esRutina)}
          className={`p-2 rounded-md transition duration-300 flex items-center justify-center ${
            esRutina ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          aria-label={esRutina ? "Desactivar rutina semanal" : "Activar rutina semanal"}
        >
          <Repeat size={24} />
        </button>
        <button
          onClick={agregarTarea}
          className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition duration-300 flex items-center justify-center"
        >
          <Plus size={24} />
          <span className="ml-2 hidden sm:inline">Agregar</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <div className="flex justify-center sm:justify-start">
          <button
            onClick={() => setVista('diaria')}
            className={`mr-2 p-2 rounded ${vista === 'diaria' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
            aria-label="Vista diaria"
          >
            <Calendar size={24} />
          </button>
          <button
            onClick={() => setVista('semanal')}
            className={`mr-2 p-2 rounded ${vista === 'semanal' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
            aria-label="Vista semanal"
          >
            <Grid size={24} />
          </button>
          <button
            onClick={() => setVista('lista')}
            className={`p-2 rounded ${vista === 'lista' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
            aria-label="Vista de lista"
          >
            <List size={24} />
          </button>
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as 'todas' | 'completadas' | 'pendientes')}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="todas">Todas</option>
          <option value="completadas">Completadas</option>
          <option value="pendientes">Pendientes</option>
        </select>
      </div>

      {vista === 'diaria' && (
        <div className="space-y-2">
          <h3 className="font-bold text-lg">
            {diaSeleccionado} {diasSemana.find(d => d.nombre === diaSeleccionado)?.fecha.getDate()}
          </h3>
          {tareasFiltradas.filter(tarea => tarea.dia === diaSeleccionado).map(tarea => (
            <TareaItem key={tarea.id} tarea={tarea} toggleCompletada={toggleCompletada} eliminarTarea={eliminarTarea} />
          ))}
        </div>
      )}

      {vista === 'semanal' && (
        <div className="space-y-4">
          {diasSemana.map(dia => (
            <div key={dia.nombre} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">
                {dia.nombre} {dia.fecha.getDate()}
              </h3>
              <div className="space-y-2">
                {tareasFiltradas.filter(tarea => tarea.dia === dia.nombre).map(tarea => (
                  <TareaItem key={tarea.id} tarea={tarea} toggleCompletada={toggleCompletada} eliminarTarea={eliminarTarea} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {vista === 'lista' && (
        <div className="space-y-2">
          {tareasFiltradas.map(tarea => (
            <TareaItem key={tarea.id} tarea={tarea} toggleCompletada={toggleCompletada} eliminarTarea={eliminarTarea} />
          ))}
        </div>
      )}
    </div>
  )
}

interface TareaItemProps {
  tarea: Tarea;
  toggleCompletada: (id: number) => void;
  eliminarTarea: (id: number) => void;
}

function TareaItem({ tarea, toggleCompletada, eliminarTarea }: TareaItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${
        tarea.esRutina
          ? tarea.completada ? 'bg-blue-100' : 'bg-blue-200'
          : tarea.completada ? 'bg-green-100' : 'bg-yellow-100'
      }`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={tarea.completada}
          onChange={() => toggleCompletada(tarea.id)}
          className="mr-3 form-checkbox h-5 w-5 text-purple-600 transition duration-150 ease-in-out"
        />
        <span className={`${tarea.completada ? 'line-through text-gray-500' : ''}`}>
          {tarea.nombre}
        </span>
        {tarea.esRutina && (
          <Repeat size={18} className="ml-2 text-blue-500" />
        )}
      </div>
      <div className="flex items-center">
        <span className="mr-2 text-sm text-gray-500">{tarea.dia}</span>
        <button onClick={() => eliminarTarea(tarea.id)} className="text-red-500 hover:text-red-700" aria-label="Eliminar tarea">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}