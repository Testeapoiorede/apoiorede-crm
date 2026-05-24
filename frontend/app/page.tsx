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
  const [activePage, setActivePage] =
    useState("DASHBOARD");

  const [toast, setToast] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [requests, setRequests] = useState<
    any[]
  >([]);

  const [clinics, setClinics] = useState<
    any[]
  >([]);

  const [filter, setFilter] =
    useState("TODOS");

  const [search, setSearch] =
    useState("");

  const [showRequestModal, setShowRequestModal] =
    useState(false);

  const [showClinicModal, setShowClinicModal] =
    useState(false);

  const [patientName, setPatientName] =
    useState("");

  const [procedure, setProcedure] =
    useState("");

  const [city, setCity] = useState("");

  const [observation, setObservation] =
    useState("");

  const [clinicId, setClinicId] =
    useState("");

  const [clinicName, setClinicName] =
    useState("");

  const [clinicCity, setClinicCity] =
    useState("");

  const [clinicState, setClinicState] =
    useState("");

  const [clinicWhatsapp, setClinicWhatsapp] =
    useState("");

  function showToast(text: string) {
    setToast(text);

    setTimeout(() => {
      setToast("");
    }, 3000);
  }

  useEffect(() => {
    const savedUser =
      localStorage.getItem("apoiorede_user");

    const savedToken =
      localStorage.getItem("apoiorede_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      loadData();
    }
  }, []);

  async function register() {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

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

      showToast(
        "Cadastro realizado com sucesso."
      );
    } else {
      setMessage(
        data.error || "Erro ao cadastrar"
      );
    }
  }

  async function login() {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

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

      showToast(
        "Login realizado com sucesso."
      );
    } else {
      setMessage(
        data.error || "Erro no login"
      );
    }
  }

  function logout() {
    localStorage.removeItem(
      "apoiorede_user"
    );

    localStorage.removeItem(
      "apoiorede_token"
    );

    setUser(null);
  }

  async function loadData() {
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

    showToast("Solicitação criada.");
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

    showToast("Clínica criada.");
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
          <h1>ApoioRede</h1>

          <p>CRM odontológico</p>

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
        </section>
      </main>
    );
  }

  return (
    <main style={appStyle}>
      <aside style={sidebarStyle}>
        <div>
          <h1 style={sidebarLogo}>
            ApoioRede
          </h1>

          <p style={sidebarSub}>
            CRM odontológico
          </p>

          <nav style={navStyle}>
            <button
              onClick={() =>
                setActivePage(
                  "DASHBOARD"
                )
              }
              style={
                activePage ===
                "DASHBOARD"
                  ? navActive
                  : navButton
              }
            >
              📊 Dashboard
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "SOLICITACOES"
                )
              }
              style={
                activePage ===
                "SOLICITACOES"
                  ? navActive
                  : navButton
              }
            >
              📝 Solicitações
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "CLINICAS"
                )
              }
              style={
                activePage ===
                "CLINICAS"
                  ? navActive
                  : navButton
              }
            >
              🏥 Clínicas
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "METRICAS"
                )
              }
              style={
                activePage ===
                "METRICAS"
                  ? navActive
                  : navButton
              }
            >
              📈 Métricas
            </button>
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
            <h2>Dashboard</h2>

            <p>
              Bem-vinda, {user.name}
            </p>
          </div>

          <button
            onClick={() =>
              setShowRequestModal(true)
            }
            style={primarySmallButton}
          >
            + Solicitação
          </button>
        </header>

        {activePage ===
          "DASHBOARD" && (
          <>
            <div style={metricsStyle}>
              <div style={metricCard}>
                <span>Total</span>

                <strong
                  style={{
                    fontSize: 28,
                  }}
                >
                  {total}
                </strong>
              </div>

              <div style={metricCard}>
                <span>
                  Pendentes
                </span>

                <strong
                  style={{
                    color:
                      "#d97706",

                    fontSize: 28,
                  }}
                >
                  {pendentes}
                </strong>
              </div>

              <div style={metricCard}>
                <span>
                  Aprovadas
                </span>

                <strong
                  style={{
                    color:
                      "#16a34a",

                    fontSize: 28,
                  }}
                >
                  {aprovadas}
                </strong>
              </div>

              <div style={metricCard}>
                <span>
                  Negadas
                </span>

                <strong
                  style={{
                    color:
                      "#dc2626",

                    fontSize: 28,
                  }}
                >
                  {negadas}
                </strong>
              </div>
            </div>

            <section style={panelStyle}>
              <div
                style={toolbarStyle}
              >
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
                      Clínica
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
                          {
                            item.procedure
                          }
                        </td>

                        <td style={tdStyle}>
                          {item.city}
                        </td>

                        <td style={tdStyle}>
                          {item.clinic
                            ?.name ||
                            "-"}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={statusStyle(
                              item.status
                            )}
                          >
                            {
                              item.status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

const appStyle = {
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
  border: 0,
  color: "white",
  cursor: "pointer",
  textAlign: "left" as const,
};

const navButton = {
  padding: 12,
  border: 0,
  borderRadius: 12,
  background: "transparent",
  color: "white",
  textAlign: "left" as const,
  cursor: "pointer",
};

const logoutButton = {
  marginTop: 40,
  width: "100%",
  padding: 12,
};

const mainStyle = {
  flex: 1,
  padding: 32,
};

const topbarStyle = {
  display: "flex",
  justifyContent:
    "space-between",
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

  display: "flex",
  flexDirection:
    "column" as const,

  gap: 12,
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
};

const inputStyle = {
  width: "100%",
  padding: 13,
  borderRadius: 12,
  marginBottom: 12,
};

const smallInput = {
  padding: 10,
  borderRadius: 10,
};

const primaryButton = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "#2563eb",
  color: "white",
  border: 0,
};

const primarySmallButton = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "#2563eb",
  color: "white",
  border: 0,
};

const loginPageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const loginCardStyle = {
  width: 400,
  background: "white",
  padding: 34,
  borderRadius: 24,
};

const tableStyle = {
  width: "100%",
};

const thStyle = {
  textAlign: "left" as const,
  padding: 14,
};

const tdStyle = {
  padding: 14,
};

function statusStyle(
  status: string
) {
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