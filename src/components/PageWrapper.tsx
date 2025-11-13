import React from 'react';

/**
 * PageWrapper - a small helper to wrap page content so headers can be sticky
 * and the page content scrolls independently. Use like:
 * <PageWrapper>
 *   <div className="page-header">...header...</div>
 *   <main>...content...</main>
 * </PageWrapper>
 */
export const PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`page-with-header h-screen overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;
