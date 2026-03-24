export function generateMessage(order, weather) {
  return `Hi ${order.customer}, your order (#${order.order_id}) to ${order.city} is delayed due to ${weather.toLowerCase()}. We appreciate your patience.`;
}