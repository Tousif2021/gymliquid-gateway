
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";

const Scanner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">QR Scanner</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-64 h-64 border-2 border-dashed border-primary rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-16 h-16 text-primary opacity-50" />
            </div>
            <p className="text-center text-muted-foreground">
              Position the QR code within the frame to scan
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scanner;
