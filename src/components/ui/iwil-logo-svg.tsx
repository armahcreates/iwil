interface IWILLogoProps {
  size?: number;
  className?: string;
}

export function IWILLogo({ size = 64, className = '' }: IWILLogoProps) {
  return (
    <img
      src="/iwil-logo.png"
      alt="IWIL Protocol Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
