const STICKER_COLOR = 'rgb(70, 81, 94)';

export function getBulkSvg(
  id: string | number,
  baseColor: string,
  cutColor: string,
): string | undefined {
  const key = String(id);
  const template = BULK_TEMPLATES[key];
  if (!template) return undefined;
  return template
    .replace(/\$baseColor/g, baseColor)
    .replace(/\$cutColor/g, cutColor)
    .replace(/\$stickerColor/g, STICKER_COLOR);
}

const BULK_TEMPLATES: Record<string, string> = {
  '0': `<svg id="bulk-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"></svg>`,
  '1': `<svg id="bulk-1" viewBox="0 0 420 119" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,4V108.6A10.42,10.42,0,0,0,10.44,119H409.56A10.42,10.42,0,0,0,420,108.6V4Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M416.06,0H3.94A4,4,0,0,0,0,4,4,4,0,0,0,3.94,8H416.06A4,4,0,0,0,420,4,4,4,0,0,0,416.06,0Z"/>
  </svg>`,
  '2': `<svg id="bulk-2" viewBox="0 0 420 93" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,4.5V82.8A10.2,10.2,0,0,0,10.2,93H409.8A10.2,10.2,0,0,0,420,82.8V4.5Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M415.52,0H4.48A4.49,4.49,0,0,0,0,4.5C0,8,3,9,5.48,9h409C417,9,420,8.17,420,4.5A4.49,4.49,0,0,0,415.52,0Z"/>
  </svg>`,
  '3': `<svg id="bulk-3" viewBox="0 0 420 133" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,13.5v97.88A21.64,21.64,0,0,0,21.67,133H398.33A21.64,21.64,0,0,0,420,111.38V13.5Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.29,0H12.71C5.69,0,0,6,0,13.5,0,21.2,6.17,27,12.71,27H407.29C413.83,27,420,20.08,420,13.5,420,6,414.31,0,407.29,0Z"/>
  </svg>`,
  '4': `<svg id="bulk-4" viewBox="0 0 265 116" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,4.5V106.38A9.61,9.61,0,0,0,9.61,116H255.39a9.61,9.61,0,0,0,9.61-9.62V4.5Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M260.65,0H4.35A4.52,4.52,0,0,0,0,4.5,4.43,4.43,0,0,0,4.35,9h256.3A4.43,4.43,0,0,0,265,4.5,4.69,4.69,0,0,0,260.65,0Z"/>
  </svg>`,
  '5': `<svg id="bulk-5" viewBox="0 0 424 210" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,86V194.86A15.11,15.11,0,0,0,15.07,210H408.93A15.11,15.11,0,0,0,424,194.86V86Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.22,0H16.78A16.8,16.8,0,0,0,0,16.82V86a17.06,17.06,0,0,0,16.78,17.12H407.22A17.06,17.06,0,0,0,424,86V16.82A16.8,16.8,0,0,0,407.22,0Z"/>
  </svg>`,
  '6': `<svg id="bulk-6" viewBox="0 0 424 255" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,131V239.85A15.11,15.11,0,0,0,15.07,255H408.93A15.11,15.11,0,0,0,424,239.85V131Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.22,0H16.78A16.8,16.8,0,0,0,0,16.82V131c0,9.29,7.51,17.28,16.78,17.28H407.22c9.27,0,16.78-8,16.78-17.28V16.82A16.8,16.8,0,0,0,407.22,0Z"/>
  </svg>`,
  '7': `<svg id="bulk-7" viewBox="0 0 280 254" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,131V239a15,15,0,0,0,15,15H265a15,15,0,0,0,15-15V131Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M263.26,0H16.74A16.76,16.76,0,0,0,0,16.79V131a16.94,16.94,0,0,0,16.74,17H263.26A16.94,16.94,0,0,0,280,131V16.79A16.76,16.76,0,0,0,263.26,0Z"/>
  </svg>`,
  '8': `<svg id="bulk-8" viewBox="0 0 424 290" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,166V275a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,275V166Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.22,0H16.78A16.79,16.79,0,0,0,0,16.8V166a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,166V16.8A16.79,16.79,0,0,0,407.22,0Z"/>
  </svg>`,
  '9': `<svg id="bulk-9" viewBox="0 0 352 328" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,205V313a15,15,0,0,0,15,15H337a15,15,0,0,0,15-15V205Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M335.25,0H16.75A16.75,16.75,0,0,0,0,16.75V205a17,17,0,0,0,16.75,17H335.25A17,17,0,0,0,352,205V16.75A16.75,16.75,0,0,0,335.25,0Z"/>
  </svg>`,
  '10': `<svg id="bulk-10" viewBox="0 0 424 329" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,205V314a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,314V205Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.22,0H16.78A16.77,16.77,0,0,0,0,16.75V205a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,205V16.75A16.77,16.77,0,0,0,407.22,0Z"/>
  </svg>`,
  '11': `<svg id="bulk-11" viewBox="0 0 282 329" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,205V314a15,15,0,0,0,15.08,15H266.92A15,15,0,0,0,282,314V205Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M265.21,0H16.79A16.77,16.77,0,0,0,0,16.75V205a17,17,0,0,0,16.79,17H265.21A17,17,0,0,0,282,205V16.75A16.77,16.77,0,0,0,265.21,0Z"/>
  </svg>`,
  '12': `<svg id="bulk-12" viewBox="0 0 424 371" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,247V356a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,356V247Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.22,0H16.78A16.78,16.78,0,0,0,0,16.77V247a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,247V16.77A16.78,16.78,0,0,0,407.22,0Z"/>
  </svg>`,
  '13': `<svg id="bulk-13" viewBox="0 0 352 371" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,247V356a15,15,0,0,0,15,15H337a15,15,0,0,0,15-15V247Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M335.25,0H16.75A16.73,16.73,0,0,0,0,16.72V247a17,17,0,0,0,16.75,17H335.25A17,17,0,0,0,352,247V16.72A16.73,16.73,0,0,0,335.25,0Z"/>
  </svg>`,
  '14': `<svg id="bulk-14" viewBox="0 0 424 450" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,328V435a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,435V328Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.22,0H16.78A16.79,16.79,0,0,0,0,16.8V328a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,328V16.8A16.79,16.79,0,0,0,407.22,0Z"/>
  </svg>`,
  '15': `<svg id="bulk-15" viewBox="0 0 424 527" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,403V512a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,512V403Z"/>
    <path class="bulk-cut" fill="$cutColor" d="M407.22,0H16.78A16.77,16.77,0,0,0,0,16.76V403a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,403V16.76A16.77,16.77,0,0,0,407.22,0Z"/>
  </svg>`,
  '16': `<svg id="bulk-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 313 106">
    <path class="bulk-base" fill="$baseColor" d="M10.6,66.1C6,79.1,2.4,92.4,0,106h306.5c5,0,6.5-3.6,6.5-6.1V5C103.8,22.3,39.2-2.7,10.6,66.1z"/>
    <path class="bulk-cut" fill="$cutColor" d="M307.7,0L70.6,13.5c-45.5,3.5-60,52.6-60,52.6c22.5-33.3,36.2-41.4,60.6-42.7L308.3,9.9c2.6,0,4.7-2.1,4.7-4.7c0-0.1,0-0.2,0-0.2C313.1,2.6,310.2-0.1,307.7,0z"/>
  </svg>`,
  '17': `<svg version="1.1" id="bulk-17" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 313 91" xml:space="preserve">
    <path class="bulk-base" fill="$baseColor" d="M10.6,44.8C4.6,57,0,69.9,0,91h307c3.3,0,6-2.7,6-6V4C33.7-1,37.9-4.8,10.6,44.8z"/>
    <path class="bulk-cut" fill="$cutColor" d="M308.5,0H58.4C28.6,0,13.5,39.4,11.1,43.9c0,0,20.4-34.9,46.3-34.9h251.1c2.5,0,4.5-2.5,4.5-4.9S311,0,308.5,0z"/>
  </svg>`,
  '18': `<svg version="1.1" id="bulk-18" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 289 126" xml:space="preserve">
    <path class="bulk-base" fill="$baseColor" d="M0,126h276c7.3,0,13-4,13-9.6V12C31.7,18.9,10.4,28.2,0,126z"/>
    <path class="bulk-cut" fill="$cutColor" d="M277.2,0C45.5,19.8,8.2-4.5,0,126C9.7,23.2,127.6,42.7,275.1,26c10.2-0.9,13.9-7.6,13.9-14C289,5.3,284.2,0,277.2,0z"/>
  </svg>`,
  '19': `<svg id="bulk-19" version="1.1" viewBox="0 0 268 172" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-cut" fill="$cutColor" d="M21,23.6C13.9,33.5,4.6,60.1,0,96.1c0,0,242.7,71.6,252.7,74.9c10,3.3,15.3-2,15.3-8.6V54C268,54,54.7,5.7,45.7,6C35.1,6.3,25.7,17.8,21,23.6z"/>
    <path class="bulk-base" fill="$baseColor" d="M258.1,45.3c-7.3-2-139-33.6-184.7-44.3C60.5-1.8,38.6-0.1,21,23.6c2-2.5,10.4-11.6,21.1-9c12.3,3,190.6,49.1,190.6,49.1C240,66,259.1,71,265.4,61c1.8-2.8,2.5-5.1,2.6-7C268.1,49.1,263.4,46.7,258.1,45.3z"/>
  </svg>`,
  '20': `<svg id="bulk-20" version="1.1" viewBox="0 0 286 197" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M8,88L0,197h270c8.5,0,16-5.5,16-14V88H8z"/>
    <path class="bulk-cut" fill="$cutColor" d="M285.5,13c-0.8-7.7-4.2-13-14.5-13C258.7,0,115.7,11.8,90,14C19,20.1,0,69.8,0,111v86c6.2-42.3,25.1-76.5,82-81.8c33.7-3.5,184-14.2,184-14.2c11.2,0,20-4.5,20-15C286,56.2,285.9,20.4,285.5,13z"/>
  </svg>`,
  '21': `<svg id="bulk-21" version="1.1" viewBox="0 0 287 235" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" fill="$baseColor" d="M0,235h271c10,0,16-5.7,16-14V113H0V235z"/>
    <path class="bulk-cut" fill="$cutColor" d="M270,0C260.4,0,95.2,11.3,62,17S0,49,0,104v131c0,0,9.9-74.3,66-79s199-15,199-15c10.3,0,22-3.7,22-16V20C287,6.2,278.3,0,270,0z"/>
  </svg>`,
  '22': `<svg id="bulk-22" version="1.1" viewBox="0 0 287 322" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" d="M0,145v177h271c10,0,16-5.7,16-14V145H0z" fill="$baseColor"/>
    <path class="bulk-cut" fill="$cutColor" d="M270,0C260.4,0,95.2,10.3,62,16S0,47,0,102v215c0,0,9.9-74.3,66-79s199-15,199-15c10.3,0,22-3.7,22-16V19C287,6.9,278.8,0,270,0z"/>
  </svg>`,
  '23': `<svg version="1.1" id="bulk-23" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 287 357" xml:space="preserve">
    <path class="bulk-base" d="M0,200l0.1,157H271c10,0,16-5.7,16-14V200H0z" fill="$baseColor"/>
    <path class="bulk-cut" fill="$cutColor" d="M270,0C260.4,0,94.6,7.6,62,16C17.4,27.5,0,47.1,0,118v239c0,0,9.9-74.3,66-79s199-15,199-15c10.3,0,22-3.7,22-16V19C287,7.6,279.6,0,270,0z"/>
  </svg>`,
  '24': `<svg id="bulk-24" version="1.1" viewBox="0 0 287 437" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" d="M0,300v137h271c10,0,16-5.7,16-14V300H0z" fill="$baseColor"/>
    <path class="bulk-cut" fill="$cutColor" d="M270,0C260.4,0,95.2,10.3,62,16S0,47,0,102v335c0,0,9.9-74.3,66-79s199-15,199-15c10.3,0,22-3.7,22-16V19C287,7.1,279.1,0,270,0z"/>
  </svg>`,
  '25': `<svg id="bulk-25" viewBox="0 0 286 512" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" d="M0,350V512H271c10,0,15-4.67,15-13V350Z" fill="$baseColor"/>
    <path class="bulk-cut" fill="$cutColor" d="M267,0C257.42,0,94.18,10.33,61,16S0,45,0,102V512s8.9-73.33,65-78,200-15,200-15c10.26,0,21-3.67,21-16V19C286,3.63,278.19,0,267,0Z"/>
  </svg>`,
};
