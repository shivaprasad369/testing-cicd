import Sum from "@/components/sum";
import UserDashboard from "@/components/Dashboard";
export default function Home() {
  return (
    <div>
      <Sum a={1} b={2} />
      <UserDashboard />
    </div>
  );
}
