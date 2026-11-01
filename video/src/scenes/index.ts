import type { ComponentType } from "react";
import { S0Hook } from "./S0Hook";
import { S1Cert } from "./S1Cert";
import { S3Response } from "./S3Response";
import { S4Blind } from "./S4Blind";
import { S5Demo } from "./S5Demo";
import { S6Risk } from "./S6Risk";
import { S7Fix } from "./S7Fix";

export const SCENES: Record<string, ComponentType> = {
  hook: S0Hook,
  cert: S1Cert,
  response: S3Response,
  blind: S4Blind,
  demo: S5Demo,
  risk: S6Risk,
  fix: S7Fix,
};
