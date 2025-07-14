'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Globe, Star, User, Languages, Award, Users, Mail, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { mockProposals } from '../constants';
import * as React from 'react';

export default function AuditorProfilePage() {
  const params = useParams();
  const auditorId = Array.isArray(params?.profile) ? params.profile[0] : params?.profile;

  // Find the first proposal with this auditorId (mock logic)
  const proposal = mockProposals.find(p => p.auditorId === auditorId);
  const auditor = proposal
    ? {
        name: proposal.auditorName || 'Anonymous Auditor',
        verified: true,
        avatarUrl: '',
        jurisdictions: ['Germany', 'France', 'Malta'],
        experience: 12,
        specialization: 'IFRS & Group Audits',
        firmType: 'Boutique Audit Firm',
        teamSize: '3-5 Team Members',
        languages: ['English', 'German', 'French'],
        avgResponse: '2 hours',
        avgCompletion: '18 days',
        engagements: 47,
        rating: 4.9,
        reviews: 29,
        recentAudits: [
          'IFRS audit for eCommerce company (€22k)',
          'Consolidated group audit for EU holding company (€48k)',
          'GAPSME filing for local service provider (€8k)'
        ]
      }
    : null;

  if (!auditor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Auditor Not Found</h1>
        <p className="text-muted-foreground">No auditor profile found for this ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen h-screen bg-gradient-to-br from-background via-muted/60 to-background">
      <header className="w-full border-b px-6 py-6 bg-card/80 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-6 max-w-3xl mx-auto">
          <Avatar className="h-28 w-28 shadow-lg border-4 border-primary/30">
            <AvatarImage src={auditor.avatarUrl} alt={auditor.name} />
            <AvatarFallback className="rounded-lg text-3xl bg-muted">
              <User className="h-12 w-12 text-primary mx-auto" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-1">{auditor.name}
              {auditor.verified && (
                <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-600 text-base px-2 py-1">
                  <CheckCircle className="h-5 w-5 text-green-600" /> Verified
                </Badge>
              )}
            </h1>
            <div className="text-muted-foreground text-lg mt-1 font-medium">
              {auditor.firmType} <span className="mx-1">|</span> {auditor.teamSize}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex justify-center w-full overflow-y-auto max-h-[calc(100vh-120px)]">
        <div className="w-full max-w-3xl px-4 py-10 space-y-10">
          <Card className="shadow-2xl border border-primary/10 rounded-2xl bg-card/90">
            <CardContent className="space-y-8 p-8">
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Professional Summary</CardTitle>
                </div>
                <div className="flex flex-wrap gap-4 text-base font-medium">
                  <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> Licensed in {auditor.jurisdictions.join(', ')}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {auditor.experience} Years Experience</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> Specializing in {auditor.specialization}</span>
                </div>
              </section>
              <hr className="my-2 border-muted" />
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Languages & Performance</CardTitle>
                </div>
                <div className="flex flex-wrap gap-4 text-base font-medium">
                  <span>Languages: {auditor.languages.join(', ')}</span>
                  <span>Avg. Response Time: {auditor.avgResponse}</span>
                  <span>Avg. Completion Time: {auditor.avgCompletion}</span>
                </div>
              </section>
              <hr className="my-2 border-muted" />
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-xl">Reputation</CardTitle>
                </div>
                <div className="flex flex-wrap gap-4 text-base font-medium">
                  <span>{auditor.engagements} Successful Engagements via Sheetsway</span>
                  <span className="flex items-center gap-1"><Star className="h-5 w-5 text-yellow-500" /> {auditor.rating} / 5.0 (based on {auditor.reviews} client reviews)</span>
                </div>
              </section>
              <hr className="my-2 border-muted" />
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Most Recent Audits</CardTitle>
                </div>
                <ul className="list-disc ml-8 text-base space-y-1">
                  {auditor.recentAudits.map((audit, i) => (
                    <li key={i}>{audit}</li>
                  ))}
                </ul>
              </section>
              <div className="flex justify-center pt-6">
                <Button
                  variant="default"
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  disabled
                >
                  Contact Auditor (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 