"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "NOVA" | "PROCURANDO_REDE" | "CLINICA_ENCONTRADA" | "FINALIZADO";

type RequestItem = {
  id: number;
  clientName: string;
  clientWhatsapp: string;
  plan: string;
  specialty: string;
  procedure: string;
  city: string;
  state: string;
  neighborhood: string;
  observation: string;
  clinicName: string;
  clinicWhatsapp: string;
  status: Status;
};

type Clinic = {
  id: number;
  name: string;
  fantasyName: string;
  whatsapp: string;
  phone: string;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  number: string;
  complement: string;
  specialty: string;
  providerType: string;
  network: string;
  source: string;
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [activePage, setActivePage] = useState("DASHBOARD");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);

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

  const [newClinicName, setNewClinicName] = useState("");
  const [newClinicWhatsapp, setNewClinicWhatsapp] = useState("");
  const [newClinicCity, setNewClinicCity] = useState("");
  const [newClinicState, setNewClinicState] = useState("");
  const [newClinicNeighborhood, setNewClinicNeighborhood] = useState("");
  const [newClinicSpecialty, setNewClinicSpecialty] = useState("");
  const [newClinicNetwork, setNewClinicNetwork] = useState("");

  const [clinicSearch, setClinicSearch] = useState("");
  const [clinicCityFilter, setClinicCityFilter] = useState("");
  const [clinicStateFilter, setClinicStateFilter] = useState("");
  const [clinicSpecialtyFilter, setClinicSpecialtyFilter] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("apoiorede_user");
    const savedRequests = localStorage.getItem("apoiorede_requests");
    const savedClinics = localStorage.getItem("apoiorede_clinics");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedRequests) setRequests(JSON.parse(savedRequests));
    if (savedClinics) setClinics(JSON.parse(savedClinics));
  }, []);

  useEffect(() => {
    localStorage.setItem("apoiorede_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("apoiorede_clinics", JSON.stringify(clinics));
  }, [clinics]);

  function showMessage(text: string) {
    setToast(text);
    setTimeout(() => setToast(""), 3500);
  }

  function login() {
    if (!email || !password) {
      showMessage("Preencha e-mail e senha.");
      return;
    }

    const loggedUser = { name: name || "Daniela", email, role: "OPERADOR" };
    localStorage.setItem("apoiorede_user", JSON.stringify(loggedUser));
    setUser(loggedUser);
  }

  function logout() {
    localStorage.removeItem("apoiorede_user");
    setUser(null);
  }

  function createRequest() {
    if (!clientName || !clientWhatsapp || !plan || !specialty || !city || !state) {
      showMessage("Preencha cliente, WhatsApp, plano, especialidade, cidade e estado.");
      return;
    }

    const suggestion = suggestClinic();

    const request: RequestItem = {
      id: Date.now(),
      clientName,
      clientWhatsapp,
      plan,
      specialty,
      procedure,
      city,
      state,
      neighborhood,
      observation,
      clinicName: clinicName || suggestion?.name || suggestion?.fantasyName || "",
      clinicWhatsapp: clinicWhatsapp || suggestion?.whatsapp || suggestion?.phone || "",
      status: suggestion || clinicName ? "CLINICA_ENCONTRADA" : "NOVA",
    };

    setRequests([request, ...requests]);
    clearRequestForm();
    setShowRequestModal(false);
    showMessage("Solicitação cadastrada.");
  }

  function clearRequestForm() {
    setClientName("");
    setClientWhatsapp("");
    setPlan("");
    setSpecialty("");
    setProcedure("");
    setCity("");
    setState("");
    setNeighborhood("");
    setObservation("");
    setClinicName("");
    setClinicWhatsapp("");
  }

  function createClinic() {
    if (!newClinicName || !newClinicCity || !newClinicState) {
      showMessage("Preencha nome, cidade e estado da clínica.");
      return;
    }

    const clinic: Clinic = {
      id: Date.now(),
      name: newClinicName,
      fantasyName: "",
      whatsapp: newClinicWhatsapp,
      phone: newClinicWhatsapp,
      city: newClinicCity,
      state: newClinicState,
      neighborhood: newClinicNeighborhood,
      address: "",
      number: "",
      complement: "",
      specialty: newClinicSpecialty,
      providerType: "Cadastro manual",
      network: newClinicNetwork,
      source: "Manual",
    };

    setClinics([clinic, ...clinics]);
    setNewClinicName("");
    setNewClinicWhatsapp("");
    setNewClinicCity("");
    setNewClinicState("");
    setNewClinicNeighborhood("");
    setNewClinicSpecialty("");
    setNewClinicNetwork("");
    setShowClinicModal(false);
    showMessage("Clínica cadastrada.");
  }

  function updateStatus(id: number, status: Status) {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function deleteRequest(id: number) {
    if (!confirm("Deseja excluir esta solicitação?")) return;
    setRequests(requests.filter((r) => r.id !== id));
  }

  function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
  }

  function openWhatsapp(phone: string) {
    const number = onlyNumbers(phone || "");
    if (!number) return alert("Número de WhatsApp não informado.");
    const finalNumber = number.length <= 11 ? `55${number}` : number;
    window.open(`https://wa.me/${finalNumber}`, "_blank");
  }

  function copyClinicMessage(item: RequestItem) {
    const text = `Olá, tudo bem? Sou Daniela, da corretora. Poderia confirmar se vocês atendem pelo plano ${item.plan} para ${item.specialty}${item.procedure ? ` / ${item.procedure}` : ""}? Cliente busca atendimento em ${item.city}/${item.state}${item.neighborhood ? `, bairro ${item.neighborhood}` : ""}.`;
    navigator.clipboard.writeText(text);
    showMessage("Mensagem para clínica copiada.");
  }

  function copyClientMessage(item: RequestItem) {
    const text = item.clinicName
      ? `Olá! Sobre sua solicitação para ${item.specialty}${item.procedure ? ` / ${item.procedure}` : ""}, localizei uma clínica: ${item.clinicName}. WhatsApp: ${item.clinicWhatsapp || "não informado"}. Peço que entre em contato diretamente para confirmar horários e agendamento.`
      : `Olá! Sobre sua solicitação para ${item.specialty}${item.procedure ? ` / ${item.procedure}` : ""}, ainda estou verificando uma clínica disponível para atendimento.`;

    navigator.clipboard.writeText(text);
    showMessage("Mensagem para cliente copiada.");
  }

  function suggestClinic() {
    const cityNorm = normalizeText(city);
    const stateNorm = normalizeText(state);
    const specialtyNorm = normalizeText(specialty);
    const neighborhoodNorm = normalizeText(neighborhood);

    return clinics.find((clinic) => {
      const sameCity = normalizeText(clinic.city).includes(cityNorm);
      const sameState = normalizeText(clinic.state).includes(stateNorm);
      const sameSpecialty =
        normalizeText(clinic.specialty).includes(specialtyNorm) ||
        normalizeText(clinic.name).includes(specialtyNorm) ||
        normalizeText(clinic.fantasyName).includes(specialtyNorm);
      const sameNeighborhood =
        !neighborhoodNorm || normalizeText(clinic.neighborhood).includes(neighborhoodNorm);

      return sameCity && sameState && sameNeighborhood && sameSpecialty;
    });
  }

  function parseCsvLine(line: string) {
    const result: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const next = line[i + 1];

      if (char === '"' && insideQuotes && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if ((char === ";" || char === ",") && !insideQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  function normalizeHeader(value: string) {
    return normalizeText(value).replace(/\s+/g, "_");
  }

  function normalizeText(value: string) {
    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function getValue(row: Record<string, string>, possibleKeys: string[]) {
    for (const key of possibleKeys) {
      const normalized = normalizeHeader(key);
      if (row[normalized]) return row[normalized];
    }

    return "";
  }

  function importCsv(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const lines = text.split(/\r?\n/).filter((line) => line.trim());

      if (lines.length < 2) {
        showMessage("Arquivo vazio ou inválido.");
        return;
      }

      const headers = parseCsvLine(lines[0]).map(normalizeHeader);

      const imported: Clinic[] = lines.slice(1).map((line, index) => {
        const values = parseCsvLine(line);
        const row: Record<string, string> = {};

        headers.forEach((header, i) => {
          row[header] = values[i] || "";
        });

        const phone = getValue(row, ["TELEFONE", "TELEFONE 1", "WHATSAPP"]);
        const name =
          getValue(row, ["NOME_CLINICA_VINCULADA", "NOME CLINICA VINCULADA", "NOME FANTASIA", "NOME"]) ||
          "Clínica sem nome";

        return {
          id: Date.now() + index,
          name,
          fantasyName: getValue(row, ["NOME FANTASIA", "FANTASIA"]),
          whatsapp: phone,
          phone,
          city: getValue(row, ["CIDADE"]),
          state: getValue(row, ["UF", "ESTADO"]),
          neighborhood: getValue(row, ["BAIRRO"]),
          address: getValue(row, ["ENDEREÇO", "ENDERECO", "LOGRADOURO"]),
          number: getValue(row, ["NUMERO", "NÚMERO"]),
          complement: getValue(row, ["COMPLEMENTO"]),
          specialty: getValue(row, ["ESPECIALIDADE"]),
          providerType: getValue(row, ["TIPO PRESTADOR", "TIPO_PRESTADOR"]),
          network: getValue(row, ["REDE"]),
          source: "Planilha Amil",
        };
      });

      const validImported = imported.filter((clinic) => clinic.city || clinic.name !== "Clínica sem nome");
      setClinics(validImported);
      showMessage(`${validImported.length} clínicas importadas da planilha.`);
    };

    reader.readAsText(file, "ISO-8859-1");
  }

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const text = `${clinic.name} ${clinic.fantasyName} ${clinic.city} ${clinic.state} ${clinic.neighborhood} ${clinic.specialty} ${clinic.network}`.toLowerCase();

      const matchSearch = text.includes(clinicSearch.toLowerCase());
      const matchCity = !clinicCityFilter || normalizeText(clinic.city).includes(normalizeText(clinicCityFilter));
      const matchState = !clinicStateFilter || normalizeText(clinic.state).includes(normalizeText(clinicStateFilter));
      const matchSpecialty =
        !clinicSpecialtyFilter ||
        normalizeText(clinic.specialty).includes(normalizeText(clinicSpecialtyFilter));

      return matchSearch && matchCity && matchState && matchSpecialty;
    });
  }, [clinics, clinicSearch, clinicCityFilter, clinicStateFilter, clinicSpecialtyFilter]);

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

          <button style={primaryButton} onClick={login}>
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>

          <button style={secondaryButton} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Criar conta" : "Já tenho conta"}
          </button>
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
            <button style={navButton(activePage === "CLINICAS")} onClick={() => setActivePage("CLINICAS")}>🏥 Rede / Clínicas</button>
            <button style={navButton(activePage === "IMPORTAR")} onClick={() => setActivePage("IMPORTAR")}>📥 Importar Excel</button>
            <button style={navButton(activePage === "METRICAS")} onClick={() => setActivePage("METRICAS")}>📈 Métricas</button>
          </nav>
        </div>

        <button style={dangerButton} onClick={logout}>Sair</button>
      </aside>

      <section style={content}>
        <header style={topbar}>
          <div>
            <h2>{pageTitle(activePage)}</h2>
            <p>Bem-vinda, {user.name}</p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={primaryButton} onClick={() => setShowRequestModal(true)}>+ Solicitação</button>
            <button style={secondaryButton} onClick={() => setShowClinicModal(true)}>+ Clínica</button>
          </div>
        </header>

        {activePage === "DASHBOARD" && (
          <>
            <div style={cardsGrid}>
              <Card title="Total" value={total} />
              <Card title="Novas" value={novas} />
              <Card title="Procurando rede" value={procurando} />
              <Card title="Clínica encontrada" value={encontradas} />
              <Card title="Finalizadas" value={finalizadas} />
              <Card title="Clínicas na base" value={clinics.length} />
            </div>

            <RequestsTable
              requests={requests}
              updateStatus={updateStatus}
              deleteRequest={deleteRequest}
              openWhatsapp={openWhatsapp}
              copyClinicMessage={copyClinicMessage}
              copyClientMessage={copyClientMessage}
            />
          </>
        )}

        {activePage === "SOLICITACOES" && (
          <RequestsTable
            requests={requests}
            updateStatus={updateStatus}
            deleteRequest={deleteRequest}
            openWhatsapp={openWhatsapp}
            copyClinicMessage={copyClinicMessage}
            copyClientMessage={copyClientMessage}
          />
        )}

        {activePage === "CLINICAS" && (
          <section style={panel}>
            <h2>Rede credenciada / Clínicas</h2>

            <div style={filters}>
              <input style={input} placeholder="Buscar nome, bairro, rede..." value={clinicSearch} onChange={(e) => setClinicSearch(e.target.value)} />
              <input style={input} placeholder="Cidade" value={clinicCityFilter} onChange={(e) => setClinicCityFilter(e.target.value)} />
              <input style={input} placeholder="UF" value={clinicStateFilter} onChange={(e) => setClinicStateFilter(e.target.value)} />
              <input style={input} placeholder="Especialidade" value={clinicSpecialtyFilter} onChange={(e) => setClinicSpecialtyFilter(e.target.value)} />
            </div>

            <p><strong>{filteredClinics.length}</strong> clínicas encontradas.</p>

            <div style={clinicGrid}>
              {filteredClinics.slice(0, 300).map((clinic) => (
                <div key={clinic.id} style={clinicCard}>
                  <h3>{clinic.name}</h3>
                  {clinic.fantasyName && <p><strong>Fantasia:</strong> {clinic.fantasyName}</p>}
                  <p><strong>Especialidade:</strong> {clinic.specialty || "-"}</p>
                  <p><strong>Endereço:</strong> {clinic.address} {clinic.number} {clinic.complement}</p>
                  <p><strong>Bairro:</strong> {clinic.neighborhood || "-"}</p>
                  <p><strong>Cidade:</strong> {clinic.city}/{clinic.state}</p>
                  <p><strong>Telefone:</strong> {clinic.phone || "-"}</p>
                  <p><strong>Rede:</strong> {clinic.network || "-"}</p>
                  <button style={greenButton} onClick={() => openWhatsapp(clinic.whatsapp || clinic.phone)}>Abrir WhatsApp</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === "IMPORTAR" && (
          <section style={panel}>
            <h2>Importar planilha da rede</h2>
            <p>Use aqui a planilha CSV da Amil ou outra rede credenciada. O sistema vai substituir a base atual pela nova importação.</p>

            <input
              type="file"
              accept=".csv,.txt"
              style={input}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importCsv(file);
              }}
            />

            <p><strong>{clinics.length}</strong> clínicas carregadas na base atual.</p>
          </section>
        )}

        {activePage === "METRICAS" && (
          <div style={cardsGrid}>
            <Card title="Total de casos" value={total} />
            <Card title="Em busca de rede" value={procurando} />
            <Card title="Rede encontrada" value={encontradas} />
            <Card title="Finalizados" value={finalizadas} />
            <Card title="Clínicas importadas" value={clinics.length} />
          </div>
        )}
      </section>

      {showRequestModal && (
        <Modal title="Nova solicitação">
          <input style={input} placeholder="Nome do cliente" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <input style={input} placeholder="WhatsApp do cliente" value={clientWhatsapp} onChange={(e) => setClientWhatsapp(e.target.value)} />
          <input style={input} placeholder="Plano odontológico" value={plan} onChange={(e) => setPlan(e.target.value)} />
          <input style={input} placeholder="Especialidade" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          <input style={input} placeholder="Procedimento" value={procedure} onChange={(e) => setProcedure(e.target.value)} />
          <input style={input} placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
          <input style={input} placeholder="Estado" value={state} onChange={(e) => setState(e.target.value)} />
          <input style={input} placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
          <input style={input} placeholder="Clínica encontrada" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
          <input style={input} placeholder="WhatsApp da clínica" value={clinicWhatsapp} onChange={(e) => setClinicWhatsapp(e.target.value)} />
          <textarea style={{ ...input, minHeight: 80 }} placeholder="Observação" value={observation} onChange={(e) => setObservation(e.target.value)} />

          <div style={{ display: "flex", gap: 12 }}>
            <button style={primaryButton} onClick={createRequest}>Salvar</button>
            <button style={dangerButton} onClick={() => setShowRequestModal(false)}>Cancelar</button>
          </div>
        </Modal>
      )}

      {showClinicModal && (
        <Modal title="Nova clínica">
          <input style={input} placeholder="Nome da clínica" value={newClinicName} onChange={(e) => setNewClinicName(e.target.value)} />
          <input style={input} placeholder="WhatsApp da clínica" value={newClinicWhatsapp} onChange={(e) => setNewClinicWhatsapp(e.target.value)} />
          <input style={input} placeholder="Cidade" value={newClinicCity} onChange={(e) => setNewClinicCity(e.target.value)} />
          <input style={input} placeholder="Estado" value={newClinicState} onChange={(e) => setNewClinicState(e.target.value)} />
          <input style={input} placeholder="Bairro" value={newClinicNeighborhood} onChange={(e) => setNewClinicNeighborhood(e.target.value)} />
          <input style={input} placeholder="Especialidade" value={newClinicSpecialty} onChange={(e) => setNewClinicSpecialty(e.target.value)} />
          <input style={input} placeholder="Rede/plano" value={newClinicNetwork} onChange={(e) => setNewClinicNetwork(e.target.value)} />

          <div style={{ display: "flex", gap: 12 }}>
            <button style={primaryButton} onClick={createClinic}>Salvar</button>
            <button style={dangerButton} onClick={() => setShowClinicModal(false)}>Cancelar</button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function pageTitle(activePage: string) {
  if (activePage === "SOLICITACOES") return "Solicitações";
  if (activePage === "CLINICAS") return "Rede / Clínicas";
  if (activePage === "IMPORTAR") return "Importar Excel";
  if (activePage === "METRICAS") return "Métricas";
  return "Dashboard";
}

function Card({ title, value }: any) {
  return (
    <div style={card}>
      <p>{title}</p>
      <h1>{value}</h1>
    </div>
  );
}

function RequestsTable({ requests, updateStatus, deleteRequest, openWhatsapp, copyClinicMessage, copyClientMessage }: any) {
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
          {requests.map((item: RequestItem) => (
            <tr key={item.id}>
              <td>{item.clientName}</td>
              <td>{item.clientWhatsapp}</td>
              <td>{item.plan}</td>
              <td>{item.specialty}<br />{item.procedure}</td>
              <td>{item.city}/{item.state}</td>
              <td>{item.clinicName || "-"}</td>
              <td>{item.status}</td>
              <td>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={yellowButton} onClick={() => updateStatus(item.id, "PROCURANDO_REDE")}>Procurando</button>
                  <button style={greenButton} onClick={() => updateStatus(item.id, "CLINICA_ENCONTRADA")}>Encontrada</button>
                  <button style={darkButton} onClick={() => updateStatus(item.id, "FINALIZADO")}>Finalizar</button>
                  <button style={secondaryButton} onClick={() => openWhatsapp(item.clientWhatsapp)}>Whats Cliente</button>
                  <button style={secondaryButton} onClick={() => openWhatsapp(item.clinicWhatsapp)}>Whats Clínica</button>
                  <button style={secondaryButton} onClick={() => copyClinicMessage(item)}>Msg Clínica</button>
                  <button style={secondaryButton} onClick={() => copyClientMessage(item)}>Msg Cliente</button>
                  <button style={dangerMiniButton} onClick={() => deleteRequest(item.id)}>Excluir</button>
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
const cardsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 24 };
const card = { background: "white", borderRadius: 20, padding: 24 };
const panel = { background: "white", borderRadius: 20, padding: 24 };
const table = { width: "100%", minWidth: 1100 };
const filters = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 };
const clinicGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 };
const clinicCard = { background: "#f8fafc", borderRadius: 18, padding: 20 };
const input = { width: "100%", padding: 14, borderRadius: 12, border: "1px solid #ddd", marginBottom: 12, boxSizing: "border-box" as const };
const primaryButton = { padding: "14px 18px", borderRadius: 12, border: "none", background: "#4f46e5", color: "white", cursor: "pointer" };
const secondaryButton = { padding: "10px 12px", borderRadius: 12, border: "none", background: "#e5e7eb", cursor: "pointer" };
const dangerButton = { padding: "14px 18px", borderRadius: 12, border: "none", background: "#ef4444", color: "white", cursor: "pointer" };
const dangerMiniButton = { background: "#fee2e2", color: "#991b1b", border: "none", padding: "8px 12px", borderRadius: 999, cursor: "pointer" };
const yellowButton = { background: "#fef3c7", border: "none", padding: "8px 12px", borderRadius: 999, cursor: "pointer" };
const greenButton = { background: "#dcfce7", border: "none", padding: "8px 12px", borderRadius: 999, cursor: "pointer" };
const darkButton = { background: "#111827", color: "white", border: "none", padding: "8px 12px", borderRadius: 999, cursor: "pointer" };
const loginPage = { minHeight: "100vh", background: "linear-gradient(135deg,#111827,#4f46e5)", display: "flex", justifyContent: "center", alignItems: "center" };
const loginCard = { background: "white", width: 400, borderRadius: 20, padding: 40 };
const modalOverlay = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 10 };
const modal = { background: "white", padding: 30, borderRadius: 20, width: 560, maxHeight: "90vh", overflowY: "auto" as const };
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
