"use client";

import { useMemo, useState } from "react";

type RequestStatus = "PENDENTE" | "APROVADA" | "NEGADA";

type RequestItem = {
  id: number;
  patient: string;
  procedure: string;
  city: string;
  clinic: string;
  status: RequestStatus;
};

type Clinic = {
  id: number;
  name: string;
  city: string;
  phone: string;
};

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [activePage, setActivePage] = useState("DASHBOARD");

  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 1,
      patient: "Daniela Moraes",
      procedure: "Ortodontia",
      city: "Sorocaba-SP",
      clinic: "Clínica Sorriso",
      status: "PENDENTE",
    },
  ]);

  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: 1,
      name: "Clínica Sorriso",
      city: "São Paulo/SP",
      phone: "(11) 99999-9999",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("TODOS");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);

  const [newPatient, setNewPatient] = useState("");
  const [newProcedure, setNewProcedure] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newClinic, setNewClinic] = useState("");

  const [clinicName, setClinicName] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");

  function handleAuth() {
    if (!email || !password) return;

    setUser({
      name: name || "Daniela Moraes",
      email,
      role: "OPERADOR",
    });
  }

  function createRequest() {
    if (!newPatient || !newProcedure) return;

    setRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        patient: newPatient,
        procedure: newProcedure,
        city: newCity,
        clinic: newClinic,
        status: "PENDENTE",
      },
    ]);

    setNewPatient("");
    setNewProcedure("");
    setNewCity("");
    setNewClinic("");

    setShowRequestModal(false);
  }

  function createClinic() {
    if (!clinicName) return;

    setClinics((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: clinicName,
        city: clinicCity,
        phone: clinicPhone,
      },
    ]);

    setClinicName("");
    setClinicCity("");
    setClinicPhone("");

    setShowClinicModal(false);
  }

  function updateStatus(id: number, status: RequestStatus) {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  }

  function deleteRequest(id: number) {
    setRequests((prev) => prev.filter((item) => item.id !== id));
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchSearch = item.patient
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter =
        filter === "TODOS" || item.status === filter;

      return matchSearch && matchFilter;
    });
  }, [requests, search, filter]);

  const total = requests.length;
  const pending = requests.filter(
    (r) => r.status === "PENDENTE"
  ).length;

  const approved = requests.filter(
    (r) => r.status === "APROVADA"
  ).length;

  const denied = requests.filter(
    (r) => r.status === "NEGADA"
  ).length;

  if (!user) {
    return (
      <main style={loginPage}>
        <div style={loginCard}>
          <h1 style={{ fontSize: 34 }}>ApoioRede</h1>

          <p style={{ color: "#666" }}>
            CRM odontológico
          </p>

          {!isLogin && (
            <input
              style={input}
              placeholder="Nome"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}

          <input
            style={input}
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            style={input}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            style={primaryButton}
            onClick={handleAuth}
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>

          <button
            style={linkButton}
            onClick={() =>
              setIsLogin(!isLogin)
            }
          >
            {isLogin
              ? "Criar conta"
              : "Já tenho conta"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={layout}>
      <aside style={sidebar}>
        <div>
          <h1 style={{ fontSize: 38 }}>
            ApoioRede
          </h1>

          <p style={{ opacity: 0.7 }}>
            CRM odontológico
          </p>

          <div style={nav}>
            <button
              style={navButton(
                activePage === "DASHBOARD"
              )}
              onClick={() =>
                setActivePage("DASHBOARD")
              }
            >
              📊 Dashboard
            </button>

            <button
              style={navButton(
                activePage === "SOLICITACOES"
              )}
              onClick={() =>
                setActivePage("SOLICITACOES")
              }
            >
              📄 Solicitações
            </button>

            <button
              style={navButton(
                activePage === "CLINICAS"
              )}
              onClick={() =>
                setActivePage("CLINICAS")
              }
            >
              🏥 Clínicas
            </button>

            <button
              style={navButton(
                activePage === "METRICAS"
              )}
              onClick={() =>
                setActivePage("METRICAS")
              }
            >
              📈 Métricas
            </button>
          </div>
        </div>

        <button
          style={logoutButton}
          onClick={() => setUser(null)}
        >
          Sair
        </button>
      </aside>

      <section style={content}>
        <div style={topbar}>
          <div>
            <h2>Dashboard</h2>

            <p>
              Bem-vinda, {user.name} —
              {user.role}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              style={primaryButton}
              onClick={() =>
                setShowRequestModal(true)
              }
            >
              + Solicitação
            </button>

            <button
              style={avatar}
            >
              {user.name[0]}
            </button>
          </div>
        </div>

        {(activePage === "DASHBOARD" ||
          activePage === "SOLICITACOES") && (
          <>
            <div style={cardsGrid}>
              <Card
                title="Total"
                value={total}
              />

              <Card
                title="Pendentes"
                value={pending}
                color="#cc6b49"
              />

              <Card
                title="Aprovadas"
                value={approved}
                color="#2e8b57"
              />

              <Card
                title="Negadas"
                value={denied}
                color="#b03052"
              />
            </div>

            <div style={panel}>
              <div style={toolbar}>
                <input
                  style={input}
                  placeholder="Buscar paciente..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                <select
                  style={input}
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                >
                  <option value="TODOS">
                    Todos
                  </option>

                  <option value="PENDENTE">
                    Pendente
                  </option>

                  <option value="APROVADA">
                    Aprovada
                  </option>

                  <option value="NEGADA">
                    Negada
                  </option>
                </select>
              </div>

              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Paciente</th>
                    <th style={th}>Procedimento</th>
                    <th style={th}>Cidade</th>
                    <th style={th}>Clínica</th>
                    <th style={th}>Status</th>
                    <th style={th}>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map(
                    (item) => (
                      <tr key={item.id}>
                        <td style={td}>
                          {item.patient}
                        </td>

                        <td style={td}>
                          {item.procedure}
                        </td>

                        <td style={td}>
                          {item.city}
                        </td>

                        <td style={td}>
                          {item.clinic}
                        </td>

                        <td style={td}>
                          <span
                            style={statusStyle(
                              item.status
                            )}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td style={td}>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              style={
                                approveButton
                              }
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  "APROVADA"
                                )
                              }
                            >
                              Aprovar
                            </button>

                            <button
                              style={
                                denyButton
                              }
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  "NEGADA"
                                )
                              }
                            >
                              Negar
                            </button>

                            <button
                              style={
                                deleteButton
                              }
                              onClick={() =>
                                deleteRequest(
                                  item.id
                                )
                              }
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activePage === "CLINICAS" && (
          <div style={panel}>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: 24,
              }}
            >
              <h2>Clínicas</h2>

              <button
                style={primaryButton}
                onClick={() =>
                  setShowClinicModal(true)
                }
              >
                + Clínica
              </button>
            </div>

            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Nome</th>
                  <th style={th}>Cidade</th>
                  <th style={th}>Telefone</th>
                </tr>
              </thead>

              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td style={td}>
                      {clinic.name}
                    </td>

                    <td style={td}>
                      {clinic.city}
                    </td>

                    <td style={td}>
                      {clinic.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePage === "METRICAS" && (
          <div style={cardsGrid}>
            <Card
              title="Total Solicitações"
              value={total}
            />

            <Card
              title="Taxa Aprovação"
              value={`${Math.round(
                (approved /
                  (total || 1)) *
                  100
              )}%`}
              color="#2e8b57"
            />

            <Card
              title="Taxa Negativa"
              value={`${Math.round(
                (denied /
                  (total || 1)) *
                  100
              )}%`}
              color="#b03052"
            />

            <Card
              title="Clínicas"
              value={clinics.length}
            />
          </div>
        )}
      </section>

      {showRequestModal && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h2>Nova Solicitação</h2>

            <input
              style={input}
              placeholder="Paciente"
              value={newPatient}
              onChange={(e) =>
                setNewPatient(
                  e.target.value
                )
              }
            />

            <input
              style={input}
              placeholder="Procedimento"
              value={newProcedure}
              onChange={(e) =>
                setNewProcedure(
                  e.target.value
                )
              }
            />

            <input
              style={input}
              placeholder="Cidade"
              value={newCity}
              onChange={(e) =>
                setNewCity(e.target.value)
              }
            />

            <input
              style={input}
              placeholder="Clínica"
              value={newClinic}
              onChange={(e) =>
                setNewClinic(
                  e.target.value
                )
              }
            />

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <button
                style={primaryButton}
                onClick={createRequest}
              >
                Salvar
              </button>

              <button
                style={secondaryButton}
                onClick={() =>
                  setShowRequestModal(
                    false
                  )
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showClinicModal && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h2>Nova Clínica</h2>

            <input
              style={input}
              placeholder="Nome"
              value={clinicName}
              onChange={(e) =>
                setClinicName(
                  e.target.value
                )
              }
            />

            <input
              style={input}
              placeholder="Cidade"
              value={clinicCity}
              onChange={(e) =>
                setClinicCity(
                  e.target.value
                )
              }
            />

            <input
              style={input}
              placeholder="Telefone"
              value={clinicPhone}
              onChange={(e) =>
                setClinicPhone(
                  e.target.value
                )
              }
            />

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <button
                style={primaryButton}
                onClick={createClinic}
              >
                Salvar
              </button>

              <button
                style={secondaryButton}
                onClick={() =>
                  setShowClinicModal(
                    false
                  )
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Card({
  title,
  value,
  color = "#111",
}: any) {
  return (
    <div style={card}>
      <p>{title}</p>

      <h1 style={{ color }}>
        {value}
      </h1>
    </div>
  );
}

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#eef3ff",
};

const sidebar = {
  width: 300,
  background:
    "linear-gradient(180deg,#16192f,#1d2452)",
  color: "white",
  padding: 32,
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
};

const nav = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
  marginTop: 40,
};

const content = {
  flex: 1,
  padding: 40,
};

const topbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 30,
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
  marginBottom: 30,
};

const card = {
  background: "white",
  borderRadius: 20,
  padding: 28,
};

const panel = {
  background: "white",
  borderRadius: 20,
  padding: 24,
};

const toolbar = {
  display: "flex",
  gap: 14,
  marginBottom: 24,
};

const table = {
  width: "100%",
};

const th = {
  textAlign: "left" as const,
  padding: 14,
};

const td = {
  padding: 14,
};

const input = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
};

const primaryButton = {
  background: "#4f46e5",
  color: "white",
  border: "none",
  padding: "14px 18px",
  borderRadius: 12,
  cursor: "pointer",
};

const secondaryButton = {
  background: "#e5e7eb",
  color: "#111",
  border: "none",
  padding: "14px 18px",
  borderRadius: 12,
  cursor: "pointer",
};

const approveButton = {
  background: "#d1fae5",
  color: "#065f46",
  border: "none",
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
};

const denyButton = {
  background: "#ffe4e6",
  color: "#be123c",
  border: "none",
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
};

const deleteButton = {
  background: "#111827",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
};

const logoutButton = {
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: 18,
  cursor: "pointer",
};

const avatar = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
};

const modalOverlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "white",
  padding: 30,
  borderRadius: 20,
  width: 420,
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
};

const loginPage = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(135deg,#4f46e5,#111827)",
};

const loginCard = {
  background: "white",
  width: 420,
  borderRadius: 20,
  padding: 40,
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
};

const linkButton = {
  background: "transparent",
  border: "none",
  color: "#4f46e5",
  cursor: "pointer",
};

function navButton(active: boolean) {
  return {
    background: active
      ? "#4f46e5"
      : "transparent",

    color: "white",
    border: "none",
    padding: 18,
    borderRadius: 16,
    textAlign: "left" as const,
    cursor: "pointer",
    fontSize: 16,
  };
}

function statusStyle(
  status: RequestStatus
) {
  const colors = {
    PENDENTE: {
      bg: "#fff1f2",
      color: "#be123c",
    },

    APROVADA: {
      bg: "#dcfce7",
      color: "#166534",
    },

    NEGADA: {
      bg: "#fee2e2",
      color: "#991b1b",
    },
  };

  return {
    background:
      colors[status].bg,

    color:
      colors[status].color,

    padding: "8px 14px",
    borderRadius: 999,
    fontWeight: "bold",
  };
}