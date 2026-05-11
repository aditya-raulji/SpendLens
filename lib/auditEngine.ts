export type ToolInput = {
  plan: string;
  spend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "data analysis" | "research" | "mixed";
  tools: {
    cursor: ToolInput;
    copilot: ToolInput;
    claude: ToolInput;
    chatgpt: ToolInput;
    anthropicApi: ToolInput;
    openaiApi: ToolInput;
    gemini: ToolInput;
    windsurf: ToolInput;
  };
};

export type ToolResult = {
  tool: string;
  currentPlan: string;
  currentMonthlyCost: number;
  recommendation: string;
  recommendedMonthlyCost: number;
  savingsPerMonth: number;
  reason: string;
};

export type AuditResult = {
  teamSize: number;
  useCase: string;
  totalCurrentSpend: number;
  toolResults: ToolResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  credexThreshold: boolean;
};

const planPrices: Record<string, Record<string, number>> = {
  cursor: {
    "Hobby ($0)": 0,
    "Pro ($20/user/mo)": 20,
    "Business ($40/user/mo)": 40,
  },
  copilot: {
    "Individual ($10/user/mo)": 10,
    "Business ($19/user/mo)": 19,
    "Enterprise ($39/user/mo)": 39,
  },
  claude: {
    "Free ($0)": 0,
    "Pro ($20/mo)": 20,
    "Max ($100/mo)": 100,
    "Team ($25/user/mo)": 25,
  },
  chatgpt: {
    "Plus ($20/mo)": 20,
    "Team ($25/user/mo)": 25,
  },
  gemini: {
    "Pro ($19.99/mo)": 19.99,
    "Ultra ($249.99/mo)": 249.99,
  },
  windsurf: {
    "Free ($0)": 0,
    "Pro ($15/user/mo)": 15,
    "Teams ($35/user/mo)": 35,
  }
};

const toolNames: Record<string, string> = {
  cursor: "Cursor",
  copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropicApi: "Anthropic API",
  openaiApi: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf"
};

