import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔍 Vérification des données avant envoi
    console.log("Email envoyé :", email);
    console.log("Password envoyé :", password);

    try {
      const res = await api.post("/login", { email, password });

      console.log("Réponse API :", res.data);

      const { role, token, user } = res.data;

      // Sauvegarde du token et des infos utilisateur
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user.id.toString());

      toast.success("Connexion réussie !");

      // Redirection selon le rôle
      if (role === "admin") navigate("/");
      else if (role === "agent") navigate("/agent/espace");
      else navigate("/");
    } catch (error: any) {
      console.error("Erreur API :", error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error("Identifiants incorrects. Vérifiez votre email ou mot de passe.");
      } else if (error.response?.status === 422) {
        toast.error("Données invalides. Vérifiez les champs saisis.");
      } else {
        toast.error(error.response?.data?.message || "Échec de connexion au serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-700 text-white placeholder-gray-400 border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Mot de passe</label>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-700 text-white placeholder-gray-400 border-gray-600"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
