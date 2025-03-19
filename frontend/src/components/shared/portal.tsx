import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
};

export default Portal;
