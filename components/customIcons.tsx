import React from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export const IconScanFood = ({ className, style }: Props) => (
  <svg
    className={className}
    style={style}
    id="Layer_2"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
  >
    <defs>
      <style>
        {`.cls-1 {
              strokeWidth: 2px;
            }

            .cls-1, .cls-3 {
              stroke: #010101;
              stroke-linecap: round;
              stroke-linejoin: round;
            }

            .cls-3 {
              stroke-width: 1.15px;
            }`}
      </style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <g>
        <g>
          <path className="cls-1" d="m1,4v-1c0-1.1.9-2,2-2h2" />
          <path className="cls-1" d="m1,14v1c0,1.1.9,2,2,2h2" />
          <path className="cls-1" d="m13,1h2c1.1,0,2,.9,2,2v1" />
          <path className="cls-1" d="m13,17h2c1.1,0,2-.9,2-2v-1" />
        </g>
        <g>
          <path
            className="cls-3"
            d="m5,8.5h8c.28,0,.5.22.5.5v.25c0,.75-1.26,2.79-2,3.25v.5c0,.28-.22.5-.5.5h-4c-.28,0-.5-.22-.5-.5v-.5c-.84-.53-2-2.5-2-3.25v-.25c0-.28.22-.5.5-.5Z"
          />
          <path className="cls-3" d="m9,5c-.32.23-.51.6-.5,1,0,.4.18.77.5,1" />
          <path className="cls-3" d="m11,5c-.32.23-.51.6-.5,1,0,.4.18.77.5,1" />
          <path className="cls-3" d="m7,5c-.32.23-.51.6-.5,1,0,.4.18.77.5,1" />
        </g>
      </g>
    </g>
  </svg>
);

export const IconScanStyle = ({ className, style }: Props) => (
  <svg
    id="Layer_2"
    className={className}
    style={style}
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
  >
    <defs>
      <style>
        {`.cls-1 {
            stroke-width: 2px;
          }

          .cls-1, .cls-2, .cls-3 {
            fill: none;
          }

          .cls-1, .cls-3 {
            stroke: #010101;
            stroke-linecap: round;
            stroke-linejoin: round;
          }

          .cls-3 {
            stroke-width: 1.15px;
          }`}
      </style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <g>
        <g>
          <path className="cls-1" d="m1,4v-1c0-1.1.9-2,2-2h2" />
          <path className="cls-1" d="m1,14v1c0,1.1.9,2,2,2h2" />
          <path className="cls-1" d="m13,1h2c1.1,0,2,.9,2,2v1" />
          <path className="cls-1" d="m13,17h2c1.1,0,2-.9,2-2v-1" />
        </g>
        <g>
          <path
            className="cls-3"
            d="m10.5,5l3,1v2.5h-1.5v4c0,.28-.22.5-.5.5h-5c-.28,0-.5-.22-.5-.5v-4h-1.5v-2.5l3-1c0,.83.67,1.5,1.5,1.5s1.5-.67,1.5-1.5"
          />
        </g>
      </g>
    </g>
  </svg>
);
