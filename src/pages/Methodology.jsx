import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Database, Brain, Users, Scale, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const sections = [
  {
    icon: Database,
    title: "Data Sources",
    color: "bg-blue-500",
    content: [
      { name: "Environment Canada", description: "Climate data, weather patterns, flood risk zones" },
      { name: "Census Data", description: "Population demographics, income levels, vulnerable communities" },
      { name: "OpenStreetMap", description: "Infrastructure locations, road networks, facilities" },
      { name: "Municipal Records", description: "Asset registries, maintenance history, condition assessments" },
      { name: "Natural Resources Canada", description: "Wildfire risk data, seismic zones, geological surveys" }
    ]
  },
  {
    icon: Brain,
    title: "Risk Assessment Methodology",
    color: "bg-purple-500",
    content: `Our risk assessment uses an interpretable machine learning approach (XGBoost) with SHAP (SHapley Additive exPlanations) values for transparency. Each risk score is calculated based on:

• **Exposure** - Physical location relative to hazard zones
• **Vulnerability** - Asset condition, age, and design standards
• **Consequence** - Population served and economic impact
• **Adaptive Capacity** - Existing resilience measures

Confidence levels reflect data quality and model certainty. All assessments undergo validation against historical events.`
  },
  {
    icon: Scale,
    title: "Investment Prioritization",
    color: "bg-emerald-500",
    content: `Multi-Criteria Decision Analysis (MCDA) framework aligned with Treasury Board guidelines:

• **Risk Reduction Impact** (30%) - Expected decrease in vulnerability
• **Cost-Benefit Ratio** (25%) - Value per dollar invested
• **Population Benefit** (25%) - Number of people protected
• **Equity Score** (20%) - Priority for vulnerable populations

Scoring is normalized across all projects to enable fair comparison and transparent decision-making.`
  },
  {
    icon: Users,
    title: "Equity Lens",
    color: "bg-rose-500",
    content: `In accordance with GBA+ (Gender-Based Analysis Plus) requirements and the Accessible Canada Act, our equity assessment considers:

• Senior population concentration (65+)
• Low-income household prevalence
• Indigenous and First Nations communities
• Remote and isolated locations
• Accessibility requirements

Assets serving vulnerable populations receive priority weighting in investment decisions.`
  }
];

const ethicalPrinciples = [
  { icon: Shield, title: "Human Decision Authority", description: "All final investment decisions rest with human authorities. AI provides decision support only." },
  { icon: AlertTriangle, title: "Bias Acknowledgment", description: "We acknowledge potential biases in historical data and actively work to mitigate them." },
  { icon: FileText, title: "Audit Transparency", description: "All assessments include full audit logs, data sources, and methodology documentation." },
  { icon: CheckCircle, title: "No Autonomous Actions", description: "The system makes no autonomous enforcement or approval decisions." }
];

export default function Methodology() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Methodology & Ethics
            </h1>
            <p className="text-slate-500 mt-1">
              Transparent, accountable, and evidence-based
            </p>
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${section.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(section.content) ? (
                      <div className="space-y-3">
                        {section.content.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge variant="outline" className="mt-0.5">{item.name}</Badge>
                            <span className="text-sm text-slate-600">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="prose prose-slate max-w-none">
                        {section.content.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-slate-600 whitespace-pre-line">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Responsible AI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <Shield className="w-6 h-6 text-blue-600" />
                Responsible AI Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ethicalPrinciples.map((principle, index) => {
                  const Icon = principle.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{principle.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{principle.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Known Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Climate projections carry inherent uncertainty, particularly for long-term (30-year) horizons
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Historical data may not capture unprecedented events or compound risks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Local microclimates and site-specific conditions require on-ground validation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Cost estimates are indicative and subject to market conditions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  Model updates may affect historical comparisons
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policy Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-6 bg-slate-900 rounded-xl text-white"
        >
          <h3 className="text-lg font-semibold mb-4">Policy Alignment</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'GC Digital Standards',
              'Directive on Automated Decision-Making',
              'Treasury Board Investment Guidelines',
              'Accessible Canada Act',
              'GBA+ Framework',
              'IPCC AR6 Climate Scenarios'
            ].map((policy, idx) => (
              <Badge key={idx} variant="secondary" className="bg-slate-700 text-slate-200">
                {policy}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}