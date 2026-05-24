"use client";

import { useEffect, useState } from "react";

type Status = "PENDENTE" | "APROVADA" | "NEGADA";

type RequestItem = {
  id: number;
  patient: string;
  procedure: string;
  city: string;
  clinic: string;
  status: Status;
};

type Clinic = {
  id: number;
  name: string;
  city: string;
  phone: string;
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);

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

  const [clinics] = useState<Clinic[]>([
    {
      id: 1,
      name: "Clínica Sorriso",
      city: "São Paulo/SP",
      phone: "(11) 99999-9999",
    },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem("apoiorede_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "PENDENTE").length;
  const approved = requests.filter((r) => r.status === "APROVADA").length;
  const denied = requests.filter((r) => r.status === "NEGADA").length;

  function handleLogin() {
    const loggedUser = {
      name: name || "Daniela Moraes",
      email,
      role: "OPERADOR",
    };

    localStorage.setItem(
      "apoiorede_user",
      JSON.stringify(loggedUser)
    );

    setUser(loggedUser);
  }

  function updateStatus(id: number, status: Status) {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  }

  if (!user) {
    return (
      <div style={loginContainer}>
        <div style={loginCard}>
          <h1>ApoioRede</h1>
          <p>CRM odontológico</p>

          {!isLogin && (
            <input
              style={inputStyle}
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            style={inputStyle}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={buttonStyle} onClick={handleLogin}>
            {isLogin ? "Entrar" : "Criar conta"}
          </button>

          <button
            style={linkButton}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Criar conta" : "Já tenho conta"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <aside style={sidebar}>
        <div>
          <h1 style={{ marginBottom: 0 }}>ApoioRede</h1>
          <p style={{ opacity: 0.7 }}>CRM odontológico</p>

          <nav style={navStyle}>
            <button
              style={menuButton(activePage === "DASHBOARD")}
              onClick={() => setActivePage("DASHBOARD")}
            >
              📊 Dashboard
            </button>

            <button
              style={menuButton(activePage === "SOLICITACOES")}
              onClick={() => setActivePage("SOLICITACOES")}
            >
              📄 Solicitações
            </button>

            <button
              style={menuButton(activePage === "CLINICAS")}
              onClick={() => setActivePage("CLINICAS")}
            >
              🏥 Clínicas
            </button>

            <button
              style={menuButton(activePage === "METRICAS")}
              onClick={() => setActivePage("METRICAS")}
            >
              📈 Métricas
            </button>
          </nav>
        </div>

        <button
          style={logoutButton}
          onClick={() => {
            localStorage.removeItem("apoiorede_user");
            setUser(null);
          }}
        >
          Sair
        </button>
      </aside>

      <main style={main}>
        <div style={topBar}>
          <div>
            <h2>Dashboard</h2>
            <p>
              Bem-vinda, {user.name} — {user.role}
            </p>
          </div>

          <button style={buttonStyle}>
            + Solicitação
          </button>
        </div>

        {activePage === "DASHBOARD" && (
          <>
            <div style={cardsGrid}>
              <div style={card}>
                <h3>Total</h3>
                <h1>{total}</h1>
              </div>

              <div style={card}>
                <h3>Pendentes</h3>
                <h1>{pending}</h1>
              </div>

              <div style={card}>
                <h3>Aprovadas</h3>
                <h1>{approved}</h1>
              </div>

              <div style={card}>
                <h3>Negadas</h3>
                <h1>{denied}</h1>
              </div>
            </div>

            <div style={panel}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Procedimento</th>
                    <th>Cidade</th>
                    <th>Clínica</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((item) => (
                    <tr key={item.id}>
                      <td>{item.patient}</td>
                      <td>{item.procedure}</td>
                      <td>{item.city}</td>
                      <td>{item.clinic}</td>

                      <td>
                        <span style={statusStyle(item.status)}>
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            style={approveButton}
                            onClick={() =>
                              updateStatus(item.id, "APROVADA")
                            }
                          >
                            Aprovar
                          </button>

                          <button
                            style={denyButton}
                            onClick={() =>
                              updateStatus(item.id, "NEGADA")
                            }
                          >
                            Negar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activePage === "SOLICITACOES" && (
          <div style={panel}>
            <h2>Solicitações</h2>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Procedimento</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((item) => (
                  <tr key={item.id}>
                    <td>{item.patient}</td>
                    <td>{item.procedure}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePage === "CLINICAS" && (
          <div style={panel}>
            <div style={topBar}>
              <h2>Clínicas</h2>

              <button style={buttonStyle}>
                + Clínica
              </button>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cidade</th>
                  <th>Telefone</th>
                </tr>
              </thead>

              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td>{clinic.name}</td>
                    <td>{clinic.city}</td>
                    <td>{clinic.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePage === "METRICAS" && (
          <div style={panel}>
            <h2>Métricas</h2>

            <div style={cardsGrid}>
              <div style={card}>
                <h3>Total Geral</h3>
                <h1>{total}</h1>
              </div>

              <div style={card}>
                <h3>Taxa Aprovação</h3>
                <h1>
                  {total > 0
                    ? Math.round((approved / total) * 100)
                    : 0}
                  %
                </h1>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const loginContainer = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg,#0f172a,#2563eb)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const loginCard = {
  background: "white",
  padding: 40,
  borderRadius: 24,
  width: 360,
  display: "flex",
  flexDirection: "column" as const,
  gap: 16,
};

const container = {
  display: "flex",
  minHeight: "100vh",
  background: "#eef4ff",
};

const sidebar = {
  width: 280,
  background: "#111827",
  color: "white",
  padding: 30,
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
};

const navStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
  marginTop: 40,
};

const main = {
  flex: 1,
  padding: 30,
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 20,
  marginBottom: 24,
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 20,
};

const panel = {
  background: "white",
  borderRadius: 20,
  padding: 24,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const inputStyle = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
};

const buttonStyle = {
  padding: "14px 20px",
  borderRadius: 12,
  border: "none",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
};

const logoutButton = {
  ...buttonStyle,
  background: "#ef4444",
};

const approveButton = {
  border: "none",
  padding: "8px 14px",
  borderRadius: 999,
  background: "#dbeafe",
  cursor: "pointer",
};

const denyButton = {
  border: "none",
  padding: "8px 14px",
  borderRadius: 999,
  background: "#fce7f3",
  cursor: "pointer",
};

const linkButton = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

function menuButton(active: boolean) {
  return {
    padding: 16,
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: active ? "#4f46e5" : "transparent",
    color: "white",
    textAlign: "left" as const,
  };
}

function statusStyle(status: Status) {
  const colors = {
    PENDENTE: {
      background: "#fef2f2",
      color: "#991b1b",
    },
    APROVADA: {
      background: "#dcfce7",
      color: "#166534",
    },
    NEGADA: {
      background: "#fce7f3",
      color: "#9d174d",
    },
  };

  return {
    background: colors[status].background,
    color: colors[status].color,
    padding: "8px 14px",
    borderRadius: 999,
    fontWeight: "bold",
  };
}