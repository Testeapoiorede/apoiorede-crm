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
    setTimeout(() => setToast(""), 3000);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("apoiorede_user", JSON.stringify(data.user));
      localStorage.setItem("apoiorede_token", data.token);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("apoiorede_user", JSON.stringify(data.user));
      localStorage.setItem("apoiorede_token", data.token);
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
  }  async function loadData() {
    const requestsResponse = await fetch(`${API_URL}/requests`, {
      headers: getAuthHeaders(),
    });

    const requestsData = await requestsResponse.json();
    setRequests(Array.isArray(requestsData) ? requestsData : []);

    const clinicsResponse = await fetch(`${API_URL}/clinics`, {
      headers: getAuthHeaders(),
    });

    const clinicsData = await clinicsResponse.json();
    setClinics(Array.isArray(clinicsData) ? clinicsData : []);
  }

  async function createClinic() {
    const response = await fetch(`${API_URL}/clinics`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: clinicName,
        city: clinicCity,
        state: clinicState,
        whatsapp: clinicWhatsapp,
      }),
    });

    if (!response.ok) {
      showToast("Apenas ADMIN pode cadastrar clínicas.");
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
    showToast("Solicitação cadastrada com sucesso.");
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`${API_URL}/requests/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    loadData();
    showToast("Status atualizado.");
  }

  async function deleteRequest(id: string) {
    if (!confirm("Deseja excluir esta solicitação?")) return;

    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      showToast("Apenas ADMIN pode excluir solicitações.");
      return;
    }

    loadData();
    showToast("Solicitação excluída.");
  }

  const filteredRequests = requests.filter((r) => {
    const matchStatus = filter === "TODOS" || r.status === filter;
    const matchSearch = r.patientName
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });  if (!user) {
    return (
      <main style={loginPageStyle}>
        <section style={loginCardStyle}>
          <h1 style={{ margin: 0, fontSize: 34 }}>ApoioRede</h1>

          <p style={{ color: "#64748b", marginBottom: 24 }}>
            CRM operacional odontológico
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setIsLogin(true)} style={isLogin ? activeTab : inactiveTab}>
              Login
            </button>

            <button onClick={() => setIsLogin(false)} style={!isLogin ? activeTab : inactiveTab}>
              Cadastro
            </button>
          </div>

          {!isLogin && (
            <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          )}

          <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

          <button onClick={isLogin ? login : register} style={primaryButton}>
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>

          {message && <p style={{ color: "#dc2626", fontWeight: "bold" }}>{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main style={appStyle}>
      {toast && <div style={toastStyle}>{toast}</div>}

      <aside style={sidebarStyle}>
        <div>
          <h1 style={sidebarLogo}>ApoioRede</h1>
          <p style={sidebarSub}>CRM odontológico</p>

          <nav style={navStyle}>
            <span style={navActive}>📊 Dashboard</span>
            <span style={navItem}>📝 Solicitações</span>
            <span style={navItem}>🏥 Clínicas</span>
            <span style={navItem}>⚙️ Configurações</span>
          </nav>
        </div>

        <button onClick={logout} style={logoutButton}>Sair</button>
      </aside>

      <section style={mainStyle}>
        <header style={topbarStyle}>
          <div>
            <h2 style={{ margin: 0 }}>Dashboard</h2>
            <p style={{ margin: "6px 0 0", color: "#64748b" }}>
              Bem-vinda, {user.name} — {user.role}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowRequestModal(true)} style={primarySmallButton}>+ Solicitação</button>

            {user.role === "ADMIN" && (
              <button onClick={() => setShowClinicModal(true)} style={secondarySmallButton}>+ Clínica</button>
            )}

            <div style={avatarStyle}>{user.name?.charAt(0)}</div>
          </div>
        </header>        <div style={metricsStyle}>
          <div style={metricCard}>
            <span>Total</span>
            <strong>{requests.length}</strong>
          </div>

          <div style={metricCard}>
            <span>Pendentes</span>
            <strong style={{ color: "#d97706" }}>
              {requests.filter((r) => r.status === "PENDENTE").length}
            </strong>
          </div>

          <div style={metricCard}>
            <span>Aprovadas</span>
            <strong style={{ color: "#16a34a" }}>
              {requests.filter((r) => r.status === "APROVADO").length}
            </strong>
          </div>

          <div style={metricCard}>
            <span>Clínicas</span>
            <strong style={{ color: "#2563eb" }}>{clinics.length}</strong>
          </div>
        </div>

        <section style={panelStyle}>
          <div style={toolbarStyle}>
            <h3 style={{ margin: 0 }}>Solicitações</h3>

            <input
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={smallInput}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={smallInput}>
              <option value="TODOS">Todos</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="APROVADO">Aprovados</option>
              <option value="NEGADO">Negados</option>
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Paciente</th>
                  <th style={thStyle}>Procedimento</th>
                  <th style={thStyle}>Cidade</th>
                  <th style={thStyle}>Clínica</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 20, color: "#64748b" }}>
                      Nenhuma solicitação encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>
                        <strong>{item.patientName}</strong>
                        <p style={mutedText}>{item.observation || "Sem observação"}</p>
                      </td>

                      <td style={tdStyle}>{item.procedure}</td>
                      <td style={tdStyle}>{item.city || "Não informada"}</td>

                      <td style={tdStyle}>
                        {item.clinic
                          ? `${item.clinic.name} - ${item.clinic.city}/${item.clinic.state}`
                          : "Não vinculada"}
                      </td>

                      <td style={tdStyle}>
                        <span style={statusStyle(item.status)}>{item.status}</span>
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button onClick={() => updateStatus(item.id, "PENDENTE")} style={yellowBtn}>Pendente</button>
                          <button onClick={() => updateStatus(item.id, "APROVADO")} style={greenBtn}>Aprovar</button>
                          <button onClick={() => updateStatus(item.id, "NEGADO")} style={redBtn}>Negar</button>

                          {user.role === "ADMIN" && (
                            <button onClick={() => deleteRequest(item.id)} style={darkBtn}>Excluir</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>      {showRequestModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3>Nova solicitação</h3>

            <input
              placeholder="Nome do paciente"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Procedimento"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            />

            <select
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Selecione uma clínica</option>

              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name} - {clinic.city}/{clinic.state}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Observação"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              style={{
                ...inputStyle,
                minHeight: 100,
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={createRequest}
                style={primaryButton}
              >
                Salvar
              </button>

              <button
                onClick={() =>
                  setShowRequestModal(false)
                }
                style={cancelButton}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showClinicModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3>Nova clínica</h3>

            <input
              placeholder="Nome da clínica"
              value={clinicName}
              onChange={(e) =>
                setClinicName(e.target.value)
              }
              style={inputStyle}
            />

            <input
              placeholder="Cidade"
              value={clinicCity}
              onChange={(e) =>
                setClinicCity(e.target.value)
              }
              style={inputStyle}
            />

            <input
              placeholder="Estado"
              value={clinicState}
              onChange={(e) =>
                setClinicState(e.target.value)
              }
              style={inputStyle}
            />

            <input
              placeholder="WhatsApp"
              value={clinicWhatsapp}
              onChange={(e) =>
                setClinicWhatsapp(e.target.value)
              }
              style={inputStyle}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={createClinic}
                style={primaryButton}
              >
                Salvar
              </button>

              <button
                onClick={() =>
                  setShowClinicModal(false)
                }
                style={cancelButton}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}const appStyle = { minHeight: "100vh", display: "flex", background: "#f1f5f9", fontFamily: "Arial", color: "#0f172a", flexWrap: "wrap" as const };
const sidebarStyle = { width: 250, background: "#0f172a", color: "white", padding: 28, display: "flex", flexDirection: "column" as const, justifyContent: "space-between" };
const sidebarLogo = { margin: 0, fontSize: 28 };
const sidebarSub = { color: "#94a3b8", marginTop: 6 };
const navStyle = { display: "grid", gap: 12, marginTop: 40 };
const navActive = { background: "#2563eb", padding: 12, borderRadius: 12, fontWeight: "bold" };
const navItem = { padding: 12, color: "#cbd5e1" };
const logoutButton = { background: "white", color: "#0f172a", border: 0, padding: 12, borderRadius: 12, fontWeight: "bold", cursor: "pointer" };
const mainStyle = { flex: 1, padding: 32, overflowX: "hidden" as const };
const topbarStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap" as const, gap: 12 };
const avatarStyle = { width: 46, height: 46, borderRadius: 999, background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" };
const metricsStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 24 };
const metricCard = { background: "white", padding: 22, borderRadius: 18, boxShadow: "0 8px 24px rgba(15,23,42,.06)", display: "grid", gap: 14 };
const panelStyle = { background: "white", padding: 22, borderRadius: 18, boxShadow: "0 8px 24px rgba(15,23,42,.06)", minWidth: 0 };
const toolbarStyle = { display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" as const };
const inputStyle = { width: "100%", padding: 13, border: "1px solid #cbd5e1", borderRadius: 12, marginBottom: 12, boxSizing: "border-box" as const };
const smallInput = { padding: 11, border: "1px solid #cbd5e1", borderRadius: 10 };
const primaryButton = { width: "100%", padding: 14, border: 0, borderRadius: 12, background: "#2563eb", color: "white", fontWeight: "bold", cursor: "pointer" };
const primarySmallButton = { padding: "11px 16px", border: 0, borderRadius: 12, background: "#2563eb", color: "white", fontWeight: "bold", cursor: "pointer" };
const secondarySmallButton = { padding: "11px 16px", border: "1px solid #cbd5e1", borderRadius: 12, background: "white", color: "#0f172a", fontWeight: "bold", cursor: "pointer" };
const cancelButton = { width: "100%", padding: 14, border: "1px solid #cbd5e1", borderRadius: 12, background: "white", color: "#0f172a", fontWeight: "bold", cursor: "pointer" };

const loginPageStyle = { minHeight: "100vh", background: "#eef2f7", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Arial", padding: 20 };
const loginCardStyle = { width: "100%", maxWidth: 420, background: "white", padding: 34, borderRadius: 24, boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)" };
const activeTab = { flex: 1, padding: 13, borderRadius: 12, border: 0, background: "#2563eb", color: "white", fontWeight: "bold", cursor: "pointer" };
const inactiveTab = { flex: 1, padding: 13, borderRadius: 12, border: 0, background: "#e5e7eb", color: "#111827", fontWeight: "bold", cursor: "pointer" };

const yellowBtn = { background: "#fef3c7", color: "#92400e", border: 0, padding: "7px 12px", borderRadius: 999, cursor: "pointer" };
const greenBtn = { background: "#dcfce7", color: "#166534", border: 0, padding: "7px 12px", borderRadius: 999, cursor: "pointer" };
const redBtn = { background: "#fee2e2", color: "#991b1b", border: 0, padding: "7px 12px", borderRadius: 999, cursor: "pointer" };
const darkBtn = { background: "#111827", color: "white", border: 0, padding: "7px 12px", borderRadius: 999, cursor: "pointer" };

const tableStyle = { width: "100%", borderCollapse: "collapse" as const, minWidth: 850 };
const thStyle = { textAlign: "left" as const, padding: 14, color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: 13 };
const tdStyle = { padding: 14, borderBottom: "1px solid #e2e8f0", verticalAlign: "top" as const };
const mutedText = { margin: "6px 0 0", color: "#64748b", fontSize: 13 };

const toastStyle = { position: "fixed" as const, top: 20, right: 20, background: "#16a34a", color: "white", padding: "14px 18px", borderRadius: 12, zIndex: 20, boxShadow: "0 12px 30px rgba(0,0,0,.18)" };
const modalOverlay = { position: "fixed" as const, inset: 0, background: "rgba(15,23,42,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 10 };
const modalCard = { width: "100%", maxWidth: 520, background: "white", borderRadius: 20, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.25)" };

function statusStyle(status: string) {
  return {
    background: status === "APROVADO" ? "#dcfce7" : status === "NEGADO" ? "#fee2e2" : "#fef3c7",
    color: status === "APROVADO" ? "#166534" : status === "NEGADO" ? "#991b1b" : "#92400e",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: "bold",
    fontSize: 13,
    whiteSpace: "nowrap" as const,
  };
}