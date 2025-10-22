declare module "httpntlm" {
  // You are telling the compiler that 'httpntlm' has a function called 'get'
  // with a generic structure to stop the compile-time error.
  export function get(
    options: HttpNtlmOptions,
    callback: (err: unknown, res: HttpNtlmResponse) => void
  ): void;
}
