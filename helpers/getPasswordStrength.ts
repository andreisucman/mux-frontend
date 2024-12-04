export const requirements = [
  { re: /[0-9]/, label: "Add a number" },
  { re: /[a-z]/, label: "Add a lowercase letter" },
  { re: /[A-Z]/, label: "Add an uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Add a special symbol" },
];

export default function getPasswordStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;
  let requirement = "";

  if (password.length < 6) {
    requirement = "Add two more characters";
  }

  requirements.forEach((req) => {
    if (!req.re.test(password)) {
      requirement = req.label;
      multiplier += 1;
    }
  });

  return { score: Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0), requirement };
}
