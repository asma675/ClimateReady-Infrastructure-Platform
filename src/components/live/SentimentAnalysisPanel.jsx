import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { govData } from '@/api/dataClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SentimentAnalysisPanel() {
  const { data: socialAlerts = [] } = useQuery({
    queryKey: ['social-alerts'],
    queryFn: () => govData.entities.RiskAlert.filter({ 
      alert_type: 'social_media',
      status: 'active'
    }, '-issued_at', 10),
    refetchInterval: 60000,
  });

  const latestAlert = socialAlerts[0];
  const sentiment = latestAlert?.sentiment_analysis;

  const getConcernColor = (level) => {
    switch(level) {
      case 'critical': return 'text-rose-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      default: return 'text-blue-600';
    }
  };

  const getConcernBg = (level) => {
    switch(level) {
      case 'critical': return 'bg-rose-50 border-rose-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (!sentiment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-500" />
            Social Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No recent social media analysis</p>
            <p className="text-xs text-slate-400 mt-1">Data updates every 5 minutes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Social Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Concern Level */}
        <div className={`p-4 rounded-lg border ${getConcernBg(sentiment.concern_level)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Public Concern Level</span>
            <Badge className={`${getConcernColor(sentiment.concern_level)} bg-white`}>
              {sentiment.concern_level?.toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Sentiment Score</span>
              <span className="font-medium">{sentiment.sentiment_score}/100</span>
            </div>
            <Progress value={sentiment.sentiment_score} className="h-2" />
          </div>
        </div>

        {/* Key Topics */}
        {sentiment.key_topics && sentiment.key_topics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {sentiment.key_topics.map((topic, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  #{topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Sample Posts */}
        {sentiment.sample_posts && sentiment.sample_posts.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Recent Posts</h4>
            <div className="space-y-2">
              {sentiment.sample_posts.slice(0, 3).map((post, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-2 bg-slate-50 rounded text-xs text-slate-600 border border-slate-100"
                >
                  <MessageSquare className="w-3 h-3 inline-block mr-1 text-slate-400" />
                  "{post}"
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Alert Info */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <AlertCircle className="w-3 h-3" />
          <span>Based on {socialAlerts.length} recent social media analysis</span>
        </div>
      </CardContent>
    </Card>
  );
}