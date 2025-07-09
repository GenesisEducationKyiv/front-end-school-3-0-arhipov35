interface PaginationProps {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  handlePageChange
}: PaginationProps) => {
  if (totalPages <= 1) return null;
  
  return (
    <nav aria-label="Tracks pagination">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-disabled={page === 1 ? "true" : "false"}
            data-testid="pagination-prev"
          >
            Previous
          </button>
        </li>
        
        {Array.from({ length: totalPages }).map((_, index) => (
          <li key={index} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-disabled={page === totalPages ? "true" : "false"}
            data-testid="pagination-next"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
