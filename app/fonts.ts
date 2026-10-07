import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: "800",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fontVariables = `${bricolage.variable} ${instrument.variable}`;
