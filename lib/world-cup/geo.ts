import type { AppLocale } from "@/lib/i18n/config";

export type Continent = "africa" | "americas" | "asia" | "europe" | "oceania";

export type CountryMeta = {
  key: string;
  code: string;
  continent: Continent;
  names: Record<AppLocale, string>;
  aliases?: string[];
};

const COUNTRY_BY_KEY: Record<string, CountryMeta> = {
  Algeria: {
    key: "Algeria",
    code: "dz",
    continent: "africa",
    names: { "pt-BR": "Argélia", "en-US": "Algeria", "es-ES": "Argelia" },
  },
  Argentina: {
    key: "Argentina",
    code: "ar",
    continent: "americas",
    names: { "pt-BR": "Argentina", "en-US": "Argentina", "es-ES": "Argentina" },
  },
  Australia: {
    key: "Australia",
    code: "au",
    continent: "oceania",
    names: { "pt-BR": "Austrália", "en-US": "Australia", "es-ES": "Australia" },
  },
  Austria: {
    key: "Austria",
    code: "at",
    continent: "europe",
    names: { "pt-BR": "Áustria", "en-US": "Austria", "es-ES": "Austria" },
  },
  Belgium: {
    key: "Belgium",
    code: "be",
    continent: "europe",
    names: { "pt-BR": "Bélgica", "en-US": "Belgium", "es-ES": "Bélgica" },
  },
  "Bosnia & Herzegovina": {
    key: "Bosnia & Herzegovina",
    code: "ba",
    continent: "europe",
    names: {
      "pt-BR": "Bósnia e Herzegovina",
      "en-US": "Bosnia & Herzegovina",
      "es-ES": "Bosnia y Herzegovina",
    },
  },
  Brazil: {
    key: "Brazil",
    code: "br",
    continent: "americas",
    names: { "pt-BR": "Brasil", "en-US": "Brazil", "es-ES": "Brasil" },
  },
  Canada: {
    key: "Canada",
    code: "ca",
    continent: "americas",
    names: { "pt-BR": "Canadá", "en-US": "Canada", "es-ES": "Canadá" },
  },
  "Cape Verde": {
    key: "Cape Verde",
    code: "cv",
    continent: "africa",
    names: { "pt-BR": "Cabo Verde", "en-US": "Cape Verde", "es-ES": "Cabo Verde" },
  },
  Colombia: {
    key: "Colombia",
    code: "co",
    continent: "americas",
    names: { "pt-BR": "Colômbia", "en-US": "Colombia", "es-ES": "Colombia" },
  },
  Croatia: {
    key: "Croatia",
    code: "hr",
    continent: "europe",
    names: { "pt-BR": "Croácia", "en-US": "Croatia", "es-ES": "Croacia" },
  },
  Curaçao: {
    key: "Curaçao",
    code: "cw",
    continent: "americas",
    names: { "pt-BR": "Curaçao", "en-US": "Curaçao", "es-ES": "Curazao" },
  },
  "Czech Republic": {
    key: "Czech Republic",
    code: "cz",
    continent: "europe",
    names: {
      "pt-BR": "República Tcheca",
      "en-US": "Czech Republic",
      "es-ES": "República Checa",
    },
  },
  "DR Congo": {
    key: "DR Congo",
    code: "cd",
    continent: "africa",
    names: {
      "pt-BR": "República Democrática do Congo",
      "en-US": "DR Congo",
      "es-ES": "República Democrática del Congo",
    },
  },
  Ecuador: {
    key: "Ecuador",
    code: "ec",
    continent: "americas",
    names: { "pt-BR": "Equador", "en-US": "Ecuador", "es-ES": "Ecuador" },
  },
  Egypt: {
    key: "Egypt",
    code: "eg",
    continent: "africa",
    names: { "pt-BR": "Egito", "en-US": "Egypt", "es-ES": "Egipto" },
  },
  England: {
    key: "England",
    code: "gb",
    continent: "europe",
    names: { "pt-BR": "Inglaterra", "en-US": "England", "es-ES": "Inglaterra" },
  },
  France: {
    key: "France",
    code: "fr",
    continent: "europe",
    names: { "pt-BR": "França", "en-US": "France", "es-ES": "Francia" },
  },
  Germany: {
    key: "Germany",
    code: "de",
    continent: "europe",
    names: { "pt-BR": "Alemanha", "en-US": "Germany", "es-ES": "Alemania" },
  },
  Ghana: {
    key: "Ghana",
    code: "gh",
    continent: "africa",
    names: { "pt-BR": "Gana", "en-US": "Ghana", "es-ES": "Ghana" },
  },
  Haiti: {
    key: "Haiti",
    code: "ht",
    continent: "americas",
    names: { "pt-BR": "Haiti", "en-US": "Haiti", "es-ES": "Haití" },
  },
  Iran: {
    key: "Iran",
    code: "ir",
    continent: "asia",
    names: { "pt-BR": "Irã", "en-US": "Iran", "es-ES": "Irán" },
  },
  Iraq: {
    key: "Iraq",
    code: "iq",
    continent: "asia",
    names: { "pt-BR": "Iraque", "en-US": "Iraq", "es-ES": "Irak" },
  },
  "Ivory Coast": {
    key: "Ivory Coast",
    code: "ci",
    continent: "africa",
    names: { "pt-BR": "Costa do Marfim", "en-US": "Ivory Coast", "es-ES": "Costa de Marfil" },
  },
  Japan: {
    key: "Japan",
    code: "jp",
    continent: "asia",
    names: { "pt-BR": "Japão", "en-US": "Japan", "es-ES": "Japón" },
  },
  Jordan: {
    key: "Jordan",
    code: "jo",
    continent: "asia",
    names: { "pt-BR": "Jordânia", "en-US": "Jordan", "es-ES": "Jordania" },
  },
  Mexico: {
    key: "Mexico",
    code: "mx",
    continent: "americas",
    names: { "pt-BR": "México", "en-US": "Mexico", "es-ES": "México" },
  },
  Morocco: {
    key: "Morocco",
    code: "ma",
    continent: "africa",
    names: { "pt-BR": "Marrocos", "en-US": "Morocco", "es-ES": "Marruecos" },
  },
  Netherlands: {
    key: "Netherlands",
    code: "nl",
    continent: "europe",
    names: { "pt-BR": "Países Baixos", "en-US": "Netherlands", "es-ES": "Países Bajos" },
  },
  "New Zealand": {
    key: "New Zealand",
    code: "nz",
    continent: "oceania",
    names: { "pt-BR": "Nova Zelândia", "en-US": "New Zealand", "es-ES": "Nueva Zelanda" },
  },
  Norway: {
    key: "Norway",
    code: "no",
    continent: "europe",
    names: { "pt-BR": "Noruega", "en-US": "Norway", "es-ES": "Noruega" },
  },
  Panama: {
    key: "Panama",
    code: "pa",
    continent: "americas",
    names: { "pt-BR": "Panamá", "en-US": "Panama", "es-ES": "Panamá" },
  },
  Paraguay: {
    key: "Paraguay",
    code: "py",
    continent: "americas",
    names: { "pt-BR": "Paraguai", "en-US": "Paraguay", "es-ES": "Paraguay" },
  },
  Portugal: {
    key: "Portugal",
    code: "pt",
    continent: "europe",
    names: { "pt-BR": "Portugal", "en-US": "Portugal", "es-ES": "Portugal" },
  },
  Qatar: {
    key: "Qatar",
    code: "qa",
    continent: "asia",
    names: { "pt-BR": "Catar", "en-US": "Qatar", "es-ES": "Catar" },
  },
  "Saudi Arabia": {
    key: "Saudi Arabia",
    code: "sa",
    continent: "asia",
    names: { "pt-BR": "Arábia Saudita", "en-US": "Saudi Arabia", "es-ES": "Arabia Saudí" },
  },
  Scotland: {
    key: "Scotland",
    code: "gb",
    continent: "europe",
    names: { "pt-BR": "Escócia", "en-US": "Scotland", "es-ES": "Escocia" },
  },
  Senegal: {
    key: "Senegal",
    code: "sn",
    continent: "africa",
    names: { "pt-BR": "Senegal", "en-US": "Senegal", "es-ES": "Senegal" },
  },
  "South Africa": {
    key: "South Africa",
    code: "za",
    continent: "africa",
    names: { "pt-BR": "África do Sul", "en-US": "South Africa", "es-ES": "Sudáfrica" },
  },
  "South Korea": {
    key: "South Korea",
    code: "kr",
    continent: "asia",
    names: { "pt-BR": "Coreia do Sul", "en-US": "South Korea", "es-ES": "Corea del Sur" },
  },
  Spain: {
    key: "Spain",
    code: "es",
    continent: "europe",
    names: { "pt-BR": "Espanha", "en-US": "Spain", "es-ES": "España" },
  },
  Sweden: {
    key: "Sweden",
    code: "se",
    continent: "europe",
    names: { "pt-BR": "Suécia", "en-US": "Sweden", "es-ES": "Suecia" },
  },
  Switzerland: {
    key: "Switzerland",
    code: "ch",
    continent: "europe",
    names: { "pt-BR": "Suíça", "en-US": "Switzerland", "es-ES": "Suiza" },
  },
  Tunisia: {
    key: "Tunisia",
    code: "tn",
    continent: "africa",
    names: { "pt-BR": "Tunísia", "en-US": "Tunisia", "es-ES": "Túnez" },
  },
  Turkey: {
    key: "Turkey",
    code: "tr",
    continent: "asia",
    names: { "pt-BR": "Turquia", "en-US": "Turkey", "es-ES": "Turquía" },
  },
  Uruguay: {
    key: "Uruguay",
    code: "uy",
    continent: "americas",
    names: { "pt-BR": "Uruguai", "en-US": "Uruguay", "es-ES": "Uruguay" },
  },
  "United States": {
    key: "United States",
    code: "us",
    continent: "americas",
    names: { "pt-BR": "Estados Unidos", "en-US": "United States", "es-ES": "Estados Unidos" },
    aliases: ["USA"],
  },
  Uzbekistan: {
    key: "Uzbekistan",
    code: "uz",
    continent: "asia",
    names: { "pt-BR": "Uzbequistão", "en-US": "Uzbekistan", "es-ES": "Uzbekistán" },
  },
};

