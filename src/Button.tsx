import './Button.css';

export type ButtonProps = {
  active?: boolean;
};

function Button({ active = false, ...props }: ButtonProps & any) {
  const className = `Button__root${active ? ' Button__root--active' : ''}`;
  return <button className={className} {...props} />;
}

export default Button;