export function auditSpend(input: AuditInput): AuditResult {
  const results: ToolResult[] = [];
  let totalCurrentSpend = 0;
  
  for (const [_, tool] of Object.entries(input.tools)) {
    if (tool.plan !== "None") {
      totalCurrentSpend += tool.spend;
    }
  }

  const { teamSize, primaryUseCase, tools } = input;

  for (const [toolId, tool] of Object.entries(tools)) {
    if (tool.plan === "None") continue;

    const toolName = toolNames[toolId] || toolId;
    let recommendedPlan = tool.plan;
    let recommendedMonthlyCost = tool.spend;
    let recommendation = "Already optimal";
    let reason = "Your current plan fits your usage well.";
    let updated = false;

    // 1. Check discrepancy (if not custom/api)
    if (planPrices[toolId] && planPrices[toolId][tool.plan] !== undefined) {
      const expectedCost = planPrices[toolId][tool.plan] * (tool.seats || 1);
      if (Math.abs(tool.spend - expectedCost) > 1) {
         if (tool.spend > expectedCost) {
            reason = `You are spending $${tool.spend} but expected cost for ${tool.seats} seats is $${expectedCost}. Check for unassigned seats.`;
            recommendation = "Remove unused seats";
            recommendedMonthlyCost = expectedCost;
            updated = true;
         }
      }
    }

    // 2. Plan fit rules
    const isTeamPlan = tool.plan.includes("Business") || tool.plan.includes("Team") || tool.plan.includes("Teams");
    if (isTeamPlan && tool.seats <= 2) {
      if (toolId === "cursor") {
         recommendedPlan = "Pro ($20/user/mo)";
         recommendedMonthlyCost = 20 * tool.seats;
         recommendation = "Downgrade to Pro";
         reason = `Cursor Pro offers everything you need for <=2 seats, saving $${(40-20)*tool.seats}/mo.`;
         updated = true;
      } else if (toolId === "copilot") {
         recommendedPlan = "Individual ($10/user/mo)";
         recommendedMonthlyCost = 10 * tool.seats;
         recommendation = "Downgrade to Individual";
         reason = `Individual plans are significantly cheaper for small teams of ${tool.seats}.`;
         updated = true;
      } else if (toolId === "chatgpt") {
         recommendedPlan = "Plus ($20/mo)";
         recommendedMonthlyCost = 20 * tool.seats;
         recommendation = "Downgrade to Plus";
         reason = `For <=2 seats, individual Plus accounts are cheaper than Team.`;
         updated = true;
      } else if (toolId === "claude") {
         recommendedPlan = "Pro ($20/mo)";
         recommendedMonthlyCost = 20 * tool.seats;
         recommendation = "Downgrade to Pro";
         reason = `For <=2 seats, individual Pro accounts are cheaper than Team.`;
         updated = true;
      } else if (toolId === "windsurf") {
         recommendedPlan = "Pro ($15/user/mo)";
         recommendedMonthlyCost = 15 * tool.seats;
         recommendation = "Downgrade to Pro";
         reason = `Pro is cheaper and perfectly suited for a team size of ${tool.seats}.`;
         updated = true;
      }
    }

    if (tool.plan.includes("Enterprise") && teamSize <= 50 && !updated) {
      if (toolId === "cursor") {
         recommendedPlan = "Business ($40/user/mo)";
         recommendedMonthlyCost = 40 * tool.seats;
         recommendation = "Downgrade to Business";
         reason = `Enterprise is typically overkill for <50 seats. Business provides strong features.`;
         updated = true;
      } else if (toolId === "copilot") {
         recommendedPlan = "Business ($19/user/mo)";
         recommendedMonthlyCost = 19 * tool.seats;
         recommendation = "Downgrade to Business";
         reason = `Enterprise is overkill for <50 seats. Copilot Business is likely sufficient.`;
         updated = true;
      } else if (toolId === "chatgpt") {
         recommendedPlan = "Team ($25/user/mo)";
         recommendedMonthlyCost = 25 * tool.seats;
         recommendation = "Downgrade to Team";
         reason = `Enterprise requires a huge commitment. Team plan is better for <50 seats.`;
         updated = true;
      }
    }

    // 3. Alternative Tool Rules
    if (primaryUseCase === "coding" && !updated) {
      if (toolId === "chatgpt" && tool.plan.includes("Plus") && tools.cursor.plan === "None" && tools.copilot.plan === "None") {
         recommendation = "Switch to Cursor Pro";
         reason = `For coding, Cursor Pro offers native IDE integration and is a better value than ChatGPT Plus.`;
         updated = true;
      }
      if (toolId === "copilot" && tool.plan.includes("Business") && tools.cursor.plan === "None") {
         recommendation = "Compare with Cursor Pro";
         reason = `Cursor Pro is similarly priced but often considered better for small teams.`;
         updated = true;
      }
    } else if (primaryUseCase === "writing" && !updated) {
      if (toolId === "cursor" || toolId === "copilot" || toolId === "windsurf") {
         recommendation = "Consider Claude Pro";
         reason = `Claude Pro excels at writing tasks and might replace expensive coding tools.`;
         recommendedMonthlyCost = 0; // assuming they drop it entirely
         updated = true;
      }
    } else if (primaryUseCase === "research" && !updated) {
      if (toolId === "chatgpt" && tool.plan.includes("Enterprise")) {
         recommendation = "Check Claude Team";
         reason = `Claude's 200k context window is excellent for research, often at a lower cost than ChatGPT Enterprise.`;
         updated = true;
      }
    }

    // 4. Overspend Flags
    if (toolId === "chatgpt" && tool.plan.includes("Plus") && tools.openaiApi.plan !== "None") {
      recommendation = "Consolidate to API";
      reason = `Paying for both OpenAI API Direct and ChatGPT Plus is redundant. Consider dropping Plus.`;
      recommendedMonthlyCost = 0;
      updated = true;
    }
    if (toolId === "claude" && tool.plan.includes("Pro") && tools.anthropicApi.plan !== "None") {
      recommendation = "Consolidate to API";
      reason = `Paying for both Anthropic API and Claude Pro is redundant. Consider dropping Pro.`;
      recommendedMonthlyCost = 0;
      updated = true;
    }

    let savingsPerMonth = Math.max(0, tool.spend - recommendedMonthlyCost);

    results.push({
      tool: toolName,
      currentPlan: tool.plan,
      currentMonthlyCost: tool.spend,
      recommendation,
      recommendedMonthlyCost,
      savingsPerMonth,
      reason,
    });
  }

  const totalMonthlySavings = results.reduce((acc, r) => acc + r.savingsPerMonth, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Total monthly AI spend > $500 and team size < 5 -> Credex flag
  const credexThreshold = totalMonthlySavings > 500 || (totalCurrentSpend > 500 && teamSize < 5);

  return {
    teamSize,
    useCase: primaryUseCase,
    totalCurrentSpend,
    toolResults: results,
    totalMonthlySavings,
    totalAnnualSavings,
    credexThreshold,
  };
}
