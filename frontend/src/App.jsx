import FindingsView from "./components/FindingsView";

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">BugHawk Dashboard</h1>
        <p className="text-muted-foreground mt-2">Findings View</p>
      </div>
      <FindingsView />
    </main>
  );
}