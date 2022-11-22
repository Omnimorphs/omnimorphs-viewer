import './Button.css';

export type ButtonProps = {
  active?: boolean;
  className?: string;
};

function Button({
  active = false,
  className = '',
  ...props
}: ButtonProps & any) {
  const finalClassName = `Button__root${
    active ? ' Button__root--active' : ''
  } ${className}`;
  return <button className={finalClassName} {...props} />;
}

export default Button;
