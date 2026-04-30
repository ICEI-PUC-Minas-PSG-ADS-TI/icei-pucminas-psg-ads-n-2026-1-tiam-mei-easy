import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig, isFirebaseConfigValid } from './firebaseConfig';

export { isFirebaseConfigValid };

const app = isFirebaseConfigValid()
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

function createAuth() {
  if (!app) return null;
  
  return getAuth(app);
}

export const auth = app ? createAuth() : null;
