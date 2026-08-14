export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 480"
      className="mx-auto w-full max-w-md md:max-w-none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A technician showing a customer the details of a completed repair job"
    >
      {/* backdrop blob */}
      <ellipse cx="260" cy="260" rx="250" ry="220" fill="#EAF6E4" />
      <ellipse cx="260" cy="440" rx="190" ry="18" fill="#DCEBD6" />

      {/* floating tool accents */}
      <g opacity="0.9">
        <circle cx="70" cy="90" r="26" fill="#DCEBD6" />
        <path d="M60 90 l20 0 M70 80 l0 20" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
        <circle cx="460" cy="120" r="20" fill="#DCEBD6" />
        <path d="M452 120 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 Z" fill="#4CAF50" />
        <circle cx="450" cy="360" r="24" fill="#DCEBD6" />
        <path d="M440 360 l20 0 M450 350 l0 20" stroke="#1F6B3D" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* job board / clipboard stand */}
      <g>
        <rect x="120" y="120" width="150" height="190" rx="10" fill="#FFFFFF" stroke="#1F6B3D" strokeWidth="4" />
        <line x1="150" y1="90" x2="150" y2="320" stroke="#15181C" strokeWidth="6" strokeLinecap="round" />
        <line x1="240" y1="90" x2="240" y2="320" stroke="#15181C" strokeWidth="6" strokeLinecap="round" />
        <rect x="130" y="82" width="130" height="16" rx="6" fill="#232A2E" />

        {/* wrench icon */}
        <g transform="translate(145,150)">
          <path
            d="M30 4c-8-4-18-1-22 8-3 7-1 15 5 20l-25 25 8 8 25-25c5 6 13 8 20 5 9-4 12-14 8-22l-11 11-9-9 11-11c-3-1-6-2-10-2z"
            fill="#4CAF50"
          />
        </g>

        {/* progress bars mimicking a job checklist */}
        <rect x="145" y="220" width="100" height="10" rx="5" fill="#DCEBD6" />
        <rect x="145" y="220" width="70" height="10" rx="5" fill="#4CAF50" />
        <rect x="145" y="245" width="100" height="10" rx="5" fill="#DCEBD6" />
        <rect x="145" y="245" width="45" height="10" rx="5" fill="#1F6B3D" />
        <rect x="145" y="270" width="100" height="10" rx="5" fill="#DCEBD6" />
        <rect x="145" y="270" width="85" height="10" rx="5" fill="#8BC63F" />
      </g>

      {/* technician standing, pointing at board */}
      <g>
        <circle cx="305" cy="118" r="26" fill="#2A211B" />
        <circle cx="305" cy="112" r="22" fill="#3A2C22" />
        <rect x="285" y="140" width="40" height="70" rx="16" fill="#4CAF50" />
        <rect x="285" y="140" width="40" height="70" rx="16" fill="#4CAF50" />
        <path d="M290 145 h30 v14 a15 15 0 0 1 -30 0 z" fill="#FFFFFF" />
        <rect x="280" y="205" width="18" height="72" rx="8" fill="#15181C" />
        <rect x="312" y="205" width="18" height="72" rx="8" fill="#15181C" />
        <rect x="272" y="272" width="34" height="14" rx="7" fill="#232A2E" />
        <rect x="304" y="272" width="34" height="14" rx="7" fill="#232A2E" />
        {/* pointing arm */}
        <path d="M290 165 q-35 -5 -55 15" stroke="#3A2C22" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="235" cy="180" r="8" fill="#3A2C22" />
        {/* other arm resting */}
        <path d="M320 165 q30 10 26 40" stroke="#4CAF50" strokeWidth="12" strokeLinecap="round" fill="none" />
      </g>

      {/* customer seated on stool with clipboard */}
      <g>
        <rect x="360" y="330" width="60" height="10" rx="5" fill="#1F6B3D" />
        <rect x="368" y="340" width="10" height="40" fill="#1F6B3D" />
        <rect x="402" y="340" width="10" height="40" fill="#1F6B3D" />

        <rect x="358" y="255" width="60" height="80" rx="18" fill="#8BC63F" />
        <circle cx="388" cy="228" r="24" fill="#3A2C22" />
        <circle cx="388" cy="223" r="20" fill="#4A372A" />

        <rect x="345" y="275" width="34" height="46" rx="6" fill="#FFFFFF" stroke="#1F6B3D" strokeWidth="3" />
        <line x1="351" y1="288" x2="373" y2="288" stroke="#DCEBD6" strokeWidth="3" />
        <line x1="351" y1="298" x2="373" y2="298" stroke="#DCEBD6" strokeWidth="3" />
        <line x1="351" y1="308" x2="365" y2="308" stroke="#DCEBD6" strokeWidth="3" />

        <path d="M370 270 q-15 10 -18 20" stroke="#4A372A" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M410 270 q15 15 6 35" stroke="#8BC63F" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>

      {/* checkmark badge, top-right, echoes the "job done" idea */}
      <g transform="translate(392,150)">
        <circle cx="0" cy="0" r="22" fill="#4CAF50" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M-9 0 l6 6 12 -14" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}
