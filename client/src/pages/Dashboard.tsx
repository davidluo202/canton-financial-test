import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, Download, Mail, TrendingUp, MessageSquare, ThumbsUp, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function Dashboard() {
  const { language } = useLanguage();
  const [trendDays, setTrendDays] = useState(7);
  const [refreshing, setRefreshing] = useState(false);

  // 获取实时统计
  const { data: overviewStats, refetch: refetchOverview } = trpc.dashboard.getOverviewStats.useQuery();
  
  // 获取满意度趋势
  const { data: trendData, refetch: refetchTrend } = trpc.dashboard.getSatisfactionTrend.useQuery({ days: trendDays });
  
  // 获取热门问题
  const { data: popularQuestions, refetch: refetchQuestions } = trpc.dashboard.getPopularQuestions.useQuery({ limit: 10, days: 7 });
  
  // 获取低评分对话
  const { data: lowRatedConversations, refetch: refetchLowRated } = trpc.dashboard.getLowRatedConversations.useQuery({ limit: 20, days: 7 });

  // 手动触发报告发送
  const sendReportMutation = trpc.email.sendDailyReport.useMutation({
    onSuccess: () => {
      toast.success(language === 'zh' ? '報告已成功發送！' : 'Report sent successfully!');
    },
    onError: (error) => {
      toast.error(language === 'zh' ? `發送失敗：${error.message}` : `Failed to send: ${error.message}`);
    },
  });

  // 刷新所有数据
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchOverview(),
      refetchTrend(),
      refetchQuestions(),
      refetchLowRated(),
    ]);
    setRefreshing(false);
    toast.success(language === 'zh' ? '數據已更新' : 'Data refreshed');
  };

  // 导出数据为CSV
  const handleExportCSV = () => {
    if (!lowRatedConversations) return;

    const csvContent = [
      ['ID', 'User Message', 'AI Response', 'Language', 'Created At', 'Rated At'].join(','),
      ...lowRatedConversations.map((conv: any) => [
        conv.id,
        `"${conv.userMessage.replace(/"/g, '""')}"`,
        `"${conv.aiResponse.replace(/"/g, '""')}"`,
        conv.language,
        new Date(conv.createdAt).toLocaleString(),
        new Date(conv.ratedAt).toLocaleString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `low-rated-conversations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success(language === 'zh' ? 'CSV文件已導出' : 'CSV file exported');
  };

  const t = {
    title: language === 'zh' ? 'AI Chatbot 管理後台' : 'AI Chatbot Dashboard',
    subtitle: language === 'zh' ? '實時監控對話數據和滿意度趨勢' : 'Monitor conversation data and satisfaction trends in real-time',
    overview: language === 'zh' ? '概覽' : 'Overview',
    trends: language === 'zh' ? '趨勢分析' : 'Trends',
    questions: language === 'zh' ? '熱門問題' : 'Popular Questions',
    lowRated: language === 'zh' ? '低評分對話' : 'Low-Rated Conversations',
    totalConversations: language === 'zh' ? '今日對話數' : 'Today\'s Conversations',
    activeUsers: language === 'zh' ? '活躍用戶' : 'Active Users',
    satisfactionRate: language === 'zh' ? '滿意度' : 'Satisfaction Rate',
    positiveRatings: language === 'zh' ? '正面評分' : 'Positive Ratings',
    refresh: language === 'zh' ? '刷新數據' : 'Refresh Data',
    sendReport: language === 'zh' ? '發送報告' : 'Send Report',
    exportCSV: language === 'zh' ? '導出CSV' : 'Export CSV',
    last7Days: language === 'zh' ? '過去7天' : 'Last 7 Days',
    last30Days: language === 'zh' ? '過去30天' : 'Last 30 Days',
    conversationTrend: language === 'zh' ? '對話趨勢' : 'Conversation Trend',
    satisfactionTrend: language === 'zh' ? '滿意度趨勢' : 'Satisfaction Trend',
    question: language === 'zh' ? '問題' : 'Question',
    count: language === 'zh' ? '次數' : 'Count',
    userMessage: language === 'zh' ? '用戶問題' : 'User Question',
    aiResponse: language === 'zh' ? 'AI回覆' : 'AI Response',
    time: language === 'zh' ? '時間' : 'Time',
    noData: language === 'zh' ? '暫無數據' : 'No data available',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t.title}</h1>
            <p className="text-slate-600 dark:text-slate-400">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {t.refresh}
            </Button>
            <Button
              variant="outline"
              onClick={() => sendReportMutation.mutate()}
              disabled={sendReportMutation.isPending}
            >
              <Mail className="w-4 h-4 mr-2" />
              {t.sendReport}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              {t.exportCSV}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.totalConversations}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.totalConversations || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'zh' ? `中文: ${overviewStats?.chineseConversations || 0} | 英文: ${overviewStats?.englishConversations || 0}` : `Chinese: ${overviewStats?.chineseConversations || 0} | English: ${overviewStats?.englishConversations || 0}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.activeUsers}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewStats?.uniqueUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'zh' ? '估算值' : 'Estimated'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.satisfactionRate}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (overviewStats?.satisfactionRate || 0) >= 70 ? 'text-green-600' :
                (overviewStats?.satisfactionRate || 0) >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {overviewStats?.satisfactionRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'zh' ? `共 ${overviewStats?.totalRatings || 0} 個評分` : `${overviewStats?.totalRatings || 0} ratings`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.positiveRatings}</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                👍 {overviewStats?.positiveRatings || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                👎 {overviewStats?.negativeRatings || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">{t.trends}</TabsTrigger>
            <TabsTrigger value="questions">{t.questions}</TabsTrigger>
            <TabsTrigger value="lowRated">{t.lowRated}</TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t.satisfactionTrend}</CardTitle>
                    <CardDescription>{language === 'zh' ? '過去幾天的滿意度變化' : 'Satisfaction changes over time'}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={trendDays === 7 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTrendDays(7)}
                    >
                      {t.last7Days}
                    </Button>
                    <Button
                      variant={trendDays === 30 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTrendDays(30)}
                    >
                      {t.last30Days}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {trendData && trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString(language === 'zh' ? 'zh-HK' : 'en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString(language === 'zh' ? 'zh-HK' : 'en-US')}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="conversations" 
                        stroke="#3b82f6" 
                        name={language === 'zh' ? '對話數' : 'Conversations'}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="satisfactionRate" 
                        stroke="#10b981" 
                        name={language === 'zh' ? '滿意度%' : 'Satisfaction %'}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {t.noData}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Popular Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.questions}</CardTitle>
                <CardDescription>{language === 'zh' ? '過去7天最常被問到的問題' : 'Most frequently asked questions in the past 7 days'}</CardDescription>
              </CardHeader>
              <CardContent>
                {popularQuestions && popularQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {popularQuestions.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex-1">
                          <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 mr-2">#{index + 1}</span>
                          <span className="text-slate-900 dark:text-white">{item.question}</span>
                        </div>
                        <span className="ml-4 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          {item.count}x
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t.noData}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Low-Rated Conversations Tab */}
          <TabsContent value="lowRated" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.lowRated}</CardTitle>
                <CardDescription>{language === 'zh' ? '過去7天收到負面評分的對話' : 'Conversations with negative ratings in the past 7 days'}</CardDescription>
              </CardHeader>
              <CardContent>
                {lowRatedConversations && lowRatedConversations.length > 0 ? (
                  <div className="space-y-4">
                    {lowRatedConversations.map((conv: any) => (
                      <div key={conv.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            ID: {conv.id} | {conv.language === 'zh' ? '中文' : 'English'}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {new Date(conv.createdAt).toLocaleString(language === 'zh' ? 'zh-HK' : 'en-US')}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{t.userMessage}:</span>
                            <p className="text-slate-900 dark:text-white mt-1">{conv.userMessage}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{t.aiResponse}:</span>
                            <p className="text-slate-900 dark:text-white mt-1">{conv.aiResponse}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t.noData}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
