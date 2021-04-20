import { Typings } from './FontType';


type LayoutType = {
  title: "gfgdf" | "ytrytr",
  paragraph: string
}

type TypographyType = {
  FontSize: "xs" | "sm" | "base" | "lg" | "xl",
  FontWeight: "thin" | "extralight" | "light" | "normal",
  FontStyle: "italic", "italic"
  FontVariantNumeric: "normal-nums", "ordinal", "slashed-zero", "lining-nums", "oldstyle-nums", "proportional-nums", "tabular-nums", "diagonal-fractions", "stacked-fractions",
  // LetterSpacing: `tracking-${value}`,
  color: "text-COLOR",
  // TextAlign: `text-${value}`,
  // LineHeight: `leading-${value}`,
  // TextOpacity: `text-opacity-${value}`,
  // TextDecoration: `${value}`,
  // TextTransform: `${value}`,
}

export {TypographyType, LayoutType, Typings as TypingsType}