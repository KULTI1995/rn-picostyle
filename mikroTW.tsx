// @ts-nocheck

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'

import { ThemeProvider, useTheme, AppProvider, LocalizationProvider, useLocalization } from './Providers'

import { createContainer, useContainer as useContext } from 'unstated-next';
import { combineProviders } from 'react-combine-provider';
import * as Animatable from 'react-native-animatable';
import { usePersistStorage as usePersistState } from "react-native-use-persist-storage";

import {
  ActivityIndicator, Button, DrawerLayoutAndroid
  , Image, ImageBackground, KeyboardAvoidingView, Modal, NavigatorIOS
  , Picker, PickerIOS, ProgressBarAndroid, ProgressViewIOS, ScrollView, SegmentedControlIOS, Slider
  , SnapshotViewIOS, Switch, RecyclerViewBackedScrollView, RefreshControl, SafeAreaView, StatusBar
  , Text, TextInput, ToastAndroid
  , TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback
  , View, FlatList, SectionList, VirtualizedList, Pressable, Touchable
} from 'react-native'
import tailwind, { getColor } from 'tailwind-rn'

import { LinearGradient } from 'expo-linear-gradient';

// fonts
import * as fonts from '@expo-google-fonts/dev'
import * as Font from 'expo-font';
import { TypingsType, LayoutType, TypographyType } from './AllTypings';

import memoizeOne from 'memoize-one';

const shadowGeneratorClass = (shadowColor, shadowOffsetWidth, shadowOffsetHeight, shadowOpacity, shadowRadius, elevation) => {
  return {
    shadowColor: shadowColor || "#000",
    shadowOffset: {
      width: shadowOffsetWidth || 0,
      height: shadowOffsetHeight || 1,
    },
    shadowOpacity: shadowOpacity || 0.18,
    shadowRadius: shadowRadius || 1.00,

    elevation: elevation || 1,
  }
}

const DecodeTransform = (string: String, size = { "height": 0, "width": 0 }, transformMatch = [], shadowsMatch = []) => {
  const sizes = { width: size?.width || 0, height: size?.height || 0 }

  let ClassObject = {}
  let shadowStyle = {}

  ClassObject.transform = []

  transformMatch.forEach((item) => {
    const regexTranslate = /(-?)translate-(x|y)-(full|(\d)\/(\d)|\d\.\d|\d+)/
    if (item.startsWith('-rotate')) {
      const [pseudo, classValue] = item.split("rotate-")
      ClassObject['transform'].push({ rotate: `-${classValue}deg` })
    } else if (item.startsWith('rotate')) {
      const [pseudo, classValue] = item.split("rotate-")
      ClassObject['transform'].push({ rotate: `${classValue}deg` })
    }

    if (regexTranslate.test(item)) {
      const [full, minusPlus, xOrY, numberOrFull, number1, number2] = regexTranslate.exec(item)
      const isFull = numberOrFull == 'full'
      const isNumber = number1 && number2
      const widthHeightDetectWidth = xOrY == "y" ? sizes['height'] : sizes['width']

      const HowPercent = isFull ? widthHeightDetectWidth : number1 / number2 * widthHeightDetectWidth
      const HowPx = +`${minusPlus && '-'}${numberOrFull * 0.25 * 16}`

      let TranslateText = 0 | ""

      if (isNumber || isFull) { TranslateText = HowPercent }
      else { TranslateText = HowPx }

      if (minusPlus == '-') { TranslateText = -TranslateText }
      if (xOrY == "x") {
        ClassObject['transform'].push({ translateX: TranslateText })
      } else {
        ClassObject['transform'].push({ translateY: TranslateText })
      }
    }

    if (item.startsWith('scale-y-')) {
      const [pseudo, classValue] = item.split("scale-y-")
      ClassObject['transform'].push({ scaleY: +classValue / 100 })
    } else if (item.startsWith('scale-x-')) {
      const [pseudo, classValue] = item.split("scale-x-")
      ClassObject['transform'].push({ scaleX: +classValue / 100 })
    } else if (item.startsWith('scale-')) {
      const [pseudo, classValue] = item.split("scale-")
      ClassObject['transform'].push({ scale: +classValue / 100 })
    }

    if (item.startsWith('skew-x-')) {
      const [pseudo, classValue] = item.split("skew-x-")
      ClassObject['transform'].push({ skewX: `${classValue}deg` })
    } else if (item.startsWith('-skew-x-')) {
      const [pseudo, classValue] = item.split("-skew-x-")
      ClassObject['transform'].push({ skewX: `-${classValue}deg` })
    } else if (item.startsWith('skew-y-')) {
      const [pseudo, classValue] = item.split("skew-y-")
      ClassObject['transform'].push({ skewY: `${classValue}deg` })
    } else if (item.startsWith('-skew-y-')) {
      const [pseudo, classValue] = item.split("-skew-y-")
      ClassObject['transform'].push({ skewY: `-${classValue}deg` })
    }
  })

  shadowsMatch.forEach((item) => {
    if (item.startsWith('shadow')) {
      const [pseudo, classValue] = item.split("shadow")
      switch (classValue) {
        case "-sm":
          shadowStyle = shadowGeneratorClass("#000", 0, 1, 0.18, 1.00, 2)
          break;
        case "":
          shadowStyle = shadowGeneratorClass("#000", 0, 1, 0.20, 1.41, 3)
          break;
        case "-md":
          shadowStyle = shadowGeneratorClass("#000", 0, 1, 0.22, 2.22, 5)
          break;
        case "-lg":
          shadowStyle = shadowGeneratorClass("#000", 0, 2, 0.23, 2.62, 6)
          break;
        case "-xl":
          shadowStyle = shadowGeneratorClass("#000", 0, 2, 0.25, 3.84, 7)
          break;
        default:
          break;
      }
    }
  })

  ClassObject = { ...ClassObject, ...shadowStyle }
  return ClassObject
}

