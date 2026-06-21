import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView
} from "react-native";

import { useAuth } from '../../context/AuthContext';
import { db } from "../../config/firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function PerfilContaScreen({ navigation }) {
    const { user } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        if (user) carregarPerfil();
    }, [user]);

    async function carregarPerfil() {
        try {
            const usuario = user;

            if (!usuario) {
                Alert.alert("Erro", "Nenhum usuário autenticado.");
                return;
            }

            setNome(usuario.displayName || "");
            setEmail(usuario.email || "");

            const refUsuario = doc(db, "users", usuario.uid);
            const documento = await getDoc(refUsuario);

            if (documento.exists()) {
                const dados = documento.data();

                setNome(dados.nome || usuario.displayName || "");
                setEmail(dados.email || usuario.email || "");
                setTelefone(dados.telefone || "");
            } else {
                await setDoc(refUsuario, {
                    nome: usuario.displayName || "",
                    email: usuario.email || "",
                    telefone: ""
                });
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar o perfil.");
        } finally {
            setCarregando(false);
        }
    }

    async function salvarPerfil() {
        try {
            const usuario = user;

            if (!usuario) {
                Alert.alert("Erro", "Nenhum usuário autenticado.");
                return;
            }

            await updateProfile(usuario, {
                displayName: nome
            });

            const refUsuario = doc(db, "users", usuario.uid);

            await updateDoc(refUsuario, {
                nome: nome,
                email: email,
                telefone: telefone
            });

            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        }
    }

    if (carregando) {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
                <Text style={styles.voltarTexto}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.titulo}>Meu Perfil</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                value={email}
                editable={false}
                placeholder="E-mail"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                placeholder="Digite seu telefone"
                keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.botao} onPress={salvarPerfil}>
                <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 25,
        textAlign: "center"
    },
    voltar: { marginBottom: 12 },
    voltarTexto: { color: '#4fc3f7', fontSize: 16 },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16
    },
    botao: {
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },
    textoBotao: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    }
});