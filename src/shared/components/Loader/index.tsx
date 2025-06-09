import "../../../styles/loader.scss";

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

const Loader = ({ size = 'md', fullScreen = false, text }: LoaderProps) => {
  const loaderContent = (
    <>
      <div 
        className={`spinner-border spinner-${size}`} 
        role="status"
        data-testid={text?.toLowerCase().includes('track') ? 'loading-tracks' : 'loading-indicator'}
        data-loading="true"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="loader-text mt-2">{text}</p>}
    </>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen" data-loading="true">
        <div className="loader-container" data-testid="loading-indicator">
          {loaderContent}
        </div>
      </div>
    );
  }

  return <div className="loader-container" data-testid="loading-indicator">{loaderContent}</div>;
};

export default Loader;
