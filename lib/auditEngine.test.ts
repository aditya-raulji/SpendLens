import { auditSpend, AuditInput } from "./auditEngine";

const defaultInput: AuditInput = {
  teamSize: 1,
  primaryUseCase: "coding",
  tools: {
    cursor: { plan: "None", spend: 0, seats: 0 },
    copilot: { plan: "None", spend: 0, seats: 0 },
    claude: { plan: "None", spend: 0, seats: 0 },
    chatgpt: { plan: "None", spend: 0, seats: 0 },
    anthropicApi: { plan: "None", spend: 0, seats: 0 },
    openaiApi: { plan: "None", spend: 0, seats: 0 },
    gemini: { plan: "None", spend: 0, seats: 0 },
    windsurf: { plan: "None", spend: 0, seats: 0 },
  }
};

describe("auditEngine", () => {
  it("1. User on Cursor Business with 2 seats -> should flag downgrade to Pro, show savings", () => {
    const input: AuditInput = {
      ...defaultInput,
      teamSize: 2,
      tools: {
        ...defaultInput.tools,
        cursor: { plan: "Business ($40/user/mo)", spend: 80, seats: 2 },
      }
    };
    const result = auditSpend(input);
    const cursorResult = result.toolResults.find(t => t.tool === "Cursor");
    expect(cursorResult).toBeDefined();
    expect(cursorResult?.recommendation).toContain("Downgrade");
    expect(cursorResult?.recommendedMonthlyCost).toBe(40);
    expect(cursorResult?.savingsPerMonth).toBe(40);
  });

  it("2. User on ChatGPT Team with 1 seat -> should flag switch to Plus plan", () => {
    const input: AuditInput = {
      ...defaultInput,
      teamSize: 1,
      tools: {
        ...defaultInput.tools,
        chatgpt: { plan: "Team ($25/user/mo)", spend: 25, seats: 1 },
      }
    };
    const result = auditSpend(input);
    const chatGptResult = result.toolResults.find(t => t.tool === "ChatGPT");
    expect(chatGptResult).toBeDefined();
    expect(chatGptResult?.recommendation).toContain("Downgrade to Plus");
    expect(chatGptResult?.savingsPerMonth).toBe(5);
  });

  it("3. User paying for both OpenAI API + ChatGPT Plus -> should flag redundancy", () => {
    const input: AuditInput = {
      ...defaultInput,
      tools: {
        ...defaultInput.tools,
        chatgpt: { plan: "Plus ($20/mo)", spend: 20, seats: 1 },
        openaiApi: { plan: "Active", spend: 50, seats: 0 },
      }
    };
    const result = auditSpend(input);
    const chatGptResult = result.toolResults.find(t => t.tool === "ChatGPT");
    expect(chatGptResult?.recommendation).toContain("Consolidate");
    expect(chatGptResult?.savingsPerMonth).toBe(20);
  });

  it("4. User on Claude Pro paying $20/mo, 1 seat, writing use case -> should show 'already optimal'", () => {
    const input: AuditInput = {
      ...defaultInput,
      primaryUseCase: "writing",
      tools: {
        ...defaultInput.tools,
        claude: { plan: "Pro ($20/mo)", spend: 20, seats: 1 },
      }
    };
    const result = auditSpend(input);
    const claudeResult = result.toolResults.find(t => t.tool === "Claude");
    expect(claudeResult?.recommendation).toBe("Already optimal");
    expect(claudeResult?.savingsPerMonth).toBe(0);
  });

  it("5. Total savings > $500/mo -> credexThreshold should be true", () => {
    const input: AuditInput = {
      ...defaultInput,
      teamSize: 10,
      tools: {
        ...defaultInput.tools,
        // High spend on something overkill
        cursor: { plan: "Enterprise (custom)", spend: 1000, seats: 10 },
      }
    };
    const result = auditSpend(input);
    expect(result.credexThreshold).toBe(true);
  });
});
