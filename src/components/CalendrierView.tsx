import React, { useState, useMemo } from 'react';
import { Conge, Absence, Employe } from '../types';
import { formatDate } from '../services/api';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Clock,
  UserCheck,
} from 'lucide-react';

interface CalendrierViewProps {
  conges: Conge[];
  absences: Absence[];
  employes: Employe[];
}

export const CalendrierView: React.FC<CalendrierViewProps> = ({
  conges,
  absences,
  employes,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayDate(today.toISOString().slice(0, 10));
  };

  // Calendar cells computation
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday is 1, Sunday is 7 in French locale
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const totalDays = lastDayOfMonth.getDate();
    const cells: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

    // Preceding padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, d);
      cells.push({
        dateStr: prevDate.toISOString().slice(0, 10),
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const current = new Date(year, month, d);
      // Ensure local ISO string
      const yStr = current.getFullYear();
      const mStr = String(current.getMonth() + 1).padStart(2, '0');
      const dStr = String(current.getDate()).padStart(2, '0');
      cells.push({
        dateStr: `${yStr}-${mStr}-${dStr}`,
        dayNumber: d,
        isCurrentMonth: true,
      });
    }

    // Trailing padding to make a neat grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      cells.push({
        dateStr: nextDate.toISOString().slice(0, 10),
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month]);

  // Index events by day ISO
  const eventsByDay = useMemo(() => {
    const map = new Map<string, { conges: Conge[]; absences: Absence[] }>();

    conges.forEach((c) => {
      if (c.statut !== 'approuve') return;
      const start = (c.dateDebut || '').slice(0, 10);
      const end = (c.dateFin || '').slice(0, 10);
      if (!start || !end) return;

      const cur = new Date(start);
      const endDate = new Date(end);
      while (cur <= endDate) {
        const key = cur.toISOString().slice(0, 10);
        if (!map.has(key)) map.set(key, { conges: [], absences: [] });
        map.get(key)!.conges.push(c);
        cur.setDate(cur.getDate() + 1);
      }
    });

    absences.forEach((a) => {
      const key = (a.date || '').slice(0, 10);
      if (!key) return;
      if (!map.has(key)) map.set(key, { conges: [], absences: [] });
      map.get(key)!.absences.push(a);
    });

    return map;
  }, [conges, absences]);

  const selectedDayEvents = selectedDayDate ? eventsByDay.get(selectedDayDate) : null;
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Calendar Header Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 capitalize">{monthName}</h2>
          <button
            onClick={resetToday}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Congé approuvé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Absence déclarée</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-px mb-2 text-center text-xs font-semibold text-slate-500 uppercase">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mer</div>
            <div>Jeu</div>
            <div>Ven</div>
            <div className="text-slate-400">Sam</div>
            <div className="text-slate-400">Dim</div>
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell) => {
              const dayEvents = eventsByDay.get(cell.dateStr);
              const isToday = cell.dateStr === todayIso;
              const isSelected = cell.dateStr === selectedDayDate;
              const hasConges = dayEvents && dayEvents.conges.length > 0;
              const hasAbsences = dayEvents && dayEvents.absences.length > 0;

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDayDate(cell.dateStr)}
                  className={`min-h-[78px] p-2 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/30'
                      : isToday
                      ? 'border-slate-900 bg-slate-50/80 font-bold'
                      : cell.isCurrentMonth
                      ? 'border-slate-200/70 bg-white hover:bg-slate-50'
                      : 'border-slate-100 bg-slate-50/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs tabular-nums ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]'
                          : cell.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {(hasConges || hasAbsences) && (
                      <div className="flex items-center gap-1">
                        {hasConges && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                        {hasAbsences && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                      </div>
                    )}
                  </div>

                  {/* Badges preview */}
                  <div className="flex flex-col gap-1 w-full overflow-hidden mt-1">
                    {dayEvents?.conges.slice(0, 2).map((c, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] truncate px-1 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium"
                      >
                        🌴 {c.employeNom || 'Congé'}
                      </div>
                    ))}
                    {dayEvents?.absences.slice(0, 1).map((a, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] truncate px-1 py-0.5 rounded bg-rose-50 text-rose-800 font-medium"
                      >
                        🚫 {a.employeNom || 'Absence'}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Drawer */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-4">
              <Calendar className="w-4 h-4 text-sky-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedDayDate ? formatDate(selectedDayDate) : 'Sélectionnez un jour'}
                </h3>
                <p className="text-xs text-slate-400">Détail des indisponibilités</p>
              </div>
            </div>

            {selectedDayEvents && (selectedDayEvents.conges.length > 0 || selectedDayEvents.absences.length > 0) ? (
              <div className="space-y-4">
                {selectedDayEvents.conges.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>En congé ({selectedDayEvents.conges.length})</span>
                    </div>
                    <div className="space-y-2">
                      {selectedDayEvents.conges.map((c) => (
                        <div key={c._id} className="p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/50 text-xs">
                          <div className="font-semibold text-slate-900">{c.employeNom || c.employeId}</div>
                          <div className="text-slate-600 capitalize text-[11px] mt-0.5">
                            Type : {c.typeConge}
                          </div>
                          {c.commentaire && <div className="text-slate-500 italic mt-0.5">« {c.commentaire} »</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDayEvents.absences.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Absences signalées ({selectedDayEvents.absences.length})</span>
                    </div>
                    <div className="space-y-2">
                      {selectedDayEvents.absences.map((a) => (
                        <div key={a._id} className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/50 text-xs">
                          <div className="font-semibold text-slate-900">{a.employeNom || a.employeId}</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{a.motif || 'Absence'}</div>
                          <div className="text-slate-500 text-[10px] mt-0.5">
                            {a.justifiee ? 'Justificatif reçu' : 'Non justifiée'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <UserCheck className="w-8 h-8 mx-auto mb-2 text-emerald-500/70" />
                <p className="text-xs font-semibold text-slate-700">Effectif au complet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Aucune absence ni aucun congé enregistré pour cette date.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            Mise à jour en temps réel selon les validations
          </div>
        </div>
      </div>
    </div>
  );
};
