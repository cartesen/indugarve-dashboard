import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// =================================================================
// DATEN AUS EXCEL-ARBEITSMAPPEN (10 Sheets)
// =================================================================

// 1. VORGANGSVERWALTUNG
const VORGAENGE = [
  { nr:100000, datum:"13.02.2026", kdNr:10005, kunde:"Kältetechnik Dresen + Bremen GmbH", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", belegstatus:"2. Angebotsphase", bereich:"Service", projNr:60000, auftragssumme:11927.78, belegart:"Angebot", auftragsstatus:"Angebotsphase", abrStatus:null, abrPct:null, belegNr:200001, belegDatum:"13.02.2026", belegsumme:11927.78, matSK:0, montageSK:0, gesamtkosten:0, gewinn:11927.78, gewinnPct:null, vorgangsstatus:"Vorgang abgeschlossen ohne Rechnungsstellung" },
  { nr:100000, datum:"13.02.2026", kdNr:10005, kunde:"Kältetechnik Dresen + Bremen GmbH", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", belegstatus:"8. Abrechnungsphase", bereich:"Service", projNr:60001, auftragssumme:11927.78, belegart:"Rechnung", auftragsstatus:"Abrechnungsphase", abrStatus:"Rechnungsstellung 100%", abrPct:1.0, belegNr:400000, belegDatum:"13.02.2026", belegsumme:11927.78, matSK:6106.65, montageSK:1205.68, gesamtkosten:7312.32, gewinn:4615.46, gewinnPct:63.1, vorgangsstatus:"Vorgang abgeschlossen ohne Rechnungsstellung" },
  { nr:100001, datum:"13.02.2026", kdNr:10010, kunde:"ska GmbH", beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", belegstatus:"8. Abrechnungsphase", bereich:"Service", projNr:60001, auftragssumme:25000, belegart:"Rechnung", auftragsstatus:"Abrechnungsphase", abrStatus:"Teilrechnung", abrPct:0.75, belegNr:400001, belegDatum:"13.02.2026", belegsumme:18750, matSK:13269.14, montageSK:0, gesamtkosten:13269.14, gewinn:5480.86, gewinnPct:41.3, vorgangsstatus:"Vorgang abgeschlossen mit Rechnungsstellung" },
  { nr:100001, datum:"13.02.2026", kdNr:10010, kunde:"ska GmbH", beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", belegstatus:"8. Abrechnungsphase", bereich:"Service", projNr:60002, auftragssumme:25000, belegart:"Rechnung", auftragsstatus:"Abrechnungsphase", abrStatus:"Teilrechnung", abrPct:0.25, belegNr:400002, belegDatum:"13.02.2026", belegsumme:6250, matSK:0, montageSK:1305, gesamtkosten:1305, gewinn:4945, gewinnPct:79.1, vorgangsstatus:"Vorgang abgeschlossen mit Rechnungsstellung" },
  { nr:100010, datum:"13.02.2026", kdNr:10006, kunde:"Arctos Industriekälte AG", beschreibung:"Erweiterung Kälteanlage", belegstatus:"3. Auftragsphase", bereich:"Anlagenbau", projNr:60003, auftragssumme:100000, belegart:"Rechnung", auftragsstatus:"Projektierungsphase", abrStatus:"Teilrechnung", abrPct:0.3, belegNr:400003, belegDatum:"13.02.2026", belegsumme:30000, matSK:10801.05, montageSK:5082.25, gesamtkosten:15883.3, gewinn:14116.7, gewinnPct:88.9, vorgangsstatus:"Vorgang Teil abgeschlossen mit Teilrechnung" },
  { nr:100010, datum:"13.02.2026", kdNr:10006, kunde:"Arctos Industriekälte AG", beschreibung:"Erweiterung Kälteanlage", belegstatus:"5. Projektierung", bereich:"Anlagenbau", projNr:60004, auftragssumme:100000, belegart:"Rechnung", auftragsstatus:"Projektierungsphase", abrStatus:"Teilrechnung", abrPct:0.2, belegNr:400004, belegDatum:"13.02.2026", belegsumme:20000, matSK:16420.09, montageSK:10164.5, gesamtkosten:26584.59, gewinn:-6584.59, gewinnPct:-24.8, vorgangsstatus:"Vorgang Teil abgeschlossen mit Teilrechnung" },
];

// 2. KALKULATION
const KALKULATION = [
  { belegNr:200001, datum:"13.02.2026", art:"Kalkulation", vorgabe:"Angebotsstellung", vorgangNr:100000, bereich:"Service", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", skMatFremdk:2146, skLohn:7395, kostenGesamt:9541, umsatzKomplett:11467.9, gewinnTotal:1926.9, gewinnPct:20.2 },
];

// 3. NACHKALKULATION
const NACHKALKULATION = [
  { belegNr:400000, datum:"13.02.2026", art:"Nachkalkulation", vorgabe:"Rechnungsstellung", vorgangNr:100000, bereich:"Service", beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", auftragsgrundlage:11927.78, abrPct:null, stServicetech:0, stVorrichter:2, stProjekt:8.5, stElektro:0, stProgramm:0, km:280, skMatFremdk:6106.65, skLohn:1205.68, kostenGesamt:7312.32, umsatzKomplett:8614.64, gewinnTotal:1302.32, gewinnPct:17.8 },
  { belegNr:400001, datum:"13.02.2026", art:"Nachkalkulation", vorgabe:"Rechnungsstellung", vorgangNr:100001, bereich:"Service", beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", auftragsgrundlage:null, abrPct:null, stServicetech:0, stVorrichter:0, stProjekt:0, stElektro:0, stProgramm:0, km:0, skMatFremdk:13269.14, skLohn:0, kostenGesamt:13269.14, umsatzKomplett:15259.51, gewinnTotal:1990.37, gewinnPct:15.0 },
  { belegNr:400002, datum:"13.02.2026", art:"Nachkalkulation", vorgabe:"Teil- u. Schlussrechnung", vorgangNr:100001, bereich:"Service", beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", auftragsgrundlage:100000, abrPct:0.30, stServicetech:10, stVorrichter:0, stProjekt:0, stElektro:0, stProgramm:0, km:350, skMatFremdk:0, skLohn:1305, kostenGesamt:1305, umsatzKomplett:30000, gewinnTotal:28695, gewinnPct:2198.9 },
  { belegNr:400003, datum:"13.02.2026", art:"Nachkalkulation", vorgabe:"Teil- u. Schlussrechnung", vorgangNr:100010, bereich:"Anlagenbau", beschreibung:"Erweiterung Kälteanlage", auftragsgrundlage:100000, abrPct:0.20, stServicetech:10, stVorrichter:10, stProjekt:10, stElektro:10, stProgramm:10, km:1500, skMatFremdk:10801.05, skLohn:5082.25, kostenGesamt:15883.3, umsatzKomplett:20000, gewinnTotal:4116.7, gewinnPct:25.9 },
  { belegNr:400004, datum:"13.02.2026", art:"Nachkalkulation", vorgabe:"Teil- u. Schlussrechnung", vorgangNr:100010, bereich:"Anlagenbau", beschreibung:"Erweiterung Kälteanlage", auftragsgrundlage:25000, abrPct:0.75, stServicetech:20, stVorrichter:20, stProjekt:20, stElektro:20, stProgramm:20, km:3000, skMatFremdk:16420.09, skLohn:10164.5, kostenGesamt:26584.59, umsatzKomplett:18750, gewinnTotal:-7834.59, gewinnPct:-29.5 },
];

// 4. STUNDENERFASSUNG
const STUNDEN = [
  { persNr:15, belegNr:400000, datum:"24.02.2026", name:"Carsten Harmeling", abteilung:"Projektierung VK", vorgang:100000, kunde:"Kältetechnik Dresen + Bremen GmbH", stunden:8.5, reisezeit:2, km:140 },
  { persNr:11, belegNr:400000, datum:"24.02.2026", name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", vorgang:100000, kunde:"Kältetechnik Dresen + Bremen GmbH", stunden:2, reisezeit:2, km:140 },
  { persNr:10, belegNr:400003, datum:"15.02.2026", name:"Max Mustermann", abteilung:"Servicetechniker VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:5, km:750 },
  { persNr:11, belegNr:400003, datum:"15.02.2026", name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:5, km:750 },
  { persNr:12, belegNr:400003, datum:"15.02.2026", name:"Tom Weber", abteilung:"Projektierung VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:13, belegNr:400003, datum:"15.02.2026", name:"Lisa Müller", abteilung:"Elektromontage VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:14, belegNr:400003, datum:"15.02.2026", name:"Jan Peters", abteilung:"Programmierung VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:10, belegNr:400004, datum:"16.02.2026", name:"Max Mustermann", abteilung:"Servicetechniker VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:5, km:750 },
  { persNr:11, belegNr:400004, datum:"16.02.2026", name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:5, km:750 },
  { persNr:12, belegNr:400004, datum:"16.02.2026", name:"Tom Weber", abteilung:"Projektierung VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:13, belegNr:400004, datum:"16.02.2026", name:"Lisa Müller", abteilung:"Elektromontage VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:14, belegNr:400004, datum:"16.02.2026", name:"Jan Peters", abteilung:"Programmierung VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:10, belegNr:400004, datum:"17.02.2026", name:"Max Mustermann", abteilung:"Servicetechniker VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:5, km:750 },
  { persNr:11, belegNr:400004, datum:"18.02.2026", name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:5, km:750 },
  { persNr:12, belegNr:400004, datum:"19.02.2026", name:"Tom Weber", abteilung:"Projektierung VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:13, belegNr:400004, datum:"20.02.2026", name:"Lisa Müller", abteilung:"Elektromontage VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:14, belegNr:400004, datum:"21.02.2026", name:"Jan Peters", abteilung:"Programmierung VK", vorgang:100010, kunde:"Arctos Industriekälte AG", stunden:10, reisezeit:0, km:0 },
  { persNr:10, belegNr:400002, datum:"03.03.2026", name:"Max Mustermann", abteilung:"Servicetechniker VK", vorgang:100001, kunde:"ska GmbH", stunden:10, reisezeit:5, km:350 },
];

// 5. MATERIALERFASSUNG
const MATERIAL = [
  { vorgangNr:100000, belegNr:400000, beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", status:"Vorgang abgeschlossen ohne Rechnungsstellung", disposition:"Lagerentnahme", art:"Vorgangsmaterial", lieferant:71611, artikel:"KD4.2205", bezeichnung:"Kugelventil DN65 pneum. 220V S-Klasse", me:"Stck", anzahl:2, einstand:879.02, gesamt:1758.04, kategorie:"Kugelventil" },
  { vorgangNr:100000, belegNr:400000, beschreibung:"Zylinderwartung Satz B Sabroe SMC 108", status:"Vorgang abgeschlossen ohne Rechnungsstellung", disposition:"Lagerentnahme", art:"Vorgangsmaterial", lieferant:71611, artikel:"KD4.2206", bezeichnung:"Kugelventil DN80 pneum. 220V S-Klasse", me:"Stck", anzahl:2, einstand:1226.72, gesamt:2453.44, kategorie:"Kugelventil" },
  { vorgangNr:100001, belegNr:400001, beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", status:"Vorgang abgeschlossen mit Rechnungsstellung", disposition:"Lagerentnahme", art:"Vorgangsmaterial", lieferant:70306, artikel:"KD4.2051", bezeichnung:"Magnetventil NH3 DN10 geflanscht EVRA 10", me:"Stck", anzahl:20, einstand:259.01, gesamt:5180.10, kategorie:"Magnetventil" },
  { vorgangNr:100001, belegNr:400001, beschreibung:"Grundüberholung SVD 2 Mycom N200VLD", status:"Vorgang abgeschlossen mit Rechnungsstellung", disposition:"Übernahme Lieferantenrechnung", art:"Fremdleistung", lieferant:null, artikel:null, bezeichnung:"Grundüberholung Ölpumpe", me:null, anzahl:1, einstand:3971.03, gesamt:3971.03, kategorie:"Fremdleistung" },
  { vorgangNr:100010, belegNr:400003, beschreibung:"Erweiterung Kälteanlage", status:"Vorgang Teil abgeschlossen mit Teilrechnung", disposition:"Übernahme Lieferantenrechnung", art:"Fremdleistung", lieferant:null, artikel:null, bezeichnung:"Eingangsrechnungen Fremdleistung", me:null, anzahl:1, einstand:3500, gesamt:3500, kategorie:"Fremdleistung" },
  { vorgangNr:100010, belegNr:400003, beschreibung:"Erweiterung Kälteanlage", status:"Vorgang Teil abgeschlossen mit Teilrechnung", disposition:"Lagerentnahme", art:"Vorgangsmaterial", lieferant:70762, artikel:"KD4.0050", bezeichnung:"NH3-Rohrleitung VA DN15", me:"m", anzahl:50, einstand:5.81, gesamt:290.50, kategorie:"Rohr" },
  { vorgangNr:100010, belegNr:400003, beschreibung:"Erweiterung Kälteanlage", status:"Vorgang Teil abgeschlossen mit Teilrechnung", disposition:"Vorgangsbestellung", art:"Vorgangsmaterial", lieferant:70762, artikel:"KD4.2205", bezeichnung:"Kugelventil DN65 pneum. diverse", me:"Stck", anzahl:5, einstand:879.02, gesamt:4395.10, kategorie:"Kugelventil" },
  { vorgangNr:100010, belegNr:400004, beschreibung:"Erweiterung Kälteanlage", status:"Vorgang Teil abgeschlossen mit Teilrechnung", disposition:"Übernahme Lieferantenrechnung", art:"Fremdleistung", lieferant:null, artikel:null, bezeichnung:"Anlagenkomponenten Fremdleistung", me:null, anzahl:1, einstand:11324.2, gesamt:11324.2, kategorie:"Fremdleistung" },
];

// 6. ERSATZTEILLISTE (Statistiken)
const ERSATZTEILE_KATEGORIEN = [
  { name:"Befestigung", anzahl:152 }, { name:"Kugelventil", anzahl:152 },
  { name:"Belimo", anzahl:84 }, { name:"Allg. Servicelager", anzahl:83 },
  { name:"Betriebsmittel", anzahl:69 }, { name:"Reduzierung", anzahl:67 },
  { name:"Ermeto", anzahl:66 }, { name:"Rohrschelle", anzahl:54 },
  { name:"ICS", anzahl:54 }, { name:"Sonstige", anzahl:221 },
];
const STUNDENSAETZE = [
  { role:"Servicetechniker", montageSK:51, montageVK:90, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { role:"Vorrichter/Schweißer", montageSK:43, montageVK:75, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { role:"Projektierung", montageSK:51, montageVK:100, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { role:"Elektromontage", montageSK:44.5, montageVK:78.5, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { role:"Programmierung", montageSK:51, montageVK:95, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
];

// 7. EINGANGSRECHNUNGEN
const EINGANGSRECHNUNGEN = [
  { eingang:"02.03.2026", name:"CH", lfdNr:"001", lieferNr:70001, materialart:"sonst. Artikel u. Leistungen", lieferant:"Klarsicht IT GmbH", kommNr:"Büro", rgNr:6096186, rgDatum:"23.06.2023", faelligkeit:"paypal", nettoRg:1381.43, bruttoRg:1643.90, zahlDatum:"03.03.2026" },
  { eingang:"03.03.2026", name:"CH", lfdNr:"002", lieferNr:70001, materialart:"Fremdleistung", lieferant:"Klarsicht IT GmbH", kommNr:100010, rgNr:6096188, rgDatum:"03.03.2026", faelligkeit:"paypal", nettoRg:3500, bruttoRg:4165, zahlDatum:"03.03.2026" },
  { eingang:"03.03.2026", name:"CH", lfdNr:"003", lieferNr:70001, materialart:"Fremdleistung", lieferant:"Klarsicht IT GmbH", kommNr:100001, rgNr:6096190, rgDatum:"03.03.2026", faelligkeit:"paypal", nettoRg:3971.03, bruttoRg:4725.53, zahlDatum:"03.03.2026" },
];

// 8. LIEFERANTENSTAMMDATEN
const LIEFERANTEN = [
  { nr:70001, name:"Klarsicht IT GmbH", strasse:"Luisenthaler Straße 1", ort:"Karben", plz:"61184", land:"Deutschland", tel:"+49 (6039) 80393-00", email:"service@klarsicht-it.de" },
  { nr:70306, name:"Danfoss GmbH", strasse:"Carl-Legien-Str. 8", ort:"Offenbach", plz:"63073", land:"Deutschland", tel:"—", email:"—" },
  { nr:70762, name:"Kälte Rohr Technik GmbH", strasse:"Industriestraße 12", ort:"Hamburg", plz:"21107", land:"Deutschland", tel:"—", email:"—" },
  { nr:71611, name:"Festo GmbH & Co. KG", strasse:"Ruiter Straße 82", ort:"Esslingen", plz:"73734", land:"Deutschland", tel:"—", email:"—" },
];

// 9. MITARBEITERSTAMM
const MITARBEITER = [
  { nr:10, name:"Max Mustermann", abteilung:"Servicetechniker VK", montageSK:51, montageVK:90, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { nr:11, name:"Anna Schmidt", abteilung:"Vorrichter Schweißer VK", montageSK:51, montageVK:75, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { nr:12, name:"Tom Weber", abteilung:"Projektierung VK", montageSK:51, montageVK:100, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { nr:13, name:"Lisa Müller", abteilung:"Elektromontage VK", montageSK:44.5, montageVK:78.5, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { nr:14, name:"Jan Peters", abteilung:"Programmierung VK", montageSK:51, montageVK:95, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { nr:15, name:"Carsten Harmeling", abteilung:"Projektierung VK", montageSK:51, montageVK:100, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
  { nr:16, name:"Maik Müller", abteilung:"Servicetechniker VK", montageSK:51, montageVK:90, reiseSK:50, reiseVK:85, kmSK:0.4, kmVK:0.9 },
];

// 10. KUNDENDATENBANK
const KUNDEN = [
  { nr:10005, name:"Kältetechnik Dresen + Bremen GmbH", ort:"Alfhausen", land:"Germany", potenzial:300000, chance:1.0 },
  { nr:10001, name:"SH Kälte- & Kompressortechnik GmbH", ort:"Beckdorf", land:"Germany", potenzial:350000, chance:0.25 },
  { nr:10004, name:"Zimmermann GmbH", ort:"Seevetal", land:"Germany", potenzial:250000, chance:0.5 },
  { nr:10002, name:"Harig GmbH", ort:"Bielefeld", land:"Germany", potenzial:250000, chance:0.5 },
  { nr:10005, name:"Friedrich von Nida Kälte- und Klimaanlagen GmbH", ort:"Wiefelstede", land:"Germany", potenzial:100000, chance:0.25 },
  { nr:10006, name:"Arctos Industriekälte AG", ort:"Hamburg", land:"Germany", potenzial:500000, chance:0.75 },
  { nr:10010, name:"ska GmbH", ort:"Hannover", land:"Germany", potenzial:200000, chance:0.8 },
];

// =================================================================
// BERECHNUNGEN
// =================================================================
const rechnungen = VORGAENGE.filter(v => v.belegart === "Rechnung" && v.belegsumme > 0);
const totalUmsatz = rechnungen.reduce((s, v) => s + v.belegsumme, 0);
const totalGewinn = rechnungen.reduce((s, v) => s + v.gewinn, 0);
const totalKosten = rechnungen.reduce((s, v) => s + v.gesamtkosten, 0);
const avgMarge = (totalGewinn / totalUmsatz * 100).toFixed(1);
const totalStunden = STUNDEN.reduce((s, r) => s + r.stunden, 0);
const totalReise = STUNDEN.reduce((s, r) => s + r.reisezeit, 0);
const totalKm = STUNDEN.reduce((s, r) => s + r.km, 0);
const totalMatKosten = MATERIAL.reduce((s, m) => s + m.gesamt, 0);
const totalEingangsRg = EINGANGSRECHNUNGEN.reduce((s, r) => s + r.nettoRg, 0);
const totalPotenzial = KUNDEN.reduce((s, k) => s + k.potenzial, 0);

const bereichChartData = ["Service","Anlagenbau"].map(b => ({
  name: b,
  umsatz: rechnungen.filter(v=>v.bereich===b).reduce((s,v)=>s+v.belegsumme,0),
  gewinn: rechnungen.filter(v=>v.bereich===b).reduce((s,v)=>s+v.gewinn,0),
  kosten: rechnungen.filter(v=>v.bereich===b).reduce((s,v)=>s+v.gesamtkosten,0),
}));

const stundenByMA = MITARBEITER.map(ma => {
  const rows = STUNDEN.filter(s => s.persNr === ma.nr);
  return { vorname: ma.name.split(" ")[0], name: ma.name, stunden: rows.reduce((s,r)=>s+r.stunden,0), reise: rows.reduce((s,r)=>s+r.reisezeit,0), km: rows.reduce((s,r)=>s+r.km,0) };
}).filter(x => x.stunden > 0);

const matByKat = {};
MATERIAL.forEach(m => { matByKat[m.kategorie] = (matByKat[m.kategorie]||0) + m.gesamt; });
const matPieData = Object.entries(matByKat).map(([name,value])=>({name,value}));

const kalkulationVergleich = NACHKALKULATION.filter(n=>n.umsatzKomplett>0).map(n => {
  const k = KALKULATION.find(k=>k.vorgangNr===n.vorgangNr);
  return { name:`${n.belegNr}`, kalkuliert:k?k.umsatzKomplett:0, nachkalk:n.umsatzKomplett, gewinnK:k?k.gewinnTotal:0, gewinnN:n.gewinnTotal };
});

const kundePotenzial = KUNDEN.map(k=>({ name:k.name.split(/\s/)[0], potenzial:k.potenzial, gewichtet:Math.round(k.potenzial*k.chance) })).sort((a,b)=>b.potenzial-a.potenzial);

// =================================================================
// FARBEN & UTILS
// =================================================================
const C = { teal:"#00d4aa", blue:"#4facfe", orange:"#ff9a3c", red:"#ff4d6d", purple:"#a78bfa", yellow:"#fbbf24", green:"#34d399", cyan:"#22d3ee" };
const PC = [C.teal,C.blue,C.orange,C.purple,C.yellow,C.green,C.cyan,C.red,"#f472b6","#818cf8"];
const fmt = n => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
const statusColor = s => { if(!s) return "#6b7280"; if(s.includes("ohne Rechnung")) return C.red; if(s.includes("Teil")) return C.orange; if(s.includes("mit Rechnung")) return C.teal; return "#6b7280"; };

const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return <div style={{background:"#131a2a",border:"1px solid #243050",borderRadius:10,padding:"10px 14px",fontSize:12,fontFamily:"monospace"}}>
    {label && <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:4}}>{label}</div>}
    {payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.name}: {typeof p.value==="number"&&Math.abs(p.value)>100?fmt(p.value):p.value}</div>)}
  </div>;
};

const KPI = ({label,value,sub,color="#00d4aa",icon}) => (
  <div style={{background:"linear-gradient(135deg,#151d30,#1c2640)",border:`1px solid ${color}25`,borderRadius:14,padding:"16px 20px",position:"relative",overflow:"hidden",boxShadow:`0 4px 20px ${color}10`}}>
    <div style={{position:"absolute",right:14,top:12,fontSize:24,opacity:0.15}}>{icon}</div>
    <div style={{fontSize:10,color:"#6b7280",letterSpacing:"0.07em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:5}}>{label}</div>
    <div style={{fontSize:24,fontWeight:700,color:"#fff",lineHeight:1.1,marginBottom:3}}>{value}</div>
    {sub && <div style={{fontSize:10,color,fontFamily:"monospace"}}>{sub}</div>}
  </div>
);

const Card = ({title,children,style={}}) => (
  <div style={{background:"#151d30",borderRadius:14,padding:20,border:"1px solid #1e2a40",...style}}>
    {title && <div style={{fontSize:10,color:"#6b7280",letterSpacing:"0.07em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:3,height:13,background:`linear-gradient(to bottom,${C.teal},${C.blue})`,borderRadius:2}}/>
      {title}
    </div>}
    {children}
  </div>
);

const Badge = ({text,color=C.teal}) => (
  <span style={{background:`${color}18`,color,padding:"2px 8px",borderRadius:20,fontSize:10,fontFamily:"monospace",whiteSpace:"nowrap"}}>{text}</span>
);

const TH = ({children}) => <th style={{padding:"7px 10px",textAlign:"left",color:"#4b5563",fontSize:10,fontFamily:"monospace",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{children}</th>;
const TD = ({children,mono,color,small,bold}) => <td style={{padding:"9px 10px",color:color||"#d1d5db",fontSize:small?11:12,fontFamily:mono?"monospace":"inherit",borderBottom:"1px solid #1a2336",fontWeight:bold?"700":"400"}}>{children}</td>;

const TABS = [
  {id:"overview",    label:"Übersicht",         icon:"⬡"},
  {id:"vorgaenge",   label:"Vorgänge",           icon:"📋"},
  {id:"kalkulation", label:"Kalk. / Nachkalk.",  icon:"⚖"},
  {id:"stunden",     label:"Stunden",            icon:"⏱"},
  {id:"material",    label:"Material",           icon:"📦"},
  {id:"ersatzteile", label:"Ersatzteilliste",    icon:"🔧"},
  {id:"eingangsrg",  label:"Eingangsrechnungen", icon:"🧾"},
  {id:"lieferanten", label:"Lieferanten",        icon:"🏭"},
  {id:"mitarbeiter", label:"Mitarbeiter",        icon:"👥"},
  {id:"kunden",      label:"Kunden",             icon:"🤝"},
];

export default function Dashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{minHeight:"100vh",background:"#0d1321",fontFamily:"system-ui,sans-serif",color:"#fff"}}>

      {/* HEADER */}
      <div style={{background:"#0d1321",borderBottom:"1px solid #1a2540",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.teal},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚙</div>
          <div>
            <div style={{fontSize:14,fontWeight:700}}>Vorgangsverwaltung</div>
            <div style={{fontSize:9,color:C.blue,fontFamily:"monospace"}}>Indugarve Germany · 10 Arbeitsmappen</div>
          </div>
        </div>
        <div style={{fontSize:10,color:"#374151",fontFamily:"monospace"}}>Stand: 04.03.2026</div>
      </div>

      {/* TABS */}
      <div style={{background:"#0f1729",borderBottom:"1px solid #1a2540",padding:"0 20px",display:"flex",gap:0,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 13px",border:"none",cursor:"pointer",background:"transparent",whiteSpace:"nowrap",
            color:tab===t.id?"#fff":"#4b5563",fontSize:11,fontWeight:tab===t.id?600:400,
            borderBottom:tab===t.id?`2px solid ${C.teal}`:"2px solid transparent",
            transition:"all 0.15s",display:"flex",alignItems:"center",gap:5
          }}>
            <span style={{fontSize:12}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{padding:"20px",maxWidth:1440,margin:"0 auto"}}>

        {/* ── ÜBERSICHT ── */}
        {tab==="overview" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Gesamtumsatz netto" value={fmt(totalUmsatz)} sub={`${rechnungen.length} Rechnungspositionen`} color={C.teal} icon="💶"/>
            <KPI label="Gesamtgewinn" value={fmt(totalGewinn)} sub={`Ø ${avgMarge}% Marge`} color={C.blue} icon="📈"/>
            <KPI label="Gesamtkosten SK" value={fmt(totalKosten)} sub="Material + Montage + GK" color={C.orange} icon="🏭"/>
            <KPI label="Erfasste Stunden" value={`${totalStunden} h`} sub={`+ ${totalReise}h Reise · ${totalKm.toLocaleString("de-DE")} km`} color={C.purple} icon="⏱"/>
            <KPI label="Kundenpotenzial" value={fmt(totalPotenzial)} sub={`${KUNDEN.length} Kunden aktiv`} color={C.yellow} icon="🤝"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Umsatz · Kosten · Gewinn nach Bereich / KPI">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={bereichChartData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:12}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:11,color:"#6b7280"}}/>
                  <Bar dataKey="umsatz" name="Umsatz" fill={C.blue} radius={[5,5,0,0]}/>
                  <Bar dataKey="kosten" name="Kosten" fill={C.orange} radius={[5,5,0,0]}/>
                  <Bar dataKey="gewinn" name="Gewinn" fill={C.teal} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Stunden je Mitarbeiter">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={stundenByMA} layout="vertical" barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" horizontal={false}/>
                  <XAxis type="number" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="vorname" tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} width={60}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="stunden" name="Arbeit h" fill={C.blue} radius={[0,4,4,0]} stackId="a"/>
                  <Bar dataKey="reise" name="Reise h" fill={C.purple} radius={[0,4,4,0]} stackId="a"/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <Card title="Materialkosten nach Kategorie">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={matPieData} cx="40%" cy="50%" outerRadius={60} dataKey="value" paddingAngle={2}>
                    {matPieData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
                  </Pie>
                  <Tooltip content={<Tip/>}/>
                </PieChart>
              </ResponsiveContainer>
              {matPieData.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:10,fontFamily:"monospace",padding:"2px 0"}}>
                  <span style={{display:"flex",alignItems:"center",gap:5,color:"#6b7280"}}><span style={{width:6,height:6,borderRadius:"50%",background:PC[i],display:"inline-block"}}/>{m.name}</span>
                  <span style={{color:"#d1d5db"}}>{fmt(m.value)}</span>
                </div>
              ))}
            </Card>
            <Card title="Kalkulation vs. Nachkalkulation">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={kalkulationVergleich.filter(x=>x.nachkalk>0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="kalkuliert" name="Kalk." fill={C.blue} radius={[4,4,0,0]}/>
                  <Bar dataKey="nachkalk" name="Nachkalk." fill={C.teal} radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Kundenpotenzial (gewichtet)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={kundePotenzial.slice(0,6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" horizontal={false}/>
                  <XAxis type="number" tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} width={70}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="potenzial" name="Potenzial" fill={`${C.blue}40`} radius={[0,4,4,0]}/>
                  <Bar dataKey="gewichtet" name="Gewichtet" fill={C.yellow} radius={[0,4,4,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>}

        {/* ── VORGÄNGE ── */}
        {tab==="vorgaenge" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Gesamtumsatz" value={fmt(totalUmsatz)} sub="alle Rechnungen" color={C.teal} icon="💶"/>
            <KPI label="Gewinn gesamt" value={fmt(totalGewinn)} sub={`Marge: ${avgMarge}%`} color={C.blue} icon="📈"/>
            <KPI label="Eindeutige Vorgänge" value={[...new Set(VORGAENGE.map(v=>v.nr))].length} sub="Vorgangsnummern" color={C.purple} icon="📋"/>
            <KPI label="Auftragsvolumen" value={fmt([...new Set(VORGAENGE.map(v=>v.nr))].reduce((s,nr)=>s+(VORGAENGE.find(v=>v.nr===nr)?.auftragssumme||0),0))} sub="offener Bestand" color={C.orange} icon="📑"/>
          </div>
          <Card title="Vorgangsverwaltung — alle Positionen">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                  <TH>Vorg.-Nr.</TH><TH>Kunde</TH><TH>Beschreibung</TH><TH>Bereich</TH>
                  <TH>Belegart</TH><TH>Auftragssumme</TH><TH>Belegsumme</TH>
                  <TH>Kosten SK</TH><TH>Gewinn</TH><TH>Marge</TH><TH>Vorgangsstatus</TH>
                </tr></thead>
                <tbody>
                  {VORGAENGE.filter(v=>v.belegsumme>0).map((v,i)=>(
                    <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <TD mono color={C.blue}>{v.nr}</TD>
                      <TD small>{v.kunde}</TD>
                      <TD small color="#6b7280">{v.beschreibung}</TD>
                      <TD><Badge text={v.bereich} color={v.bereich==="Service"?C.teal:C.orange}/></TD>
                      <TD><Badge text={v.belegart} color={C.blue}/></TD>
                      <TD mono>{fmt(v.auftragssumme)}</TD>
                      <TD mono>{fmt(v.belegsumme)}</TD>
                      <TD mono color="#6b7280">{fmt(v.gesamtkosten)}</TD>
                      <TD mono color={v.gewinn>=0?C.teal:C.red} bold>{fmt(v.gewinn)}</TD>
                      <TD mono color={v.gewinnPct>40?C.teal:v.gewinnPct>0?C.orange:C.red}>{v.gewinnPct!=null?`${v.gewinnPct.toFixed(1)}%`:"—"}</TD>
                      <TD><Badge text={v.vorgangsstatus} color={statusColor(v.vorgangsstatus)}/></TD>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr style={{background:"#1a2540"}}>
                  <td colSpan={5} style={{padding:"9px 10px",color:"#4b5563",fontSize:10,fontFamily:"monospace"}}>GESAMT</td>
                  <TD mono color="#fff" bold>{fmt(rechnungen.reduce((s,v)=>s+v.auftragssumme,0))}</TD>
                  <TD mono color="#fff" bold>{fmt(totalUmsatz)}</TD>
                  <TD mono color="#6b7280" bold>{fmt(totalKosten)}</TD>
                  <TD mono color={C.teal} bold>{fmt(totalGewinn)}</TD>
                  <TD mono color={C.teal} bold>{avgMarge}%</TD>
                  <td/>
                </tr></tfoot>
              </table>
            </div>
          </Card>
        </>}

        {/* ── KALKULATION / NACHKALKULATION ── */}
        {tab==="kalkulation" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Kalk. Umsatz (Plan)" value={fmt(KALKULATION.reduce((s,k)=>s+k.umsatzKomplett,0))} sub="Kalkulation" color={C.blue} icon="📐"/>
            <KPI label="Nachkalk. Umsatz (Ist)" value={fmt(NACHKALKULATION.reduce((s,n)=>s+n.umsatzKomplett,0))} sub="Nachkalkulation" color={C.teal} icon="✅"/>
            <KPI label="Nachkalk. Gewinn" value={fmt(NACHKALKULATION.reduce((s,n)=>s+n.gewinnTotal,0))} sub="alle Belege" color={C.orange} icon="💡"/>
            <KPI label="GK-Satz" value="45 %" sub="Gemeinkosten" color={C.purple} icon="⚙"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Gewinn Kalkulation vs. Nachkalkulation">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={kalkulationVergleich}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="gewinnK" name="Gewinn Kalk." fill={C.blue} radius={[5,5,0,0]}/>
                  <Bar dataKey="gewinnN" name="Gewinn Nachkalk." fill={C.teal} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Kostenstruktur Nachkalkulation (SK)">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={NACHKALKULATION.filter(n=>n.kostenGesamt>0).map(n=>({name:`${n.belegNr}`,mat:n.skMatFremdk,lohn:n.skLohn}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="mat" name="Material+Fremdk. SK" fill={C.orange} radius={[5,5,0,0]} stackId="a"/>
                  <Bar dataKey="lohn" name="Lohnkosten SK" fill={C.purple} radius={[5,5,0,0]} stackId="a"/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Nachkalkulation — Detailtabelle">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                  <TH>Beleg-Nr.</TH><TH>Vorgang</TH><TH>Bereich</TH><TH>Beschreibung</TH>
                  <TH>St.Service</TH><TH>St.Vorr.</TH><TH>St.Proj.</TH><TH>St.Elektro</TH><TH>St.Prog.</TH><TH>km</TH>
                  <TH>SK Mat</TH><TH>SK Lohn</TH><TH>Kosten ges.</TH><TH>Umsatz</TH><TH>Gewinn</TH><TH>Marge</TH>
                </tr></thead>
                <tbody>
                  {NACHKALKULATION.map((n,i)=>(
                    <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <TD mono color={C.blue}>{n.belegNr}</TD>
                      <TD mono>{n.vorgangNr}</TD>
                      <TD><Badge text={n.bereich} color={n.bereich==="Service"?C.teal:C.orange}/></TD>
                      <TD small color="#6b7280">{n.beschreibung}</TD>
                      <TD mono>{n.stServicetech||"—"}</TD>
                      <TD mono>{n.stVorrichter||"—"}</TD>
                      <TD mono>{n.stProjekt||"—"}</TD>
                      <TD mono>{n.stElektro||"—"}</TD>
                      <TD mono>{n.stProgramm||"—"}</TD>
                      <TD mono>{n.km||"—"}</TD>
                      <TD mono color="#9ca3af">{fmt(n.skMatFremdk)}</TD>
                      <TD mono color="#9ca3af">{fmt(n.skLohn)}</TD>
                      <TD mono>{fmt(n.kostenGesamt)}</TD>
                      <TD mono color="#d1d5db">{fmt(n.umsatzKomplett)}</TD>
                      <TD mono color={n.gewinnTotal>=0?C.teal:C.red} bold>{fmt(n.gewinnTotal)}</TD>
                      <TD mono color={n.gewinnPct>20?C.teal:n.gewinnPct>0?C.orange:C.red}>{n.gewinnPct.toFixed(1)}%</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>}

        {/* ── STUNDEN ── */}
        {tab==="stunden" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Arbeitsstunden" value={`${totalStunden} h`} sub={`${STUNDEN.length} Einträge`} color={C.teal} icon="⏱"/>
            <KPI label="Reisezeit" value={`${totalReise} h`} sub="dokumentiert" color={C.blue} icon="🚗"/>
            <KPI label="Kilometer" value={`${totalKm.toLocaleString("de-DE")} km`} sub="Gesamtstrecke" color={C.orange} icon="📍"/>
            <KPI label="Mitarbeiter aktiv" value={stundenByMA.length} sub="mit Stundeneinträgen" color={C.purple} icon="👤"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Stunden + Reisezeit je Mitarbeiter">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stundenByMA} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="vorname" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="stunden" name="Arbeitsstunden" fill={C.blue} radius={[5,5,0,0]}/>
                  <Bar dataKey="reise" name="Reisezeit h" fill={C.purple} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Kilometer je Mitarbeiter">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stundenByMA.filter(x=>x.km>0)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" horizontal={false}/>
                  <XAxis type="number" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="vorname" tick={{fill:"#9ca3af",fontSize:11}} axisLine={false} tickLine={false} width={70}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="km" name="km" fill={C.orange} radius={[0,5,5,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Stundenerfassung — alle Buchungen">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                  <TH>Datum</TH><TH>Mitarbeiter</TH><TH>Abteilung</TH><TH>Vorgang</TH>
                  <TH>Kunde</TH><TH>Stunden</TH><TH>Reise h</TH><TH>km</TH>
                </tr></thead>
                <tbody>
                  {STUNDEN.map((s,i)=>(
                    <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <TD mono small>{s.datum}</TD>
                      <TD>{s.name}</TD>
                      <TD small color="#6b7280">{s.abteilung}</TD>
                      <TD mono color={C.blue}>{s.vorgang}</TD>
                      <TD small>{s.kunde}</TD>
                      <TD mono color={C.teal} bold>{s.stunden}h</TD>
                      <TD mono color={C.orange}>{s.reisezeit>0?`${s.reisezeit}h`:"—"}</TD>
                      <TD mono color="#9ca3af">{s.km>0?s.km.toLocaleString("de-DE"):"—"}</TD>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr style={{background:"#1a2540"}}>
                  <td colSpan={5} style={{padding:"9px 10px",color:"#4b5563",fontSize:10,fontFamily:"monospace"}}>GESAMT</td>
                  <TD mono color={C.teal} bold>{totalStunden} h</TD>
                  <TD mono color={C.orange} bold>{totalReise} h</TD>
                  <TD mono color="#9ca3af" bold>{totalKm.toLocaleString("de-DE")}</TD>
                </tr></tfoot>
              </table>
            </div>
          </Card>
        </>}

        {/* ── MATERIAL ── */}
        {tab==="material" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Materialkosten ges." value={fmt(totalMatKosten)} sub={`${MATERIAL.length} Positionen`} color={C.teal} icon="📦"/>
            <KPI label="Lagerentnahmen" value={MATERIAL.filter(m=>m.disposition==="Lagerentnahme").length} sub="Positionen" color={C.blue} icon="📥"/>
            <KPI label="Fremdleistungen" value={MATERIAL.filter(m=>m.art==="Fremdleistung").length} sub="Positionen" color={C.orange} icon="🔗"/>
            <KPI label="Vorgangsbestellungen" value={MATERIAL.filter(m=>m.disposition==="Vorgangsbestellung").length} sub="Positionen" color={C.purple} icon="🛒"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Materialkosten nach Kategorie">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={matPieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {matPieData.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
                  </Pie>
                  <Tooltip content={<Tip/>}/>
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Materialkosten je Vorgang">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={[...new Set(MATERIAL.map(m=>m.vorgangNr))].map(nr=>({name:`${nr}`,kosten:MATERIAL.filter(m=>m.vorgangNr===nr).reduce((s,m)=>s+m.gesamt,0)}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="kosten" name="Materialkosten" fill={C.teal} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Materialerfassung — alle Positionen">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                  <TH>Vorgang</TH><TH>Beleg</TH><TH>Artikel</TH><TH>Bezeichnung</TH>
                  <TH>Kategorie</TH><TH>Disposition</TH><TH>Art</TH>
                  <TH>Anz.</TH><TH>ME</TH><TH>Einstand</TH><TH>Gesamt SK</TH>
                </tr></thead>
                <tbody>
                  {MATERIAL.map((m,i)=>(
                    <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <TD mono color={C.blue}>{m.vorgangNr}</TD>
                      <TD mono color="#6b7280">{m.belegNr}</TD>
                      <TD mono small color={C.cyan}>{m.artikel||"—"}</TD>
                      <TD small>{m.bezeichnung}</TD>
                      <TD><Badge text={m.kategorie} color={C.blue}/></TD>
                      <TD small color="#6b7280">{m.disposition}</TD>
                      <TD><Badge text={m.art} color={m.art==="Fremdleistung"?C.orange:C.teal}/></TD>
                      <TD mono>{m.anzahl}</TD>
                      <TD mono color="#6b7280">{m.me||"—"}</TD>
                      <TD mono color="#9ca3af">{fmt(m.einstand)}</TD>
                      <TD mono color={C.teal} bold>{fmt(m.gesamt)}</TD>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr style={{background:"#1a2540"}}>
                  <td colSpan={10} style={{padding:"9px 10px",color:"#4b5563",fontSize:10,fontFamily:"monospace"}}>GESAMT MATERIALKOSTEN (SK)</td>
                  <TD mono color={C.teal} bold>{fmt(totalMatKosten)}</TD>
                </tr></tfoot>
              </table>
            </div>
          </Card>
        </>}

        {/* ── ERSATZTEILLISTE ── */}
        {tab==="ersatzteile" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Artikel gesamt" value="1.807" sub="in Stammdaten" color={C.teal} icon="🔧"/>
            <KPI label="Artikel mit Bestand" value="233" sub="Lagervorrat vorhanden" color={C.blue} icon="📦"/>
            <KPI label="Kategorien" value={ERSATZTEILE_KATEGORIEN.length} sub="Materialgruppen" color={C.orange} icon="🗂"/>
            <KPI label="GK-Satz Standard" value="30 %" sub="Gemeinkosten Ersatzteile" color={C.purple} icon="⚙"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Artikel nach Kategorie (Top 10)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...ERSATZTEILE_KATEGORIEN].sort((a,b)=>b.anzahl-a.anzahl)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" horizontal={false}/>
                  <XAxis type="number" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} width={110}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="anzahl" name="Artikel" radius={[0,5,5,0]}>
                    {ERSATZTEILE_KATEGORIEN.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Stundensätze VK nach Abteilung (€/h)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={STUNDENSAETZE} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="role" tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} angle={-10} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}€`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="montageSK" name="Montage SK" fill={C.orange} radius={[5,5,0,0]}/>
                  <Bar dataKey="montageVK" name="Montage VK" fill={C.teal} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Stundensätze SK / VK — Vergleich">
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                <TH>Abteilung / Rolle</TH><TH>Montage SK</TH><TH>Montage VK</TH><TH>DB Montage</TH>
                <TH>Reise SK</TH><TH>Reise VK</TH><TH>km SK</TH><TH>km VK</TH>
              </tr></thead>
              <tbody>
                {STUNDENSAETZE.map((s,i)=>{
                  const db = ((s.montageVK-s.montageSK)/s.montageSK*100).toFixed(0);
                  return <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <TD bold>{s.role}</TD>
                    <TD mono color="#9ca3af">{s.montageSK} €/h</TD>
                    <TD mono color={C.teal} bold>{s.montageVK} €/h</TD>
                    <TD mono color={C.green} bold>+{db}%</TD>
                    <TD mono color="#9ca3af">{s.reiseSK} €/h</TD>
                    <TD mono color={C.blue}>{s.reiseVK} €/h</TD>
                    <TD mono color="#9ca3af">{s.kmSK} €</TD>
                    <TD mono color={C.orange}>{s.kmVK} €</TD>
                  </tr>;
                })}
              </tbody>
            </table>
          </Card>
        </>}

        {/* ── EINGANGSRECHNUNGEN ── */}
        {tab==="eingangsrg" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Eingangsrg. netto" value={fmt(totalEingangsRg)} sub={`${EINGANGSRECHNUNGEN.length} Rechnungen`} color={C.teal} icon="🧾"/>
            <KPI label="Eingangsrg. brutto" value={fmt(EINGANGSRECHNUNGEN.reduce((s,r)=>s+r.bruttoRg,0))} sub="inkl. MwSt." color={C.blue} icon="💶"/>
            <KPI label="Fremdleistungen" value={fmt(EINGANGSRECHNUNGEN.filter(r=>r.materialart==="Fremdleistung").reduce((s,r)=>s+r.nettoRg,0))} sub="Fremdkosten" color={C.orange} icon="🔗"/>
            <KPI label="Lieferanten" value={[...new Set(EINGANGSRECHNUNGEN.map(r=>r.lieferNr))].length} sub="aktiv" color={C.purple} icon="🏭"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Eingangsrechnungen nach Materialart">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={Object.entries(EINGANGSRECHNUNGEN.reduce((acc,r)=>{acc[r.materialart]=(acc[r.materialart]||0)+r.nettoRg;return acc},{})).map(([name,value])=>({name,value}))}
                    cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                    {EINGANGSRECHNUNGEN.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
                  </Pie>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:11,color:"#6b7280"}}/>
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Netto vs. Brutto je Rechnung">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={EINGANGSRECHNUNGEN.map(r=>({name:`Nr.${r.lfdNr}`,netto:r.nettoRg,brutto:r.bruttoRg}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(1)}k`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="netto" name="Netto €" fill={C.teal} radius={[5,5,0,0]}/>
                  <Bar dataKey="brutto" name="Brutto €" fill={C.blue} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Eingangsrechnungen — Buchungsübersicht">
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                <TH>Eingang</TH><TH>Name</TH><TH>lfd.-Nr.</TH><TH>Liefer.-Nr.</TH>
                <TH>Lieferant</TH><TH>Materialart</TH><TH>Komm.-Nr.</TH>
                <TH>RG.-Nr.</TH><TH>RG.-Datum</TH><TH>Netto €</TH><TH>Brutto €</TH><TH>Zahldatum</TH>
              </tr></thead>
              <tbody>
                {EINGANGSRECHNUNGEN.map((r,i)=>(
                  <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <TD mono small>{r.eingang}</TD>
                    <TD>{r.name}</TD>
                    <TD mono color={C.blue}>{r.lfdNr}</TD>
                    <TD mono color="#6b7280">{r.lieferNr}</TD>
                    <TD small>{r.lieferant}</TD>
                    <TD><Badge text={r.materialart} color={r.materialart==="Fremdleistung"?C.orange:C.blue}/></TD>
                    <TD mono color="#9ca3af">{r.kommNr}</TD>
                    <TD mono small>{r.rgNr}</TD>
                    <TD mono small color="#6b7280">{r.rgDatum}</TD>
                    <TD mono color={C.teal} bold>{fmt(r.nettoRg)}</TD>
                    <TD mono color="#9ca3af">{fmt(r.bruttoRg)}</TD>
                    <TD mono small color={C.green}>{r.zahlDatum}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>}

        {/* ── LIEFERANTEN ── */}
        {tab==="lieferanten" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Aktive Lieferanten" value={LIEFERANTEN.length} sub="in Stammdaten" color={C.teal} icon="🏭"/>
            <KPI label="Einkaufsvolumen netto" value={fmt(totalEingangsRg)} sub="lfd. Geschäftsjahr" color={C.blue} icon="💶"/>
            <KPI label="Lieferantenkapazität" value="2.979" sub="Nummernkreis reserviert" color={C.orange} icon="🔢"/>
          </div>
          <Card title="Lieferantenstammdaten">
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                <TH>Lief.-Nr.</TH><TH>Firmenname</TH><TH>Straße</TH><TH>PLZ</TH><TH>Ort</TH><TH>Land</TH><TH>Telefon</TH><TH>E-Mail</TH>
              </tr></thead>
              <tbody>
                {LIEFERANTEN.map((l,i)=>(
                  <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <TD mono color={C.blue}>{l.nr}</TD>
                    <TD bold>{l.name}</TD>
                    <TD small color="#6b7280">{l.strasse}</TD>
                    <TD mono small>{l.plz}</TD>
                    <TD small>{l.ort}</TD>
                    <TD small><Badge text={l.land} color={C.teal}/></TD>
                    <TD small color="#6b7280">{l.tel}</TD>
                    <TD small color={C.blue}>{l.email}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>}

        {/* ── MITARBEITER ── */}
        {tab==="mitarbeiter" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Mitarbeiter" value={MITARBEITER.length} sub="im Stamm" color={C.teal} icon="👥"/>
            <KPI label="Arbeitsstunden" value={`${totalStunden} h`} sub="erfasst" color={C.blue} icon="⏱"/>
            <KPI label="Ø Montage VK" value={`${(MITARBEITER.reduce((s,m)=>s+m.montageVK,0)/MITARBEITER.length).toFixed(0)} €/h`} sub="Verkaufspreis" color={C.orange} icon="💶"/>
            <KPI label="Gemeinkosten" value="45 %" sub="GK-Satz global" color={C.purple} icon="⚙"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Stundensätze SK vs. VK (Montage)">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MITARBEITER.map(m=>({name:m.name.split(" ")[0],sk:m.montageSK,vk:m.montageVK}))} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}€`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="sk" name="SK €/h" fill={C.orange} radius={[5,5,0,0]}/>
                  <Bar dataKey="vk" name="VK €/h" fill={C.teal} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Erfasste Stunden + Reise je Mitarbeiter">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stundenByMA} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="vorname" tick={{fill:"#6b7280",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="stunden" name="Arbeit h" fill={C.blue} radius={[5,5,0,0]}/>
                  <Bar dataKey="reise" name="Reise h" fill={C.purple} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Mitarbeiterstamm — Stundensätze & Konditionen">
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                <TH>Pers.-Nr.</TH><TH>Name</TH><TH>Abteilung</TH>
                <TH>Montage SK</TH><TH>Montage VK</TH><TH>DB Montage</TH>
                <TH>Reise SK</TH><TH>Reise VK</TH><TH>km SK</TH><TH>km VK</TH><TH>Ges.-Std.</TH>
              </tr></thead>
              <tbody>
                {MITARBEITER.map((m,i)=>{
                  const st = stundenByMA.find(s=>s.name===m.name);
                  const db = ((m.montageVK-m.montageSK)/m.montageSK*100).toFixed(0);
                  return <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <TD mono color={C.blue}>{m.nr}</TD>
                    <TD bold>{m.name}</TD>
                    <TD small color="#9ca3af">{m.abteilung}</TD>
                    <TD mono color="#9ca3af">{m.montageSK} €/h</TD>
                    <TD mono color={C.teal} bold>{m.montageVK} €/h</TD>
                    <TD mono color={C.green} bold>+{db}%</TD>
                    <TD mono color="#9ca3af">{m.reiseSK} €/h</TD>
                    <TD mono color={C.blue}>{m.reiseVK} €/h</TD>
                    <TD mono color="#9ca3af">{m.kmSK} €</TD>
                    <TD mono color={C.orange}>{m.kmVK} €</TD>
                    <TD mono color={st?C.teal:"#4b5563"}>{st?`${st.stunden} h`:"—"}</TD>
                  </tr>;
                })}
              </tbody>
            </table>
          </Card>
        </>}

        {/* ── KUNDEN ── */}
        {tab==="kunden" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            <KPI label="Kunden gesamt" value={KUNDEN.length} sub="in Datenbank" color={C.teal} icon="🤝"/>
            <KPI label="Gesamtpotenzial" value={fmt(totalPotenzial)} sub="Umsatzpotenzial" color={C.blue} icon="📊"/>
            <KPI label="Gew. Potenzial" value={fmt(KUNDEN.reduce((s,k)=>s+k.potenzial*k.chance,0))} sub="nach Erfolgschance" color={C.orange} icon="⚖"/>
            <KPI label="Aktive Auftraggeber" value={[...new Set(rechnungen.map(v=>v.kdNr))].length} sub="mit Rechnungen" color={C.purple} icon="✅"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card title="Potenzial vs. gewichtetes Potenzial">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={kundePotenzial} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540"/>
                  <XAxis dataKey="name" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10,color:"#6b7280"}}/>
                  <Bar dataKey="potenzial" name="Potenzial €" fill={`${C.blue}40`} radius={[5,5,0,0]}/>
                  <Bar dataKey="gewichtet" name="Gewichtet €" fill={C.yellow} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Erfolgschancen je Kunde">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={KUNDEN.map(k=>({name:k.name.split(" ")[0],chance:k.chance*100}))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" horizontal={false}/>
                  <XAxis type="number" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} domain={[0,100]}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} width={80}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="chance" name="Erfolgschance %" radius={[0,5,5,0]}>
                    {KUNDEN.map((k,i)=><Cell key={i} fill={k.chance>=0.75?C.teal:k.chance>=0.5?C.orange:C.red}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Kundendatenbank — Stammdaten">
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"2px solid #1a2540"}}>
                <TH>Kd.-Nr.</TH><TH>Firmenname</TH><TH>Ort</TH><TH>Land</TH>
                <TH>Umsatzpotenzial</TH><TH>Erfolgschance</TH><TH>Gew. Potenzial</TH><TH>Status</TH>
              </tr></thead>
              <tbody>
                {KUNDEN.map((k,i)=>{
                  const aktiv = rechnungen.some(v=>v.kdNr===k.nr);
                  return <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1a2336"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <TD mono color={C.blue}>{k.nr}</TD>
                    <TD bold>{k.name}</TD>
                    <TD small>{k.ort}</TD>
                    <TD small><Badge text={k.land} color={C.teal}/></TD>
                    <TD mono color="#d1d5db">{fmt(k.potenzial)}</TD>
                    <TD mono color={k.chance>=0.75?C.teal:k.chance>=0.5?C.orange:C.red} bold>{(k.chance*100).toFixed(0)}%</TD>
                    <TD mono color={C.yellow}>{fmt(Math.round(k.potenzial*k.chance))}</TD>
                    <TD><Badge text={aktiv?"Aktiv":"Prospect"} color={aktiv?C.teal:C.purple}/></TD>
                  </tr>;
                })}
              </tbody>
            </table>
          </Card>
        </>}

      </div>
    </div>
  );
}