const PseudoClassDecode = (string: String, i, arrLength) => {
  let webHooksFromTailwindString = string.match(
    /(first:)(\S+)|(last:)(\S+)|(odd:)(\S+)|(even:)(\S+)/g
  ) || []

  const styles = webHooksFromTailwindString.map((item) => {
    // console.log(item)
    // console.log(i, arrLength-1)
    const [pseudo, className] = item.split(":")
    if (pseudo === "first" && i == 0) {
      return className
    }
    if (pseudo === "last" && i == arrLength - 1) {
      return className
    }
    if (pseudo === "odd" && i % 2) {
      return className
    }
    if (pseudo === "even" && !(i % 2)) {
      return className
    }
    return ""

  }).join(" ")

  return styles
}

const ThemeClassDecode = (theme: String, string: String) => {
  let webHooksFromTailwindString = string.match(
    /(dark:)(\S+)/g
  ) || []

  let cutString = string.replace(/((dark:)(\S+))/g, " ");

  webHooksFromTailwindString = webHooksFromTailwindString.map((item) => {
    const [pseudo, className] = item.split(":")
    if (pseudo === "dark" && theme == "dark") {
      return className
    }
    return ""
  }).join(" ")

  return cutString + " " + webHooksFromTailwindString
}

const AnimationDecode = (styles: String) => {
  let animationProps = { "useNativeDriver": true }
  const animateArray = styles.match(/(native:|animation:|iterationDelay:|iterationCount:|transition:|direction:|easing:|delay:)(\S+)/g) || []

  animateArray.forEach((item) => {
    const [, pseudo, className,] = item.split(/(native:|animation:|iterationDelay:|iterationCount:|transition:|direction:|easing:|delay:)(\S+)/g)
    if (pseudo === "iterationCount:") {
      animationProps["iterationCount"] = Number(className) ? +className : className
    }
    else if (pseudo === "iterationDelay:") {
      animationProps["iterationDelay"] = Number(className) ? +className : className
    }
    else if (pseudo === "native:") {
      animationProps["useNativeDriver"] = Boolean(className)
    }
    else if (pseudo === "easing:") {
      animationProps["easing"] = className
    }
    else if (pseudo === "direction:") {
      animationProps["direction"] = className
    }
    else if (pseudo === "direction:") {
      animationProps["direction"] = className
    }
    else if (pseudo === "animation:") {
      animationProps["animation"] = className
    }
    else if (pseudo === "delay:") {
      animationProps["delay"] = Number(className) ? +className : className
    }
  })
  return animationProps
}

