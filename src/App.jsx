import { useState } from "react";

export default function App() {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const [erro, setErro] = useState("");

  function formatarCNPJ(valor) {
    const digits = valor.replace(/\D/g, "").slice(0, 14);

    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  async function consultar() {
    const clean = cnpj.replace(/\D/g, "");

    if (clean.length !== 14) {
      setErro("Digite um CNPJ válido.");
      return;
    }

    try {
      setErro("");
      setLoading(true);
      setEmpresa(null);

      const response = await fetch(
        `https://publica.cnpj.ws/cnpj/${clean}`
      );

      if (!response.ok) {
        throw new Error("CNPJ não encontrado.");
      }

      const data = await response.json();
      setEmpresa(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "24px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 10 }}>
          Consulta CNPJ
        </h1>

        <p style={{ color: "#64748b" }}>
          Consulta pública de empresas
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20
          }}
        >
          <input
            value={cnpj}
            onChange={(e) =>
              setCnpj(formatarCNPJ(e.target.value))
            }
            placeholder="00.000.000/0000-00"
            style={{
              flex: 1,
              padding: 15,
              borderRadius: 12,
              border: "1px solid #cbd5e1"
            }}
          />

          <button
            onClick={consultar}
            disabled={loading}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0 20px",
              cursor: "pointer"
            }}
          >
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </div>

        {erro && (
          <div
            style={{
              marginTop: 20,
              background: "#fee2e2",
              color: "#991b1b",
              padding: 15,
              borderRadius: 12
            }}
          >
            {erro}
          </div>
        )}

        {empresa && (
          <div
            style={{
              marginTop: 25,
              background: "#f8fafc",
              borderRadius: 18,
              padding: 20
            }}
          >
            <h2>Resumo da Empresa</h2>

            <p>
              <strong>Razão Social:</strong>{" "}
              {empresa.razao_social}
            </p>

            <p>
              <strong>Fantasia:</strong>{" "}
              {empresa.estabelecimento?.nome_fantasia ||
                "Não informado"}
            </p>

            <p>
              <strong>Situação:</strong>{" "}
              {
                empresa.estabelecimento
                  ?.situacao_cadastral
              }
            </p>

            <p>
              <strong>Cidade/UF:</strong>{" "}
              {
                empresa.estabelecimento?.cidade
                  ?.nome
              }
              /
              {
                empresa.estabelecimento?.estado
                  ?.sigla
              }
            </p>

            <p>
              <strong>Telefone:</strong>{" "}
              {
                empresa.estabelecimento
                  ?.telefone_1
              }
            </p>

            <details style={{ marginTop: 20 }}>
              <summary>
                Ver JSON completo
              </summary>

              <pre
                style={{
                  overflow: "auto",
                  background: "#0f172a",
                  color: "#fff",
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 10
                }}
              >
                {JSON.stringify(
                  empresa,
                  null,
                  2
                )}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
