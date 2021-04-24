## PicoStyle
> Styling Library for React Native(Expo) with Super Features!  Create beautiful and unique apps very quickly.

- Super-featured: Animation support, gradient, localization, shadows, theme and global context with persist!
- Big support for types.
- Support for Tailwind, and syntax similar to styled-components.
- Dark theme, inline :dark - All of properties have :dark
- Pseudoclass No extra steps. :first, :last, :odd, :even
- **Support Tailwind gradient, translate, rotate, scale !**
- There are over 2500 fonts to choose from. No extra steps(for DEV), with realtime update. Just fontFamily=""

<p>Hit me stars :star::star:</p>

## Install and usage:
```
yarn add rn-picostyle
npm install -S rn-picostyle
```
```
import tw, { ThemeProvider, LocalizationProvider, useTheme, useLocalization, combineProviders, FlexBox, Layout, Spacing, Typography, Effects, useContext } from 'rn-picostyle'
```

## demo
#### Just looking. It contains everything you need to know!  [Link](https://github.com/KULTI1995/rn-picostyle/blob/master/Examples/demo.jsx "Showcase Project")
<img src="https://user-images.githubusercontent.com/14282128/115757576-c29a8980-a39e-11eb-8ecd-7c6905fdbf71.png" width="60%">

## Guide

#### Global Contex - No more nesting.

```react
const AppProvider = combineProviders([
  [ThemeProvider, { initialState: {theme, persist:true} }],
  [LocalizationProvider, { initialState: { translations, fallback: true, persist:true } }],
]);
```

Your own Contex - with data persist, if you want.
```
import {createContainer, usePersistState} from 'rn-picostyle'

const MeContext = (initialState) => {
  const [data, setData, restored] = usePersistState("@storage_path", initialState['data'], {persist: true});
  const [OtherData, setOtherData] = useState(initialState);


  return { data, setData, restored, OtherData, setOtherData }
}

const useTheme = createContainer(ThemeContext);
const ThemeProvider = useTheme.Provider

export { ThemeProvider, useTheme };
```

and use:
```
 const { t, locale, setLocale } = useContext(useLocalization);
 ```
```
 const { theme } = useContext(useTheme)
 ```

### Styling

#### 1. Inline flex, or mix?
Layout, Spacing, Typography, Effects - syntax like styled system, for you. :)
```react
const Row = tw.View`${Layout} ${Spacing} ${FlexBox} ${Typography} ${Effects}`
```
And automatic suggesting, you do not have to do anything. No thank you, put the coffee down. :)


#### 2. Inheritance and style override
```react
const SquarePosition = tw.View`bg-red-200`
const SquareInner = tw(SquarePosition)`bg-blue-200`
```

#### 3. Animation? No problem, just use AnimatableView/AnimatableText (Support all of react-native-animatable)
- Support syntax: native:Bollean, animation:TYPE, iterationDelay:TIME, easing:ease-out, direction:DIRECTION, iterationCount:infinite, delay:TIME
- Support Animations TYPE: bounce flash jello pulse rotate rubberBand shake swing tada wobble etc. (Support all of react-native-animatable)

```react
const FooterRightBuyButton = tw.AnimatableView`animation:pulse iterationDelay:2000 easing:ease-out iterationCount:infinite`
```

#### 4. Gradient? Just change View, to LinearGradient. Like Tailwind syntax, and support tailwind color.
```react
const LinearGradientBox = tw.LinearGradient`from-red-400 via-red-200 to-transparent gradient-to-tr`
```
#### 5. Iterable element? Use special pseudo classes. No extra steps, just write.
Pseudo: fist, last, odd, even

```react
const Box = tw.View`w-8 h-8 bg-red-200 rounded m-1 last:bg-pink-200 first:bg-blue-200`

<Row center>
  <Box/>
  <Box/>
  <Box/>
  <Box/>
  <Box/>
  <Box/>
</Row>
```
#### 6. Using fonts, no extra steps!(DEV) Over 2500 to choose from. With prompting, but not only for fonts !
![ezgif com-gif-maker](https://user-images.githubusercontent.com/14282128/115872915-a3553800-a442-11eb-98b2-7400c6310e51.gif)

Usage fonts, in production: [Link](https://docs.expo.io/guides/using-custom-fonts "Expo font")

### TODO:
- Improving and increasing the speed
- Rewriting the code more concise.

### :heart::heart: Created by Kamil Niedbalski - pixelkoduje.pl :heart::heart:
pixelkoduje@gmail.com - hire me :)

<div align="center">
<p>Liked the library? <g-emoji class="g-emoji" alias="innocent" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f607.png">😇</g-emoji></p>
<p><a href="https://www.buymeacoffee.com/pixelkoduje" rel="nofollow"><img src="https://cdn.buymeacoffee.com/assets/img/home-page-v3/bmc-new-logo.png" alt="Buy Me A Coffee" height="34" style="max-width:100%;"></a></p>
</div>
