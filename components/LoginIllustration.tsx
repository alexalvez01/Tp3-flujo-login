import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '@/constants/Theme';

/**
 * Ilustración del login - vectorizado desde Figma #213:23292 (213x165)
 * Candado + círculos decorativos con la paleta del kit.
 */
export function LoginIllustration() {
  return (
    <Svg width={213} height={165} viewBox="0 0 213 165">
      <Circle cx={110} cy={90} r={75} fill={Colors.illustrationBg} />
      <Circle cx={77} cy={5} r={5} fill={Colors.primary} />
      <Circle cx={200.5} cy={34.5} r={12.5} fill={Colors.accentRed} />
      <Circle cx={183} cy={136} r={5} fill={Colors.accentBlue} />
      <Circle cx={52} cy={136} r={10} fill={Colors.accentOrange} />
      <Circle cx={5} cy={70} r={5} fill={Colors.accentTeal} />

      {/* Arco del candado */}
      <Path
        d="M120.538 83.3238C119.92 83.3238 119.393 82.8129 119.393 82.1926V72.2306C119.393 67.0124 115.178 62.7794 109.982 62.7794C104.786 62.7794 100.571 67.0306 100.571 72.2306V82.1926C100.571 82.8129 100.062 83.3238 99.4259 83.3238H93.1033C92.4855 83.3238 91.9768 82.8129 91.9768 82.1926V72.2306C91.9768 62.2503 100.062 54.1311 110 54.1311C119.938 54.1311 128.023 62.2503 128.023 72.2306V82.1926C128.023 82.8129 127.515 83.3238 126.879 83.3238H120.538Z"
        fill={Colors.lockPurple}
        stroke="white"
        strokeWidth={2.26}
      />
      {/* Cuerpo del candado */}
      <Path
        d="M88.8881 124.887C87.3619 124.887 86.1265 123.646 86.1265 122.114V83.8165C86.1265 82.2839 87.3619 81.0432 88.8881 81.0432H131.112C132.638 81.0432 133.874 82.2839 133.874 83.8165V122.095C133.874 123.628 132.638 124.869 131.112 124.869H88.8881V124.887Z"
        fill={Colors.lockPurple}
        stroke="white"
        strokeWidth={2.26}
      />
      {/* Bocallave */}
      <Path
        d="M108.172 107.262C108.172 107.003 108.011 106.771 107.77 106.679C105.426 105.784 103.774 103.512 103.774 100.858C103.775 97.4256 106.566 94.6401 109.981 94.6399C113.414 94.6399 116.188 97.4244 116.188 100.858C116.188 103.512 114.537 105.784 112.193 106.679C111.952 106.771 111.792 107.003 111.792 107.262V110.473C111.792 111.481 110.979 112.294 109.981 112.294C108.984 112.294 108.172 111.481 108.172 110.473V107.262Z"
        fill={Colors.lockPurple}
        stroke="white"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
