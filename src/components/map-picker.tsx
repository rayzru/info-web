import { useState } from "react";

export function MapPicker() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
          <svg viewBox="0 0 569 508" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" stroke-width="2">
              <rect onClick={() => setSelected("str1")} data-id="str1" x="348.312" y="326.915" width="199.903" height="81.9809" transform="rotate(-24.7213 348.312 326.915)" />
              <rect onClick={() => setSelected("str2")}  data-id="str2" x="125.629" y="429.356" width="244.367" height="81.9809" transform="rotate(-24.7213 125.629 429.356)"/>
              <rect onClick={() => setSelected("str6")} data-id="str6" x="350.763" y="25.7647" width="75.0724" height="161.621" transform="rotate(1.45837 350.763 25.7647)" />
              <rect onClick={() => setSelected("str7")} data-id="str7" x="483.077" y="3.07538" width="75.0724" height="145.609" transform="rotate(1.45837 483.077 3.07538)" />
              <rect data-id="lit1" x="89.7916" y="150.093" width="80.8252" height="77.9013" transform="rotate(1.45837 89.7916 150.093)" />
              <rect data-id="lit8" x="205.156" y="96.3631" width="80.8252" height="212.189" transform="rotate(1.45837 205.156 96.3631)" />
              <rect data-id="lit9" x="46.9116" y="254.526" width="229.893" height="45.0426" transform="rotate(73.4757 46.9116 254.526)" />
            </g>
          </svg>
      </div>
    </div>
  );
}
