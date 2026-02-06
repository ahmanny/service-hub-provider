
export interface BankInterface {
  name: string;
  code: string;
  slug: string;
}
export const NIGERIAN_BANKS: BankInterface[] = [
  { name: "Access Bank", code: "044", slug: "access-bank" },
  { name: "Access (Diamond)", code: "063", slug: "access-bank-diamond" },
  { name: "ALAT by Wema", code: "035A", slug: "alat-by-wema" },
  { name: "Citibank Nigeria", code: "023", slug: "citibank-nigeria" },
  { name: "EcoBank Nigeria", code: "050", slug: "ecobank-nigeria" },
  { name: "Fidelity Bank", code: "070", slug: "fidelity-bank" },
  { name: "First Bank of Nigeria", code: "011", slug: "first-bank-of-nigeria" },
  { name: "First City Monument Bank (FCMB)", code: "214", slug: "first-city-monument-bank" },
  { name: "Guaranty Trust Bank (GTB)", code: "058", slug: "guaranty-trust-bank" },
  { name: "Heritage Bank", code: "030", slug: "heritage-bank" },
  { name: "Keystone Bank", code: "082", slug: "keystone-bank" },
  { name: "Kuda Bank", code: "50211", slug: "kuda-bank" },
  { name: "Moniepoint MFB", code: "50515", slug: "moniepoint-mfb-ng" },
  { name: "OPay (Paycom)", code: "999992", slug: "paycom" },
  { name: "Palmpay", code: "999991", slug: "palmpay" },
  { name: "Stanbic IBTC Bank", code: "039", slug: "stanbic-ibtc-bank" },
  { name: "United Bank for Africa (UBA)", code: "033", slug: "united-bank-for-africa" },
  { name: "Wema Bank", code: "035", slug: "wema-bank" },
  { name: "Zenith Bank", code: "057", slug: "zenith-bank" },
].sort((a, b) => a.name.localeCompare(b.name));