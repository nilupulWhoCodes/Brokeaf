export const CREATE = "CREATE";
export const JOIN = "JOIN";
export const EDIT = "EDIT";

export const incomeCategories = [
  { id: 1, name: "Salary" },
  { id: 2, name: "Investments" },
  { id: 3, name: "Other" },
  { id: 4, name: "Gift" },
];
export const expensesCategories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Travelling" },
  { id: 3, name: "Households & Utilities" },
  { id: 4, name: "Personal & Health" },
  { id: 5, name: "Education" },
  { id: 6, name: "Clothes" },
  { id: 7, name: "Entertainment" },
  { id: 8, name: "Other" },
];

export const categoryIcons: Record<string, string> = {
  Food: "fastfood",
  Travelling: "flight",
  "Households & Utilities": "home",
  "Personal & Health": "favorite",
  Education: "school",
  Clothes: "checkroom",
  Entertainment: "sports-esports",

  // Income category icons
  Salary: "attach-money",
  Investments: "trending-up",
  Other: "more-horiz",
  Gift: "card-giftcard",
};
