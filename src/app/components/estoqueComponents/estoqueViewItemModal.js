import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';

import ConfirmModal from '../ConfirmModal';
import { deleteEstoque } from '../../services/estoque/deleteEstoque';

import { Feather } from '@expo/vector-icons';
import { updateEstoque } from '../../services/estoque/updateEstoque';

export default function EstoqueViewItemModal({
    visible,
    onClose,
    item,
    loadEstoque
}) {

    const [isEditing, setIsEditing] = useState(false);
    const [nome, setNome] = useState('');
    const [fabricante, setFabricante] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valor, setValor] = useState('');
    const [confirmVisible, setConfirmVisible] = useState(false);

    useEffect(() => {

        if (item) {

            setNome(item.nome || '');
            setFabricante(item.fabricante || '');
            setQuantidade(String(item.quantidade || ''));
            setValor(item.valor || '');

        }

    }, [item]);

    if (!item) return null;

    async function handleDelete() {

        const response = await deleteEstoque(item.id);

        if (response.success) {

            console.log('Item excluído');

            await loadEstoque();

            setConfirmVisible(false);

            onClose();

        } else {

            console.log('Erro ao excluir');

        }

    }

    async function handleSave() {

        const response = await updateEstoque(item.id, {
            nome,
            fabricante,
            valor,
        });

        if (response.success) {

            console.log('Atualizado com sucesso');

            await loadEstoque();

            setIsEditing(false);

            onClose();

        } else {

            console.log('Erro ao atualizar');

        }

    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >

            <ConfirmModal
                visible={confirmVisible}
                title="Tem certeza?"
                message="Deseja realmente excluir este item?"
                onConfirm={handleDelete}
                onCancel={() => setConfirmVisible(false)}
            />

            <View style={styles.overlay}>

                <View style={styles.modalContainer}>

                    <View style={styles.header}>

                        <Text style={styles.title}>
                            Visualizar Item
                        </Text>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setIsEditing(!isEditing)}
                        >
                            <Feather
                                name="edit-2"
                                size={18}
                                color="#2F80ED"
                            />

                            <Text style={styles.editButtonText}>
                                Editar
                            </Text>

                        </TouchableOpacity>

                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                        <View style={styles.inputContainer}>

                            <Text style={styles.label}>
                                Nome do item
                            </Text>

                            <TextInput
                                style={styles.input}
                                editable={isEditing}
                                value={nome}
                                onChangeText={setNome}
                            />

                        </View>

                        <View style={styles.inputContainer}>

                            <Text style={styles.label}>
                                Fabricante
                            </Text>

                            <TextInput
                                style={styles.input}
                                editable={isEditing}
                                value={fabricante}
                                onChangeText={setFabricante}
                            />

                        </View>

                        <View style={styles.inputContainer}>

                            <Text style={styles.label}>
                                Quantidade
                            </Text>

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.disabledInput,
                                ]}
                                editable={false}
                                value={quantidade}
                            />

                        </View>

                        <View style={styles.inputContainer}>

                            <Text style={styles.label}>
                                Valor
                            </Text>

                            <TextInput
                                style={styles.input}
                                editable={isEditing}
                                value={valor}
                                onChangeText={setValor}
                            />

                        </View>

                    </ScrollView>

                    <View style={styles.buttonContainer}>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => setConfirmVisible(true)}
                        >
                            <Text style={styles.deleteButtonText}>
                                Excluir
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>
                                Fechar
                            </Text>
                        </TouchableOpacity>

                        {isEditing && (
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>
                                    Salvar
                                </Text>
                            </TouchableOpacity>
                        )}

                    </View>

                </View>

            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({

    deleteButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#EB5757',
        justifyContent: 'center',
        alignItems: 'center',
    },

    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    editButtonText: {
        color: '#2F80ED',
        fontWeight: 'bold',
    },

    inputContainer: {
        marginBottom: 18,
    },

    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },

    input: {
        height: 50,
        backgroundColor: '#F2F2F2',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 15,
    },

    disabledInput: {
        backgroundColor: '#E5E5E5',
        color: '#777',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        gap: 10,
    },

    closeButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    saveButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#2F80ED',
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButtonText: {
        fontWeight: 'bold',
        color: '#333',
    },

    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});