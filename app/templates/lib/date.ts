const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("id-ID", {
  numeric: "auto",
});

const RELATIVE_DIVISIONS = [
  { amount: 60, unit: "second" as const },
  { amount: 60, unit: "minute" as const },
  { amount: 24, unit: "hour" as const },
  { amount: 7, unit: "day" as const },
  { amount: 4.34524, unit: "week" as const },
  { amount: 12, unit: "month" as const },
  { amount: Number.POSITIVE_INFINITY, unit: "year" as const },
];

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formatRelativeTime = (value?: string | Date | null) => {
  if (!value) {
    return "-";
  }

  const target = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(target.getTime())) {
    return "-";
  }

  const now = Date.now();
  let delta = (target.getTime() - now) / 1000;

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(delta) < division.amount) {
      return RELATIVE_FORMATTER.format(Math.round(delta), division.unit);
    }

    delta /= division.amount;
  }

  return RELATIVE_FORMATTER.format(0, "second");
};

export const formatDateShort = (value?: string | Date | null) => {
  if (!value) {
    return "-";
  }

  const target = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(target.getTime())) {
    return "-";
  }

  return DATE_FORMATTER.format(target);
};
