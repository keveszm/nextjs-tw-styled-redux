import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import { useStore } from '../store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import 'tailwindcss/tailwind.css'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Courier New', Courier, monospace;
  }
`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store, {}, function () {
    persistor.persist()
  })

  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
