import Modal from '@/shared/components/Modal';

interface DeleteTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const DeleteTrackModal = ({
  isOpen,
  onClose,
  onDelete,
  isDeleting
}: DeleteTrackModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="delete-confirmation" data-testid="confirm-dialog">
        <div className="delete-confirmation__icon"></div>
        <h2 className="delete-confirmation__title">Delete Track</h2>
        <p className="delete-confirmation__message">Are you sure you want to delete this track?</p>
        <div className="delete-confirmation__warning">This action cannot be undone.</div>
        
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
            ) : 'Delete Track'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTrackModal;
