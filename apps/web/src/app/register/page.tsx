import { redirect } from "next/navigation";

// Registration and login are the same thing with Discord OAuth.
export default function RegisterPage() {
  redirect("/login");
}
