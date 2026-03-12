/**
 * Nose SVG templates ported from the web library.
 * All noses share viewBox "0 0 200 214" (aspect ratio 214/200 = 1.07).
 *
 * CSS class → inline attribute mapping:
 *   nose-filling-straight → fill=floorColor   (fuselage background rect)
 *   nose-filling          → fill=fuselageColor (hull interior)
 *   nose-dotted-line      → fill=none stroke=none (hidden guide)
 *   nose-outline          → fill=none stroke=strokeColor
 *   nose-windows          → fill=white
 */
export interface NoseStyle {
    floorColor: string;
    fuselageColor: string;
    strokeColor: string;
}
/** Returns the SVG string for the given noseType, falling back to 'default'. */
export declare function getNoseSvg(noseType: string, s: NoseStyle): string;
/** Returns aspect ratio (height/width) for the given nose type. */
export declare function getNoseAspectRatio(noseType: string): number;
/** @deprecated Use getNoseAspectRatio(noseType) for per-type height. */
export declare const NOSE_ASPECT_RATIO: number;
//# sourceMappingURL=nose-templates.d.ts.map