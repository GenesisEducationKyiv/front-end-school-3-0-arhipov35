import { useState, useCallback, lazy, Suspense } from 'react';
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
import TrackTable from './components/TrackTable';
import Pagination from './components/Pagination';


const TrackForm = lazy(() => import('@/features/tracks/components/TrackForm'));
const TrackFileUpload = lazy(() => import('@/features/tracks/components/TrackFileUpload'));
const DeleteTrackModal = lazy(() => import('./components/DeleteTrackModal'));
const BulkDeleteModal = lazy(() => import('./components/BulkDeleteModal'));

const TrackList = () => {
  const {
    filters,
    data,
    error,
    isLoading,
    refetch,
    genres,
    uniqueArtists,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
    handleGenreFilterChange,
    handleArtistFilterChange
  } = useTrackFilters();

  const { addToast } = useToast();

  const [deleteTrack, { isLoading: isDeleting }] = useDeleteTrackMutation();
  const [deleteMultipleTracks, { isLoading: isMultipleDeleting }] = useDeleteMultipleTracksMutation();

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

  const openEditModal = useCallback((track: Track) => {
    setSelectedTrack(track);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((id: string) => {
    setDeleteTrackId(id);
    setIsDeleteModalOpen(true);
  }, []);

  const openUploadModal = useCallback((track: Track) => {
    setSelectedUploadTrack(track);
    setIsUploadModalOpen(true);
  }, []);

  const handleUploadModalClose = useCallback(() => {
    setIsUploadModalOpen(false);
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTrackId) {
      return;
    }

    try {
      if (data?.data.find((t: Track) => t.id === deleteTrackId)) {
        refetch();
      }

      await deleteTrack(deleteTrackId).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteTrackId(null);

      addToast('Track deleted successfully', 'success');
    } catch (error) {
      refetch();

      addToast('Failed to delete track', 'error');
    }
  }, [deleteTrackId, deleteTrack, data?.data, refetch]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedTrackIds.length === 0) {
      return;
    }

    try {
      if (data?.data.some((t: Track) => selectedTrackIds.includes(t.id))) {
        refetch();
      }

      await deleteMultipleTracks(selectedTrackIds).unwrap();
      setIsBulkDeleteModalOpen(false);
      setSelectedTrackIds([]);
      setIsBulkSelectEnabled(false);

      addToast(`Successfully deleted ${selectedTrackIds.length} tracks`, 'success');
    } catch (error) {
      refetch();

      addToast(`Failed to delete tracks`, 'error');
    }
  }, [selectedTrackIds, deleteMultipleTracks, data?.data, refetch]);

  const toggleSelectTrack = useCallback((id: string) => {
    setSelectedTrackIds(prev =>
      prev.includes(id)
        ? prev.filter(trackId => trackId !== id)
        : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (data?.data) {
      if (selectedTrackIds.length === data.data.length) {
        setSelectedTrackIds([]);
      } else {
        setSelectedTrackIds(data.data.map(track => track.id));
      }
    }
  }, [data?.data, selectedTrackIds.length]);

  const getDefaultCoverImage = useCallback(() => {
    return 'https://placehold.co/60x60?text=Music';
  }, []);

  const toggleBulkSelect = useCallback(() => {
    setIsBulkSelectEnabled(prev => !prev);
    if (isBulkSelectEnabled) {
      setSelectedTrackIds([]);
    }
  }, [isBulkSelectEnabled]);

  if (isLoading) {
    return <Loader text="Loading tracks..." data-testid="loading-tracks" />;
  }

  return (
    <div className="track-list-container">
      <ActionBar
        isBulkSelectEnabled={isBulkSelectEnabled}
        selectedTrackIds={selectedTrackIds}
        toggleBulkSelect={toggleBulkSelect}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onBulkDeleteClick={() => setIsBulkDeleteModalOpen(true)}
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
        <div className="empty-state">
          <p>No tracks found. Create your first track!</p>
        </div>
      ) : (
        <>
          <TrackTable
            tracks={data?.data || []}
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
            {data?.meta && (
              <>
                <p className="text-muted">
                  Showing {(data.meta.page - 1) * data.meta.limit + 1} to {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of {data.meta.total} tracks
                </p>
                <div data-testid="pagination">
                  <Pagination
                    page={data.meta.page}
                    totalPages={data.meta.totalPages}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Track"
      >
        <Suspense fallback={<Loader text="Loading form..." />}>
          <TrackForm onClose={() => setIsCreateModalOpen(false)} />
        </Suspense>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Track"
      >
        {selectedTrack && (
          <Suspense fallback={<Loader text="Loading form..." />}>
            <TrackForm
              track={selectedTrack}
              onClose={() => setIsEditModalOpen(false)}
            />
          </Suspense>
        )}
      </Modal>

      <Suspense fallback={<Loader text="Loading..." />}>
        <DeleteTrackModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </Suspense>

      <Suspense fallback={<Loader text="Loading..." />}>
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          onDelete={handleBulkDelete}
          isDeleting={isMultipleDeleting}
          selectedCount={selectedTrackIds.length}
        />
      </Suspense>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        title=""
        size="md"
      >
        {selectedUploadTrack && (
          <Suspense fallback={<Loader text="Loading upload form..." />}>
            <TrackFileUpload
              track={selectedUploadTrack}
              onClose={handleUploadModalClose}
            />
          </Suspense>
        )}
      </Modal>
    </div>
  );
};

export default TrackList;
