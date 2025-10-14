import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, Eye, Edit, Trash } from "lucide-react";

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Documents</h1>
          <p className="text-muted-foreground mt-2">
            Contrats, certificats et documents administratifs
          </p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground">
          <Upload className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-institutional-blue mx-auto mb-4" />
            <h3 className="font-semibold">Contrats</h3>
            <p className="text-sm text-muted-foreground mt-2">156 documents</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-institutional-green mx-auto mb-4" />
            <h3 className="font-semibold">Certificats</h3>
            <p className="text-sm text-muted-foreground mt-2">89 documents</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold">Autres</h3>
            <p className="text-sm text-muted-foreground mt-2">23 documents</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Documents récents</CardTitle>
          <CardDescription>Derniers documents ajoutés ou modifiés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-institutional-blue" />
                  <div>
                    <h4 className="font-medium">Contrat Agent {i}</h4>
                    <p className="text-sm text-muted-foreground">Mis à jour il y a 2 jours</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}