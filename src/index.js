import { readOrders, writeOrders } from "./fileHandler.js";
import { processOrders } from "./processor.js";
import { logInfo, logError } from "./utils/logger.js";

function printFlow() {
  console.log(`
================= AI DELIVERY AGENT FLOW =================

[ORDER INGESTION]
        ↓
[PARALLEL WEATHER FETCH]
        ↓
[AI DECISION ENGINE]
        ↓
[DELAY DETECTION & PRIORITIZATION]
        ↓
[ACTION EXECUTION (NOTIFY / ESCALATE)]
        ↓
[ORDER UPDATE & REPORTING]

=========================================================
`);
}

function printSummary(summary) {
  console.log(`
-------------------------------
AI DELIVERY AGENT REPORT
-------------------------------
Total Orders:      ${summary.total}
Processed:         ${summary.processed}
Delayed:           ${summary.delayed}
Escalations:       ${summary.escalations}
Errors:            ${summary.errors}

System Status:     ${summary.errors > 0 ? "DEGRADED" : "STABLE"}
-------------------------------
`);
}

async function main() {
  console.log("\nAI Delivery Agent Activated\n");

  printFlow();

  try {
    logInfo("Loading orders from data source...");
    const orders = await readOrders();

    if (!orders.length) {
      throw new Error("No orders found to process");
    }

    logInfo("Processing orders using concurrent execution...");
    const { results, summary } = await processOrders(orders);

    logInfo("Writing updated orders to data source...");
    await writeOrders(results);

    printSummary(summary);

    logInfo("Execution completed successfully");

  } catch (error) {
    logError(`SYSTEM FAILURE: ${error.message}`);
    console.error("\nExecution terminated due to critical failure\n");
  }
}

main();