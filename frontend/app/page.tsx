"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);

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

  useEffect(() => {
    const savedUser = localStorage.getItem("apoiorede_user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadData();
    }
  }, []);

  async function register() {
    const response = await fetch("https://apoiorede-crm.onrender.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Usuário cadastrado com sucesso ✅");
      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setMessage(data.error || "Erro ao cadastrar");
    }
  }

  async function login() {
 const response = await fetch("https://apoiorede-crm.onrender.com/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      localStorage.setItem("apoiorede_user", JSON.stringify(data.user));
      setMessage("");
      loadData();
    } else {
      setMessage(data.error || "Erro no login");
    }
  }

  function logout() {
    localStorage.removeItem("apoiorede_user");
    setUser(null);
    setEmail("");
    setPassword("");
  }

  async function loadData() {
    const requestsResponse = await fetch("http://localhost:3333/requests");
    const requestsData = await requestsResponse.json();
    setRequests(requestsData);

    const clinicsResponse = await fetch("http://localhost:3333/clinics");
    const clinicsData = await clinicsResponse.json();
    setClinics(clinicsData);
  }

  async function createClinic() {
    await fetch("http://localhost:3333/clinics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: clinicName, city: clinicCity, state: clinicState, whatsapp: clinicWhatsapp }),
    });

    setClinicName("");
    setClinicCity("");
    setClinicState("");
    setClinicWhatsapp("");
    loadData();
  }

  async function createRequest() {
    await fetch("http://localhost:3333/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientName, procedure, city, observation, clinicId: clinicId || null }),
    });

    setPatientName("");
    setProcedure("");
    setCity("");
    setObservation("");
    setClinicId("");
    loadData();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`http://localhost:3333/requests/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadData();
  }

  async function deleteRequest(id: string) {
    if (!confirm("Deseja excluir esta solicitação?")) return;

    await fetch(`http://localhost:3333/requests/${id}`, {
      method: "DELETE",
    });

    loadData();
  }

  const filteredRequests = requests.filter((r) => {
    const matchStatus = filter === "TODOS" || r.status === filter;
    const matchSearch = r.patientName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (!user) {
    return (
      <main style={loginPageStyle}>
        <section style={loginCardStyle}>
          <h1>ApoioRede</h1>
          <p>CRM operacional odontológico</p>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setIsLogin(true)} style={isLogin ? activeTab : inactiveTab}>Login</button>
            <button onClick={() => setIsLogin(false)} style={!isLogin ? activeTab : inactiveTab}>Cadastro</button>
          </div>

          {!isLogin && <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />}

          <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

          <button onClick={isLogin ? login : register} style={buttonStyle}>
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>

          {message && <p style={{ color: "#2563eb", fontWeight: "bold" }}>{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef2f7", fontFamily: "Arial" }}>
      <style>{`
        @media (max-width: 900px) {
          .header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 16px;
          }

          .dashboard-grid,
          .main-grid {
            grid-template-columns: 1fr !important;
          }

          .content {
            padding: 20px !important;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch !important;
          }

          .toolbar input,
          .toolbar select {
            width: 100% !important;
          }

          .actions {
            justify-content: flex-start;
          }
        }
      `}</style>

      <header className="header" style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>ApoioRede</h1>
          <p style={{ margin: "6px 0 0", color: "#cbd5e1" }}>CRM operacional odontológico</p>
        </div>

        <div>
          <span style={{ marginRight: 16 }}>Olá, {user.name}</span>
          <button onClick={logout} style={{ padding: "10px 16px", borderRadius: 8, border: 0, cursor: "pointer" }}>
            Sair
          </button>
        </div>
      </header>

      <section className="content" style={{ padding: 40 }}>
        <div className="dashboard-grid" style={dashboardGridStyle}>
          <div style={cardStyle}>
            <strong>Total de solicitações</strong>
            <p style={numberStyle}>{requests.length}</p>
          </div>

          <div style={cardStyle}>
            <strong>Pendentes</strong>
            <p style={{ ...numberStyle, color: "#ca8a04" }}>{requests.filter((r) => r.status === "PENDENTE").length}</p>
          </div>

          <div style={cardStyle}>
            <strong>Clínicas cadastradas</strong>
            <p style={{ ...numberStyle, color: "#2563eb" }}>{clinics.length}</p>
          </div>
        </div>

        <div className="main-grid" style={mainGridStyle}>
          <section style={cardStyle}>
            <h2>Nova solicitação</h2>

            <input placeholder="Nome do paciente" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={inputStyle} />
            <input placeholder="Procedimento" value={procedure} onChange={(e) => setProcedure(e.target.value)} style={inputStyle} />
            <input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />

            <select value={clinicId} onChange={(e) => setClinicId(e.target.value)} style={inputStyle}>
              <option value="">Selecione uma clínica</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name} - {clinic.city}/{clinic.state}
                </option>
              ))}
            </select>

            <textarea placeholder="Observação" value={observation} onChange={(e) => setObservation(e.target.value)} style={{ ...inputStyle, minHeight: 90 }} />

            <button onClick={createRequest} style={buttonStyle}>Cadastrar solicitação</button>
          </section>

          <section style={cardStyle}>
            <h2>Nova clínica</h2>

            <input placeholder="Nome da clínica" value={clinicName} onChange={(e) => setClinicName(e.target.value)} style={inputStyle} />
            <input placeholder="Cidade" value={clinicCity} onChange={(e) => setClinicCity(e.target.value)} style={inputStyle} />
            <input placeholder="Estado" value={clinicState} onChange={(e) => setClinicState(e.target.value)} style={inputStyle} />
            <input placeholder="WhatsApp" value={clinicWhatsapp} onChange={(e) => setClinicWhatsapp(e.target.value)} style={inputStyle} />

            <button onClick={createClinic} style={buttonStyle}>Cadastrar clínica</button>

            <h3>Clínicas cadastradas</h3>
            {clinics.map((clinic) => (
              <p key={clinic.id}>
                <strong>{clinic.name}</strong><br />
                {clinic.city}/{clinic.state}<br />
                WhatsApp: {clinic.whatsapp}
              </p>
            ))}
          </section>

          <section style={cardStyle}>
            <div className="toolbar" style={toolbarStyle}>
              <h2>Solicitações</h2>

              <input placeholder="Buscar paciente..." value={search} onChange={(e) => setSearch(e.target.value)} style={smallInputStyle} />

              <select value={filter} onChange={(e) => setFilter(e.target.value)} style={smallInputStyle}>
                <option value="TODOS">Todos</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="APROVADO">Aprovados</option>
                <option value="NEGADO">Negados</option>
              </select>
            </div>

            {filteredRequests.length === 0 ? (
              <p>Nenhuma solicitação encontrada.</p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {filteredRequests.map((item) => (
                  <div key={item.id} style={requestCardStyle}>
                    <strong style={{ fontSize: 18 }}>{item.patientName}</strong>

                    <p><strong>Procedimento:</strong> {item.procedure}</p>
                    <p><strong>Cidade:</strong> {item.city || "Não informada"}</p>
                    <p><strong>Observação:</strong> {item.observation || "Sem observação"}</p>
                    <p><strong>Clínica:</strong> {item.clinic ? `${item.clinic.name} - ${item.clinic.city}/${item.clinic.state}` : "Não vinculada"}</p>

                    <div className="actions" style={actionStyle}>
                      <button onClick={() => updateStatus(item.id, "PENDENTE")} style={pendingButton}>Pendente</button>
                      <button onClick={() => updateStatus(item.id, "APROVADO")} style={approveButton}>Aprovar</button>
                      <button onClick={() => updateStatus(item.id, "NEGADO")} style={denyButton}>Negar</button>
                      <button onClick={() => deleteRequest(item.id)} style={deleteButton}>Excluir</button>
                    </div>

                    <br />
                    <span style={statusStyle(item.status)}>{item.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

const loginPageStyle = {
  minHeight: "100vh",
  background: "#eef2f7",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
  padding: 20,
};

const loginCardStyle = {
  width: "100%",
  maxWidth: 400,
  background: "white",
  padding: 32,
  borderRadius: 20,
};

const headerStyle = {
  background: "#0f172a",
  color: "white",
  padding: "24px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const dashboardGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 20,
  marginBottom: 30,
};

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "360px 360px 1fr",
  gap: 24,
};

const cardStyle = {
  background: "white",
  padding: 24,
  borderRadius: 16,
};

const requestCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
};

const toolbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 20,
  alignItems: "center",
};

const numberStyle = { fontSize: 32, margin: "12px 0 0" };

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  fontSize: 14,
};

const smallInputStyle = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  width: 200,
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  background: "#2563eb",
  color: "white",
  border: 0,
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
};

const activeTab = { flex: 1, padding: 12, borderRadius: 10, border: 0, background: "#2563eb", color: "white", fontWeight: "bold", cursor: "pointer" };
const inactiveTab = { flex: 1, padding: 12, borderRadius: 10, border: 0, background: "#e5e7eb", color: "#111827", fontWeight: "bold", cursor: "pointer" };

const actionStyle = { display: "flex", gap: 8, flexWrap: "wrap" as const };
const pendingButton = { background: "#fef3c7", color: "#92400e", border: 0, padding: "6px 10px", borderRadius: 999, cursor: "pointer" };
const approveButton = { background: "#dcfce7", color: "#166534", border: 0, padding: "6px 10px", borderRadius: 999, cursor: "pointer" };
const denyButton = { background: "#fee2e2", color: "#991b1b", border: 0, padding: "6px 10px", borderRadius: 999, cursor: "pointer" };
const deleteButton = { background: "#111827", color: "white", border: 0, padding: "6px 10px", borderRadius: 999, cursor: "pointer" };

function statusStyle(status: string) {
  return {
    background: status === "APROVADO" ? "#dcfce7" : status === "NEGADO" ? "#fee2e2" : "#fef3c7",
    color: status === "APROVADO" ? "#166534" : status === "NEGADO" ? "#991b1b" : "#92400e",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: "bold",
  };
}