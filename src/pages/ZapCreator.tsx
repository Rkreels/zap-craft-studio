
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { toast } from "@/hooks/use-toast";

export default function ZapCreator() {
  const handleSave = (steps: any[]) => {
    // In a real app, we would save this to a database
    console.log("Saving workflow:", steps);
    toast({
      title: "Workflow saved",
      description: "Your Zap has been saved and is now active.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-16"> {/* pb-16 to account for the fixed bottom bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Untitled Zap"
          className="text-2xl font-bold border-0 border-b-2 border-transparent focus:border-purple-500 focus:outline-none focus:ring-0 bg-transparent w-full"
          defaultValue="Untitled Zap"
        />
      </div>

      <WorkflowBuilder onSave={handleSave} />
    </div>
  );
}
