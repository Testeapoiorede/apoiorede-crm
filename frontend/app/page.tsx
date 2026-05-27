"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3001";

type Status = "NOVA" | "PROCURANDO_REDE" | "CLINICA_ENCONTRADA" | "FINALIZADO";

export default function Home() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [activePage, setActivePage] = useState("DASHBOARD");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@apoio.com");
  const [password, setPassword] = useState("123456");

  const [requests, setRequests] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientWhatsapp, setClientWhatsapp] = useState("");
  const [plan, setPlan] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [procedure, setProcedure] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [observation, setObservation] = useState("");

  const [clinicName, setClinicName] = useState("");
  const [clinicWhatsapp, setClinicWhatsapp] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicState, setClinicState] = useState("");
  const [clinicSpecialty, setClinicSpecialty] = useState("");
  const [clinicNetwork, setClinicNetwork] = useState("");

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  function showMessage(text: string) {
    setToast(text);
    setTimeout(() => setToast(""), 3000);
  }

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: Bearer ${token},
    };
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("apoiorede_token");
    const savedUser = localStorage.getItem("apoiorede_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  async function loadData() {
    const requestsRes = await fetch(${API_URL}/requests, {
      headers: authHeaders(),
    });

    const clinicsRes = await fetch(${API_URL}/clinics, {
      headers: authHeaders(),
    });

    const requestsData = await requestsRes.json();
    const clinicsData = await clinicsRes.json();

    if (Array.isArray(requestsData)) setRequests(requestsData);
    if (Array.isArray(clinicsData)) setClinics(clinicsData);
  }

  async function handleAuth() {
    const endpoint = isLogin ? "login" : "register";

    const response = await fetch(${API_URL}/${endpoint}, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || "Daniela", email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || "Erro no acesso.");
      return;
    }

    if (isLogin) {
      localStorage.setItem("apoiorede_token", data.token);
      localStorage.setItem("apoiorede_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showMessage("Login realizado.");
    } else {
      showMessage("Conta criada. Faça login.");
      setIsLogin(true);
    }
  }

  function logout() {
    localStorage.removeItem("apoiorede_token");
    localStorage.removeItem("apoiorede_user");
    setToken("");
    setUser(null);
  }

  async function createRequest() {
    const response = await fetch(${API_URL}/requests, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        clientName,
        clientWhatsapp,
        plan,
        specialty,
        procedure,
        city,
        state,
        neighborhood,
        observation,
        status: "NOVA",
      }),
    });

    if (!response.ok) {
      showMessage("Erro ao criar solicitação.");
      return;
    }

    setClientName("");
    setClientWhatsapp("");
    setPlan("");
    setSpecialty("");
    setProcedure("");
    setCity("");
    setState("");
    setNeighborhood("");
    setObservation("");
    setShowRequestModal(false);

    await loadData();
    showMessage("Solicitação criada.");
  }

  async function createClinic() {
    const response = await fetch(${API_URL}/clinics, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        name: clinicName,
        whatsapp: clinicWhatsapp,
        phone: clinicWhatsapp,
        city: clinicCity,
        state: clinicState,
        specialty: clinicSpecialty,
        network: clinicNetwork,
        source: "Manual",
      }),
    });

    if (!response.ok) {
      showMessage("Erro ao criar clínica.");
      return;
    }

    setClinicName("");
    setClinicWhatsapp("");
    setClinicCity("");
    setClinicState("");
    setClinicSpecialty("");
    setClinicNetwork("");
    setShowClinicModal(false);

    await loadData();
    showMessage("Clínica criada.");
  }

  async function updateRequest(id: string, data: any) {
    await fetch(${API_URL}/requests/${id}, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    await loadData();
  }

  function openWhatsApp(phone: string) {
    const number = (phone || "").replace(/\D/g, "");
    if (!number) return alert("WhatsApp não informado.");
    const finalNumber = number.length <= 11 ? 55${number} : number;
    window.open(https://wa.me/${finalNumber}, "_blank");
  }

  function copyClientMessage(item: any) {
    const text = item.clinic
      ? Olá! Sobre sua solicitação para ${item.specialty}${item.procedure ? ` / ${item.procedure} : ""}, localizei uma clínica: ${item.clinic.name}. WhatsApp: ${item.clinic.whatsapp || item.clinic.phone || "não informado"}. Peço que entre em contato diretamente para confirmar horários e agendamento.`
      : Olá! Sobre sua solicitação para ${item.specialty}${item.procedure ? ` / ${item.procedure} : ""}, ainda estou verificando uma clínica disponível para atendimento.`;

    navigator.clipboard.writeText(text);
    showMessage("Mensagem para cliente copiada.");
  }

  function copyClinicMessage(item: any) {
    const text = Olá, tudo bem? Sou Daniela, da corretora. Poderia confirmar se vocês atendem pelo plano ${item.plan} para ${item.specialty}${item.procedure ? ` / ${item.procedure} : ""}? Cliente busca atendimento em ${item.city}/${item.state}${item.neighborhood ? , bairro ${item.neighborhood} : ""}.`;

    navigator.clipboard.writeText(text);
    showMessage("Mensagem para clínica copiada.");
  }

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const text = ${clinic.name} ${clinic.city} ${clinic.state} ${clinic.specialty} ${clinic.network}.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [clinics, search]);

  const total = requests.length;
  const novas = requests.filter((r) => r.status === "NOVA").length;
  const procurando = requests.filter((r) => r.status === "PROCURANDO_REDE").length;
  const encontradas = requests.filter((r) => r.status === "CLINICA_ENCONTRADA").length;
  const finalizadas = requests.filter((r) => r.status === "FINALIZADO").length;

  if (!user) {
    return (
      <main style={loginPage}>
        <section style={loginCard}>
          <h1>ApoioRede</h1>
          <p>Central de rede credenciada</p>

          {!isLogin && (
            <input style={input} placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          )}

          <input style={input} placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={input} type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button style={primaryButton} onClick={handleAuth}>
            {isLogin ? "Entrar" : "Criar conta"}
          </button>

          <button style={secondaryButton} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Criar nova conta" : "Já tenho conta"}
          </button>

          {toast && <p>{toast}</p>}
        </section>
      </main>
    );
  }

  return (
    <main style={layout}>
      {toast && <div style={toastStyle}>{toast}</div>}

      <aside style={sidebar}>
        <div>
          <h1>ApoioRede</h1>
          <p>Rede credenciada</p>

          <nav style={nav}>
            <button style={navButton(activePage === "DASHBOARD")} onClick={() => setActivePage("DASHBOARD")}>📊 Dashboard</button>
            <button style={navButton(activePage === "SOLICITACOES")} onClick={() => setActivePage("SOLICITACOES")}>📝 Solicitações</button>
            <button style={navButton(activePage === "CLINICAS")} onClick={() => setActivePage("CLINICAS")}>🏥 Clínicas</button>
          </nav>
        </div>

        <button style={dangerButton} onClick={logout}>Sair</button>
      </aside>

      <section style={content}>
        <header style={topbar}>
          <div>
            <h2>{activePage}</h2>
            <p>Bem-vinda, {user.name}</p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button style={primaryButton} onClick={() => setShowRequestModal(true)}>+ Solicitação</button>
            <button style={secondaryButton} onClick={() => setShowClinicModal(true)}>+ Clínica</button>
          </div>
        </header>

        {activePage === "DASHBOARD" && (
          <>
            <div style={cardsGrid}>
              <Card title="Total" value={total} />
              <Card title="Novas" value={novas} />
              <Card title="Procurando" value={procurando} />
              <Card title="Encontradas" value={encontradas} />
              <Card title="Finalizadas" value={finalizadas} />
              <Card title="Clínicas" value={clinics.length} />
            </div>

            <RequestsTable
              requests={requests}
              clinics={clinics}
              updateRequest={updateRequest}
              openWhatsApp={openWhatsApp}
              copyClientMessage={copyClientMessage}
              copyClinicMessage={copyClinicMessage}
            />
          </>
        )}

        {activePage === "SOLICITACOES" && (
          <RequestsTable
            requests={requests}
            clinics={clinics}
            updateRequest={updateRequest}
            openWhatsApp={openWhatsApp}
            copyClientMessage={copyClientMessage}
            copyClinicMessage={copyClinicMessage}
          />
        )}

        {activePage === "CLINICAS" && (
          <section style={panel}>
            <input style={input} placeholder="Buscar clínica..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <div style={clinicGrid}>
              {filteredClinics.map((clinic) => (
                <div key={clinic.id} style={clinicCard}>
                  <h3>{clinic.name}</h3>
                  <p>{clinic.city}/{clinic.state}</p>
                  <p>{clinic.specialty || "-"}</p>
                  <p>{clinic.whatsapp || clinic.phone || "-"}</p>
                  <button style={greenButton} onClick={() => openWhatsApp(clinic.whatsapp || clinic.phone || "")}>
                    Abrir WhatsApp
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      {showRequestModal && (
        <Modal title="Nova solicitação">
          <input style={input} placeholder="Nome do cliente" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <input style={input} placeholder="WhatsApp do cliente" value={clientWhatsapp} onChange={(e) => setClientWhatsapp(e.target.value)} />
          <input style={input} placeholder="Plano" value={plan} onChange={(e) => setPlan(e.target.value)} />
          <input style={input} placeholder="Especialidade" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          <input style={input} placeholder="Procedimento" value={procedure} onChange={(e) => setProcedure(e.target.value)} />
          <input style={input} placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
          <input style={input} placeholder="Estado" value={state} onChange={(e) => setState(e.target.value)} />
          <input style={input} placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
          <textarea style={{ ...input, minHeight: 80 }} placeholder="Observação" value={observation} onChange={(e) => setObservation(e.target.value)} />

          <div style={{ display: "flex", gap: 12 }}>
            <button style={primaryButton} onClick={createRequest}>Salvar</button>
            <button style={dangerButton} onClick={() => setShowRequestModal(false)}>Cancelar</button>
          </div>
        </Modal>
      )}

      {showClinicModal && (
        <Modal title="Nova clínica">
          <input style={input} placeholder="Nome da clínica" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
          <input style={input} placeholder="WhatsApp" value={clinicWhatsapp} onChange={(e) => setClinicWhatsapp(e.target.value)} />
          <input style={input} placeholder="Cidade" value={clinicCity} onChange={(e) => setClinicCity(e.target.value)} />
          <input style={input} placeholder="Estado" value={clinicState} onChange={(e) => setClinicState(e.target.value)} />
          <input style={input} placeholder="Especialidade" value={clinicSpecialty} onChange={(e) => setClinicSpecialty(e.target.value)} />
          <input style={input} placeholder="Rede / plano" value={clinicNetwork} onChange={(e) => setClinicNetwork(e.target.value)} />

          <div style={{ display: "flex", gap: 12 }}>
            <button style={primaryButton} onClick={createClinic}>Salvar</button>
            <button style={dangerButton} onClick={() => setShowClinicModal(false)}>Cancelar</button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Card({ title, value }: any) {
  return (
    <div style={card}>
      <p>{title}</p>
      <h1>{value}</h1>
    </div>
  );
}

function RequestsTable({ requests, clinics, updateRequest, openWhatsApp, copyClientMessage, copyClinicMessage }: any) {
  return (
    <section style={panel}>
      <table style={table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>WhatsApp</th>
            <th>Plano</th>
            <th>Especialidade</th>
            <th>Cidade</th>
            <th>Clínica</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((item: any) => (
            <tr key={item.id}>
              <td>{item.clientName}</td>
              <td>{item.clientWhatsapp || "-"}</td>
              <td>{item.plan}</td>
              <td>{item.specialty}<br />{item.procedure || ""}</td>
              <td>{item.city}/{item.state}</td>

              <td>
                <select
                  value={item.clinicId || ""}
                  onChange={(e) => updateRequest(item.id, { clinicId: e.target.value || null })}
                  style={select}
                >
                  <option value="">Selecione</option>
                  {clinics.map((clinic: any) => (
                    <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                  ))}
                </select>
              </td>

              <td>
                <select
                  value={item.status}
                  onChange={(e) => updateRequest(item.id, { status: e.target.value })}
                  style={select}
                >
                  <option value="NOVA">NOVA</option>
                  <option value="PROCURANDO_REDE">PROCURANDO_REDE</option>
                  <option value="CLINICA_ENCONTRADA">CLINICA_ENCONTRADA</option>
                  <option value="FINALIZADO">FINALIZADO</option>
                </select>
              </td>

              <td>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={secondaryButton} onClick={() => openWhatsApp(item.clientWhatsapp)}>Whats Cliente</button>
                  <button style={secondaryButton} onClick={() => openWhatsApp(item.clinic?.whatsapp || item.clinic?.phone || "")}>Whats Clínica</button>
                  <button style={secondaryButton} onClick={() => copyClinicMessage(item)}>Msg Clínica</button>
                  <button style={secondaryButton} onClick={() => copyClientMessage(item)}>Msg Cliente</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Modal({ title, children }: any) {
  return (
    <div style={modalOverlay}>
      <div style={modal}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

const layout = { display: "flex", minHeight: "100vh", background: "#eef4ff" };
const sidebar = { width: 280, background: "#111827", color: "white", padding: 30, display: "flex", flexDirection: "column" as const, justifyContent: "space-between" };
const nav = { display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 30 };
const content = { flex: 1, padding: 30, overflowX: "auto" as const };
const topbar = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 };
const cardsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20, marginBottom: 24 };
const card = { background: "white", borderRadius: 20, padding: 24 };
const panel = { background: "white", borderRadius: 20, padding: 24 };
const table = { width: "100%", minWidth: 1100 };
const clinicGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20 };
const clinicCard = { background: "#f8fafc", borderRadius: 18, padding: 20 };
const input = { width: "100%", padding: 14, borderRadius: 12, border: "1px solid #ddd", marginBottom: 12, boxSizing: "border-box" as const };
const select = { padding: 10, borderRadius: 10, border: "1px solid #ddd" };
const primaryButton = { padding: "14px 18px", borderRadius: 12, border: "none", background: "#4f46e5", color: "white", cursor: "pointer" };
const secondaryButton = { padding: "10px 12px", borderRadius: 12, border: "none", background: "#e5e7eb", cursor: "pointer" };
const dangerButton = { padding: "14px 18px", borderRadius: 12, border: "none", background: "#ef4444", color: "white", cursor: "pointer" };
const greenButton = { background: "#dcfce7", border: "none", padding: "8px 12px", borderRadius: 999, cursor: "pointer" };
const loginPage = { minHeight: "100vh", background: "linear-gradient(135deg,#111827,#4f46e5)", display: "flex", justifyContent: "center", alignItems: "center" };
const loginCard = { background: "white", width: 400, borderRadius: 20, padding: 40 };
const modalOverlay = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 10 };
const modal = { background: "white", padding: 30, borderRadius: 20, width: 540, maxHeight: "90vh", overflowY: "auto" as const };
const toastStyle = { position: "fixed" as const, top: 20, right: 20, background: "#16a34a", color: "white", padding: "14px 18px", borderRadius: 12, zIndex: 20 };

function navButton(active: boolean) {
  return {
    background: active ? "#4f46e5" : "transparent",
    color: "white",
    border: "none",
    padding: 16,
    borderRadius: 14,
    textAlign: "left" as const,
    cursor: "pointer",
  };
}