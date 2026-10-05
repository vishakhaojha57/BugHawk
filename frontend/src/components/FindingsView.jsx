import React, { useState, useMemo, useEffect } from "react";
import mockFindings from "@/mocks/findings.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function FindingsView() {
  const [findings, setFindings] = useState(mockFindings);

  // State Verification: console.log se print karke check karein
  useEffect(() => {
    console.log("Loaded Mock Findings:", findings);
  }, [findings]);

  // Calculations for cards
  const totalIssues = findings.length;
  const criticalIssues = useMemo(() => findings.filter(f => f.severity === "CRITICAL").length, [findings]);
  // High / Medium Issues logic
  const highMediumIssues = useMemo(() => findings.filter(f => f.severity === "HIGH" || f.severity === "MEDIUM").length, [findings]);

  return (
    <div className="w-full max-w-6xl space-y-6 mt-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIssues}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalIssues}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High / Medium Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{highMediumIssues}</div>
          </CardContent>
        </Card>
      </div>

      {/* Findings Table */}
      <div className="rounded-md border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Category / Tool</TableHead>
              <TableHead>Location (file:line)</TableHead>
              <TableHead>Rule ID & Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {findings.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge variant={(item.severity === "CRITICAL" || item.severity === "HIGH") ? "destructive" : (item.severity === "MEDIUM" ? "default" : "secondary")}>
                    {item.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{item.category}</div>
                  <div className="text-xs text-muted-foreground">{item.sourceTool}</div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {item.file}:{item.line}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{item.rule}</div>
                  <div className="text-sm text-muted-foreground">{item.message}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
