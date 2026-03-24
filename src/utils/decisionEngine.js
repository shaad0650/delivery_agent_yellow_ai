const WEATHER_RULES = {
  Rain: {
    severity: "Moderate",
    delay: true,
    priority: "Normal",
    action: "Notify"
  },
  Snow: {
    severity: "Moderate",
    delay: true,
    priority: "Normal",
    action: "Notify"
  },
  Thunderstorm: {
    severity: "High",
    delay: true,
    priority: "High",
    action: "Escalate"
  },
  Extreme: {
    severity: "Critical",
    delay: true,
    priority: "High",
    action: "Escalate"
  },
  Clear: {
    severity: "Low",
    delay: false,
    priority: "Low",
    action: "None"
  },
  Clouds: {
    severity: "Low",
    delay: false,
    priority: "Low",
    action: "None"
  }
};

const DEFAULT_RULE = {
  severity: "Unknown",
  delay: false,
  priority: "Low",
  action: "Monitor"
};

function generateReasoning(context) {
  const { weather, severity, city } = context;

  return `Observed weather condition '${weather}' in ${city} with severity classified as '${severity}'. Based on operational thresholds, ${
    severity === "Low"
      ? "no delivery disruption is expected."
      : "delivery disruption risk is elevated."
  }`;
}
function generateDecisionExplanation(context) {
  const { delay, action, priority } = context;

  if (!delay) {
    return "No action required. System will continue monitoring conditions.";
  }

  if (action === "Escalate") {
    return `High-risk disruption detected. Escalation triggered with priority '${priority}'.`;
  }

  return `Moderate disruption detected. Customer notification initiated with priority '${priority}'.`;
}

export function decisionEngine(order, weather) {
  const rule = WEATHER_RULES[weather] || DEFAULT_RULE;
  const context = {
    orderId: order.order_id,
    city: order.city,
    weather,
    ...rule
  };
  const reasoning = generateReasoning(context);
  const decisionExplanation = generateDecisionExplanation(context);

  return {
    observation: {
      weather: context.weather,
      severity: context.severity
    },

    decision: {
      shouldDelay: context.delay,
      priority: context.priority,
      action: context.action
    },

    explanation: {
      reasoning,
      decisionExplanation
    }
  };
}