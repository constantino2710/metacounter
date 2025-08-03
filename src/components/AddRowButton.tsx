import { Plus } from 'lucide-react';

interface AddRowButtonProps {
  onClick: () => void;
  type: 'cliente' | 'filial' | 'funcionario';
}

export function AddRowButton({ onClick, type }: AddRowButtonProps) {
  const getLabel = () => {
    switch (type) {
      case 'cliente':
        return 'Adicionar Cliente';
      case 'filial':
        return 'Adicionar Filial';
      case 'funcionario':
        return 'Adicionar Funcionário';
      default:
        return 'Adicionar Item';
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
    >
      <Plus size={16} />
      {getLabel()}
    </button>
  );
}