const TEAM_TO_COUNTRY_KEY: Record<string, string> = {
  USA: "United States",
};

const COUNTRY_KEY_LOOKUP = Object.values(COUNTRY_BY_KEY).reduce<Record<string, string>>(
  (acc, meta) => {
    acc[meta.key] = meta.key;
    acc[meta.names["en-US"]] = meta.key;
    acc[meta.names["pt-BR"]] = meta.key;
    acc[meta.names["es-ES"]] = meta.key;
    meta.aliases?.forEach((alias) => {
      acc[alias] = meta.key;
    });
    return acc;
  },
  {},
);

export function countryKeyFromTeam(team: string): string {
  const direct = TEAM_TO_COUNTRY_KEY[team] ?? team;
  return COUNTRY_KEY_LOOKUP[direct] ?? direct;
}

export function countryMetaFromTeam(team: string): CountryMeta | null {
  return COUNTRY_BY_KEY[countryKeyFromTeam(team)] ?? null;
}

export function countryMetaFromKey(countryKey: string): CountryMeta | null {
  return COUNTRY_BY_KEY[countryKey] ?? null;
}

export function allCountryMetadata(): CountryMeta[] {
  return Object.values(COUNTRY_BY_KEY);
}

export function continentFromCountry(country: string): Continent {
  const key = COUNTRY_KEY_LOOKUP[country] ?? country;
  return COUNTRY_BY_KEY[key]?.continent ?? "europe";
}

export function localizeCountry(country: string, locale: AppLocale): string {
  const key = COUNTRY_KEY_LOOKUP[country] ?? country;
  return COUNTRY_BY_KEY[key]?.names[locale] ?? country;
}

export function flagPathForCountry(country: string): string {
  const key = COUNTRY_KEY_LOOKUP[country] ?? country;
  const code = COUNTRY_BY_KEY[key]?.code;
  return code ? `/flags/${code}.png` : "/flags/placeholder.png";
}
