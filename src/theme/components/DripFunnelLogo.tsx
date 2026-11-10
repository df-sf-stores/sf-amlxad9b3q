import styles from '../styles/layout.module.css'

// The DripFunnel white logo, drawn as paths: the theme may hold no image files, and SVG <text> isn't allowed.
const ring = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`
const n = 'M1451 305V128h57v27q17-30 54-30q63 0 63 70v110h-58v-95q0-32-27-32q-32 0-32 34v93z'

export const DripFunnelLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 2080 370" aria-hidden="true" focusable="false">
    <path className={styles.dfOrange} d="M0 0H215A184 184 0 0 1 215 368H175L228 305A123 123 0 0 0 215 60H68V330L0 263Z" />
    <path className={styles.dfWhite} d="M102 118H295L255 173H102ZM102 218H218L102 366Z" />
    <g className={styles.dfWhite}>
      <path fillRule="evenodd" d="M428 64H535A120.5 120.5 0 0 1 535 305H428ZM492 121H530A63 63 0 0 1 530 247H492Z" />
      <rect x="665" y="128" width="62" height="177" />
      <path d="M727 178Q745 126 790 125V186Q745 186 727 232Z" />
      <circle cx="837" cy="80" r="35" />
      <rect x="805" y="128" width="63" height="177" />
      <rect x="889" y="128" width="61" height="237" />
      <path fillRule="evenodd" d={`${ring(1012, 215, 73, 90)}${ring(988, 218, 38, 40)}`} />
    </g>
    <g className={styles.dfOrange}>
      <path d="M1098 64H1255V121H1160V160H1248V215H1160V305H1098Z" />
      <path d="M1260 128H1318V225Q1318 258 1347 258Q1377 258 1377 225V128H1435V305H1377V282Q1360 310 1323 310Q1260 310 1260 240Z" />
      <path d={n} />
      <path d={n} transform="translate(190 0)" />
      <path fillRule="evenodd" d="M2007 233H1883Q1886 266 1918 266Q1938 266 1948 250H2004Q1985 310 1916 310Q1825 310 1825 218Q1825 125 1916 125Q2008 125 2007 233ZM1883 198H1950Q1945 168 1916 168Q1888 168 1883 198Z" />
      <rect x="2020" y="64" width="58" height="241" />
    </g>
  </svg>
)
