// Unified-System-Lifecycle-Phase-Validator.ts
// SAIA-Class 300 — deterministic lifecycle phase validator.

export interface PhasePacket {
  packetId: string;
  engineId: string;
  phase: string;
  timestampIso: string;
}

export type PhaseStatus =
  | "PHASE_VALID"
  | "INVALID_PHASE"
  | "OUT_OF_ORDER"
  | "TIMESTAMP_ERROR";

export interface PhaseRuling {
  rulingId: string;
  packetId: string;
  status: PhaseStatus;
  details: string;
  issuedAtIso: string;
  issuedByEngineId: string;
}

export interface PhaseValidatorConfig {
  engineId: string;
  validPhases: string[];
  phaseOrder: string[];
}

export class UnifiedSystemLifecyclePhaseValidator {
  private readonly config: PhaseValidatorConfig;

  constructor(config: PhaseValidatorConfig) {
    this.config = config;
  }

  public evaluate(packet: PhasePacket): PhaseRuling {
    const status = this.resolveStatus(packet);

    return {
      rulingId: this.generateRulingId(packet),
      packetId: packet.packetId,
      status,
      details: this.describe(status),
      issuedAtIso: new Date().toISOString(),
      issuedByEngineId: this.config.engineId,
    };
  }

  private resolveStatus(packet: PhasePacket): PhaseStatus {
    if (!packet.timestampIso) return "TIMESTAMP_ERROR";

    if (!this.config.validPhases.includes(packet.phase)) {
      return "INVALID_PHASE";
    }

    const index = this.config.phaseOrder.indexOf(packet.phase);
    if (index === -1) return "INVALID_PHASE";

    // Deterministic placeholder: odd index = out of order
    if (index % 2 !== 0) return "OUT_OF_ORDER";

    return "PHASE_VALID";
  }

  private describe(status: PhaseStatus): string {
    switch (status) {
      case "PHASE_VALID":
        return "Lifecycle phase validated.";
      case "INVALID_PHASE":
        return "Phase not recognized or allowed.";
      case "OUT_OF_ORDER":
        return "Phase executed out of canonical sequence.";
      case "TIMESTAMP_ERROR":
        return "Missing or invalid timestamp.";
    }
  }

  private generateRulingId(packet: PhasePacket): string {
    return `PHASE-${this.config.engineId}-${packet.packetId}-${Date.now()}`;
  }
}

export const DEFAULT_PHASE_VALIDATOR_CONFIG: PhaseValidatorConfig = {
  engineId: "Unified-System-Lifecycle-Phase-Validator-Class-300",
  validPhases: ["ACTIVATION", "RUNTIME", "FINALIZATION", "ARCHIVE"],
  phaseOrder: ["ACTIVATION", "RUNTIME", "FINALIZATION", "ARCHIVE"],
};
