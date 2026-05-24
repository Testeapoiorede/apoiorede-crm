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

  const [toast, setToast] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requests, setRequests] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);

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
  }  async function loadData() {
    const requestsResponse = await fetch(
      `${API_URL}/requests`,
      {
        headers: getAuthHeaders(),
      }
    );

    const requestsData =
      await requestsResponse.json();

    setRequests(
      Array.isArray(requestsData)
        ? requestsData
        : []
    );

    const clinicsResponse = await fetch(
      `${API_URL}/clinics`,
      {
        headers: getAuthHeaders(),
      }
    );

    const clinicsData =
      await clinicsResponse.json();

    setClinics(
      Array.isArray(clinicsData)
        ? clinicsData
        : []
    );
  }

  const total = requests.length;

  const pendentes = requests.filter(
    (r) => r.status === "PENDENTE"
  ).length;

  const aprovadas = requests.filter(
    (r) => r.status === "APROVADO"
  ).length;

  const negadas = requests.filter(
    (r) => r.status === "NEGADO"
  ).length;

  const filteredRequests =
    requests.filter((r) => {
      const matchStatus =
        filter === "TODOS" ||
        r.status === filter;

      const matchSearch =
        r.patientName
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        matchStatus && matchSearch
      );
    });

  if (!user) {
    return (
      <main style={loginPageStyle}>
        <section style={loginCardStyle}>
          <h1 style={{ margin: 0 }}>
            ApoioRede
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: 20,
            }}
          >
            CRM odontológico
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <button
              onClick={() =>
                setIsLogin(true)
              }
              style={
                isLogin
                  ? activeTab
                  : inactiveTab
              }
            >
              Login
            </button>

            <button
              onClick={() =>
                setIsLogin(false)
              }
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
                setName(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          )}

          <input
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={
              isLogin
                ? login
                : register
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
                color: "red",
                marginTop: 15,
              }}
            >
              {message}
            </p>
          )}
        </section>
      </main>
    );
  }  return (
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
              📈 Métricas
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
                marginTop: 5,
                color: "#64748b",
              }}
            >
              Bem-vinda,{" "}
              {user.name}
            </p>
          </div>

          <div style={avatarStyle}>
            {user.name?.charAt(0)}
          </div>
        </header>

        <div style={metricsStyle}>
          <div style={metricCard}>
            <span>Total</span>
            <strong>{total}</strong>
          </div>

          <div style={metricCard}>
            <span>Pendentes</span>

            <strong
              style={{
                color: "#d97706",
              }}
            >
              {pendentes}
            </strong>
          </div>

          <div style={metricCard}>
            <span>Aprovadas</span>

            <strong
              style={{
                color: "#16a34a",
              }}
            >
              {aprovadas}
            </strong>
          </div>

          <div style={metricCard}>
            <span>Negadas</span>

            <strong
              style={{
                color: "#dc2626",
              }}
            >
              {negadas}
            </strong>
          </div>
        </div>        <section style={panelStyle}>
          <div style={toolbarStyle}>
            <input
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={smallInput}
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              style={smallInput}
            >
              <option value="TODOS">
                Todos
              </option>

              <option value="PENDENTE">
                Pendentes
              </option>

              <option value="APROVADO">
                Aprovados
              </option>

              <option value="NEGADO">
                Negados
              </option>
            </select>
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>
                    Paciente
                  </th>

                  <th style={thStyle}>
                    Procedimento
                  </th>

                  <th style={thStyle}>
                    Cidade
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map(
                  (item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>
                        {
                          item.patientName
                        }
                      </td>

                      <td style={tdStyle}>
                        {item.procedure}
                      </td>

                      <td style={tdStyle}>
                        {item.city}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={statusStyle(
                            item.status
                          )}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}const appStyle = {
  minHeight: "100vh",
  display: "flex",
  background: "#f1f5f9",
  fontFamily: "Arial",
};

const sidebarStyle = {
  width: 250,
  background: "#0f172a",
  color: "white",
  padding: 28,
};

const sidebarLogo = {
  margin: 0,
  fontSize: 28,
};

const sidebarSub = {
  color: "#94a3b8",
};

const navStyle = {
  display: "grid",
  gap: 12,
  marginTop: 40,
};

const navActive = {
  background: "#2563eb",
  padding: 12,
  borderRadius: 12,
};

const navItem = {
  padding: 12,
};

const logoutButton = {
  marginTop: 40,
  width: "100%",
  padding: 12,
  border: 0,
  borderRadius: 12,
  cursor: "pointer",
};

const mainStyle = {
  flex: 1,
  padding: 32,
};

const topbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
};

const avatarStyle = {
  width: 45,
  height: 45,
  borderRadius: 999,
  background: "#2563eb",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const metricsStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 18,
  marginBottom: 24,
};

const metricCard = {
  background: "white",
  padding: 24,
  borderRadius: 18,
};

const panelStyle = {
  background: "white",
  padding: 24,
  borderRadius: 18,
};

const toolbarStyle = {
  display: "flex",
  gap: 12,
  marginBottom: 18,
};const inputStyle = {
  width: "100%",
  padding: 13,
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  marginBottom: 12,
};

const smallInput = {
  padding: 10,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
};

const primaryButton = {
  width: "100%",
  padding: 14,
  border: 0,
  borderRadius: 12,
  background: "#2563eb",
  color: "white",
};

const loginPageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#eef2f7",
};

const loginCardStyle = {
  width: 400,
  background: "white",
  padding: 34,
  borderRadius: 24,
};

const activeTab = {
  flex: 1,
  padding: 12,
  border: 0,
  borderRadius: 12,
  background: "#2563eb",
  color: "white",
};

const inactiveTab = {
  flex: 1,
  padding: 12,
  border: 0,
  borderRadius: 12,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const thStyle = {
  textAlign: "left" as const,
  padding: 14,
};

const tdStyle = {
  padding: 14,
  borderTop: "1px solid #e2e8f0",
};

const toastStyle = {
  position: "fixed" as const,
  top: 20,
  right: 20,
  background: "#16a34a",
  color: "white",
  padding: "14px 18px",
  borderRadius: 12,
};

function statusStyle(status: string) {
  return {
    background:
      status === "APROVADO"
        ? "#dcfce7"
        : status === "NEGADO"
        ? "#fee2e2"
        : "#fef3c7",

    color:
      status === "APROVADO"
        ? "#166534"
        : status === "NEGADO"
        ? "#991b1b"
        : "#92400e",

    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: "bold",
  };
}