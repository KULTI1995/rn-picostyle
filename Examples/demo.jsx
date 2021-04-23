import React from 'react'
import { View } from 'react-native'
import tw, { ThemeProvider, LocalizationProvider, useTheme, useLocalization, combineProviders, FlexBox, Layout, Spacing, Typography, Effects, useContext } from 'rn-picostyle'
import { Ionicons } from '@expo/vector-icons';

const Row = tw.View`flex flex-row
${props => props?.flexDirection == 'col' && 'flex-col'}
${props => props?.center && 'justify-center items-center'}
${props => props?.between && 'justify-between'}
${props => props?.around && 'justify-around'}
`
export {Row}

const PageScroller = tw.ScrollView``

//headers
const Header = tw.View`my-3 flex flex-row justify-between`
const HeaderLeftBox = tw.TouchableHighlight`bg-gray-200 mx-3 px-4 py-2 rounded-lg justify-center`
const HeaderRightBox = tw.TouchableHighlight`bg-gray-200 mx-3 px-4 py-2 rounded-lg justify-center`

const FooterRightBuyButtonFunction = (props) => {
  const { theme, switchTheme } = useContext(useTheme)

  return (<HeaderRightBox {...props} underlayColor="bg-gray-300" onPress={() => switchTheme(theme == 'light' ? 'dark' : 'light')}>
    {theme == 'light'
      ? <Ionicons name="md-sunny" size={25} color="#262626" />
      : <Ionicons name="md-moon" size={25} color="#262626" />
    }
  </HeaderRightBox>)
}

const HeaderTextBox = tw.Pressable`flex flex-col items-center`
const HeaderHeader = tw.Text`text-xl text-gray-900 font-bold tracking-wide`
const HeaderCaption = tw.Text`text-xs text-gray-500`

//
const SquarePosition = tw.View`items-center justify-center w-8 h-8 bg-red-200 rounded m-1 ${props => props.color} last:bg-pink-200 ${Layout} ${Spacing}`
const SquareInner = tw(SquarePosition)`bg-blue-200`
const SquarePositionGradient = tw.LinearGradient`items-center justify-center w-8 h-8 from-green-400 via-green-200 to-transparent dark:from-gray-400 dark:via-gray-200 gradient-to-tr rounded m-1`

const SquarePositionText = tw.Text`text-white font-bold`
const DividerSquarePosition = tw.View`w-full h-4`

//
const ReservationCaptionBox = tw.View`flex-row justify-center items-center mx-3`
const ReservationCaptionCircle = tw.View`h-2 w-2 rounded-full m-1 ${props => props.color}`
const ReservationCaptionText = tw.Text`text-sm text-gray-900 text-xs`
const ArcImage = tw.Image`m-2 absolute flex w-full`
const ArcBox = tw.View`w-full h-8 relative items-center`
const ArcText = tw.Text`mt-4 text-xs text-gray-500`

//date
const DateScroller = tw.ScrollView`w-full`
const DateBox = tw.View`flex items-center bg-gray-200 px-4 py-3 m-2 rounded-lg ${props => props.active && 'bg-red-600'}`

const DateCaption = tw.Text`text-xs text-gray-400 ${props => props.active && 'text-white'}`
const DateHeader = tw.Text`text-lg text-gray-900 font-bold ${props => props.active && 'text-white'}`

//Footer
const FooterOrderBox = tw.View`m-3 flex flex-row justify-between`

const FooterLeftBox = tw.TouchableOpacity`px-8 py-3 flex flex-col items-center bg-purple-100 rounded-2xl`
const FooterLeftCaption = tw.Text`text-xs text-gray-600 text-xs`
const FooterLeftHeader = tw.Text`text-sm font-bold text-gray-900`
const FooterRightBuyButton = tw.AnimatableView`px-8 py-3 bg-red-600 rounded-2xl justify-center animation:pulse iterationDelay:2000 easing:ease-out iterationCount:infinite`
const FooterBuyButtonText = tw.Text`text-base text-white font-bold dark:text-gray-700 ${Typography} ${Effects}`

const theme = {
  "bg-white": "bg-gray-500",
  "text-white": "text-gray-100",
  "text-gray-900": "text-black",
  "bg-red-600": "bg-gray-600",
  "bg-red-200": "bg-gray-200",
  "bg-purple-200": "bg-gray-500",
  "bg-purple-100": "bg-gray-200",
  "bg-pink-200": "bg-gray-300"
}

const translations = {
  en:{
    foo: 'Foo',
    bar: 'Hello world {{someValue}}',
    buyButton: 'buy {{price}}',
    howTickets: '{{count}} tickets',
    HeaderCaptionText: 'Session Selection'
  },
  fr:{
    foo: 'Fou',
    bar: 'Bár {{someValue}}',
    buyButton: 'achat {{price}}',
    howTickets: '{{count}} billets',
    HeaderCaptionText: 'Sélection de session'
  }
}

const AppProvider = combineProviders([
  [ThemeProvider, { initialState: {theme, persist:true} }],
  [LocalizationProvider, { initialState: { translations, fallback: true, persist:true } }],
]);