const GradientDecode = (string: String) => {
  let gradientPosition = [[1, 0], [0, 0]]

  let webHooksFromTailwindString = string.match(
    / (from-|via-|to-)(\S+)/g
  ) || []

  let gradientPositionString = string.match(
    /(gradient-to-)(\S+)/g
  ) || []

  gradientPositionString.forEach((item) => {
    const className = item.slice(12, item.length)

    switch (className) {
      case "t":
        gradientPosition = [[0, 0], [0, 1]]
        break;
      case "tr":
        gradientPosition = [[1, 0], [0, 1]]
        break;
      case "r":
        gradientPosition = [[1, 0], [0, 0]]
        break;
      case "br":
        gradientPosition = [[1, 1], [0, 0]]
        break;
      case "b":
        gradientPosition = [[0, 1], [0, 0]]
        break;
      case "bl":
        gradientPosition = [[0, 1], [1, 0]]
        break;
      case "l":
        gradientPosition = [[0, 0], [1, 0]]
        break;
      case "tl":
        gradientPosition = [[0, 0], [1, 1]]
        break;
      default:
        break;
    }
  })

  webHooksFromTailwindString = webHooksFromTailwindString.map((item) => {
    const [, pseudo, className,] = item.split(/(from-|via-|to-)(\S+)/)
    if (pseudo === "from-") {
      return getColor(className)
    }
    if (pseudo === "via-") {
      return getColor(className)
    }
    if (pseudo === "to-") {
      return getColor(className)
    }
    return " "

  })
  return [webHooksFromTailwindString, gradientPosition]
}

