import { useState, useEffect, useRef } from "react";
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
  const [darkMode, setDarkMode] = useState(true);
  const [campanhas, setCampanhas] = useState([]);
  const [modoDemo, setModoDemo] = useState(false);
  const printRef = useRef();

  return (
    <div>
      <h1>Dashboard Meta Ads</h1>
      {/* Gráfico e dados viriam aqui */}
    </div>
  );
}
