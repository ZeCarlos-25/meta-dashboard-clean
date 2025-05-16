import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function DashboardMetaAds() {
  const [dados, setDados] = useState([]);
  const [modoDemo, setModoDemo] = useState(false);
  const printRef = useRef();

  const urlPlanilha =
    "https://docs.google.com/spreadsheets/d/1QGZSa7wn4uvgKcFAdfYc2zmfRRcWlRGJV1NKxl-O6-0/gviz/tq?tqx=out:json";

  useEffect(() => {
    if (!modoDemo) {
      fetch(urlPlanilha)
        .then((res) => res.text())
        .then((data) => {
          const json = JSON.parse(data.substring(47).slice(0, -2));
          const linhas = json.table.rows.map((row) => {
            const getVal = (i) => row.c[i]?.v ?? "";

            let rawData = getVal(0);
            let dataFormatada = rawData;

            // Corrige a data se vier como objeto
            if (typeof rawData === "object" && rawData !== null) {
              const d = new Date(rawData);
              dataFormatada = d.toLocaleDateString("pt-BR").slice(0, 5); // Ex: 15/05
            }

            return {
              DATA: dataFormatada,
              NOME: getVal(1),
              TIPO: getVal(2),
              CPM: parseFloat(getVal(3)?.toString().replace(",", ".")) || 0,
              CPC: parseFloat(getVal(4)?.toString().replace(",", ".")) || 0,
              CTR: parseFloat(getVal(5)?.toString().replace(",", ".")) || 0,
              ROAS: parseFloat(getVal(6)?.toString().replace(",", ".")) || 0,
            };
          });

          setDados(linhas.filter((item) => item.DATA && item.ROAS));
        });
    } else {
      setDados([
        { DATA: "01/05", ROAS: 3.2, CPC: 1.9 },
        { DATA: "02/05", ROAS: 2.1, CPC: 2.3 },
        { DATA: "03/05", ROAS: 4.0, CPC: 1.5 },
        { DATA: "04/05", ROAS: 2.8, CPC: 2.0 },
      ]);
    }
  }, [modoDemo]);

  const exportarCSV = () => {
    const csv = ["DATA,ROAS,CPC"];
    dados.forEach((d) => csv.push(`${d.DATA},${d.ROAS},${d.CPC}`));
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio.csv";
    link.click();
  };

  const exportarPDF = () => {
    html2canvas(printRef.current).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
      pdf.save("relatorio.pdf");
    });
  };

  return (
    <div style={{ padding: "20px" }} ref={printRef}>
      <h1>Dashboard Meta Ads</h1>
      <button onClick={() => setModoDemo(!modoDemo)}>
        {modoDemo ? "Desativar Modo Demo" : "Ativar Modo Demo"}
      </button>
      <button onClick={exportarCSV}>Exportar CSV</button>
      <button onClick={exportarPDF}>Gerar PDF</button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dados}>
          <XAxis dataKey="DATA" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="ROAS" stroke="#82ca9d" name="ROAS" />
          <Line type="monotone" dataKey="CPC" stroke="#8884d8" name="CPC" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


