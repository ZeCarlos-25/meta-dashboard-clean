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
            return {
              DATA: row.c[0]?.v || "",
              NOME: row.c[1]?.v || "",
              TIPO: row.c[2]?.v || "",
              CPM: parseFloat(row.c[3]?.v || 0),
              CPC: parseFloat(row.c[4]?.v || 0),
              CTR: parseFloat(row.c[5]?.v || 0),
              ROAS: parseFloat(row.c[6]?.v || 0),
            };
          });
          setDados(linhas);
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
          <Line type="monotone" dataKey="ROAS" stroke="#82ca9d" />
          <Line type="monotone" dataKey="CPC" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
