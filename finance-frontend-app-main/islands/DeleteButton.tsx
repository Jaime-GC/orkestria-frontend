import { FunctionalComponent } from "preact";
import { DeleteIcon } from "../components/Icons.tsx";
import { deleteResource } from "../components/api.ts";

export interface DeleteButtonProps {
  resource: string;
  id: number;
  onSuccess?: () => void;
}

export const DeleteButton: FunctionalComponent<DeleteButtonProps> = ({
  resource,
  id,
  onSuccess,
}) => {
    
  async function handleClick() {
    await deleteResource(resource, id);
    onSuccess?.() ?? window.location.reload();
  }

  return (
    <button
      onClick={handleClick}
      class="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
    >
      <DeleteIcon />
    </button>
  );
};