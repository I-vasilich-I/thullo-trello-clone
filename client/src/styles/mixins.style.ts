import { css } from 'styled-components';

type FontProps = {
  size: string;
  height: string;
  color: string;
  family?: string;
  style?: 'normal';
  weight?: string | number;
  spacing?: string;
};

const font = ({ color, size, family, height, style, spacing, weight }: FontProps) => css`
  font-family: ${family || 'Poppins'};
  font-style: ${style || 'normal'};
  font-size: ${size || '1rem'};
  font-weight: ${weight || 'normal'};
  line-height: ${height};
  letter-spacing: ${spacing || '-0.035em'};
  color: ${color || 'red'};
`;

export { font };
