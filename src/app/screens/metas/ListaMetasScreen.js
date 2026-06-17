import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';


const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const AZUL_CLARO = '#4fc3f7';
const BRANCO = '#ffffff';


export default function ListaMetasScreen() {


  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [valorAtual, setValorAtual] = useState('');
  const [periodo, setPeriodo] = useState('');


  const [metas, setMetas] = useState([]);
  const [metaEditando, setMetaEditando] = useState(null);
  const [metaExpandida, setMetaExpandida] = useState(null);



  async function buscarMetas(){

    try{

      const snapshot = await getDocs(
        collection(db,'metas')
      );


      const lista = [];

      snapshot.forEach((item)=>{

        lista.push({
          id:item.id,
          ...item.data()
        });

      });


      setMetas(lista);


    }catch(error){

      console.log(error);

    }

  }



  async function salvarMeta(){


    try{


      const dados = {

        titulo,
        categoria,
        valorMeta:Number(valorMeta),
        valorAtual:Number(valorAtual),
        periodo,

      };



      if(metaEditando){


        await updateDoc(
          doc(db,'metas',metaEditando),
          dados
        );


        alert('Meta atualizada!');


        setMetaEditando(null);



      }else{


        await addDoc(
          collection(db,'metas'),
          {
            ...dados,
            criadoEm:new Date()
          }
        );


        alert('Meta criada!');


      }



      limparCampos();

      buscarMetas();



    }catch(error){

      console.log(error);
      alert('Erro ao salvar meta');

    }


  }



  async function excluirMeta(id){


    try{


      await deleteDoc(
        doc(db,'metas',id)
      );


      buscarMetas();


      alert('Meta excluída');


    }catch(error){

      console.log(error);

    }

  }



  function editarMeta(meta){


    setTitulo(meta.titulo || '');
    setCategoria(meta.categoria || '');
    setValorMeta(String(meta.valorMeta || ''));
    setValorAtual(String(meta.valorAtual || ''));
    setPeriodo(meta.periodo || '');

    setMetaEditando(meta.id);


  }



  function limparCampos(){

    setTitulo('');
    setCategoria('');
    setValorMeta('');
    setValorAtual('');
    setPeriodo('');

  }



  useEffect(()=>{

    buscarMetas();

  },[]);




  return (

    <View style={styles.container}>


      <View style={styles.header}>


        <Text style={styles.logo}>
          MEI <Text style={styles.logoDestaque}>EASY</Text>
        </Text>


        <Text style={styles.subtitulo}>
          Gerenciamento de Metas Financeiras
        </Text>


      </View>




      <ScrollView>


        <View style={styles.cardFormulario}>


          <Text style={styles.cardTitulo}>
            {metaEditando ? 'Editar Meta' : 'Nova Meta'}
          </Text>



          <TextInput
            placeholder="Nome da meta"
            placeholderTextColor="#aac"
            value={titulo}
            onChangeText={setTitulo}
            style={styles.input}
          />



          <TextInput
            placeholder="Categoria"
            placeholderTextColor="#aac"
            value={categoria}
            onChangeText={setCategoria}
            style={styles.input}
          />



          <TextInput
            placeholder="Valor da meta"
            placeholderTextColor="#aac"
            value={valorMeta}
            onChangeText={setValorMeta}
            keyboardType="numeric"
            style={styles.input}
          />



          <TextInput
            placeholder="Valor atual"
            placeholderTextColor="#aac"
            value={valorAtual}
            onChangeText={setValorAtual}
            keyboardType="numeric"
            style={styles.input}
          />



          <TextInput
            placeholder="Período"
            placeholderTextColor="#aac"
            value={periodo}
            onChangeText={setPeriodo}
            style={styles.input}
          />



          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={salvarMeta}
          >

            <Text style={styles.textoBotaoSalvar}>
              {metaEditando ? 'Atualizar Meta':'Salvar Meta'}
            </Text>


          </TouchableOpacity>



        </View>





        <Text style={styles.tituloLista}>
          Metas cadastradas
        </Text>





        <FlatList

          data={metas}

          scrollEnabled={false}


          keyExtractor={(item)=>item.id}


          renderItem={({item})=>{


            const expandida =
            metaExpandida === item.id;



            const progresso =
            item.valorMeta > 0
            ?
            Math.round(
              (item.valorAtual/item.valorMeta)*100
            )
            :
            0;



            return(


              <TouchableOpacity

                style={styles.cardMeta}

                onPress={()=>{

                  setMetaExpandida(
                    expandida ? null : item.id
                  )

                }}

              >


                <View style={styles.cardHeader}>


                  <Text style={styles.nomeMeta}>
                    {item.titulo}
                  </Text>


                  <Text style={styles.seta}>
                    {expandida?'▲':'▼'}
                  </Text>


                </View>





                {expandida && (


                  <View style={styles.detalhes}>


                    <Text style={styles.valor}>
                      Categoria: {item.categoria}
                    </Text>


                    <Text style={styles.valor}>
                      Progresso: {progresso}%
                    </Text>


                    <Text style={styles.valor}>
                      R$ {item.valorAtual} / R$ {item.valorMeta}
                    </Text>



                    <View style={styles.botoesRow}>


                      <TouchableOpacity
                        style={styles.botaoEditar}
                        onPress={()=>editarMeta(item)}
                      >

                        <Text>
                          Editar
                        </Text>

                      </TouchableOpacity>



                      <TouchableOpacity
                        style={styles.botaoExcluir}
                        onPress={()=>excluirMeta(item.id)}
                      >

                        <Text style={{color:'#fff'}}>
                          Excluir
                        </Text>


                      </TouchableOpacity>


                    </View>


                  </View>


                )}



              </TouchableOpacity>


            )


          }}

        />


      </ScrollView>


    </View>


  );


}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: AZUL_ESCURO,
    paddingHorizontal: 20,
    paddingTop: 50,
  },


  header: {
    marginBottom: 25,
  },


  logo: {
    color: BRANCO,
    fontSize: 28,
    fontWeight: 'bold',
  },


  logoDestaque: {
    color: AZUL_CLARO,
  },


  subtitulo: {
    color: '#cdd6ff',
    marginTop: 6,
    fontSize: 15,
  },


  cardFormulario: {
    backgroundColor: '#243570',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },


  cardTitulo: {
    color: BRANCO,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },


  input: {
    backgroundColor: AZUL_MEDIO,
    color: BRANCO,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },


  botaoSalvar: {
    backgroundColor: AZUL_CLARO,
    padding: 16,
    borderRadius: 12,
  },


  textoBotaoSalvar: {
    textAlign: 'center',
    color: AZUL_ESCURO,
    fontWeight: 'bold',
  },


  tituloLista: {
    color: BRANCO,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },


  cardMeta: {
    backgroundColor: '#243570',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },


  cardHeader: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },


  nomeMeta: {
    color: BRANCO,
    fontSize:18,
    fontWeight:'bold',
  },


  seta:{
    color:AZUL_CLARO,
    fontSize:18,
  },


  detalhes:{
    marginTop:20,
    borderTopWidth:1,
    borderTopColor:'#3950a8',
    paddingTop:15,
  },


  valor:{
    color:BRANCO,
    marginBottom:8,
  },


  botoesRow:{
    flexDirection:'row',
    gap:10,
    marginTop:15,
  },


  botaoEditar:{
    flex:1,
    backgroundColor:AZUL_CLARO,
    padding:14,
    borderRadius:10,
    alignItems:'center',
  },


  botaoExcluir:{
    flex:1,
    backgroundColor:'#ff6b6b',
    padding:14,
    borderRadius:10,
    alignItems:'center',
  },


});