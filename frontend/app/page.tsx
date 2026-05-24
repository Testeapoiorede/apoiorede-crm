export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 40,
          borderRadius: 20,
          width: 400,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>ApoioRede</h1>

        <p>Sistema restaurado com sucesso ✅</p>
      </div>
    </main>
  );
}