const useComponentSize = () => {
  const [size, setSize] = useState(null);

  const onLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

const memoizeGradientDecode = memoizeOne(GradientDecode)
const memoizeAnimationDecode = memoizeOne(AnimationDecode)

const tw = <TComponent extends React.FC<React.ComponentProps<TComponent> & TypingsType & LayoutType & TypographyType>>(Component: TComponent, DisplayName = Component.name) => {
  return (strings, ...args): TComponent => {
    return memo((props) => {
      // console.time("Component Render Time");
      const { theme, themeStyle } = useTheme.useContainer()
      const [style, setStyle] = useState('')
      const [linearGradient, setLinearGradient] = useState(['transparent', 'transparent'])
      const [gradientPosition, setGradientPosition] = useState([[0, 0], [0, 0]])
      const [font, setFont] = useState(undefined)
      const [extraProps, setExtraProps] = useState({})
      const [styleOther, setClassObject] = useState({})
      const [size, onLayout] = useComponentSize();

      let mapStyles: [String] = useMemo(() => {
        const interleaved = args.reduce(
          (acc, arg, index) => {
            return [...acc, arg, strings[index + 1]]; s
          },
          [strings[0]]
        );

        let mapStyles = interleaved
          .map(part => (typeof part === "function" ? part(props) : part))
          .join("").replace(/false/g, '').concat(" ", props.className || "");

        return mapStyles
      }, [args, props.className])

      let [transformMatch, shadowsMatch] = useMemo(() => [
        mapStyles.match(/(rotate-|-rotate-|translate-x-|translate-y-|-translate-x-|-translate-y-|scale-|scale-x-|scale-y-|skew-x-|skew-y-)(\w+|full|\d\/\d|\d+)/g) || [],
        mapStyles.match(/(shadow-|shadow)(\w+|)/g) || [],
      ], [mapStyles])

      let gradientMatch = useMemo(() => mapStyles.match(/gradient-to-| (from-|via-|to-)(\S+)/g) || [], [mapStyles])

      // transform (shadow etc...)
      const transformObj = useMemo(() => {
        if (transformMatch || shadowsMatch) {
          return DecodeTransform(mapStyles, size, transformMatch, shadowsMatch)
        } else {
          return {}
        }
      }, [transformMatch, shadowsMatch])

      // pseudoclass (odd, first, last, etc...)
      const pseudoClass = useMemo(() => {
        if (!!props.allProps && props.allProps?.arr > 1) {
          let { i, arr } = props?.allProps
          return PseudoClassDecode(mapStyles, i, arr)
        } else {
          return ""
        }
      }, [props.allProps])

      const Theme = useMemo(() => {
        const styles = mapStyles.concat(" ", pseudoClass).replace(/(gradient-to-|from-|via-|to-|animation:|iterationDelay:|iterationCount:|transition:|direction:|easing:|delay:|native|first:|last:|odd:|even:|translate-y-|-translate-y-|shadow-|rotate|-rotate)(\S+)/g, "")
        if (themeStyle && theme == 'dark') {

          const styleArray = styles.split(/ +|\n/).filter(Boolean)
          let themeStringFromStyle = styleArray.map((styleItem) => themeStyle[styleItem] || styleItem).join(" ")

          return ThemeClassDecode(theme, themeStringFromStyle)

        }
        return styles.replace(/(dark:)(\S+)/g, "")
      }, [mapStyles, theme, themeStyle, props.allProps])

      const fontFamily = useMemo(() => {
        return new Promise((resolve, reject) => {
          if (!!props.fontFamily) {
            const fontFamilyRegex = /(\w+)_(\d+)(\w+)/
            let fontFamily = props.fontFamily || ""
            const fontFamilyExec = fontFamilyRegex.exec(fontFamily) || false
            const isfirstRender = font === undefined
            const isTheSameFont = font == fontFamily
            if ((isfirstRender && fontFamilyExec) || (fontFamilyExec && !isTheSameFont)) {
              async function loadFont(fontFamily) {
                return await Font.loadAsync({ [fontFamily]: fonts[fontFamily] });
              }
              // after the loading set the font status to true
              loadFont(props.fontFamily).then(() => {
                setFont(props.fontFamily)
                resolve({ fontFamily: props.fontFamily, fontWeight: fontFamilyExec[2] })
              });
            } else if (fontFamilyExec) {
              setFont(props.fontFamily)
              resolve({ fontFamily: props.fontFamily, fontWeight: fontFamilyExec[2] })
            } else {
              resolve({ fontFamily: props.fontFamily })
            }
          } else {
            resolve({})
          }
        })

      }, [props.fontFamily])

      useEffect(() => {
        async function setAllClass() {
          const font = await fontFamily
          setClassObject({ ...font, ...transformObj })
        }
        setAllClass();

        if (DisplayName == 'LinearGradient' && gradientMatch) {
          const [gradientArray, gradientPosition] = memoizeGradientDecode(mapStyles)
          setLinearGradient(gradientArray)
          setGradientPosition(gradientPosition)
        } else {
          setLinearGradient(['transparent', 'transparent'])
        }

        if (DisplayName == "AnimatableComponent") {
          setExtraProps(memoizeAnimationDecode(mapStyles))
        }
      }, [mapStyles, Component])

      // przekazanie miejsc, do propsów (first, last, odd, even)
      const children = useMemo(() => {
        return React.Children.map(props.children, (child: React.ReactElement, index) => {
          if (!React.isValidElement(child)) {
            return child
          }
          // Eg. String has no props
          if (child.props) {
            const allProps = { arr: props.children.length, i: index }
            // @ts-ignore
            return React.cloneElement(child, { allProps });
          }
          return child;
        })
      }, [props.children])

      let underlayColor = useMemo(() => (props?.underlayColor || '') && props?.underlayColor.search(/bg-\S+/) != -1 ? tailwind(props?.underlayColor).backgroundColor : props?.underlayColor, [props.underlayColor])
      let contentContainerStyle = useMemo(() => props?.contentContainerStyle ? tailwind(props.contentContainerStyle) : "", [props.contentContainerStyle])

      const NotAllowedComponent = ["TouchableWithoutFeedback", "TouchableHighlight"]

      if (DisplayName === "LinearGradient") {
        return <Component
          start={gradientPosition[1]}
          end={gradientPosition[0]}
          // Button Linear Gradient
          colors={linearGradient}
          onLayout={onLayout} {...props} style={{ ...tailwind(Theme), ...props.style, ...styleOther }}>
          {props.children}
        </Component>
      }

      return (
        <Component
          onLayout={onLayout} {...props} style={{ ...tailwind(Theme), ...props.style, ...styleOther}} contentContainerStyle={contentContainerStyle} underlayColor={underlayColor} {...extraProps}>
          { NotAllowedComponent.includes(DisplayName) ? props.children : children}
        </Component>
      )
    })
  }
}

tw.AnimatableView = tw(Animatable.View, "AnimatableComponent")
tw.AnimatableText = tw(Animatable.Text, "AnimatableComponent")
tw.AnimatableImage = tw(Animatable.Image, "AnimatableComponent")
tw.LinearGradient = tw(LinearGradient, "LinearGradient")

tw.Touchable = tw(Touchable, "Touchable")
tw.ActivityIndicator = tw(ActivityIndicator, "ActivityIndicator")
tw.Button = tw(Button, "Button")
tw.DatePickerIOS = tw(View, "View")
tw.DrawerLayoutAndroid = tw(DrawerLayoutAndroid, "DrawerLayoutAndroid")
tw.Image = tw(Image, "Image")
tw.ImageBackground = tw(ImageBackground, "ImageBackground")
tw.KeyboardAvoidingView = tw(KeyboardAvoidingView, "KeyboardAvoidingView")
tw.Modal = tw(Modal, "Modal")
tw.NavigatorIOS = tw(NavigatorIOS, "NavigatorIOS")
tw.Pressable = tw(Pressable, "Pressable")
tw.Picker = tw(Picker, "Picker")
tw.PickerIOS = tw(PickerIOS, "PickerIOS")
tw.ProgressBarAndroid = tw(ProgressBarAndroid, "ProgressBarAndroid")
tw.ProgressViewIOS = tw(ProgressViewIOS, "ProgressViewIOS")
tw.ScrollView = tw(ScrollView, "ScrollView")
tw.SegmentedControlIOS = tw(SegmentedControlIOS, "SegmentedControlIOS")
tw.Slider = tw(Slider, "Slider")
tw.SnapshotViewIOS = tw(SnapshotViewIOS, "SnapshotViewIOS")
tw.Switch = tw(Switch, "Switch")
tw.RecyclerViewBackedScrollView = tw(RecyclerViewBackedScrollView, "RecyclerViewBackedScrollView")
tw.RefreshControl = tw(RefreshControl, "RefreshControl")
tw.SafeAreaView = tw(SafeAreaView, "SafeAreaView")
tw.StatusBar = tw(StatusBar, "StatusBar")
tw.Text = tw(Text, "Text")
tw.TextInput = tw(TextInput, "TextInput")
tw.ToastAndroid = tw(ToastAndroid, "ToastAndroid")
tw.TouchableHighlight = tw(TouchableHighlight, "TouchableHighlight")
tw.TouchableNativeFeedback = tw(TouchableNativeFeedback, "TouchableNativeFeedback")
tw.TouchableOpacity = tw(TouchableOpacity, "TouchableOpacity")
tw.TouchableWithoutFeedback = tw(TouchableWithoutFeedback, "TouchableWithoutFeedback")
tw.View = tw(View, "View")
tw.FlatList = tw(FlatList, "FlatList")
tw.SectionList = tw(SectionList, "SectionList")
tw.VirtualizedList = tw(VirtualizedList, "VirtualizedList")
tw.Pressable = tw(Pressable, "Pressable")

tw.css = (strings: Array<String>, ...args: Array<Function>) => {
  return (props) => {
    return `${strings.map(item => item).join(" ")} ${args.map(item => item(props)).join(" ")}`
  }
}

// ${//props?.flexBasis ? 'bg-'+props.bg: ""}
const FlexBox = (props) => {
  let styleString = ""

  const config = {
    alignItems: (value) => `items-${value}`,
    alignContent: (value) => `content-${value}`,
    justifyItems: (value) => `justify-items-${value}`,
    justifyContent: (value) => `justify-${value}`,
    flexWrap: (value) => `flex-${value}`,
    flexDirection: (value) => `flex-${value}`,
    flex: (value) => `flex-${value}`,
    flexGrow: (value) => value ? `flex-grow` : "flex-grow-0",
    flexShrink: (value) => value ? `flex-shrink` : "flex-shrink-0",
    justifySelf: (value) => `justify-self-${value}`,
    alignSelf: (value) => `self-${value}`,
    order: (value) => `order-${value}`
  }

  for (const [key, value] of Object.entries(props)) {
    if (config[key] !== undefined) {
      styleString += config[key](value)
    }
  }
  return styleString
}

const Spacing = (props) => {
  let styleString = ""

  const config = {
    //padding
    p: (value) => `p-${value}`,
    pt: (value) => `pt-${value}`,
    pr: (value) => `pr-${value}`,
    pb: (value) => `pb-${value}`,
    pl: (value) => `pl-${value}`,
    px: (value) => `px-${value}`,
    py: (value) => `py-${value}`,
    //margin
    m: (value) => `m-${value}`,
    mt: (value) => `mt-${value}`,
    mr: (value) => `mr-${value}`,
    mb: (value) => `mb-${value}`,
    ml: (value) => `ml-${value}`,
    mx: (value) => `mx-${value}`,
    my: (value) => `my-${value}`,
  }

  for (const [key, value] of Object.entries(props)) {
    if (config[key] !== undefined) {
      styleString += config[key](value)
    }
  }
  return styleString
}

const Layout = (props) => {
  let styleString = ""

  const config = {
    //padding
    w: (value) => `w-${value}`,
    h: (value) => `h-${value}`,
    minW: (value) => `min-w-${value}`,
    minH: (value) => `min-h-${value}`,
    maxW: (value) => `max-w-${value}`,
    maxH: (value) => `max-h-${value}`,
    overflow: (value) => `overflow-${value}`,
    overflowX: (value) => `overflow-x-${value}`,
    overflowY: (value) => `overflow-y-${value}`,
    display: (value) => `${value}`,
    verticalAlign: (value) => `align-${value}`,
  }

  for (const [key, value] of Object.entries(props)) {
    if (config[key] !== undefined) {
      styleString += config[key](value)
    }
  }
  return styleString
}

const Effects = (props) => {
  let styleString = ""

  const generateClassStringPositiveNegative = (number, string) => {

    // if (number.match(/^-\d+$/)) {
    if (+number < 0) {
      return `-${string + Math.abs(number)}`
    } else {
      return `${string + Math.abs(number)}`
    }
  }

  const config = {
    //padding
    shadow: (value) => `shadow-${value}`,
    opacity: (value) => `opacity-${value}`,
    rotate: (value) => generateClassStringPositiveNegative(value, "rotate-"),
    scale: (value) => `scale-${value}`,
    scaleX: (value) => `scale-x-${value}`,
    scaleY: (value) => `scale-y-${value}`,
    skewX: (value) => generateClassStringPositiveNegative(value, "skew-x-"),
    skewY: (value) => generateClassStringPositiveNegative(value, "skew-y-"),
    translateX: (value) => generateClassStringPositiveNegative(value, "translate-x-"),
    translateY: (value) => generateClassStringPositiveNegative(value, "translate-y-"),
  }

  for (const [key, value] of Object.entries(props)) {
    generateClassStringPositiveNegative(value, "rotate-")
    if (config[key] !== undefined) {
      // console.log([key, value], generateClassStringPositiveNegative(value, "rotate-"))
      styleString += config[key](value)
    }
  }
  return styleString
}

const Typography = (props) => {
  let styleString = ""

  const config = {
    //padding
    FontSize: (value) => `text-${value}`,
    FontWeight: (value) => `font-${value}`,
    FontStyle: (value) => value == 'italic' ? "italic" : "",
    FontVariantNumeric: (value) => `${value}`,
    LetterSpacing: (value) => `tracking-${value}`,
    color: (value) => `text-${value}`,
    TextAlign: (value) => `text-${value}`,
    LineHeight: (value) => `leading-${value}`,
    TextOpacity: (value) => `text-opacity-${value}`,
    TextDecoration: (value) => `${value}`,
    TextTransform: (value) => `${value}`,
  }

  for (const [key, value] of Object.entries(props)) {
    if (config[key] !== undefined) {
      styleString += config[key](value)
    }
  }
  return styleString
}

export {
  FlexBox,
  Spacing,
  Layout,
  Effects,
  Typography,
  ThemeProvider,
  useTheme,
  AppProvider,
  createContainer,
  combineProviders,
  useContext,
  LocalizationProvider,
  useLocalization,
  usePersistState
}
export default tw