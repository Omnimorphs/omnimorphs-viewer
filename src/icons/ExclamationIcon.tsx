import classNames from 'classnames';

export type ExclamationIconProps = {
  className?: string;
};

function ExclamationIcon({ className = '' }: ExclamationIconProps) {
  return (
    <svg
      className={classNames({
        [className]: true
      })}
      width="50"
      viewBox="0 0 191.812 191.812"
    >
      <g>
        <path
          fill="currentColor"
          d="M95.906,121.003c6.903,0,12.5-5.597,12.5-12.5V51.511c0-6.904-5.597-12.5-12.5-12.5
		s-12.5,5.596-12.5,12.5v56.993C83.406,115.407,89.003,121.003,95.906,121.003z"
        />
        <path
          fill="currentColor"
          d="M95.909,127.807c-3.29,0-6.521,1.33-8.841,3.66c-2.329,2.32-3.659,5.54-3.659,8.83
		s1.33,6.52,3.659,8.84c2.32,2.33,5.551,3.66,8.841,3.66s6.51-1.33,8.84-3.66c2.319-2.32,3.66-5.55,3.66-8.84s-1.341-6.51-3.66-8.83
		C102.419,129.137,99.199,127.807,95.909,127.807z"
        />
        <path
          fill="currentColor"
          d="M95.906,0C43.024,0,0,43.023,0,95.906s43.023,95.906,95.906,95.906s95.905-43.023,95.905-95.906
		S148.789,0,95.906,0z M95.906,176.812C51.294,176.812,15,140.518,15,95.906S51.294,15,95.906,15
		c44.611,0,80.905,36.294,80.905,80.906S140.518,176.812,95.906,176.812z"
        />
      </g>
    </svg>
  );
}

export default ExclamationIcon;
