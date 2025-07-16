import { useState, useCallback, lazy, Suspense, useMemo } from 'react';
import { useDeleteTrackMutation, useDeleteMultipleTracksMutation } from '@/features/tracks/api/apiSlice';
import { Track } from '@/types/track';
import { useTrackFilters } from '@/features/tracks/hooks/useTrackFilters';
import { useToast } from '@/contexts/ToastContext';
import Loader from '@/shared/components/Loader';
import Modal from '@/shared/components/Modal';
import '@/styles/track-list.scss';
import '@/styles/delete-confirmation.scss';
import '@/styles/audio-player.scss';
import FilterBar from './components/FilterBar';
import ActionBar from './components/ActionBar';
import TrackCardGrid from './components/TrackCardGrid';
import Pagination from './components/Pagination';

const TrackForm = lazy(() => import('@/features/tracks/components/TrackForm'));
const TrackFileUpload = lazy(() => import('@/features/tracks/components/TrackFileUpload'));
const DeleteTrackModal = lazy(() => import('./components/DeleteTrackModal'));
const BulkDeleteModal = lazy(() => import('./components/BulkDeleteModal'));

const TrackList = () => {
  const {filters, data, error, isLoading, refetch, genres, uniqueArtists, handlePageChange, handleSortChange, handleSearchChange, handleGenreFilterChange, handleArtistFilterChange} = useTrackFilters();
  const {addToast} = useToast();
  const [deleteTrack, {isLoading: isDeleting}] = useDeleteTrackMutation();
  const [deleteMultipleTracks, {isLoading: isMultipleDeleting}] = useDeleteMultipleTracksMutation();
  
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteTrackId, setDeleteTrackId] = useState<string | null>(null);
  const [selectedUploadTrack, setSelectedUploadTrack] = useState<Track | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [isBulkSelectEnabled, setIsBulkSelectEnabled] = useState(false);

  const openEditModal = useCallback((track: Track) => {setSelectedTrack(track); setIsEditModalOpen(true);}, []);
  const openDeleteModal = useCallback((id: string) => {setDeleteTrackId(id); setIsDeleteModalOpen(true);}, []);
  const openUploadModal = useCallback((track: Track) => {setSelectedUploadTrack(track); setIsUploadModalOpen(true);}, []);
  const handleCreateClick = useCallback(() => setIsCreateModalOpen(true), []);
  const handleBulkDeleteClick = useCallback(() => setIsBulkDeleteModalOpen(true), []);
  const handleUploadModalClose = useCallback(() => {setIsUploadModalOpen(false); void refetch();}, [refetch]);
  const handleCreateModalClose = useCallback(() => setIsCreateModalOpen(false), []);
  const handleEditModalClose = useCallback(() => {setIsEditModalOpen(false); setSelectedTrack(null);}, []);
  const handleDeleteModalClose = useCallback(() => {setIsDeleteModalOpen(false); setDeleteTrackId(null);}, []);
  const handleBulkDeleteModalClose = useCallback(() => setIsBulkDeleteModalOpen(false), []);

  const handleDelete = useCallback(async () => {
    if (!deleteTrackId) return;
    try {
      if (data?.data.find((t: Track) => t.id === deleteTrackId)) void refetch();
      await deleteTrack(deleteTrackId).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteTrackId(null);
      addToast('Track deleted successfully', 'success');
    } catch {
      void refetch();
      addToast('Failed to delete track', 'error');
    }
  }, [deleteTrackId, deleteTrack, data?.data, refetch, addToast]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedTrackIds.length === 0) return;
    try {
      if (data?.data.some((t: Track) => selectedTrackIds.includes(t.id))) void refetch();
      await deleteMultipleTracks(selectedTrackIds).unwrap();
      setIsBulkDeleteModalOpen(false);
      setSelectedTrackIds([]);
      setIsBulkSelectEnabled(false);
      addToast(`Successfully deleted ${selectedTrackIds.length} tracks`, 'success');
    } catch {
      void refetch();
      addToast(`Failed to delete tracks`, 'error');
    }
  }, [selectedTrackIds, deleteMultipleTracks, data?.data, refetch, addToast]);

  const toggleSelectTrack = useCallback((id: string) => {
    setSelectedTrackIds(prev => prev.includes(id) ? prev.filter(trackId => trackId !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (data?.data) setSelectedTrackIds(selectedTrackIds.length === data.data.length ? [] : data.data.map(track => track.id));
  }, [data?.data, selectedTrackIds.length]);

  const toggleBulkSelect = useCallback(() => {
    setIsBulkSelectEnabled(prev => !prev);
    if (isBulkSelectEnabled) setSelectedTrackIds([]);
  }, [isBulkSelectEnabled]);
  
  const getDefaultCoverImage = useCallback(() => 'https://placehold.co/60x60?text=Music', []);
  const memoizedTracks = useMemo(() => data?.data ?? [], [data?.data]);
  const paginationMeta = useMemo(() => data?.meta, [data?.meta]);

  if (isLoading) return <Loader text="Loading tracks..." data-testid="loading-tracks" />;

  return (
    <div className="track-list-container">
      <ActionBar
        isBulkSelectEnabled={isBulkSelectEnabled}
        selectedTrackIds={selectedTrackIds}
        toggleBulkSelect={toggleBulkSelect}
        onCreateClick={handleCreateClick}
        onBulkDeleteClick={handleBulkDeleteClick}
      />
      <FilterBar
        filters={filters}
        genres={genres}
        uniqueArtists={uniqueArtists}
        handleSearchChange={handleSearchChange}
        handleSortChange={handleSortChange}
        handleGenreFilterChange={handleGenreFilterChange}
        handleArtistFilterChange={handleArtistFilterChange}
      />

      {error ? (
        <div className="alert alert-danger" role="alert">
          {(() => {
            let errorMessage = 'Failed to load tracks';

            if (error && typeof error === 'object' && 'data' in error) {
              const errorData = error.data;
              if (errorData && typeof errorData === 'object' && 'error' in errorData) {
                const errorText = errorData.error;
                if (typeof errorText === 'string') {
                  errorMessage = errorText;
                }
              }
            }

            return `Error: ${errorMessage}`;
          })()}
        </div>
      ) : null}

      {data?.data.length === 0 ? (
        <div className="empty-state"><p>No tracks found. Create your first track!</p></div>
      ) : (
        <>
          <TrackCardGrid
            tracks={memoizedTracks}
            isBulkSelectEnabled={isBulkSelectEnabled}
            selectedTrackIds={selectedTrackIds}
            toggleSelectTrack={toggleSelectTrack}
            toggleSelectAll={toggleSelectAll}
            onEditClick={openEditModal}
            onDeleteClick={openDeleteModal}
            onUploadClick={openUploadModal}
            getDefaultCoverImage={getDefaultCoverImage}
          />
          <div className="d-flex justify-content-between align-items-center mt-3">
            {paginationMeta && (
              <>
                <p className="text-muted">Showing {(paginationMeta.page - 1) * paginationMeta.limit + 1} to {Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)} of {paginationMeta.total} tracks</p>
                <div data-testid="pagination">
                  <Pagination page={paginationMeta.page} totalPages={paginationMeta.totalPages} handlePageChange={handlePageChange} />
                </div>
              </>
            )}
          </div>
        </>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={handleCreateModalClose} title="Create New Track">
        <Suspense fallback={<Loader text="Loading form..." />}>
          <TrackForm onClose={handleCreateModalClose} />
        </Suspense>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose} title="Edit Track">
        {selectedTrack && (
          <Suspense fallback={<Loader text="Loading form..." />}>
            <TrackForm track={selectedTrack} onClose={handleEditModalClose} />
          </Suspense>
        )}
      </Modal>

      <Suspense fallback={<div className="loading"></div>}>
        <DeleteTrackModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onDelete={() => void handleDelete()}
          isDeleting={isDeleting}
        />
      </Suspense>

      <Suspense fallback={<div className="loading"></div>}>
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={handleBulkDeleteModalClose}
          onDelete={() => void handleBulkDelete()}
          isDeleting={isMultipleDeleting}
          selectedCount={selectedTrackIds.length}
        />
      </Suspense>

      <Modal isOpen={isUploadModalOpen} onClose={handleUploadModalClose} title="" size="md">
        {selectedUploadTrack && (
          <Suspense fallback={<Loader text="Loading upload form..." />}>
            <TrackFileUpload track={selectedUploadTrack} onClose={handleUploadModalClose} />
          </Suspense>
        )}
      </Modal>
    </div>
  );
};

export default TrackList;
