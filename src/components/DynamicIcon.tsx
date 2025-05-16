import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 24, className = '' }) => {
  const IconComponent = (LucideIcons as any)[name];
  
  if (!IconComponent) {
    // Fallback icon if the specified icon doesn't exist
    return <LucideIcons.HelpCircle size={size} className={className} />;
  }
  
  return <IconComponent size={size} className={className} />;
};

export default DynamicIcon;