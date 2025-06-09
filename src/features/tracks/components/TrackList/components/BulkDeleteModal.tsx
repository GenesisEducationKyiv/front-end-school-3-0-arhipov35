import Modal from '../../../../../shared/components/Modal';

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  selectedCount: number;
}

const BulkDeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
  selectedCount
}: BulkDeleteModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Selected Tracks"
      size="sm"
    >
      <div className="delete-confirmation">
        <p className="mb-4">
          Are you sure you want to delete {selectedCount} selected track{selectedCount !== 1 ? 's' : ''}? This action cannot be undone.
        </p>
        
        <div className="delete-confirmation__actions">
          <button 
            type="button" 
            className="delete-confirmation__cancel-btn" 
            onClick={onClose}
            disabled={isDeleting}
            aria-disabled={isDeleting ? "true" : "false"}
            data-testid="cancel-delete"
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="delete-confirmation__delete-btn" 
            onClick={onDelete}
            disabled={isDeleting}
            aria-disabled={isDeleting ? "true" : "false"}
            data-testid="confirm-delete"
          >
            {isDeleting ? (
              <>
                <span className="spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : 'Delete Selected'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkDeleteModal;
