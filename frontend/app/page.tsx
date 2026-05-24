"use client";

import { useEffect, useState } from "react";

const API_URL = "https://apoiorede-crm.onrender.com";

function getAuthHeaders() {
  const token = localStorage.getItem("apoiorede_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);

  const [toast, setToast] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requests, setRequests] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);

  const [patientName, setPatientName] = useState("");
  const [procedure, setProcedure] = useState("");
  const [city, setCity] = useState("");
  const [observation, setObservation] = useState("");
  const [clinicId, setClinicId] = useState("");

  const [clinicName, setClinicName] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicState, setClinicState] = useState("");
  const [clinicWhatsapp, setClinicWhatsapp] = useState("");

  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  function showToast(text: string) {
    setToast(text);

    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("apoiorede_user");
    const savedToken = localStorage.getItem("apoiorede_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      loadData();
    }
  }, []);

  async function register() {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        "apoiorede_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "apoiorede_token",
        data.token
      );

      setUser(data.user);
      setMessage("");
      loadData();

      showToast("Cadastro realizado com sucesso.");
    } else {
      setMessage(data.error || "Erro ao cadastrar");
    }
  }

  async function login() {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        "apoiorede_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "apoiorede_token",
        data.token
      );

      setUser(data.user);
      setMessage("");
      loadData();

      showToast("Login realizado com sucesso.");
    } else {
      setMessage(data.error || "Erro no login");
    }
  }

  function logout() {
    localStorage.removeItem("apoiorede_user");
    localStorage.removeItem("apoiorede_token");

    setUser(null);
    setEmail("");
    setPassword("");
  }

  async function loadData() {
    const requestsResponse = await fetch(
      `${API_URL}/requests`,
      {
        headers: getAuthHeaders(),
      }
    );

    const requestsData = await requestsResponse.json();
    setRequests(requestsData);

    const clinicsResponse = await fetch(
      `${API_URL}/clinics`,
      {
        headers: getAuthHeaders(),
      }
    );

    const clinicsData = await clinicsResponse.json();
    setClinics(clinicsData);
  }

  async function createClinic() {
    const response = await fetch(
      `${API_URL}/clinics`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: clinicName,
          city: clinicCity,
          state: clinicState,
          whatsapp: clinicWhatsapp,
        }),
      }
    );

    if (!response.ok) {
      showToast(
        "Apenas ADMIN pode cadastrar clínicas."
      );

      return;
    }

    setClinicName("");
    setClinicCity("");
    setClinicState("");
    setClinicWhatsapp("");

    setShowClinicModal(false);

    loadData();

    showToast("Clínica cadastrada com sucesso.");
  }

  async function createRequest() {
    await fetch(`${API_URL}/requests`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientName,
        procedure,
        city,
        observation,
        clinicId: clinicId || null,
      }),
    });

    setPatientName("");
    setProcedure("");
    setCity("");
    setObservation("");
    setClinicId("");

    setShowRequestModal(false);

    loadData();

    showToast(
      "Solicitação cadastrada com sucesso."
    );
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    await fetch(
      `${API_URL}/requests/${id}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status,
        }),
      }
    );

    loadData();

    showToast("Status atualizado.");
  }

  async function deleteRequest(id: string) {
    if (
      !confirm(
        "Deseja excluir esta solicitação?"
      )
    )
      return;

    const response = await fetch(
      `${API_URL}/requests/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      showToast(
        "Apenas ADMIN pode excluir solicitações."
      );

      return;
    }

    loadData();

    showToast("Solicitação excluída.");
  }

  const filteredRequests = requests.filter(
    (r) => {
      const matchStatus =
        filter === "TODOS" ||
        r.status === filter;

      const matchSearch =
        r.patientName
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchStatus && matchSearch;
    }
  );

  if (!user) {
    return (
      <main style={loginPageStyle}>
        <section style={loginCardStyle}>
          <h1 style={{ margin: 0, fontSize: 34 }}>
            ApoioRede
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: 24,
            }}
          >
            CRM operacional odontológico
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => setIsLogin(true)}
              style={
                isLogin
                  ? activeTab
                  : inactiveTab
              }
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              style={
                !isLogin
                  ? activeTab
                  : inactiveTab
              }
            >
              Cadastro
            </button>
          </div>

          {!isLogin && (
            <input
              placeholder="Nome"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={inputStyle}
            />
          )}

          <input
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={
              isLogin ? login : register
            }
            style={primaryButton}
          >
            {isLogin
              ? "Entrar"
              : "Cadastrar"}
          </button>

          {message && (
            <p
              style={{
                color: "#dc2626",
                fontWeight: "bold",
              }}
            >
              {message}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main style={appStyle}>
      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}

      <aside style={sidebarStyle}>
        <div>
          <h1 style={sidebarLogo}>
            ApoioRede
          </h1>

          <p style={sidebarSub}>
            CRM odontológico
          </p>

          <nav style={navStyle}>
            <span style={navActive}>
              📊 Dashboard
            </span>

            <span style={navItem}>
              📝 Solicitações
            </span>

            <span style={navItem}>
              🏥 Clínicas
            </span>

            <span style={navItem}>
              ⚙️ Configurações
            </span>
          </nav>
        </div>

        <button
          onClick={logout}
          style={logoutButton}
        >
          Sair
        </button>
      </aside>

      <section style={mainStyle}>
        <header style={topbarStyle}>
          <div>
            <h2 style={{ margin: 0 }}>
              Dashboard
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
              }}
            >
              Bem-vinda, {user.name}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() =>
                setShowRequestModal(true)
              }
              style={primarySmallButton}
            >
              + Solicitação
            </button>

            {user.role === "ADMIN" && (
              <button
                onClick={() =>
                  setShowClinicModal(true)
                }
                style={secondarySmallButton}
              >
                + Clínica
              </button>
            )}

            <div style={avatarStyle}>
              {user.name?.charAt(0)}
            </div>
          </div>
        </header>