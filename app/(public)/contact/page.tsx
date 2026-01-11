"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        setError(data.error || "A apărut o eroare. Te rugăm să încerci din nou.");
      }
    } catch (err) {
      setError("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          Contact
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px]">
          Ai întrebări sau sugestii? Ne-ar face plăcere să auzim de la tine. Completează
          formularul de mai jos și îți vom răspunde în cel mai scurt timp posibil.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Trimite-ne un Mesaj</CardTitle>
            <CardDescription>
              Completează formularul și îți vom răspunde în cel mai scurt timp posibil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckCircle2 className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mesaj Trimis cu Succes!</h3>
                <p className="text-muted-foreground mb-4">
                  Îți mulțumim pentru mesaj. Îți vom răspunde în cel mai scurt timp
                  posibil.
                </p>
                <Button onClick={() => setSuccess(false)}>
                  Trimite Alt Mesaj
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nume Complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="Ion Popescu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      placeholder="ion.popescu@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subiect *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    placeholder="Despre ce vrei să discutăm?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mesaj *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={6}
                    placeholder="Scrie mesajul tău aici..."
                  />
                </div>
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    "Se trimite..."
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      Trimite Mesaj
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

