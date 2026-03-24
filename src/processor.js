import { getWeather } from "./services/weatherService.js";
import { decisionEngine } from "./utils/decisionEngine.js";
import { generateMessage } from "./utils/messageGenerator.js";
import { logInfo, logError } from "./utils/logger.js";

async function processSingleOrder(order) {
  const baseResult = { ...order };
  try {
    logInfo(`Processing Order ${order.order_id} (${order.city})`);
    const weather = await getWeather(order.city);
    const agentOutput = decisionEngine(order, weather);
    const enrichedOrder = {
      ...baseResult,
      weather: agentOutput.observation.weather,
      severity: agentOutput.observation.severity,
      priority: agentOutput.decision.priority,
      decision_reason: agentOutput.explanation.reasoning,
      decision_details: agentOutput.explanation.decisionExplanation
    };
    if (agentOutput.decision.shouldDelay) {
      enrichedOrder.status = "Delayed";

      enrichedOrder.action_taken =
        agentOutput.decision.action === "Escalate"
          ? "Escalated to Operations"
          : "Customer Notified";

      enrichedOrder.message = generateMessage(order, weather);

    } else {
      enrichedOrder.status = "On-Time";
      enrichedOrder.action_taken = "No Action Required";
    }
    return enrichedOrder;

  } catch (error) {
    logError(`Order ${order.order_id} failed: ${error.message}`);

    return {
      ...baseResult,
      status: "Error",
      error: error.message,
      action_taken: "None"
    };
  }
}
export async function processOrders(orders) {
  logInfo("Starting concurrent order processing...");

  const results = await Promise.all(
    orders.map(order => processSingleOrder(order))
  );
  const summary = {
    total: orders.length,
    processed: 0,
    delayed: 0,
    escalations: 0,
    errors: 0
  };
  for (const order of results) {
    if (order.status === "Error") {
      summary.errors++;
      continue;
    }
    summary.processed++;
    if (order.status === "Delayed") {
      summary.delayed++;
    }

    if (order.action_taken === "Escalated to Operations") {
      summary.escalations++;
    }
  }

  return { results, summary };
}