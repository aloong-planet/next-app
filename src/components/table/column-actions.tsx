import {Edit, Trash2} from 'lucide-react';
import {Button} from '@/src/components/ui/button';

interface ColumnActionsProps {
    id: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const ColumnActions = ({id, onEdit, onDelete}: ColumnActionsProps) => {
    return (
        <div className="flex justify-center">
            <Button onClick={() => onEdit(id)} variant="ghost" className="h-6 w-6 p-0">
                <Edit className="h-4 w-4"/>
            </Button>
            <Button onClick={() => onDelete(id)} variant="ghost" className="h-6 w-6 p-0">
                <Trash2 className="h-4 w-4"/>
            </Button>
        </div>
    );
};

export default ColumnActions;
