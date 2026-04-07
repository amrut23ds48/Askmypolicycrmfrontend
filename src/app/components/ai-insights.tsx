import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface InsightItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const insights: InsightItem[] = [
  {
    id: "1",
    title: "Unexpected Demand",
    description: "Users drop after shipping selection due to long loading time. Improve checkout process by simplifying shipping options and reducing form fields.",
    priority: "high"
  },
  {
    id: "2",
    title: "Project Delivery Risk",
    description: "Most users end on the payment step. Recommend enabling more payment methods and reducing form fields.",
    priority: "medium"
  },
  {
    id: "3",
    title: "Lead Quality Drop",
    description: "User engagement is declining. Consider implementing a loyalty program or promotional campaign.",
    priority: "medium"
  },
  {
    id: "4",
    title: "Surge in New Requests",
    description: "High traffic from social media campaigns. Prepare support team for increased inquiries.",
    priority: "low"
  },
  {
    id: "5",
    title: "High Conversion Opportunity",
    description: "Many clients showing interest in premium plans. Schedule personalized consultations to increase conversions.",
    priority: "high"
  },
];

export function AIInsights() {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set(["5"]));

  const toggleInsight = (id: string) => {
    setExpandedInsights((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <div className="size-2 rounded-full bg-red-500" />;
      case "medium":
        return <div className="size-2 rounded-full bg-orange-500" />;
      case "low":
        return <div className="size-2 rounded-full bg-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
          <Sparkles className="size-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Insight</h3>
          <p className="text-xs text-muted-foreground">Actionable insights powered by AI</p>
        </div>
      </div>

      <div className="space-y-2">
        {insights.map((insight) => {
          const isExpanded = expandedInsights.has(insight.id);
          return (
            <div
              key={insight.id}
              className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              <button
                onClick={() => toggleInsight(insight.id)}
                className="w-full p-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getPriorityIcon(insight.priority)}
                  <span className="text-sm font-medium">{insight.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>
              {isExpanded && (
                <div className="p-3 bg-card text-sm text-muted-foreground">
                  {insight.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
