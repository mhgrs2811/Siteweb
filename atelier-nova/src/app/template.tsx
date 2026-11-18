import { PageTransition } from "@/components/layout/PageTransition";

/** Le template est remonté à chaque navigation : il porte la transition entre pages. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
