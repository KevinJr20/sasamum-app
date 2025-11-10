// Mock implementation for framer-motion used in tests and during builds.
// We avoid using Jest globals here so the file can be typechecked by TypeScript
// and used both in test and build contexts.

import React from 'react';

const mockMotionComponent = ({
  animate,
  initial,
  children,
  transition,
  ...props
}: any) => {
  const Component = props.as || 'div';
  return React.createElement(Component, props, children);
};

export const motion = new Proxy({}, {
  get: () => mockMotionComponent,
});

export const AnimatePresence = ({ children }: any) => children;