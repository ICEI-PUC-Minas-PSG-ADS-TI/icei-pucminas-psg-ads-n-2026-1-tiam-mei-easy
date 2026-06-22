import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function cadastrar(email, senha, nome) {
    const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
    const nomeTrim = nome.trim();

    await updateProfile(credencial.user, { displayName: nomeTrim });
    await setDoc(doc(db, 'users', credencial.user.uid), {
      nome: nomeTrim,
      email: email.trim(),
      telefone: '',
      criadoEm: new Date().toISOString(),
    });

    return credencial.user;
  }

  async function login(email, senha) {
    return signInWithEmailAndPassword(auth, email.trim(), senha);
  }

  async function logout() {
    return signOut(auth);
  }

  async function recuperarSenha(email) {
    return sendPasswordResetEmail(auth, email.trim());
  }

  const userName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Usuário';

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.uid ?? null,
        userName,
        loading,
        cadastrar,
        login,
        logout,
        recuperarSenha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
