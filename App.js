import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

const API_URL = "https://gerenlib-backend.onrender.com/api/loans";

export default function App() {
  const [id, setId] = useState(null);
  const [tituloLivro, setTituloLivro] = useState("");
  const [nomeLeitor, setNomeLeitor] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");

  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadEntries();
    setDataDevolucao(new Date().toISOString().split("T")[0]);
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } catch {
      return dateString;
    }
  };

  const clearForm = () => {
    setId(null);
    setTituloLivro("");
    setNomeLeitor("");
    setDataDevolucao(new Date().toISOString().split("T")[0]);
  };

  const loadEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      setLivros(data);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar os registros: " + error.message,
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const saveEntry = async () => {
    if (!tituloLivro || !nomeLeitor || !dataDevolucao) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    const payload = {
      tituloLivro,
      nomeLeitor,
      dataDevolucao: new Date(dataDevolucao).toISOString(),
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";

    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      Alert.alert("Sucesso", id ? "Registro atualizado!" : "Registro criado!");
      clearForm();
      loadEntries();
    } catch (error) {
      Alert.alert("Erro", error.message);
      setLoading(false);
    }
  };

  const editEntry = (entry) => {
    setId(entry._id);
    setTituloLivro(entry.tituloLivro);
    setNomeLeitor(entry.nomeLeitor);
    setDataDevolucao(entry.dataDevolucao.split("T")[0]);
  };

  const deleteEntry = (idToDelete) => {
    Alert.alert("Excluir", "Deseja excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await fetch(`${API_URL}/${idToDelete}`, { method: "DELETE" });
            loadEntries();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir.");
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardList}>
      <Text style={styles.bookTitle}>{item.tituloLivro}</Text>
      <Text style={styles.textData}>
        <Text style={styles.bold}>Leitor:</Text> {item.nomeLeitor}
      </Text>
      <Text style={styles.textData}>
        <Text style={styles.bold}>Devolução:</Text>{" "}
        {formatDate(item.dataDevolucao)}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => editEntry(item)}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteEntry(item._id)}
        >
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Image
            source={require("./assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {id ? "Editar registro" : "Registrar devolução de livros"}
          </Text>

          <Text style={styles.label}>Título do livro</Text>
          <TextInput
            style={styles.input}
            value={tituloLivro}
            onChangeText={setTituloLivro}
            placeholder="Ex: O Senhor dos Anéis"
          />

          <Text style={styles.label}>Nome do leitor</Text>
          <TextInput
            style={styles.input}
            value={nomeLeitor}
            onChangeText={setNomeLeitor}
            placeholder="Ex: João da Silva"
          />

          <Text style={styles.label}>Data de devolução (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={dataDevolucao}
            onChangeText={setDataDevolucao}
            keyboardType="numeric"
            placeholder="2024-12-31"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={saveEntry}
              disabled={loading}
            >
              <Text style={styles.btnTextPrimary}>Salvar</Text>
            </TouchableOpacity>

            {id && (
              <TouchableOpacity style={styles.secondaryBtn} onPress={clearForm}>
                <Text style={styles.btnTextSecondary}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Histórico</Text>
            <TouchableOpacity onPress={loadEntries}>
              <Text style={styles.refreshText}>Atualizar</Text>
            </TouchableOpacity>
          </View>

          {loading && !isRefreshing ? (
            <ActivityIndicator
              size="large"
              color="#007A7C"
              style={{ marginTop: 20 }}
            />
          ) : (
            <FlatList
              data={livros}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                loadEntries();
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Nenhum registro encontrado.
                </Text>
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007A7C",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#007A7C",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTextPrimary: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnTextSecondary: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 16,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  refreshText: {
    color: "#007A7C",
    fontWeight: "bold",
  },
  cardList: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  textData: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  editBtn: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  logoImage: {
  width: 180,   // Ajuste para o tamanho que achar melhor
  height: 50,
  marginBottom: 8,
},
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
});
