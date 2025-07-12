import { ReactNode } from 'react';
import './card.scss';

export interface CardProps {
  /**
   * Card header avatar content (letter, icon, or image)
   */
  avatar?: ReactNode;
  /**
   * Main header text
   */
  header?: string;
  /**
   * Secondary header text
   */
  subhead?: string;
  /**
   * Show menu button (three dots)
   */
  showMenu?: boolean;
  /**
   * Menu button click handler
   */
  onMenuClick?: () => void;
  /**
   * Image URL for the card
   */
  imageUrl?: string;
  /**
   * Alt text for the image
   */
  imageAlt?: string;
  /**
   * Handler for image load errors
   */
  onImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  /**
   * Card title
   */
  title?: string;
  /**
   * Card subtitle
   */
  subtitle?: string;
  /**
   * Main content text
   */
  text?: string;
  /**
   * Custom content to render in the card body
   */
  children?: ReactNode;
  /**
   * Primary action button text
   */
  primaryButtonLabel?: string;
  /**
   * Primary button click handler
   */
  onPrimaryButtonClick?: () => void;
  /**
   * Secondary action button text
   */
  secondaryButtonLabel?: string;
  /**
   * Secondary button click handler
   */
  onSecondaryButtonClick?: () => void;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Additional props
   */
  [key: string]: unknown;
}

/**
 * Card component for displaying content with header, image, and actions
 */
export const Card = ({
  avatar,
  header,
  subhead,
  showMenu = false,
  onMenuClick,
  imageUrl,
  imageAlt = 'Card image',
  onImageError,
  title,
  subtitle,
  text,
  children,
  primaryButtonLabel,
  onPrimaryButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  className = '',
  ...props
}: CardProps) => {
  // Default avatar is first letter of header or 'A'
  const defaultAvatar = header ? header.charAt(0).toUpperCase() : 'A';
  
  return (
    <div className={`card ${className}`} {...props}>
      {(avatar ?? header ?? subhead ?? showMenu) && (
        <div className="card__header">
          {avatar !== undefined ? (
            <div className="card__avatar">{avatar}</div>
          ) : (
            <div className="card__avatar">{defaultAvatar}</div>
          )}
          
          <div className="card__header-content">
            {header && <h3 className="card__header-title">{header}</h3>}
            {subhead && <p className="card__header-subtitle">{subhead}</p>}
          </div>
          
          {showMenu && (
            <div 
              className="card__menu" 
              onClick={onMenuClick}
              role="button"
              tabIndex={0}
              aria-label="Menu"
            >
              <div className="card__menu-dots">
                <div className="card__menu-dot"></div>
                <div className="card__menu-dot"></div>
                <div className="card__menu-dot"></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {imageUrl && (
        <div className="card__image">
          <img 
            src={imageUrl} 
            alt={imageAlt || ''} 
            onError={onImageError}
          />
        </div>
      )}
      
      <div className="card__content">
        {title && <h2 className="card__title">{title}</h2>}
        {subtitle && <h3 className="card__subtitle">{subtitle}</h3>}
        {text && <p className="card__text">{text}</p>}
        {children}
      </div>
      
      {(primaryButtonLabel ?? secondaryButtonLabel) && (
        <div className="card__footer">
          {secondaryButtonLabel && (
            <button 
              className="card__button card__button--secondary"
              onClick={onSecondaryButtonClick}
            >
              {secondaryButtonLabel}
            </button>
          )}
          
          {primaryButtonLabel && (
            <button 
              className="card__button card__button--primary"
              onClick={onPrimaryButtonClick}
            >
              {primaryButtonLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
