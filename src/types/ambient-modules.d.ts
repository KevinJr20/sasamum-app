// Allow imports that include a version suffix like `library@1.2.3` to be
// treated as `any` during typechecking. The project currently imports some
// packages using that pattern (e.g. `lucide-react@0.487.0`) which TypeScript
// cannot resolve. This declaration allows a quick incremental pass so we can
// run the typechecker and then fix individual files progressively.

declare module '*@*' {
  const mod: any;
  export default mod;
}

// Fallback for any other unknown module names (optional, keeps the compiler
// quiet for quick iteration). Remove or narrow these once real types are
// available for the packages used.
declare module '*';
