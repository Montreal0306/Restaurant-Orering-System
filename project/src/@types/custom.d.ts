declare module '*/ServerRequestModal' {
  interface ServerRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const ServerRequestModal: React.FC<ServerRequestModalProps>;
  export default ServerRequestModal;
} 