import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Cpu, Terminal, CheckCircle2, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SCAN_STEPS = [
    { label: "Extracting archive contents...", progress: 20, icon: Terminal },
    { label: "Running ESLint & code cleanliness audit...", progress: 45, icon: Cpu },
    { label: "Running Semgrep static security patterns...", progress: 75, icon: ShieldCheck },
    { label: "Aggregating findings & building health report...", progress: 95, icon: Loader2 },
];

export default function AnalysisStatus({ fileName, onComplete, onReset }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(15);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Phase 3 real API aane tak step-by-step progress simulate ho rahi hai
        const interval = setInterval(() => {
            setCurrentStepIndex((prevIndex) => {
                if (prevIndex < SCAN_STEPS.length - 1) {
                    const nextIndex = prevIndex + 1;
                    setProgress(SCAN_STEPS[nextIndex].progress);
                    return nextIndex;
                } else {
                    clearInterval(interval);
                    setProgress(100);
                    setIsFinished(true);
                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, 800);
                    return prevIndex;
                }
            });
        }, 1200);

        return () => clearInterval(interval);
    }, [onComplete]);

    const activeStep = SCAN_STEPS[currentStepIndex];
    const StepIcon = isFinished ? CheckCircle2 : activeStep.icon;

    return (
        <Card className="w-full border-border bg-card/60 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6 flex flex-col gap-4">
                {/* Top Header Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                            <StepIcon className={`h-5 w-5 ${!isFinished ? "animate-spin" : "text-green-500"}`} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                {isFinished ? "Analysis Complete" : "Processing Codebase..."}
                            </h3>
                            <p className="text-xs text-muted-foreground font-mono truncate max-w-[240px] md:max-w-md">
                                {fileName || "uploaded-project.zip"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant={isFinished ? "default" : "secondary"} className="uppercase text-[11px] font-mono">
                            {isFinished ? "ready" : "scanning"}
                        </Badge>
                        {onReset && (
                            <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 text-xs">
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{isFinished ? "Report generated successfully" : activeStep.label}</span>
                        <span className="font-mono font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step Progression Pills */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    {SCAN_STEPS.map((step, idx) => {
                        const isDone = idx < currentStepIndex || isFinished;
                        const isCurrent = idx === currentStepIndex && !isFinished;

                        return (
                            <div
                                key={step.label}
                                className={`text-[11px] p-2 rounded border transition-colors flex items-center gap-1.5 ${isDone
                                        ? "border-primary/40 bg-primary/5 text-foreground"
                                        : isCurrent
                                            ? "border-primary bg-background font-medium text-primary shadow-xs"
                                            : "border-border/50 text-muted-foreground/60"
                                    }`}
                            >
                                <div
                                    className={`h-1.5 w-1.5 rounded-full ${isDone ? "bg-primary" : isCurrent ? "bg-primary animate-ping" : "bg-muted-foreground/30"
                                        }`}
                                />
                                <span className="truncate">{step.label.split(" ")[0]}</span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}