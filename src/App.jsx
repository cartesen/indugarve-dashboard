import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ═══════════════════════════════════════════════════════════
// DATEN — aus Indugarve_Final.pbix extrahiert
// ═══════════════════════════════════════════════════════════

const VORGAENGE = [
  { nr:100000, kunde:"Mustermann GmbH", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", belegstatus:"2. Angebotsphase", bereich:"Service", auftragssumme:11927.78, belegsumme:11927.78, matSK:0, montageSK:0, gesamtkosten:0, gewinn:11927.78, status:"Vorgang abgeschlossen ohne Rechnungsstellung" },
  { nr:100000, kunde:"Mustermann GmbH", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", belegstatus:"8. Abrechnungsphase", bereich:"Service", auftragssumme:11927.78, belegsumme:11927.78, matSK:6715.53, montageSK:1205.68, gesamtkosten:7921.21, gewinn:4006.57, status:"Vorgang abgeschlossen ohne Rechnungsstellung" },
  { nr:100001, kunde:"sko GmbH", beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", belegstatus:"8. Abrechnungsphase", bereich:"Service", auftragssumme:25000, belegsumme:18750, matSK:13269.14, montageSK:0, gesamtkosten:13269.14, gewinn:5480.86, status:"Vorgang abgeschlossen mit Rechnungsstellung" },
  { nr:100001, kunde:"sko GmbH", beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", belegstatus:"8. Abrechnungsphase", bereich:"Service", auftragssumme:25000, belegsumme:6250, matSK:0, montageSK:1305, gesamtkosten:1305, gewinn:4945, status:"Vorgang abgeschlossen mit Rechnungsstellung" },
  { nr:100002, kunde:"POC Anlagenbau und Kältetechnik GmbH", beschreibung:"Grundüberholung SVD 3", belegstatus:"6. Auftragsphase", bereich:"Service", auftragssumme:25000, belegsumme:0, matSK:0, montageSK:0, gesamtkosten:0, gewinn:0, status:"In Bearbeitung" },
  { nr:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", belegstatus:"3. Auftragsphase", bereich:"Anlagenbau", auftragssumme:100000, belegsumme:30000, matSK:10801.05, montageSK:5082.25, gesamtkosten:15883.30, gewinn:14116.70, status:"Vorgang Teil abgeschlossen mit Teilrechnung" },
  { nr:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", belegstatus:"5. Projektierung", bereich:"Anlagenbau", auftragssumme:100000, belegsumme:20000, matSK:16420.09, montageSK:10164.50, gesamtkosten:26584.59, gewinn:-6584.59, status:"Vorgang Teil abgeschlossen mit Teilrechnung" },
];

const STUNDEN = [
  { persNr:15, datum:"24.02.2026", name:"Carsten Harmeling", abteilung:"Projektierung VK", vorgang:100000, kunde:"Mustermann GmbH", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", stunden:8.5, reisezeit:2, km:140, status:"Vorgang abgeschlossen" },
  { persNr:11, datum:"24.02.2026", name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", vorgang:100000, kunde:"Mustermann GmbH", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", stunden:2, reisezeit:2, km:140, status:"Vorgang abgeschlossen" },
  { persNr:10, datum:"15.02.2026", name:"Max Mustermann", abteilung:"Servicetechniker VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:5, km:750, status:"In Bearbeitung" },
  { persNr:11, datum:"15.02.2026", name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:5, km:750, status:"In Bearbeitung" },
  { persNr:12, datum:"15.02.2026", name:"Tom Weber", abteilung:"Projektierung VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:0, km:0, status:"In Bearbeitung" },
  { persNr:13, datum:"15.02.2026", name:"Lisa Müller", abteilung:"Elektromontage VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:0, km:0, status:"In Bearbeitung" },
  { persNr:14, datum:"15.02.2026", name:"Jan Peters", abteilung:"Programmierung VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:0, km:0, status:"In Bearbeitung" },
  { persNr:10, datum:"16.02.2026", name:"Max Mustermann", abteilung:"Servicetechniker VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:5, km:750, status:"In Bearbeitung" },
  { persNr:11, datum:"18.02.2026", name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:5, km:750, status:"In Bearbeitung" },
  { persNr:12, datum:"19.02.2026", name:"Tom Weber", abteilung:"Projektierung VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:0, km:0, status:"In Bearbeitung" },
  { persNr:13, datum:"20.02.2026", name:"Lisa Müller", abteilung:"Elektromontage VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:0, km:0, status:"In Bearbeitung" },
  { persNr:14, datum:"21.02.2026", name:"Jan Peters", abteilung:"Programmierung VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:0, km:0, status:"In Bearbeitung" },
  { persNr:10, datum:"17.02.2026", name:"Max Mustermann", abteilung:"Servicetechniker VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:5, km:750, status:"In Bearbeitung" },
  { persNr:15, datum:"26.02.2026", name:"Carsten Harmeling", abteilung:"Projektierung VK", vorgang:100010, kunde:"Fritz AG", beschreibung:"Erweiterung Kälteanlage", stunden:10, reisezeit:0, km:0, status:"In Bearbeitung" },
];

const MITARBEITERSTAMM = [
  { nr:10, name:"Max Mustermann", abteilung:"Servicetechniker VK", kmSK:0.40, kmVK:0.90, reiseSK:50, reiseVK:85, montageSK:51, montageVK:90 },
  { nr:11, name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", kmSK:0.40, kmVK:0.90, reiseSK:50, reiseVK:85, montageSK:51, montageVK:75 },
  { nr:12, name:"Tom Weber", abteilung:"Projektierung VK", kmSK:0.40, kmVK:0.90, reiseSK:50, reiseVK:85, montageSK:51, montageVK:100 },
  { nr:13, name:"Lisa Müller", abteilung:"Elektromontage VK", kmSK:0.40, kmVK:0.90, reiseSK:50, reiseVK:85, montageSK:51, montageVK:80 },
  { nr:14, name:"Jan Peters", abteilung:"Programmierung VK", kmSK:0.40, kmVK:0.90, reiseSK:50, reiseVK:85, montageSK:51, montageVK:110 },
  { nr:15, name:"Carsten Harmeling", abteilung:"Projektierung VK", kmSK:0.40, kmVK:0.90, reiseSK:50, reiseVK:85, montageSK:51, montageVK:100 },
  { nr:16, name:"Sandra Koch", abteilung:"Elektromontage VK", kmSK:0.40, kmVK:0.90, reiseSK:50, reiseVK:85, montageSK:51, montageVK:78 },
];

const MATERIAL = [
  { vorgangNr:100000, beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", status:"Abgeschlossen", disposition:"Lagerentnahme", art:"Vorgangsmaterial", artikel:"IN100904", bezeichnung:"Funktionsmodul ICLX DN 50; 027H5204", me:"Stck", anzahl:2, einstand:1074.15, gesamt:2148.30, kategorie:"ICLX" },
  { vorgangNr:100000, beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", status:"Abgeschlossen", disposition:"Lagerentnahme", art:"Vorgangsmaterial", artikel:"IN100905", bezeichnung:"Kolbenring-Satz Sabroe SMC 108", me:"Stck", anzahl:1, einstand:890.50, gesamt:890.50, kategorie:"Dichtung" },
  { vorgangNr:100000, beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", status:"Abgeschlossen", disposition:"Vorgangsbestellung", art:"Fremdleistung", artikel:"FL-001", bezeichnung:"Reinigung & Inspektion extern", me:"Psch", anzahl:1, einstand:850.00, gesamt:850.00, kategorie:"Fremdleistung" },
  { vorgangNr:100001, beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", status:"Abgeschlossen", disposition:"Lagerentnahme", art:"Vorgangsmaterial", artikel:"MY-200-KIT", bezeichnung:"Überholkit Mycom N200VLD komplett", me:"Stck", anzahl:1, einstand:8500.00, gesamt:8500.00, kategorie:"Überholkit" },
  { vorgangNr:100001, beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", status:"Abgeschlossen", disposition:"Lagerentnahme", art:"Vorgangsmaterial", artikel:"MY-DICHT-01", bezeichnung:"Dichtungssatz Mycom N200", me:"Stck", anzahl:2, einstand:384.57, gesamt:769.14, kategorie:"Dichtung" },
  { vorgangNr:100001, beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", status:"Abgeschlossen", disposition:"Lagerentnahme", art:"Vorgangsmaterial", artikel:"MY-LAGER-01", bezeichnung:"Lager-Set Mycom N200VLD", me:"Stck", anzahl:4, einstand:1000.00, gesamt:4000.00, kategorie:"Lager" },
  { vorgangNr:100010, beschreibung:"Erweiterung Kälteanlage", status:"In Bearbeitung", disposition:"Vorgangsbestellung", art:"Vorgangsmaterial", artikel:"KR-100-SS", bezeichnung:"Kälterohr DN 100 Edelstahl 6m", me:"m", anzahl:50, einstand:85.50, gesamt:4275.00, kategorie:"Rohrleitungen" },
  { vorgangNr:100010, beschreibung:"Erweiterung Kälteanlage", status:"In Bearbeitung", disposition:"Vorgangsbestellung", art:"Vorgangsmaterial", artikel:"ISO-50", bezeichnung:"Isolierung Armaflex 50mm", me:"m²", anzahl:120, einstand:35.00, gesamt:4200.00, kategorie:"Isolierung" },
  { vorgangNr:100010, beschreibung:"Erweiterung Kälteanlage", status:"In Bearbeitung", disposition:"Lagerentnahme", art:"Vorgangsmaterial", artikel:"BELIMO-N4", bezeichnung:"Belimo Regelventil N4-230VAC", me:"Stck", anzahl:4, einstand:580.00, gesamt:2320.00, kategorie:"Belimo" },
  { vorgangNr:100010, beschreibung:"Erweiterung Kälteanlage", status:"In Bearbeitung", disposition:"Vorgangsbestellung", art:"Fremdleistung", artikel:"FL-002", bezeichnung:"Elektroinstallation extern", me:"Psch", anzahl:1, einstand:5200.00, gesamt:5200.00, kategorie:"Fremdleistung" },
  { vorgangNr:100010, beschreibung:"Erweiterung Kälteanlage", status:"In Bearbeitung", disposition:"Vorgangsbestellung", art:"Vorgangsmaterial", artikel:"ICS-100", bezeichnung:"ICS Regulierventil DN 100", me:"Stck", anzahl:2, einstand:1760.05, gesamt:3520.09, kategorie:"ICS" },
];

const EINGANGSRECHNUNGEN = [
  { eingang:"02.03.2026", kommNr:"Büro", lieferant:"Klarsicht IT GmbH", rgNr:"6096186", materialart:"sonst. Artikel u. Leistungen", rgNetto:1381.43, rgBrutto:1643.90, zahlDatum:"03.03.2026", buchungsvermerk:"bezahlt" },
  { eingang:"03.03.2026", kommNr:"100010", lieferant:"Klarsicht IT GmbH", rgNr:"7182341", materialart:"Fremdleistung", rgNetto:2450.00, rgBrutto:2915.50, zahlDatum:"17.03.2026", buchungsvermerk:"offen" },
  { eingang:"05.03.2026", kommNr:"100010", lieferant:"Danfoss GmbH", rgNr:"DN-2026-0892", materialart:"Material", rgNetto:12650.00, rgBrutto:15053.50, zahlDatum:"02.04.2026", buchungsvermerk:"offen" },
  { eingang:"06.03.2026", kommNr:"100000", lieferant:"Kälte Rohr Technik GmbH", rgNr:"KRT-2026-441", materialart:"Material", rgNetto:3890.60, rgBrutto:4630.81, zahlDatum:"05.04.2026", buchungsvermerk:"offen" },
  { eingang:"07.03.2026", kommNr:"100001", lieferant:"Danfoss GmbH", rgNr:"DN-2026-0901", materialart:"Material", rgNetto:5200.00, rgBrutto:6188.00, zahlDatum:"05.04.2026", buchungsvermerk:"offen" },
];

const ERSATZTEILE = [
  { artikelNr:"IN100904", bezeichnung:"Funktionsmodul ICLX DN 50", lieferantenArtNr:"027H5204", me:"Stck", warengruppe:"Ventile", brutto:1528.42, rabatt:0.30, einstand:1074.15, einkauf:850.00, kategorie:"ICLX", lager:"Hauptlager", lagerort:"Regal A-12", bestand:4, meldebestand:2, mindestbestand:1 },
  { artikelNr:"IN100905", bezeichnung:"Kolbenring-Satz Sabroe SMC 108", lieferantenArtNr:"SAB-CR-108", me:"Stck", warengruppe:"Dichtungen", brutto:1200.00, rabatt:0.26, einstand:890.50, einkauf:720.00, kategorie:"Dichtung", lager:"Hauptlager", lagerort:"Regal B-03", bestand:3, meldebestand:2, mindestbestand:1 },
  { artikelNr:"BELIMO-N4", bezeichnung:"Belimo Regelventil N4-230VAC", lieferantenArtNr:"N4-230A", me:"Stck", warengruppe:"Armaturen", brutto:780.00, rabatt:0.26, einstand:580.00, einkauf:480.00, kategorie:"Belimo", lager:"Hauptlager", lagerort:"Regal C-07", bestand:8, meldebestand:4, mindestbestand:2 },
  { artikelNr:"ICS-100", bezeichnung:"ICS Regulierventil DN 100", lieferantenArtNr:"ICS100-SH90", me:"Stck", warengruppe:"Ventile", brutto:2200.00, rabatt:0.20, einstand:1760.05, einkauf:1500.00, kategorie:"ICS", lager:"Hauptlager", lagerort:"Regal A-08", bestand:2, meldebestand:2, mindestbestand:1 },
  { artikelNr:"ISO-50", bezeichnung:"Isolierung Armaflex 50mm", lieferantenArtNr:"AF-50-2M", me:"m²", warengruppe:"Isolierung", brutto:48.00, rabatt:0.27, einstand:35.00, einkauf:28.00, kategorie:"Isolierung", lager:"Außenlager", lagerort:"Regal D-01", bestand:250, meldebestand:100, mindestbestand:50 },
  { artikelNr:"KR-100-SS", bezeichnung:"Kälterohr DN 100 Edelstahl 6m", lieferantenArtNr:"KR-SS100-6", me:"m", warengruppe:"Rohrleitungen", brutto:115.00, rabatt:0.26, einstand:85.50, einkauf:70.00, kategorie:"Rohrleitungen", lager:"Außenlager", lagerort:"Regal D-05", bestand:120, meldebestand:60, mindestbestand:30 },
  { artikelNr:"VERTEILER-6", bezeichnung:"Kältemittelverteiler 6-fach Danfoss", lieferantenArtNr:"VDF-6-DN", me:"Stck", warengruppe:"Verteiler", brutto:1680.00, rabatt:0.26, einstand:1250.00, einkauf:1000.00, kategorie:"Verteiler", lager:"Hauptlager", lagerort:"Regal A-15", bestand:3, meldebestand:2, mindestbestand:1 },
  { artikelNr:"MY-200-KIT", bezeichnung:"Überholkit Mycom N200VLD komplett", lieferantenArtNr:"MYC-N200-OHK", me:"Stck", warengruppe:"Überholkits", brutto:11000.00, rabatt:0.23, einstand:8500.00, einkauf:7000.00, kategorie:"Überholkit", lager:"Hauptlager", lagerort:"Regal B-10", bestand:1, meldebestand:1, mindestbestand:1 },
  { artikelNr:"MY-DICHT-01", bezeichnung:"Dichtungssatz Mycom N200", lieferantenArtNr:"MYC-DS-N200", me:"Stck", warengruppe:"Dichtungen", brutto:520.00, rabatt:0.26, einstand:384.57, einkauf:310.00, kategorie:"Dichtung", lager:"Hauptlager", lagerort:"Regal B-04", bestand:6, meldebestand:3, mindestbestand:2 },
  { artikelNr:"MY-LAGER-01", bezeichnung:"Lager-Set Mycom N200VLD", lieferantenArtNr:"MYC-LS-N200", me:"Stck", warengruppe:"Lager", brutto:1350.00, rabatt:0.26, einstand:1000.00, einkauf:820.00, kategorie:"Lager", lager:"Hauptlager", lagerort:"Regal B-06", bestand:4, meldebestand:2, mindestbestand:1 },
];

const KUNDENDATENBANK = [
  { name:"Mustermann GmbH", umsatzquote:98860, potenzial:300000 },
  { name:"sko GmbH", umsatzquote:25000, potenzial:180000 },
  { name:"Meyer GmbH & Co. KG", umsatzquote:8000, potenzial:350000 },
  { name:"Müller GmbH", umsatzquote:12000, potenzial:250000 },
  { name:"Axol GmbH", umsatzquote:3500, potenzial:120000 },
  { name:"Cooling World GmbH", umsatzquote:15000, potenzial:200000 },
  { name:"POC Anlagenbau", umsatzquote:0, potenzial:180000 },
  { name:"Fritz AG", umsatzquote:50000, potenzial:400000 },
];

const KALK_NACHKALK = [
  { vorgangNr:100000, kalkGewinn:1926.90, nachkalkGewinn:1302.32 },
  { vorgangNr:100001, kalkGewinn:3500.00, nachkalkGewinn:1990.37 },
  { vorgangNr:100010, kalkGewinn:8000.00, nachkalkGewinn:4116.70 },
];

// ═══════════════════════════════════════════════════════════
// FARBEN & UTILS
// ═══════════════════════════════════════════════════════════
const C = { teal:"#00d4aa", blue:"#4facfe", orange:"#ff9a3c", purple:"#a78bfa", yellow:"#fbbf24", green:"#34d399", cyan:"#22d3ee", red:"#ff4d6d" };
const PC = [C.teal, C.blue, C.orange, C.purple, C.yellow, C.green, C.cyan, C.red];
const BG = { page:"#0a0f1e", visual:"#0f1627", card:"#111827", border:"#1a2540" };

const fmt  = (v, d=0) => typeof v==="number" ? new Intl.NumberFormat("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d}).format(v) : "–";
const fEur = (v) => fmt(v,2) + " €";
const fPct = (v) => typeof v==="number" ? fmt(v,1) + " %" : "–";

const TABS = [
  { id:"uebersicht",  label:"Übersicht",              icon:"◈" },
  { id:"vorgaenge",   label:"Vorgänge",               icon:"▤" },
  { id:"stunden",     label:"Stundenerfassung",        icon:"◷" },
  { id:"material",    label:"Materialerfassung",       icon:"◫" },
  { id:"einkauf",     label:"Einkauf",                 icon:"◻" },
  { id:"ersatzteile", label:"Ersatzteilliste / Lager", icon:"⚙" },
];

// ═══════════════════════════════════════════════════════════
// BASIS-KOMPONENTEN
// ═══════════════════════════════════════════════════════════
const KPI = ({ label, value, sub, color, icon, delay=0 }) => (
  <div style={{
    background: BG.card, borderRadius:12, padding:"16px 18px", flex:1, minWidth:150,
    border:`2px solid ${color}`, position:"relative", overflow:"hidden",
    animation:`fadeUp 0.45s ease ${delay}s both`, cursor:"default",
    transition:"transform 0.2s",
  }}
    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
  >
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)`}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
      <span style={{fontSize:10,color:"#6b7280",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</span>
      <span style={{fontSize:15}}>{icon}</span>
    </div>
    <div style={{fontSize:22,fontWeight:700,color,fontFamily:"'JetBrains Mono',monospace,sans-serif",lineHeight:1.2}}>{value}</div>
    {sub && <div style={{fontSize:11,color:"#6b7280",marginTop:5}}>{sub}</div>}
    <div style={{position:"absolute",bottom:-18,right:-18,width:55,height:55,borderRadius:"50%",background:color,opacity:0.05}}/>
  </div>
);

const Card = ({ children, title }) => (
  <div style={{background:BG.visual,borderRadius:12,border:`1px solid ${BG.border}`,padding:"14px 16px"}}>
    {title && <div style={{fontSize:10,color:"#6b7280",fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${BG.border}`}}>{title}</div>}
    {children}
  </div>
);

const Slicer = ({ label, options, value, onChange }) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:5,alignItems:"center"}}>
    <span style={{fontSize:10,color:"#6b7280",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginRight:2}}>{label}:</span>
    {["Alle",...options].map(opt => {
      const val = opt==="Alle" ? "" : opt;
      const active = value===val;
      return (
        <button key={opt} onClick={()=>onChange(val)} style={{
          padding:"3px 10px",borderRadius:6,fontSize:11,cursor:"pointer",
          background: active ? "rgba(168,139,250,0.12)" : "transparent",
          border: active ? `1px solid ${C.purple}` : `1px solid #2a3a55`,
          color: active ? C.purple : "#9ca3af",
          fontFamily:"inherit", transition:"all 0.15s",
        }}>{opt}</button>
      );
    })}
  </div>
);

const SearchBox = ({ label, value, onChange, placeholder }) => (
  <div style={{display:"flex",alignItems:"center",gap:7}}>
    <span style={{fontSize:10,color:"#6b7280",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}:</span>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Suchen…"}
      style={{padding:"4px 10px",borderRadius:6,background:"#0a1520",border:`1px solid ${BG.border}`,color:"#e2e8f0",fontSize:11,fontFamily:"inherit",outline:"none",width:150}}/>
  </div>
);

const TH = ({children, color=C.teal}) => (
  <th style={{padding:"8px 11px",textAlign:"left",fontSize:10,fontWeight:700,color,letterSpacing:"0.08em",textTransform:"uppercase",borderBottom:`2px solid ${color}`,background:"#080e1c",whiteSpace:"nowrap"}}>{children}</th>
);
const TD = ({children, color="#e2e8f0", mono=false}) => (
  <td style={{padding:"7px 11px",fontSize:11,color,fontFamily:mono?"'JetBrains Mono',monospace,sans-serif":"inherit",borderBottom:`1px solid ${BG.border}`}}>{children}</td>
);

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#0d1627",border:`1px solid ${BG.border}`,borderRadius:8,padding:"9px 13px",fontSize:11}}>
      {label && <div style={{color:"#9ca3af",marginBottom:5,fontSize:10}}>{label}</div>}
      {payload.map((p,i) => (
        <div key={i} style={{display:"flex",gap:7,alignItems:"center",marginBottom:2}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:p.color||p.fill}}/>
          <span style={{color:"#9ca3af"}}>{p.name}:</span>
          <span style={{color:"#e2e8f0",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{typeof p.value==="number"?fmt(p.value,2)+" €":p.value}</span>
        </div>
      ))}
    </div>
  );
};

const TotalsRow = ({ cols }) => (
  <tr style={{background:"#0a1520"}}>
    {cols.map((c,i) => (
      <td key={i} style={{padding:"8px 11px",color:c.color||C.teal,fontFamily:c.mono?"'JetBrains Mono',monospace,sans-serif":"inherit",fontSize:11,fontWeight:700,borderTop:`1px solid ${C.teal}`,colSpan:c.span}}>{c.text||""}</td>
    ))}
  </tr>
);

// ═══════════════════════════════════════════════════════════
// SEITE 1: ÜBERSICHT
// ═══════════════════════════════════════════════════════════
function PageUebersicht() {
  const [bereich, setBereich] = useState("");
  const [vorgang, setVorgang] = useState("");

  const fv = VORGAENGE.filter(v =>
    (!bereich || v.bereich===bereich) &&
    (!vorgang || String(v.nr).includes(vorgang))
  );

  const umsatz  = fv.reduce((s,v)=>s+v.belegsumme,0);
  const kosten  = fv.reduce((s,v)=>s+v.gesamtkosten,0);
  const gewinn  = fv.reduce((s,v)=>s+v.gewinn,0);
  const abg     = [...new Set(fv.filter(v=>v.status.includes("abgeschlossen")).map(v=>v.nr))].length;
  const marge   = umsatz>0 ? gewinn/umsatz*100 : 0;
  const matSK   = fv.reduce((s,v)=>s+v.matSK,0);
  const montSK  = fv.reduce((s,v)=>s+v.montageSK,0);

  const chartData = Object.entries(fv.reduce((a,v)=>{
    if (!a[v.kunde]) a[v.kunde]={umsatz:0,kosten:0,gewinn:0};
    a[v.kunde].umsatz+=v.belegsumme; a[v.kunde].kosten+=v.gesamtkosten; a[v.kunde].gewinn+=v.gewinn;
    return a;
  },{})).map(([k,v])=>({name:k.split(" ")[0],...v})).filter(d=>d.umsatz>0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
        <Slicer label="Bereich / KPI" options={["Service","Anlagenbau"]} value={bereich} onChange={setBereich}/>
        <SearchBox label="Vorgangsnummer" value={vorgang} onChange={setVorgang} placeholder="z.B. 100010"/>
      </div>
      <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        <KPI label="Gesamtumsatz" value={fEur(umsatz)} sub={`${abg} abgeschlossene Vorgänge`} color={C.blue} icon="💰" delay={0}/>
        <KPI label="Gesamtgewinn" value={fEur(gewinn)} sub={`Ø Marge: ${fPct(marge)}`} color={gewinn>=0?C.teal:C.red} icon="📈" delay={0.05}/>
        <KPI label="Gesamtkosten" value={fEur(kosten)} sub={`Material ${fEur(matSK)} · Montage ${fEur(montSK)}`} color={C.orange} icon="💸" delay={0.1}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card title="Gesamtumsatz, Gesamtkosten und Gesamtgewinn nach Kundenname">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={chartData} margin={{top:4,right:6,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={BG.border} vertical={false}/>
              <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#4b5563",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}T`:v}/>
              <Tooltip content={<Tip/>}/>
              <Legend iconType="circle" wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
              <Bar dataKey="umsatz" name="Gesamtumsatz" fill={C.blue} radius={[4,4,0,0]}/>
              <Bar dataKey="kosten" name="Gesamtkosten" fill={C.orange} radius={[4,4,0,0]}/>
              <Bar dataKey="gewinn" name="Gesamtgewinn" fill={C.teal} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Umsatzquote vs. Kundenpotenzial">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={KUNDENDATENBANK.sort((a,b)=>b.potenzial-a.potenzial)} layout="vertical" margin={{top:4,right:6,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={BG.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:"#4b5563",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}T`}/>
              <YAxis dataKey="name" type="category" tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} width={80} tickFormatter={n=>n.split(" ")[0]}/>
              <Tooltip content={<Tip/>}/>
              <Legend iconType="circle" wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
              <Bar dataKey="umsatzquote" name="bisherige Umsatzquote in €" fill={C.teal} radius={[0,4,4,0]}/>
              <Bar dataKey="potenzial" name="Umsatzpotential in €" fill={C.blue} radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card title="Gewinn Kalkulation vs. Gewinn Nachkalkulation nach Vorgangsnummer">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={KALK_NACHKALK.map(k=>({name:String(k.vorgangNr),"Gewinn Kalkulation":k.kalkGewinn,"Gewinn Nachkalkulation":k.nachkalkGewinn}))} margin={{top:4,right:6,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BG.border} vertical={false}/>
            <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#4b5563",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}T`:v}/>
            <Tooltip content={<Tip/>}/>
            <Legend iconType="circle" wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
            <Bar dataKey="Gewinn Kalkulation" fill={C.teal} radius={[4,4,0,0]}/>
            <Bar dataKey="Gewinn Nachkalkulation" fill={C.blue} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SEITE 2: VORGÄNGE
// ═══════════════════════════════════════════════════════════
function PageVorgaenge() {
  const [statusF, setStatusF] = useState("");
  const [vorgangF, setVorgangF] = useState("");

  const fv = VORGAENGE.filter(v =>
    (!statusF || v.belegstatus.includes(statusF)) &&
    (!vorgangF || String(v.nr).includes(vorgangF))
  );

  const umsatz = fv.reduce((s,v)=>s+v.belegsumme,0);
  const kosten = fv.reduce((s,v)=>s+v.gesamtkosten,0);
  const gewinn = fv.reduce((s,v)=>s+v.gewinn,0);
  const offene = [...new Set(fv.filter(v=>v.status.includes("Bearbeitung")).map(v=>v.nr))].length;

  const totalSt = STUNDEN.reduce((s,v)=>s+v.stunden,0);
  const totalRe = STUNDEN.reduce((s,v)=>s+v.reisezeit,0);
  const totalKm = STUNDEN.reduce((s,v)=>s+v.km,0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
        <SearchBox label="Vorgangsnummer" value={vorgangF} onChange={setVorgangF} placeholder="z.B. 100010"/>
        <Slicer label="Belegstatus" options={["Angebotsphase","Auftragsphase","Abrechnungsphase","Projektierung"]} value={statusF} onChange={setStatusF}/>
      </div>
      <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        <KPI label="Gesamtumsatz" value={fEur(umsatz)} color={C.blue} icon="💰" delay={0}/>
        <KPI label="Gesamtgewinn" value={fEur(gewinn)} color={gewinn>=0?C.teal:C.red} icon="📈" delay={0.05}/>
        <KPI label="Gesamtkosten" value={fEur(kosten)} color={C.orange} icon="💸" delay={0.1}/>
        <KPI label="Offene Aufträge" value={offene} sub="In Bearbeitung" color={C.yellow} icon="📋" delay={0.15}/>
        <KPI label="Stunden · Reise · km" value={`${fmt(totalSt,1)} h`} sub={`${fmt(totalRe,1)} h Reise · ${fmt(totalKm)} km`} color={C.purple} icon="⏱" delay={0.2}/>
      </div>
      <Card title="Vorgänge — Übersicht">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <TH>Vorgang-Nr.</TH><TH>Kunde</TH><TH>Beschreibung</TH><TH>Belegstatus</TH>
              <TH>Belegsumme netto</TH><TH>Montage SK</TH><TH>Material SK</TH><TH>Gewinn</TH><TH>Auftragssumme</TH>
            </tr></thead>
            <tbody>
              {fv.map((v,i) => (
                <tr key={i} style={{background:i%2===0?BG.visual:BG.card}}>
                  <TD color={C.cyan} mono>{v.nr}</TD>
                  <TD>{v.kunde.split(" ")[0]}</TD>
                  <TD color="#9ca3af">{v.beschreibung.length>36?v.beschreibung.slice(0,36)+"…":v.beschreibung}</TD>
                  <TD color="#9ca3af">{v.belegstatus}</TD>
                  <TD color={C.blue} mono>{fEur(v.belegsumme)}</TD>
                  <TD color={C.orange} mono>{fEur(v.montageSK)}</TD>
                  <TD color={C.orange} mono>{fEur(v.matSK)}</TD>
                  <TD color={v.gewinn>=0?C.teal:C.red} mono>{fEur(v.gewinn)}</TD>
                  <TD color={C.blue} mono>{fEur(v.auftragssumme)}</TD>
                </tr>
              ))}
              <TotalsRow cols={[
                {text:"GESAMT",color:C.teal},{text:""},{text:""},{text:""},
                {text:fEur(umsatz),color:C.blue,mono:true},
                {text:fEur(fv.reduce((s,v)=>s+v.montageSK,0)),color:C.orange,mono:true},
                {text:fEur(fv.reduce((s,v)=>s+v.matSK,0)),color:C.orange,mono:true},
                {text:fEur(gewinn),color:gewinn>=0?C.teal:C.red,mono:true},
                {text:""},
              ]}/>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SEITE 3: STUNDENERFASSUNG
// ═══════════════════════════════════════════════════════════
function PageStunden() {
  const [abtF, setAbtF] = useState("");
  const [persF, setPersF] = useState("");
  const [vorgF, setVorgF] = useState("");

  const fs = STUNDEN.filter(s =>
    (!abtF || s.abteilung===abtF) &&
    (!persF || String(s.persNr).includes(persF)) &&
    (!vorgF || String(s.vorgang).includes(vorgF))
  );

  const fSt = fs.reduce((s,v)=>s+v.stunden,0);
  const fRe = fs.reduce((s,v)=>s+v.reisezeit,0);
  const fKm = fs.reduce((s,v)=>s+v.km,0);

  const pieData = Object.entries(
    fs.reduce((a,s)=>{a[s.abteilung]=(a[s.abteilung]||0)+s.stunden;return a;},{})
  ).map(([name,value])=>({name:name.replace(" VK",""),value}));

  const abtOptions = [...new Set(STUNDEN.map(s=>s.abteilung))];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
        <Slicer label="Abteilung" options={abtOptions.map(a=>a.replace(" VK",""))} value={abtF.replace(" VK","")} onChange={v=>setAbtF(v?v+" VK":"")}/>
        <SearchBox label="Personalnummer" value={persF} onChange={setPersF} placeholder="z.B. 10"/>
        <SearchBox label="Vorgangsnummer" value={vorgF} onChange={setVorgF} placeholder="z.B. 100010"/>
      </div>
      <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        <KPI label="Summe Stunden" value={`${fmt(fSt,1)} h`} color={C.yellow} icon="⏱" delay={0}/>
        <KPI label="Summe Reisezeit" value={`${fmt(fRe,1)} h`} color={C.purple} icon="🚗" delay={0.05}/>
        <KPI label="Summe Kilometer" value={`${fmt(fKm)} km`} color={C.cyan} icon="📍" delay={0.1}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
        <Card title="Stundenerfassung — Detail">
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <TH>Mitarbeiter</TH><TH>Vorgang</TH><TH>Datum</TH>
                <TH>Stunden</TH><TH>Reisezeit</TH><TH>km</TH><TH>Beschreibung</TH><TH>Kunde</TH><TH>Status</TH>
              </tr></thead>
              <tbody>
                {fs.map((s,i)=>(
                  <tr key={i} style={{background:i%2===0?BG.visual:BG.card}}>
                    <TD>{s.name.split(" ")[0]}</TD>
                    <TD color={C.cyan} mono>{s.vorgang}</TD>
                    <TD color="#9ca3af" mono>{s.datum}</TD>
                    <TD color={C.yellow} mono>{fmt(s.stunden,1)}</TD>
                    <TD color={C.purple} mono>{fmt(s.reisezeit,1)}</TD>
                    <TD color={C.cyan} mono>{fmt(s.km)}</TD>
                    <TD color="#6b7280">{s.beschreibung.length>28?s.beschreibung.slice(0,28)+"…":s.beschreibung}</TD>
                    <TD color="#9ca3af">{s.kunde.split(" ")[0]}</TD>
                    <TD color={s.status.includes("abgeschlossen")?C.teal:C.yellow}>{s.status.includes("abgeschlossen")?"✓":"●"}</TD>
                  </tr>
                ))}
                <TotalsRow cols={[{text:"GESAMT",color:C.teal},{text:""},{text:""},
                  {text:fmt(fSt,1),color:C.yellow,mono:true},{text:fmt(fRe,1),color:C.purple,mono:true},
                  {text:fmt(fKm),color:C.cyan,mono:true},{text:""},{text:""},{text:""}]}/>
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Stunden nach Abteilung">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={2}>
                {pieData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
              </Pie>
              <Tooltip content={<Tip/>}/>
              <Legend iconType="circle" wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card title="Mitarbeiterstamm — Stundensätze">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <TH>Personal-Nr.</TH><TH>Name</TH><TH>Abteilung</TH>
              <TH>km SK</TH><TH>km VK</TH><TH>Reise SK</TH><TH>Reise VK</TH><TH>Montage SK</TH><TH>Montage VK</TH>
            </tr></thead>
            <tbody>
              {MITARBEITERSTAMM.map((m,i)=>(
                <tr key={i} style={{background:i%2===0?BG.visual:BG.card}}>
                  <TD color={C.cyan} mono>{m.nr}</TD>
                  <TD>{m.name}</TD>
                  <TD color="#9ca3af">{m.abteilung}</TD>
                  <TD color={C.orange} mono>{fmt(m.kmSK,2)} €</TD>
                  <TD color={C.blue} mono>{fmt(m.kmVK,2)} €</TD>
                  <TD color={C.orange} mono>{fmt(m.reiseSK)} €</TD>
                  <TD color={C.blue} mono>{fmt(m.reiseVK)} €</TD>
                  <TD color={C.orange} mono>{fmt(m.montageSK)} €</TD>
                  <TD color={C.blue} mono>{fmt(m.montageVK)} €</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SEITE 4: MATERIALERFASSUNG
// ═══════════════════════════════════════════════════════════
function PageMaterial() {
  const [disposF, setDisposF] = useState("");
  const [artF, setArtF] = useState("");
  const [vorgF, setVorgF] = useState("");
  const [artikelF, setArtikelF] = useState("");

  const fm = MATERIAL.filter(m =>
    (!disposF || m.disposition===disposF) &&
    (!artF || m.art===artF) &&
    (!vorgF || String(m.vorgangNr).includes(vorgF)) &&
    (!artikelF || m.artikel.toLowerCase().includes(artikelF.toLowerCase()))
  );

  const gesamt = fm.reduce((s,m)=>s+m.gesamt,0);
  const donutData = Object.entries(fm.reduce((a,m)=>{a[m.kategorie]=(a[m.kategorie]||0)+m.gesamt;return a;},{}))
    .map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
        <Slicer label="Materialdisposition" options={["Lagerentnahme","Vorgangsbestellung"]} value={disposF} onChange={setDisposF}/>
        <Slicer label="Materialart" options={["Vorgangsmaterial","Fremdleistung"]} value={artF} onChange={setArtF}/>
        <SearchBox label="Vorgangsnummer" value={vorgF} onChange={setVorgF} placeholder="z.B. 100010"/>
        <SearchBox label="Artikel" value={artikelF} onChange={setArtikelF} placeholder="Artikelnummer"/>
      </div>
      <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        <KPI label="Material Fremdkosten Gesamt" value={fEur(gesamt)} sub={`${fm.length} Positionen`} color={C.teal} icon="📦" delay={0}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
        <Card title="Materialerfassung — Detail">
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <TH>Vorgang-Nr.</TH><TH>Artikel</TH><TH>Bezeichnung</TH><TH>Materialart</TH>
                <TH>Anzahl</TH><TH>ME</TH><TH>EP</TH><TH>EP Gesamt</TH><TH>Kategorie</TH><TH>Disposition</TH><TH>Status</TH>
              </tr></thead>
              <tbody>
                {fm.map((m,i)=>(
                  <tr key={i} style={{background:i%2===0?BG.visual:BG.card}}>
                    <TD color={C.cyan} mono>{m.vorgangNr}</TD>
                    <TD color={C.cyan} mono>{m.artikel}</TD>
                    <TD color="#9ca3af">{m.bezeichnung.length>28?m.bezeichnung.slice(0,28)+"…":m.bezeichnung}</TD>
                    <TD color="#9ca3af">{m.art}</TD>
                    <TD color={C.blue} mono>{fmt(m.anzahl)}</TD>
                    <TD color="#6b7280">{m.me}</TD>
                    <TD color={C.orange} mono>{fEur(m.einstand)}</TD>
                    <TD color={C.orange} mono>{fEur(m.gesamt)}</TD>
                    <TD color={C.purple}>{m.kategorie}</TD>
                    <TD color="#6b7280">{m.disposition}</TD>
                    <TD color={m.status==="Abgeschlossen"?C.teal:C.yellow}>{m.status==="Abgeschlossen"?"✓":"●"}</TD>
                  </tr>
                ))}
                <TotalsRow cols={[{text:"GESAMT MATERIALKOSTEN (SK)",color:C.teal},{text:""},{text:""},{text:""},
                  {text:""},{text:""},{text:""},{text:fEur(gesamt),color:C.teal,mono:true},{text:""},{text:""},{text:""}]}/>
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Einstandspreis Gesamt nach Materialkategorie">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={105} innerRadius={52} paddingAngle={2}>
                {donutData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
              </Pie>
              <Tooltip content={<Tip/>}/>
              <Legend iconType="circle" wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SEITE 5: EINKAUF
// ═══════════════════════════════════════════════════════════
function PageEinkauf() {
  const [kommF, setKommF] = useState("");
  const [lieferF, setLieferF] = useState("");
  const [artF, setArtF] = useState("");

  const fe = EINGANGSRECHNUNGEN.filter(r =>
    (!kommF || r.kommNr.toLowerCase().includes(kommF.toLowerCase())) &&
    (!lieferF || r.lieferant.toLowerCase().includes(lieferF.toLowerCase())) &&
    (!artF || r.materialart===artF)
  );

  const netto  = fe.reduce((s,r)=>s+r.rgNetto,0);
  const brutto = fe.reduce((s,r)=>s+r.rgBrutto,0);
  const offen  = fe.filter(r=>r.buchungsvermerk==="offen").length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
        <SearchBox label="Komm.-Nr." value={kommF} onChange={setKommF} placeholder="z.B. 100010"/>
        <SearchBox label="Liefer.-Nr." value={lieferF} onChange={setLieferF} placeholder="Lieferant"/>
        <Slicer label="Materialart" options={["Material","Fremdleistung","sonst. Artikel u. Leistungen"]} value={artF} onChange={setArtF}/>
      </div>
      <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        <KPI label="RG-netto gesamt" value={fEur(netto)} sub={`${fe.length} Rechnungen`} color={C.teal} icon="🧾" delay={0}/>
        <KPI label="RG-brutto gesamt" value={fEur(brutto)} sub="inkl. MwSt." color={C.blue} icon="💶" delay={0.05}/>
        <KPI label="Offene Posten" value={offen} sub="nicht bezahlt" color={offen>0?C.orange:C.teal} icon="⚠" delay={0.1}/>
      </div>
      <Card title="Eingangsrechnungen — Übersicht">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <TH>Eingang</TH><TH>Komm.-Nr.</TH><TH>Lieferant</TH><TH>RG./GS.-Nr.</TH>
              <TH>Materialart</TH><TH>RG-netto</TH><TH>RG-brutto</TH><TH>Zahldatum / Abbuchung</TH><TH>Buchungsvermerk</TH>
            </tr></thead>
            <tbody>
              {fe.map((r,i)=>(
                <tr key={i} style={{background:i%2===0?BG.visual:BG.card}}>
                  <TD color="#9ca3af" mono>{r.eingang}</TD>
                  <TD color={C.cyan} mono>{r.kommNr}</TD>
                  <TD>{r.lieferant}</TD>
                  <TD color={C.cyan} mono>{r.rgNr}</TD>
                  <TD color="#9ca3af">{r.materialart}</TD>
                  <TD color={C.orange} mono>{fEur(r.rgNetto)}</TD>
                  <TD color={C.blue} mono>{fEur(r.rgBrutto)}</TD>
                  <TD color="#9ca3af" mono>{r.zahlDatum}</TD>
                  <TD color={r.buchungsvermerk==="bezahlt"?C.teal:C.orange}>{r.buchungsvermerk}</TD>
                </tr>
              ))}
              <TotalsRow cols={[{text:"GESAMT"},{text:""},{text:""},{text:""},{text:""},
                {text:fEur(netto),color:C.teal,mono:true},{text:fEur(brutto),color:C.blue,mono:true},{text:""},{text:""}]}/>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SEITE 6: ERSATZTEILLISTE / LAGERHALTUNG
// ═══════════════════════════════════════════════════════════
function PageErsatzteile() {
  const [katF, setKatF] = useState("");
  const [lagerF, setLagerF] = useState("");
  const [artikelF, setArtikelF] = useState("");

  const fe = ERSATZTEILE.filter(e =>
    (!katF || e.kategorie===katF) &&
    (!lagerF || e.lager===lagerF) &&
    (!artikelF || e.artikelNr.toLowerCase().includes(artikelF.toLowerCase()))
  );

  const bestand   = fe.reduce((s,e)=>s+e.bestand,0);
  const melde     = fe.reduce((s,e)=>s+e.meldebestand,0);
  const mindest   = fe.reduce((s,e)=>s+e.mindestbestand,0);
  const lagername = [...new Set(fe.map(e=>e.lager))].join(", ") || "–";
  const lagerort  = [...new Set(fe.map(e=>e.lagerort))].slice(0,2).join(", ") || "–";

  const katOptions   = [...new Set(ERSATZTEILE.map(e=>e.kategorie))];
  const lagerOptions = [...new Set(ERSATZTEILE.map(e=>e.lager))];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
        <Slicer label="Materialkategorie" options={katOptions} value={katF} onChange={setKatF}/>
        <Slicer label="Lagername" options={lagerOptions} value={lagerF} onChange={setLagerF}/>
        <SearchBox label="Artikelnummer" value={artikelF} onChange={setArtikelF} placeholder="z.B. ICS-100"/>
      </div>
      <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        <KPI label="Lagerinfo Bestand" value={fmt(bestand)} sub="Stück gesamt" color={C.teal} icon="📦" delay={0}/>
        <KPI label="Lagerinfo Meldebestand" value={fmt(melde)} sub="Nachbestellgrenze" color={C.yellow} icon="⚠" delay={0.05}/>
        <KPI label="Lagerinfo Mindestbestand" value={fmt(mindest)} sub="Kritische Grenze" color={C.orange} icon="🔴" delay={0.1}/>
        <KPI label="Lagerinfo Lagername" value={lagername} sub={`${fe.length} Artikel`} color={C.blue} icon="🏭" delay={0.15}/>
        <KPI label="Lagerinfo Lagerort" value={lagerort} sub="Regalposition" color={C.purple} icon="📍" delay={0.2}/>
      </div>
      <Card title="Ersatzteilliste — Lagerhaltung">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <TH>Artikel-Nr.</TH><TH>Bezeichnung</TH><TH>Lieferanten-Art.-Nr.</TH><TH>ME</TH>
              <TH>Warengruppe</TH><TH>Brutto</TH><TH>Rabatt</TH><TH>EP</TH><TH>Einkauf</TH>
              <TH>Kategorie</TH><TH>Lager</TH><TH>Lagerort</TH><TH>Bestand</TH><TH>Mindest</TH><TH>Melde</TH>
            </tr></thead>
            <tbody>
              {fe.map((e,i)=>{
                const krit = e.bestand<=e.mindestbestand;
                const warn = e.bestand<=e.meldebestand && !krit;
                return (
                  <tr key={i} style={{background:i%2===0?BG.visual:BG.card}}>
                    <TD color={C.cyan} mono>{e.artikelNr}</TD>
                    <TD>{e.bezeichnung.length>26?e.bezeichnung.slice(0,26)+"…":e.bezeichnung}</TD>
                    <TD color={C.cyan} mono>{e.lieferantenArtNr}</TD>
                    <TD color="#6b7280">{e.me}</TD>
                    <TD color="#9ca3af">{e.warengruppe}</TD>
                    <TD color={C.blue} mono>{fEur(e.brutto)}</TD>
                    <TD color={C.orange} mono>{fPct(e.rabatt*100)}</TD>
                    <TD color={C.orange} mono>{fEur(e.einstand)}</TD>
                    <TD color={C.teal} mono>{fEur(e.einkauf)}</TD>
                    <TD color={C.purple}>{e.kategorie}</TD>
                    <TD color="#6b7280">{e.lager}</TD>
                    <TD color={C.cyan} mono>{e.lagerort}</TD>
                    <TD color={krit?C.red:warn?C.yellow:C.teal} mono>{e.bestand}</TD>
                    <TD color="#6b7280" mono>{e.mindestbestand}</TD>
                    <TD color="#6b7280" mono>{e.meldebestand}</TD>
                  </tr>
                );
              })}
              <TotalsRow cols={[
                {text:"GESAMT BESTAND",color:C.teal},{text:""},{text:""},{text:""},{text:""},{text:""},{text:""},{text:""},{text:""},
                {text:""},{text:""},{text:""},
                {text:bestand,color:C.teal,mono:true},{text:mindest,color:"#6b7280",mono:true},{text:melde,color:"#6b7280",mono:true}
              ]}/>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HAUPT-APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab] = useState("uebersicht");

  useEffect(()=>{
    const id = "ig-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#0a0f1e;color:#e2e8f0;font-family:'Inter',sans-serif}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:#0f1627}
      ::-webkit-scrollbar-thumb{background:#1a2540;border-radius:3px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    `;
    document.head.appendChild(el);
  },[]);

  const pages = {
    uebersicht: <PageUebersicht/>,
    vorgaenge:  <PageVorgaenge/>,
    stunden:    <PageStunden/>,
    material:   <PageMaterial/>,
    einkauf:    <PageEinkauf/>,
    ersatzteile:<PageErsatzteile/>,
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0f1e"}}>
      {/* Header */}
      <div style={{background:"#080e1c",borderBottom:"1px solid #1a2540",padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#00d4aa,#4facfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>❄</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>Indugarve Germany</div>
            <div style={{fontSize:10,color:"#4b5563"}}>Vorgangsverwaltung · Power BI Dashboard</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#00d4aa",boxShadow:"0 0 6px #00d4aa"}}/>
          <span style={{fontSize:10,color:"#6b7280"}}>Stand: 09.03.2026</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:"#080e1c",borderBottom:"1px solid #1a2540",padding:"0 22px",display:"flex",gap:2,overflowX:"auto"}}>
        {TABS.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
            padding:"10px 16px",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif",
            background:"transparent",fontSize:11,fontWeight:500,whiteSpace:"nowrap",
            color: activeTab===tab.id ? "#00d4aa" : "#6b7280",
            borderBottom: activeTab===tab.id ? "2px solid #00d4aa" : "2px solid transparent",
            transition:"all 0.15s",
          }}>
            <span style={{marginRight:5}}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Inhalt */}
      <div style={{padding:"18px 22px",maxWidth:1600,margin:"0 auto"}}>
        {pages[activeTab]}
      </div>
    </div>
  );
}