const Main = () => {
  const { t, locale, setLocale } = useContext(useLocalization);

  return (
    <PageScroller vertical={true} className="mt-6" contentContainerStyle="h-full flex-col flex justify-between">
    <View>
      <Header>
        <HeaderLeftBox underlayColor="bg-gray-300" onPress={() => { }}><Ionicons name="ios-arrow-back" size={22} color="#464646" /></HeaderLeftBox>
        <HeaderTextBox onPress={() =>setLocale(locale == 'en' ? 'fr' : 'en')}>
          <HeaderHeader>The Gentlemen</HeaderHeader>
          <HeaderCaption>{t('HeaderCaptionText')}</HeaderCaption>
        </HeaderTextBox>
        {/* <HeaderRightBox underlayColor="bg-gray-300" onPress={() => { }}><Ionicons name="md-sunny" size={25} color="#262626" /></HeaderRightBox> */}
        {/* <FooterRightBuyButtonFunction /> */}
        <FooterRightBuyButtonFunction />
      </Header>
      <DateScroller horizontal showsHorizontalScrollIndicator={false}>
        {new Array(10).fill('').map((v, i, arr) => (
          <DateBox key={i} active={i == 0 ? true : false}>
            <DateCaption>Tue</DateCaption>
            <DateHeader className="text-xl" active={i == 0 ? true : false}>{17 + i}</DateHeader>
          </DateBox>
        ))}
      </DateScroller>
      <DateScroller horizontal showsHorizontalScrollIndicator={false}>
        {new Array(5).fill('').map((v, i, arr) => (
          <DateBox key={i} active={i == 2 ? true : false}>
            <DateHeader active={i == 2 ? true : false}>1{i}:30</DateHeader>
            <DateCaption>$ {i}.25 • 3D</DateCaption>
          </DateBox>
        ))}
      </DateScroller>
      <DividerSquarePosition />
      <ArcBox>
        <ArcImage source={require('./assets/Scene3.png')} resizeMode="contain" resizeMethod="resize" />
        <ArcText>Scene</ArcText>
      </ArcBox>
      <DividerSquarePosition />
      <Row center>
        <SquarePosition/>
        <SquarePosition />
        <SquarePosition className="rotate-15" color="bg-purple-200" />
        <SquarePosition color="bg-purple-200" />
        <SquarePosition />
      </Row>
      <Row center>
        <SquarePosition />
        <SquarePosition w={9} h={9}/>
        <SquarePosition className="-translate-x-1 translate-y-2 bg-yellow-200"/>
        <SquarePosition color="bg-purple-200" />
        <SquarePosition color="bg-purple-200" />
        <SquarePosition color="bg-purple-200" />
        <SquarePosition />
      </Row>
      <Row center>
        <SquarePosition color="bg-purple-200" />
        <SquarePosition color="bg-purple-200" />
        <SquarePosition />
        <SquarePosition />
        <SquareInner className="shadow-lg"/>
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
      </Row>
      <Row center>
        <SquarePosition color="bg-purple-200" />
        <SquarePosition color="bg-purple-200" />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
      </Row>
      <DividerSquarePosition />
      <Row center>
        <SquarePosition />
        <SquarePositionGradient />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition color="bg-red-600"><SquarePositionText>5</SquarePositionText></SquarePosition>
        <SquarePosition className="dark:bg-green-400" color="bg-red-600"><SquarePositionText className="-rotate-15 scale-125">6</SquarePositionText></SquarePosition>
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
      </Row>
      <Row center>
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition color="bg-purple-200" />
        <SquarePosition color="bg-purple-200" />
        <SquarePosition color="bg-purple-200" />
      </Row>
      <Row center>
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
        <SquarePosition />
      </Row>
      <DividerSquarePosition />
      <Row around>
        <ReservationCaptionBox>
          <ReservationCaptionCircle color="bg-red-200" />
          <ReservationCaptionText fontFamily="Lato_400Regular">Available</ReservationCaptionText>
        </ReservationCaptionBox>
        <ReservationCaptionBox>
          <ReservationCaptionCircle color="bg-purple-200" />
          <ReservationCaptionText fontFamily="Lato_400Regular">Reserved</ReservationCaptionText>
        </ReservationCaptionBox>
        <ReservationCaptionBox>
          <ReservationCaptionCircle color="bg-red-600" />
          <ReservationCaptionText fontFamily="Lato_400Regular">Selected</ReservationCaptionText>
        </ReservationCaptionBox>
      </Row>
    </View>
    <FooterOrderBox>
      <FooterLeftBox>
        <FooterLeftHeader>{t('howTickets', { count: '2' })}</FooterLeftHeader>
        <FooterLeftCaption>5 row - 5,6 seat</FooterLeftCaption>
      </FooterLeftBox>
      <FooterRightBuyButton useNativeDriver={true}><FooterBuyButtonText className="dark:text-gray-200" fontFamily="AlegreyaSans_700Bold">{t('buyButton', { price: '$10.50' })}</FooterBuyButtonText></FooterRightBuyButton>
    </FooterOrderBox>
  </PageScroller>
  )
}

const LoadMain = () => {
  const { restored:restoredTheme } = useContext(useTheme)

  return (
    <View>
      {restoredTheme ? (
        <Main />
      ) : null}
    </View>
  );
}

const App = () => {
  return (
    <AppProvider>
      <LoadMain/>
    </AppProvider>
  )
}

export default App