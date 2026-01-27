import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { cn } from "@/lib/utils";

interface AnalyticsOverviewProps {
  userData: { name: string; users: number }[];
  applicationsData: { name: string; value: number }[];
  activityData: { name: string; applications: number; messages: number }[];
}

const COLORS = ['hsl(330, 81%, 71%)', 'hsl(45, 100%, 66%)', 'hsl(0, 84.2%, 60.2%)'];

export const AnalyticsOverview = ({ userData, applicationsData, activityData }: AnalyticsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6"
      >
        <h3 className="font-semibold text-lg text-foreground mb-4">User Growth</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userData}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(330, 81%, 71%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(330, 81%, 71%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(330, 20%, 90%)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: "hsl(330, 10%, 45%)" }}
                axisLine={{ stroke: "hsl(330, 20%, 90%)" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(330, 10%, 45%)" }}
                axisLine={{ stroke: "hsl(330, 20%, 90%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(330, 20%, 90%)",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(330, 81%, 71%)"
                strokeWidth={3}
                dot={{ fill: "hsl(330, 81%, 71%)", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                fill="url(#userGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Applications Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-card border border-border/50 p-6"
      >
        <h3 className="font-semibold text-lg text-foreground mb-4">Applications</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={applicationsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {applicationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(330, 20%, 90%)",
                  borderRadius: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {applicationsData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-3 rounded-2xl bg-card border border-border/50 p-6"
      >
        <h3 className="font-semibold text-lg text-foreground mb-4">Weekly Activity</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(330, 20%, 90%)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: "hsl(330, 10%, 45%)" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "hsl(330, 10%, 45%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(330, 20%, 90%)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="applications" fill="hsl(330, 81%, 71%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="messages" fill="hsl(45, 100%, 66%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
