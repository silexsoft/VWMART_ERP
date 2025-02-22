
export const getStatusColor = (statusId: number | undefined) => {
  switch (statusId) {
    case 10:
    case 12:
    case 15:
      return "bg-yellow-500"; // Yellow
    case 20:
      return "bg-blue-500"; // Blue
    case 30:
      return "bg-green-500"; // Green
    case 40:
      return "bg-red-500"; // Red
    default:
      return "bg-gray-500"; // Default Gray for unknown statuses
  }
};

export const orderStatusMap: Record<number, string> = {
  10: "Packing Pending",
  12: "Invoicing Pending",
  15: "Pickup Pending",
  20: "In Transit",
  30: "Completed",
  40: "Cancelled"
};

export const paymentStatusMap: Record<number, string> = {
  10: "Pending",
  20: "Authorized",
  30: "Paid",
  35: "PartiallyRefunded",
  40: "Refunded",
  50: "Voided"
};