import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";

interface Offer {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

function getOffers(quizData: any): Offer[] {
  const offers: Offer[] = [];

  // Student-focused offers
  if (quizData?.profession === 'student') {
    offers.push(
      {
        id: 'student-prime',
        title: 'Student Essentials Savings',
        description: 'Get discounts on textbooks, transit, and essential subscriptions with verified student status.',
        badge: 'Student'
      },
      {
        id: 'credit-builder',
        title: 'No-Annual-Fee Credit Builder',
        description: 'Start building credit with a secured card designed for first-time users. No credit history required.',
        badge: 'Credit'
      },
    );
  }

  // Limited/no-bank-access offers
  if (quizData?.bankAccess === 'limited-access' || quizData?.bankAccess === 'no-bank-account') {
    offers.push(
      {
        id: 'cash-friendly',
        title: 'Cash-Friendly Budgeting',
        description: 'Tools and tips for managing money with cash and prepaid options—no traditional bank account required.',
        badge: 'Inclusive'
      },
      {
        id: 'fee-free-prepaid',
        title: 'Low/No-Fee Prepaid Options',
        description: 'Find prepaid accounts with free cash reloads and no monthly maintenance fees.',
        badge: 'No Fees'
      },
    );
  }

  // Immigrant-focused offers
  if (quizData?.immigrantStatus === 'visa-holder' || quizData?.immigrantStatus === 'permanent-resident') {
    offers.push(
      {
        id: 'itin-guide',
        title: 'ITIN & No-SSN Banking Guide',
        description: 'Step-by-step guidance to open accounts using ITIN and build credit without an SSN.',
        badge: 'Guide'
      },
      {
        id: 'remittance-optimizer',
        title: 'Remittance Cost Optimizer',
        description: 'Reduce transfer costs with timing tips, FX spread awareness, and low-fee corridor suggestions.',
        badge: 'Save Fees'
      },
    );
  }

  // Gig worker offers
  if (quizData?.profession === 'gig-worker') {
    offers.push(
      {
        id: 'irregular-income',
        title: 'Irregular Income Toolkit',
        description: 'Stabilize cash flow with cushions, invoice strategies, and flexible savings rules.',
        badge: 'Toolkit'
      },
      {
        id: 'tax-set-aside',
        title: 'Auto Tax Set-Aside',
        description: 'Automate a % of each payout into tax savings so April is stress-free.',
        badge: 'Automation'
      },
    );
  }

  // General offer for all
  offers.push(
    {
      id: 'community-resources',
      title: 'Community Financial Resources',
      description: 'Trusted links: CFPB, FDIC, credit counseling, and local community support.',
      badge: 'Trusted'
    }
  );

  return offers;
}

export function OffersSection() {
  const { quizData } = useQuiz();
  const offers = getOffers(quizData);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-xl font-bold text-slate-900">Smart Offers for You</h3>
      </div>
      <p className="text-sm text-slate-600">Curated benefits and guidance based on your situation—no bank account required.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="p-4 border-2 border-slate-200 hover:border-indigo-200 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-slate-900">{offer.title}</h4>
              {offer.badge && (
                <span className="text-[10px] uppercase tracking-wide bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border">{offer.badge}</span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-3">{offer.description}</p>
            <Button variant="outline" size="sm">Learn more</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
