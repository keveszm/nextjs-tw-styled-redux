import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


let store

// Action types
export const actionTypes = {
  TICK: 'TICK',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
}

const initialTimerState = {
  lastUpdate: 0,
  light: false,
  count: 0,
}

// REDUCERS
export const reducer = (state = initialTimerState, action) => {
  switch (action.type) {
    case actionTypes.TICK:
      return {
        ...state,
        lastUpdate: action.ts,
        light: !!action.light,
      }
    case actionTypes.INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      }
    case actionTypes.DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      }
    case actionTypes.RESET:
      return {
        ...state,
        count: initialTimerState.count,
      }
    default:
      return state
  }
}

// ACTIONS
export const serverRenderClock = () => {
  return { type: actionTypes.TICK, light: false, ts: Date.now() }
}

export const startClock = () => {
  return { type: actionTypes.TICK, light: true, ts: Date.now() }
}

export const incrementCount = () => ({ type: actionTypes.INCREMENT })

export const decrementCount = () => ({ type: actionTypes.DECREMENT })

export const resetCount = () => ({ type: actionTypes.RESET })

const persistConfig = {
  key: 'primary',
  storage,
  whitelist: ['count'], // place to select which state you want to persist
}

const persistedReducer = persistReducer(persistConfig, reducer)

function initStore(initialState) {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
