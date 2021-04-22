import { Typings } from './FontType';


type LayoutType = {
  w: number,
  h: number,
  minW: number,
  minH: number,
  maxW: number,
  maxH: number,
  display: "flex" | "block",
  verticalAlign: "baseline" | "top",
  overflow: "hidden" | "scroll" | "visible",
}

type TypographyType = {
  FontSize: "xs" | "sm" | "base" | "lg" | "xl",
  FontWeight: "thin" | "extralight" | "light" | "normal",
  FontStyle: "italic", "italic",
  FontVariantNumeric: "normal-nums", "ordinal", "slashed-zero", "lining-nums", "oldstyle-nums", "proportional-nums", "tabular-nums", "diagonal-fractions", "stacked-fractions",
  LetterSpacing: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest",
  color: "TAILWIND COLOR",
  TextAlign: "left" | "center" | "right" | "justify",
  LineHeight: `leading-value`,
  TextOpacity: number,
  TextTransform: "uppercase" | "lowercase" | "capitalize" | "normal-case"
}

type EffectsType = {
  shadow: "xs" | "sm" | "base" | "lg",
  opacity: number,
  rotate: number,
  scale: number,
  scaleX: number,
  scaleY: number,
  skewX: number,
  skewY: number,
  translateX: number,
  translateY: number
}

type SpacingType = {
  p: number,
  pt: number,
  pr: number,
  pb: number,
  pl: number,
  px: number,
  py: number,
  //margin
  m: number,
  mt: number,
  mr: number,
  mb: number,
  ml: number,
  mx: number,
  my: number,
}

type FlexBoxType = {
  alignItems: "start" | "end" | "center" | "baseline" | "stretch",
  alignContent: "center" | "start" | "end" | "between" | "around" | "evenly",
  // justifyItems: "center" | "start" | "end" | "between" | "around" | "evenly",
  justifyContent: "center" | "start" | "end" | "between" | "around" | "evenly",
  flexWrap: "wrap" | "wrap-reverse" | "nowwrap"
  flexDirection: "row" | "row-reverse" | "col" | "col-reverse"
  flex: "1" | "auto" | "initial" | "none"
  flexGrow: 1 | 0,
  flexShrink: 1 | 0,
  alignSelf: "start" | "end" | "center" | "auto" | "stretch"
}

type AllSuperTypes = FlexBoxType & SpacingType & EffectsType & TypographyType & LayoutType & Typings

export { AllSuperTypes, TypographyType, LayoutType, SpacingType, FlexBoxType, EffectsType, Typings as TypingsType }