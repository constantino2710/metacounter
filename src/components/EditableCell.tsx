import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface EditableCellProps {
  value: number;
  onSave: (newValue: number) => void;
  isEditable?: boolean;
  colorClass?: string;
  metaDia?: number;
  superMetaDia?: number;
}

export function EditableCell({ 
  value, 
  onSave, 
  isEditable = true,
  colorClass = '',
  metaDia,
  superMetaDia 
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseFloat(editValue) || 0;
    onSave(numValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getPerformanceColor = (): string => {
    if (!metaDia || metaDia === 0) return 'bg-gray-100 text-gray-600 border border-gray-200';
    
    // Supermeta é definida como 30% a mais que a meta
    const calculatedSuperMeta = superMetaDia || (metaDia * 1.3);
    
    if (value >= calculatedSuperMeta) {
      return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md border border-blue-400';
    } else if (value >= metaDia) {
      return 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md border border-green-400';
    } else if (value > 0) {
      return 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md border border-red-400';
    } else {
      return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const cellColorClass = colorClass || getPerformanceColor();

  if (isEditing) {
    return (
      <div className="p-2 flex items-center gap-1 bg-white border border-blue-500">
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full text-xs text-center border-none outline-none"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-700 p-1"
        >
          <Check size={12} />
        </button>
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-700 p-1"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`p-3 text-center border-r border-slate-200 font-bold text-sm ${cellColorClass} group cursor-pointer relative transition-all duration-200 hover:scale-105`}
      onClick={() => isEditable && setIsEditing(true)}
    >
      <span>{value > 0 ? Math.round(value).toString() : value === 0 ? '0' : '-'}</span>
      {isEditable && (
        <Edit2 size={12} className="absolute top-1 right-1 opacity-0 group-hover:opacity-70 text-current" />
      )}
    </div>
  );
}