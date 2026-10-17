/**
 * Fluid tokens shared by every auth page.
 * Every value scales linearly between its min and max with the viewport (clamp).
 *  - shared tokens : 375px -> 1280px
 *  - panel tokens  : 640px -> 1280px (the side panel only exists from sm up)
 */
export const fluid = {
  // side panel (640 -> 1280)
  panelRadius: "rounded-[clamp(0.75rem,0rem_+_1.875vw,1.5rem)]", // 12 -> 24
  panelMinW: "min-w-[clamp(17.5rem,15rem_+_6.25vw,20rem)]", // 280 -> 320
  panelPad: "p-[clamp(1.5rem,1rem_+_1.25vw,2rem)]", // 24 -> 32

  // shared (375 -> 1280)
  logo: "h-[clamp(2.125rem,calc(1.13vw+1.86rem),2.875rem)]", // 34 -> 46
  panelTitle: "text-[length:clamp(1.625rem,1.47rem_+_0.663vw,2rem)]", // 26 -> 32
  panelDesc: "text-[length:clamp(1rem,0.948rem_+_0.221vw,1.125rem)]", // 16 -> 18
  panelStack: "gap-[clamp(0.5rem,0.396rem_+_0.442vw,0.75rem)]", // 8 -> 12
  helpText: "text-[length:clamp(0.875rem,0.823rem_+_0.221vw,1rem)]", // 14 -> 16

  // contact list
  contactMt: "mt-[clamp(1rem,0.793rem_+_0.884vw,1.5rem)]", // 16 -> 24
  contactText: "text-[length:clamp(1rem,0.948rem_+_0.221vw,1.125rem)]", // 16 -> 18
  contactBox: "size-[clamp(1.875rem,1.72rem_+_0.663vw,2.25rem)]", // 30 -> 36
  contactGlyph: "text-[length:clamp(0.75rem,0.698rem_+_0.221vw,0.875rem)]", // 12 -> 14

  // form
  formGap: "gap-[clamp(1.5rem,1.137rem_+_1.547vw,2.375rem)]", // 24 -> 38
  headGap: "gap-[clamp(0.25rem,0.146rem_+_0.442vw,0.5rem)]", // 4 -> 8
  welcome: "text-[length:clamp(1.5rem,1.293rem_+_0.884vw,2rem)]", // 24 -> 32
  subtitle: "text-[length:clamp(0.75rem,0.698rem_+_0.221vw,0.875rem)]", // 12 -> 14
  fieldsGap: "gap-[clamp(1rem,0.793rem_+_0.884vw,1.5rem)]", // 16 -> 24
  forgot: "text-[length:clamp(0.813rem,0.735rem_+_0.331vw,1rem)]", // 13 -> 16
  orText: "text-[length:clamp(0.75rem,0.698rem_+_0.221vw,0.875rem)]", // 12 -> 14
  socialH: "h-[clamp(2.75rem,2.698rem_+_0.221vw,2.875rem)]", // 44 -> 46
  socialIcon: "text-[length:clamp(1.25rem,0.991rem_+_1.105vw,1.875rem)]", // 20 -> 30
  googleIcon: "size-[clamp(1.25rem,0.991rem_+_1.105vw,1.875rem)]", // 20 -> 30
  signupMt: "mt-[clamp(1.5rem,1.396rem_+_0.442vw,1.75rem)]", // 24 -> 28
  signupText: "text-[length:clamp(1rem,0.948rem_+_0.221vw,1.125rem)]", // 16 -> 18
  signupLink: "text-[length:clamp(0.938rem,0.912rem_+_0.11vw,1rem)]", // 15 -> 16

  // spacing (375 -> 1280)
  gapIcon: "gap-[clamp(0.25rem,0.198rem_+_0.221vw,0.375rem)]", // 4 -> 6
  gapInline: "gap-[clamp(0.5rem,0.448rem_+_0.221vw,0.625rem)]", // 8 -> 10
  gapTight: "gap-[clamp(0.375rem,0.323rem_+_0.221vw,0.5rem)]", // 6 -> 8
  helpGap: "gap-[clamp(0.625rem,0.573rem_+_0.221vw,0.75rem)]", // 10 -> 12
  gapMd: "gap-[clamp(1rem,0.793rem_+_0.884vw,1.5rem)]", // 16 -> 24
  dividerMy: "my-[clamp(0.5rem,0.396rem_+_0.442vw,0.75rem)]", // 8 -> 12
  contactGap: "gap-[clamp(1.5rem,1.293rem_+_0.884vw,2rem)]", // 24 -> 32

  // side panel spacing (640 -> 1280)
  panelGap: "gap-[clamp(1.5rem,1rem_+_1.25vw,2rem)]", // 24 -> 32

  // mobile-only offsets (375 -> 640): room for the pinned logo / toggle
  mobilePt: "max-sm:pt-[clamp(6rem,4.585rem_+_6.038vw,7rem)]", // 96 -> 112
  mobilePb: "max-sm:pb-[clamp(5rem,3.585rem_+_6.038vw,6rem)]", // 80 -> 96
  mobileTop: "top-[clamp(1.5rem,0.792rem_+_3.019vw,2rem)]", // 24 -> 32
  mobileBottom: "bottom-[clamp(1.5rem,0.792rem_+_3.019vw,2rem)]", // 24 -> 32
};
