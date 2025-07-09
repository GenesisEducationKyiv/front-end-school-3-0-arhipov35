interface ActionBarProps {
  isBulkSelectEnabled: boolean;
  selectedTrackIds: string[];
  toggleBulkSelect: () => void;
  onCreateClick: () => void;
  onBulkDeleteClick: () => void;
}

const ActionBar = ({
  isBulkSelectEnabled,
  selectedTrackIds,
  toggleBulkSelect,
  onCreateClick,
  onBulkDeleteClick
}: ActionBarProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 data-testid="tracks-header">Tracks</h1>
      <div className="button-group d-flex gap-2">
        {isBulkSelectEnabled && (
          <button 
            className="btn btn-danger" 
            onClick={onBulkDeleteClick}
            disabled={selectedTrackIds.length === 0}
            aria-disabled={selectedTrackIds.length === 0 ? "true" : "false"}
            data-testid="bulk-delete-button"
          >
            Delete Selected ({selectedTrackIds.length})
          </button>
        )}
        <button 
          className={`btn ${isBulkSelectEnabled ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={toggleBulkSelect}
          data-testid="select-mode-toggle"
        >
          {isBulkSelectEnabled ? 'Cancel Selection' : 'Select Multiple'}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onCreateClick}
          data-testid="create-track-button"
        >
          Create Track
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
